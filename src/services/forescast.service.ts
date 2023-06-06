
import StormGlass, { ForecastPoint } from "../clients/stormGlass";
import { InternalError } from "../util/errors/errors";
import { Beach } from "../models/beach";




export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export interface TimeForecast {
    time: string;
    forecast: BeachForecast[];
}


export class ForecastProcessingInternalError extends InternalError {
    constructor(message: string) {
        super(`Unexpected error during the forecast processing: ${message}`);
    }


}



export default class ForecastService {

    constructor(protected stormGlass = new StormGlass()) { }


    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {

        const pointsWithCorrectSources: BeachForecast[] = [];

        try {

            for (const beach of beaches) {
                  console.log(beach.lat, beach.lng);
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                console.log(points);
                const enrichedBeachData = this.enrichedBeachData(points, beach);
                console.log(enrichedBeachData);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (error) {
           console.log(error);
            throw new ForecastProcessingInternalError((error as Error).message);

        }
    }

    private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {

        return points.map((point) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1,
            },
            ...point,
        }));



    }



    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        const forecastByTime: TimeForecast[] = []

        for (const point of forecast) {

            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                timePoint.forecast.push(point);
            } else {
                forecastByTime.push({
                    time: point.time,
                    forecast: [point],
                });
            }
        }
        return forecastByTime;

    }


}