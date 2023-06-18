
import nock from 'nock'



import stormGlassWaterResponseMock from '../fixtures/StormGlass_Water_Response_Mock.json'
import api_forecast_response_1_beach from "../fixtures/api_forecast_response_1_beach.json"
import { Beach, BeachPosition } from '../../src/models/beach';
import { User } from '../../src/models/user';
import { AuthMethods } from '../../src/util/authMethods';


describe('Beach forecast functional tests', () => {
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
   
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id,
    };
    await new Beach(defaultBeach).save();
    token = AuthMethods.generateToken(user.toJSON());


  })

  it('should return a forecast with just a few times', async () => {


    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWaterResponseMock);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });

   

    expect(status).toBe(200);
    expect(body).toEqual(api_forecast_response_1_beach);
  })
  it('should return a forecast with just a few times', async () => {


    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .replyWithError('Something went wrong');

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });

   

    expect(status).toBe(500);
    expect(body).toEqual({
      "code": 500,
      error: 'Internal Server Error',
      "message": "Something went wrong",
    })

  })
});



