

import stormGlassNormalizedMock from '../../../test/fixtures/StormGlass_water_Normalized_Mock.json';
import StormGlass from '../../clients/stormGlass';
import { Beach, GeoPosition } from '../../models/beach';
import ForecastService, { ForecastProcessingInternalError } from '../forecast.service';


jest.mock('@src/clients/stormGlass');

describe('StormGlass client', () => {

    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;



    it('should return the forecast for mutiple beaches in the same hour with different ratings', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
          {
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ]);
        mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
          {
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ]);
        const beaches: Beach[] = [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: GeoPosition.E,
            user: 'fake-id',
          },
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: GeoPosition.S,
            user: 'fake-id',
          },
        ];
        const expectedResponse = [
          {
            time: '2020-04-26T00:00:00+00:00',
            forecast: [
              {
                lat: -33.792726,
                lng: 141.289824,
                name: 'Dee Why',
                position: 'S',
                rating: 3,
                swellDirection: 64.26,
                swellHeight: 0.15,
                swellPeriod: 13.89,
                time: '2020-04-26T00:00:00+00:00',
                waveDirection: 231.38,
                waveHeight: 2.07,
                windDirection: 299.45,
                windSpeed: 100,
              },
              {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: 'E',
                rating: 2,
                swellDirection: 123.41,
                swellHeight: 0.21,
                swellPeriod: 3.67,
                time: '2020-04-26T00:00:00+00:00',
                waveDirection: 232.12,
                waveHeight: 0.46,
                windDirection: 310.48,
                windSpeed: 100,
              },
              
            ],
          },
        ];
        const forecast = new ForecastService(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);


      
        expect(beachesWithRating).toEqual(expectedResponse);
      });

    it('should return the forecast for a list of beaches', async () => {
        mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedMock);



        const beaches: Beach[] = [

            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: GeoPosition.E,
                user: '647f9ae30f3a999b78a1023d',

            },
        ];

        const expectedResponse = [{
            time: "2023-04-14T00:00:00+00:00",
            forecast: [{
                lat: -33.792726,
                lng: 151.289824,
                name: "Manly",
                position: "E",
                rating: 2,
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
                rating: 2,
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
                rating: 2,
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
                rating: 2,
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




        const forecast = new ForecastService(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);
        expect(beachesWithRating).toEqual(expectedResponse);

    });

    it('should return an empty list when the beaches array is empty', async () => {

        const forecast = new ForecastService();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);


    });


    it('should throw internal processing error when something goes wrong during the rating process', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: GeoPosition.E,
                user: '647f9ae30f3a999b78a1023d',

            }

        ]

        mockedStormGlassService.fetchPoints.mockRejectedValue('Error fetching data');

        const forecast = new ForecastService(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches))
            .rejects
            .toThrowError(ForecastProcessingInternalError);




    });



})