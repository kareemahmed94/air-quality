import {createRouter} from '@/core/plugins/createRouter'
import {Request, Response} from 'express'
import {container, TYPES} from '@/core/container'
import {AirQualityController} from '@/core/controllers/air-quality.controller'

export const apiRouter = createRouter('/api/v1', ['authorization token'], 1)
const airQualityController = container.get<AirQualityController>(TYPES.AirQualityController)

// Air Quality endpoints
apiRouter.get(
    '/air-quality/nearest',
    {
        summary: 'Get air quality for nearest city to coordinates',
        queryParams: ['latitude', 'longitude'],
        responseSchema: {default: {}},
    },
    async (req: Request, res: Response) => await airQualityController.getNearestCityAirQuality(req, res)
)

apiRouter.get(
    '/air-quality/most-polluted-time',
    {
        summary: 'Get most polluted time for coordinates',
        queryParams: ['latitude', 'longitude'],
        responseSchema: {default: {}},
    },
    async (req: Request, res: Response) => await airQualityController.getMostPollutedTime(req, res)
)
