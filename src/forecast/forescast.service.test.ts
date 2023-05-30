
import StormGlass from '@src/clients/stormGlass';
import stormGlassNormalizedMock from '@test/fixtures/StormGlass_water_Normalized_Mock.json';
import Forecast, { Beach, BeachPosition, ForecastProcessingInternalError } from '@src/forecast/forescast.service';
jest.mock('@src/clients/stormGlass');
describe('StormGlass client', () => {

    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

    it('should return the forecast for a list of beaches', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedMock);



        const beaches: Beach[] = [

            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
             

            },
        ];


        const expectedResponse =
            [{
                time: "2023-04-14T00:00:00+00:00",
                forecast: [{
                    lat: -33.792726,
                    lng: 151.289824,
                    name: "Manly",
                    position: "E",
                    rating: 1,
                    swellDirection: 157.4,
                    time: "2023-04-14T00:00:00+00:00",
                    swellHeight: 1.53,
                    swellPeriod: 9.64,
                    waveDirection: 148.9,
                    waveHeight: 2.03,
                    windDirection: 184.16,
                    windSpeed: 9.18
                }],
            },
            {
                time: "2023-04-14T01:00:00+00:00",
                forecast: [{
                    lat: -33.792726,
                    lng: 151.289824,
                    name: "Manly",
                    position: "E",
                    rating: 1,
                    swellDirection: 155.32,
                    time: "2023-04-14T01:00:00+00:00",
                    swellHeight: 1.68,
                    swellPeriod: 9.42,
                    waveDirection: 148.58,
                    waveHeight: 2.02,
                    windDirection: 190.17,
                    windSpeed: 8.98
                }],
            },
            {
                time: "2023-04-14T02:00:00+00:00",
                forecast: [{
                    lat: -33.792726,
                    lng: 151.289824,
                    name: "Manly",
                    position: "E",
                    rating: 1,
                    time: "2023-04-14T02:00:00+00:00",
                    swellDirection: 153.25,
                    swellHeight: 1.84,
                    swellPeriod: 9.21,
                    waveDirection: 148.27,
                    waveHeight: 2,
                    windDirection: 196.19,
                    windSpeed: 8.77
                }],
            },
            {
                time: "2023-04-14T03:00:00+00:00",
                forecast: [{
                    lat: -33.792726,
                    lng: 151.289824,
                    name: "Manly",
                    position: "E",
                    rating: 1,
                    swellDirection: 151.17,
                    time: "2023-04-14T03:00:00+00:00",
                    swellHeight: 1.99,
                    swellPeriod: 8.99,
                    waveDirection: 147.95,
                    waveHeight: 1.99,
                    windDirection: 202.2,
                    windSpeed: 8.57
                }],
            }]

        const forecast = new Forecast(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);
        expect(beachesWithRating).toEqual(expectedResponse);

    });

    it('should return an empty list when the beaches array is empty', async () => {

        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);


    });


    it('should throw internal processing error when something goes wrong during the rating process', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
              
            }

        ]
            
        mockedStormGlassService.fetchPoints.mockRejectedValue('Error fetching data');

        const forecast = new Forecast(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches))
        .rejects
        .toThrowError(ForecastProcessingInternalError);




    });



})