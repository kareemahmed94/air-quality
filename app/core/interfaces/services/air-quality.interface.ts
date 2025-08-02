import { Coordinates, IQAirResponse } from '@/core/types/iqair.types'

export interface IAirQualityService {
  /**
   * Manually trigger air quality data collection for Paris
   */
  create(coordinates: Coordinates): Promise<void>

  /**
   * Get the most polluted time for a coordinates
   * @param coordinates
   */
  getMostPollutedTime(coordinates: Coordinates): Promise<Date | null>
}
