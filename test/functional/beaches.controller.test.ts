import { Beach } from "../../src/models/beach";
import { User } from "../../src/models/user";
import { AuthMethods } from "../../src/util/authMethods";




describe('Beaches functional tests', () => {
    const defaultUser = {
        name: 'John Doe',
        email: 'John@mail.com',
        password: '1234'
    }
    let token: string
    beforeEach(async () => {
        await Beach.deleteMany({});
        await User.deleteMany({});
        const user = await new User(defaultUser).save();
        token = AuthMethods.generateToken(user.toJSON());

    })

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
                const { body, status } = await global.testRequest
                    .post('/beaches')
                    .set({ 'x-access-token': token })
                    .send(newBeach);


                expect(status).toBe(201);
                expect(body).toEqual(expect.objectContaining(newBeach));
            });

        it('should  return 422 when there is a validation error',

            async () => {

                const newBeach =
                {
                    lat: "invalid",
                    lng: 151.289824,
                    name: 'Manly',
                    position: 'E',
                };
                const { body, status } = await global.testRequest
                    .post('/beaches')
                    .set({ 'x-access-token': token })
                    .send(newBeach);


                expect(status).toBe(406);
                expect(body).toEqual({

                    message:

                        JSON.stringify([
                            {
                                king: 'Number',
                                path: 'lat',
                                message: 'Cast to Number failed for value "invalid" (type string) at path "lat"'
                            }
                        ]),

                    code: 406,

                    error: 'Not Acceptable',

                    description: 'Validation failed!'

                });
            });
        it.skip('should  return 500 when there is a validation error', async () => {

            const newBeach =
            {
                lat: "invalid",
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const { body, status } = await global.testRequest
                .post('/beaches')
                .set({ 'x-access-token': token })
                .send(newBeach);


            expect(status).toBe(500);
            expect(body).toEqual({ error: 'Internal Server Error' });
        });





    });
});

