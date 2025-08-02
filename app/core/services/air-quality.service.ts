import { injectable, inject } from 'inversify'
import { TYPES } from '@/core/types/container'
import { IIQAirService, IAirQualityRepository, IAirQualityService } from '@/core/interfaces'
import { Coordinates } from '@/core/types/iqair.types'

@injectable()
export class AirQualityService implements IAirQualityService {
  constructor(
    @inject(TYPES.IQAirService) private readonly iqairService: IIQAirService,
    @inject(TYPES.AirQualityRepository) private readonly airQualityRepository: IAirQualityRepository,
  ) {
  }

  async create(coordinates: Coordinates): Promise<void> {
    try {
      const airQualityData = await this.iqairService.getNearestCityAirQuality(coordinates)
      const data = airQualityData.data

      await this.airQualityRepository.create({
        city: data.city,
        latitude: data.location.coordinates[0],
        longitude: data.location.coordinates[1],
        aqi: data.current.pollution.aqius,
        main_pollutant: data.current.pollution.mainus,
        temperature: data.current.weather.tp,
        humidity: data.current.weather.hu,
        pressure: data.current.weather.pr,
        wind_speed: data.current.weather.ws,
        wind_direction: data.current.weather.wd,
        recorded_at: data.current.pollution.ts,
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Get the most polluted time for a coordinates
   * @param coordinates
   */
  async getMostPollutedTime(coordinates: Coordinates): Promise<Date | null> {
    try {
      const data = await this.airQualityRepository.getMaxPollutedTime({
        latitude: Number(coordinates.latitude),
        longitude: Number(coordinates.longitude),
      })
      return data?.length ? data[0].created_at : null
    } catch (error) {
      throw error
    }
  }
}
