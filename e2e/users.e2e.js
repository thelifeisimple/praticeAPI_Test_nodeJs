const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');


describe('test for /users path', () => {
    let app = null;
    let server = null;
    let api = null;

    beforeAll(async() => {
        app = createApp();
        server = app.listen(9000);
        api = request(app);
        await upSeed();
    });
    
    describe('GET /users/{id}', () =>{
        test('should return a user', async () => {
            const user = await models.User.findByPk('1');
            const inputData = {
                email: user.email,
	            password: "admin123"
            };
            const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`);
            expect(statusCode).toEqual(200);
            expect(body.id).toEqual(user.id)
            expect(body.email).toEqual(user.email);


        });
    });

    describe('POST /users', () =>{
        
        test('should return a 400 Bad request with password invalid', async () => {
            //ARRANGE
            const inputData = {
                email: "ana@mail.com",
                password: "---"
            };
            //Act
            const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
            //Assert
            expect(statusCode) .toBe(400);
            expect(body.message).toMatch(/password/);
        });

        test('should return a 400 Bad request with email invalid', async () => {
            //ARRANGE
            const inputData = {
                email: "a-----",
                password: "hjuhiuhiuhbiup123"
            };
            //Act
            const response = await api.post('/api/v1/users').send(inputData);
            //Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toMatch(/email/);
        });

        test('should return a new user', async () => {
            //ARRANGE
            const inputData = {
                email: "anamarita34@mail.com",
                password: "ahvfri6123"
            }
            //Act
            const {statusCode, body}= await api.post('/api/v1/users').send(inputData);
            //Assert
            expect(statusCode).toBe(201);
            //check db
            const user = await models.User.findByPk(body.id);
            expect(user).toBeTruthy();
            expect(user.role).toEqual('admin');
            expect(user.email).toEqual(inputData.email);
        });

        //Todo: test with valid data
    });

    describe('PUT /users', () =>{
        //test for /users
    });

    afterAll(async() => {
        server.close();
        await downSeed();
    })
});
