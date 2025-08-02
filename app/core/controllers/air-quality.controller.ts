import { Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/core/types/container'
import { Coordinates } from '@/core/types/iqair.types'
import { IIQAirService } from '@/core/interfaces'
import { responseJson } from '@/core/utils/response'
import { AirQualityService } from '@/core/services/air-quality.service'
import { format } from 'date-fns'

@injectable()
export class AirQualityController {
  constructor(
    @inject(TYPES.IQAirService) private readonly iqairService: IIQAirService,
    @inject(TYPES.AirQualityService) private readonly airQualityService: AirQualityService,
  ) {
  }

  async getNearestCityAirQuality(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.query as unknown as Coordinates
      if (!latitude || !longitude) {
        return responseJson(res, {
          status: 422, message: 'Validation Error, Latitude and longitude are required',
        })
      }
      const response = await this.iqairService.getNearestCityAirQuality({ latitude, longitude })

      return responseJson(res, {
        status: 200, message: 'Data retrieved successfully',
        data: {
          result: {
            pollution: response.data.current.pollution,
          },
        },
      })
    } catch (error) {
      return responseJson(res, {
        status: 500,
        message: 'Failed to retrieve air quality history',
        data: {
          success: false,
          error,
        },
      })
    }
  }

  async getMostPollutedTime(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.query as unknown as Coordinates
      if (!latitude || !longitude) {
        return responseJson(res, {
          status: 422, message: 'Validation Error, Latitude and longitude are required',
        })
      }
      const data = await this.airQualityService.getMostPollutedTime({ latitude, longitude })

      return responseJson(res, {
        status: 200, message: 'Data retrieved successfully',
        data: {
          date: data ? format(data, 'yyyy-MM-dd') : null,
          time: data ? format(data, 'hh:m') : null,
        },
      })
    } catch (error) {
      return responseJson(res, {
        status: 500,
        message: 'Failed to retrieve air quality history',
        data: {
          success: false,
          error,
        },
      })
    }
  }
}
