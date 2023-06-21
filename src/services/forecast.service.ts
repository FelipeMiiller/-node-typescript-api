import StormGlass, { ForecastPoint } from "../clients/stormGlass";
import logger from "../logger";
import { Beach } from "../models/beach";
import { InternalError } from "../util/errors/internal-errors";
import { RatingService } from "./rating.service";



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

    constructor(
        private readonly stormGlass = new StormGlass(),
        private readonly ratingService: typeof RatingService = RatingService) { }


    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
        logger.info(`Processing forecast for ${beaches.length} beaches`);
        const pointsWithCorrectSources: BeachForecast[] = [];

        try {

            for (const beach of beaches) {
                const rating = new this.ratingService(beach);
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

                const enrichedBeachData = this.enrichedBeachData(rating, points, beach);

                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (error) {
            logger.error(error);
            throw new ForecastProcessingInternalError((error as Error).message);

        }
    }

    private enrichedBeachData(rating: RatingService, points: ForecastPoint[], beach: Beach): BeachForecast[] {

        return points.map((point) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: rating.getRateForPoint(point),
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