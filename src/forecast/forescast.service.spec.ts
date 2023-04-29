
import StormGlass from '@src/clients/stormGlass';
import stormGlassNormalizedMock from '@test/fixtures/StormGlass_water_Normalized_Mock.json';
import Forecast, { Beach, BeachPosition } from '@src/forecast/forescast.service';
jest.mock('@src/clients/stormGlass');
describe('StormGlass client', () => {


    it('should return the forecast for a list of beaches', async () => {
        StormGlass.prototype.fetchPoints =
            jest
                .fn()
                .mockResolvedValue(stormGlassNormalizedMock);

        const beaches: Beach[] = [

            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
                user: 'some-id'

            },
        ];


        const expectedResponse =
            [{
                lat: -33.792726,
                lng: 151.289824,
                name: "Manly",
                position: "E",
                rating: 1,
                swellDirection: 157.4,
                swellHeight: 1.53,
                swellPeriod: 9.64,
                time: "2023-04-14T00:00:00+00:00",
                waveDirection: 148.9,
                waveHeight: 2.03,
                windDirection: 184.16,
                windSpeed: 9.18
            },
            {
                lat: -33.792726,
                lng: 151.289824,
                name: "Manly",
                position: "E",
                rating: 1,
                swellDirection: 155.32,
                swellHeight: 1.68,
                swellPeriod: 9.42,
                time: "2023-04-14T01:00:00+00:00",
                waveDirection: 148.58,
                waveHeight: 2.02,
                windDirection: 190.17,
                windSpeed: 8.98
            },
            {
                lat: -33.792726,
                lng: 151.289824,
                name: "Manly",
                position: "E",
                rating: 1,
                swellDirection: 153.25,
                swellHeight: 1.84,
                swellPeriod: 9.21,
                time: "2023-04-14T02:00:00+00:00",
                waveDirection: 148.27,
                waveHeight: 2,
                windDirection: 196.19,
                windSpeed: 8.77
            },
            {
                lat: -33.792726,
                lng: 151.289824,
                name: "Manly",
                position: "E",
                rating: 1,
                swellDirection: 151.17,
                swellHeight: 1.99,
                swellPeriod: 8.99,
                time: "2023-04-14T03:00:00+00:00",
                waveDirection: 147.95,
                waveHeight: 1.99,
                windDirection: 202.2,
                windSpeed: 8.57
            }]

        const forecast = new Forecast(new StormGlass());
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);
        expect(beachesWithRating).toEqual(expectedResponse);

    }


    )
})