import { Coordinates, IQAirResponse } from '@/core/types/iqair.types'

export interface IIQAirService {
  /**
   * Get air quality information for the nearest city to given coordinates
   * @param coordinates
   */
  getNearestCityAirQuality(coordinates: Coordinates): Promise<IQAirResponse>
}
