


import * as HTTPUtil from '../../util/Request';
import StormGlass from '../stormGlass';
import stormGlassWaterResponseMock from '../../../test/fixtures/StormGlass_Water_Response_Mock.json';
import stormGlassWaterNormalizedMock from '../../../test/fixtures/StormGlass_water_Normalized_Mock.json';



describe('StormGlass client', () => {

    const mockedRequest = new HTTPUtil.Request as jest.Mocked<HTTPUtil.Request>;
    it('should return the normalized forecasst from the StormGlass Service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;


         mockedRequest.get = jest.fn().mockResolvedValue({ data: stormGlassWaterResponseMock })
        const stormGlassSpec = new StormGlass( mockedRequest);
        const response = await stormGlassSpec.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassWaterNormalizedMock);
    });

    it('should exclude incomplete data points', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const incompleteResponse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300,
                    },
                }
            ]

        }

         mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);
        const stormGlassSpec = new StormGlass( mockedRequest);
        
        const response = await stormGlassSpec.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    });


    it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedRequest.get.mockRejectedValue('Network Error');
        

        const stormGlass = new StormGlass( mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng))
        .rejects
        .toThrow('Unexpected error when trying to communicate to StormGlass: "Network Error"');
    });

    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        class FakeAxiosError extends Error {
            constructor(public response: object) {
                super();
            }
        }

         mockedRequest.get.mockRejectedValue(
            new FakeAxiosError({
                status: 429,
                data: { errors: ['Rate Limit reached'] },
            })
        );

        const stormGlass = new StormGlass( mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng))
        .rejects
        .toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
        );
    });
});
