



describe('Beaches functional tests', () => {
  
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
                const response = await global.testRequest.post('/beaches').send(newBeach);
                expect(response.status).toBe(201);
                expect(response.body).toEqual(expect.objectContaining(newBeach));
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
            const response = await  global.testRequest.post('/beaches').send(newBeach);


            expect(response.status).toBe(422);
            console.log(response.body);
            expect(response.body).toEqual({ error: 'Beach validation failed: lat: Cast to Number failed for value "invalid" (type string) at path "lat"'  });
        });
        it.skip('should  return 500 when there is a validation error', async () => {

            const newBeach =
            {
                lat: "invalid",
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
            };
            const response = await  global.testRequest.post('/beaches').send(newBeach);


            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal Server Error' });
        });





    });
});
