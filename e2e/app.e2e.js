const request = require('supertest');
const createApp = require('./../src/app');
const { config } = require('./../src/config/config')

describe('test for app', () => {
    let app = null;
    let server = null;
    let api = null;

    beforeEach(() => {
        app = createApp();
        server = app.listen(9000);
        api = request(app);
    });
    
    test('GET /hello', async () =>{
        const response = await api.get('/hello');
        expect(response).toBeTruthy();
        expect(response.statusCode).toEqual(200);
        expect(response.body.name).toEqual('ana');
        expect(response.headers['content-type']).toMatch(/json/);
    });

    describe('Get /nueva-ruta', () =>{
        test('Should return 401', async () =>{
            const response = await api.get('/nueva-ruta')
            expect(response.statusCode).toEqual(401);
        });
        
        test('Should return 401', async () =>{
            const response = await api.get('/nueva-ruta').set({
                api: '15134'
            });
            expect(response.statusCode).toEqual(401);
        });

        test('Should return 200', async () =>{
            const { statusCode} = await api.get('/nueva-ruta').set({
                api: config.apiKey
            });
            expect(statusCode).toEqual(200);
        });

    });
    

    afterEach(() => {
        server.close(); 
    })
});
