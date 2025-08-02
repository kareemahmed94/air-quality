import { CityAirQuality, Prisma } from '@prisma/client'

export interface IAirQualityRepository {

  create(data: Prisma.CityAirQualityUncheckedCreateInput): Promise<CityAirQuality>

  getMaxPollutedTime(where: Prisma.CityAirQualityWhereInput): Promise<CityAirQuality[]>
}
