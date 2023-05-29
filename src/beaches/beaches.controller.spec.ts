
import { SetupServer } from '@src/configServer';
import { Beach } from '@src/models/beach';
import supertest from 'supertest';


const server = new SetupServer();

describe('Beaches functional tests', () => {
    beforeAll(async () => await Beach.deleteMany({}));
    describe('When creating a beach', () => {
        it('should create a beach with success',
            async () => {
                const newBeach =
                {
                    lat: -33.792726,
                    lng: 151.289824,
                    name: 'Manly',
                    position: 'E',
                };
                const response = await supertest(server.getApp).post('/beaches').send(newBeach);
                expect(response.status).toBe(201);
                expect(response.body).toEqual(expect.objectContaining(newBeach));
            });

        it('should  return 422 when there is a validation error', async () => {

            const newBeach =
            {
                lat: "invalid",
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const response = await supertest(server.getApp).post('/beaches').send(newBeach);


            expect(response.status).toBe(422);
            expect(response.body).toEqual({ error: 'Beach validation failed: lat: Cast to Number failed for value "invalid" at path "lat"' });
        });





    });
});

