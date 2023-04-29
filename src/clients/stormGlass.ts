
import { InternalError } from "@src/util/errors/internal-errors";
import config, { IConfig } from "config";
import * as HTTPUtil from "@src/util/Request";



export interface StormGlassForecastResponse {
  readonly hours: StormGlassPoint[];
}

export interface StormGlassPoint {
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassPointSource {
  readonly icon: number;
  readonly noaa: number;
  readonly sg: number;
}

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;

}

export class StormGlassUnexpectedResponseError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}


export class ClientRequestError extends InternalError {
  constructor(message: string) {
    console.log(message)
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    console.log(message)
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

const stormglassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);


export default class StormGlass {
  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';
  constructor(protected request = new HTTPUtil.Request()) { }


  async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {

    try {
      const { data } = await this.request.get<StormGlassForecastResponse>(
        `${stormglassResourceConfig.get('apiUrl')}
        weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}`, {
        headers: {
          Authorization: process.env.STORM_GLASS_API_KEY
        }
      });

      return this.normalizeResponse(data)


    } catch (err) {
      if (err instanceof Error && HTTPUtil.Request.isRequestError(err)) {
        console.log("dfsdf")
        const error = HTTPUtil.Request.extractErrorData(err);
        console.log(error)
        console.log(`Error: ${JSON.stringify(error.data)} Code: ${error.status}`)
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(error.data)} Code: ${error.status}`
        );

      }
      if (err instanceof Error) {

        throw new ClientRequestError(JSON.stringify(err.message));
      }

    }

  }

  private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {

    return points.hours.filter(this.isValidPoint.bind(this)).map(point => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource]

    }))

  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.time &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource])

  }

}
