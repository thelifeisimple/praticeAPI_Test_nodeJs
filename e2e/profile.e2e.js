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

    describe('GET /my-orders', () =>{
        test('should return a 401', async () => {
            const user = await models.User.findByPk('1');
            const inputId = '1';
            const { statusCode, body } = await api.get(`/api/v1/profile/my-orders`).set({
                'Authorization': `Bearer 12121515`
            });
            expect(statusCode).toEqual(401);
        });

        test('should return a use with acces token valid ', async () => {
            const user = await models.User.findByPk('1');
            const inputData = {
                email: user.email,
	            password: "admin123"
            };

            const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
            const accessToken = bodyLogin.access_token;

            const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
                'Authorization': `Bearer ${accessToken}`
            });
            expect(statusCode).toEqual(200);
            //check db
            expect(body.email).toEqual(user.email);

        });
    });
    
    describe('GET /my-user admin user', () =>{

        beforeAll(async() => {
            const user = await models.User.findByPk('1');
            const inputData = {
                email: user.email,
	            password: "admin123"
            };
            const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
            accessToken = bodyLogin.access_token;
        });

        test('should return a 401', async () => {
            const user = await models.User.findByPk('1');
            const inputId = '1';
            const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
                'Authorization': `Bearer 12121515`
            });
            expect(statusCode).toEqual(401);
        });

        test('should return a use with acces token valid ', async () => {
            const user = await models.User.findByPk('1');
            const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
                'Authorization': `Bearer ${accessToken}`
            });
            expect(statusCode).toEqual(200);
            //check db
            expect(body.email).toEqual(user.email);
        });

        afterAll(() => {
            accessToken = null;
        });
    });

    afterAll(async() => {
        server.close();
        await downSeed(); 
    })
});
