import { injectable, inject } from 'inversify'
import { TYPES } from '@/core/types/container'
import { IApiService, IIQAirService } from '@/core/interfaces'
import { Coordinates, AirQualityInfo, IQAirResponse, AirQualityInfoResponse } from '@/core/types/iqair.types'
import env from '@/config/constants/env'
import console from 'node:console'

@injectable()
export class IQAirService implements IIQAirService {
  private readonly baseUrl = env.IQAIR_BASE_URL
  private readonly apiKey = env.IQAIR_PK

  constructor(
    @inject(TYPES.ApiService) private readonly apiService: IApiService,
  ) {
  }

  async getNearestCityAirQuality(coordinates: Coordinates): Promise<IQAirResponse> {
    try {
      const response = await this.apiService.get<IQAirResponse>(
        `${this.baseUrl}/nearest_city`,
        {
          params: {
            lat: coordinates.latitude,
            lon: coordinates.longitude,
            key: this.apiKey,
          },
          timeout: 10000,
        },
      )
      console.log({ data: response.data.data })
      if (response.data.status !== 'success') {
        throw new Error(`IQAir API error: ${response.data.status}`)
      }

      return response.data
    } catch (error) {
      throw new Error(`Failed to get air quality data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
