const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => {
    return{
        createTransport: jest.fn().mockImplementation(() => {
            return{
                sendMail: mockSendMail,
            }
        })
    }
});

describe('test for /auth path', () => {
    let app = null;
    let server = null;
    let api = null;

    beforeEach(async() => {
        app = createApp();
        server = app.listen(9000);
        api = request(app);
        await upSeed();
    });
    
    describe('POST /login', () =>{
        
        test('should return a 401 Unauthorized', async () => {
            //ARRANGE
            const inputData = {
                email: "ana11@mail.com",
                password: "1248521jgbiuh"
            };
            //Act
            const { statusCode} = await api.post('/api/v1/auth/login').send(inputData);
            //Assert
            expect(statusCode).toBe(401);
        });

        test('should return a 200 authorized', async () => {
            //ARRANGE
            const user = await models.User.findByPk('1')
            const inputData = {
                email: user.email,
	            password: "admin123"
            };
            //Act
            const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData);
            //Assert
            expect(statusCode).toBe(200);
            expect(body.access_token).toBeTruthy();
            expect(body.user.email).toEqual(inputData.email);
            expect(body.user.password).toBeUndefined();
        });


    });

    describe('POST /recovery', () => {

        beforeAll(() =>{
            mockSendMail.mockClear();
        })

        test('should return a 401 Unauthorized', async () => {
            const inputData = {
                email: "ana11facke@mail.com",
                //password: "a------23"
            };
            const { statusCode} = await api.post('/api/v1/auth/recovery').send(inputData);
            expect(statusCode).toBe(401);
        });
        
        test('should send  mail', async () => {
            const user = await models.User.findByPk('1')
            const inputData = {
                email: user.email,
                //password: "admin123"
            };
            mockSendMail.mockResolvedValue(true);
            const { statusCode, body} = await api.post('/api/v1/auth/recovery').send(inputData);
            console.log('body', body);
            expect(statusCode).toBe(200);
            expect(body.message).toEqual('mail sent');
            expect(mockSendMail).toHaveBeenCalled();
        });

    })

    afterEach(async() => {
        server.close();
        await downSeed();
    })
});
