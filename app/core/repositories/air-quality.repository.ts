import { injectable, inject } from 'inversify'
import { CityAirQuality, Prisma, PrismaClient } from '@prisma/client'
import { TYPES } from '@/core/types/container'
import { IAirQualityRepository } from '@/core/interfaces'

@injectable()
export class AirQualityRepository implements IAirQualityRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {
  }

  async create(data: Prisma.CityAirQualityUncheckedCreateInput): Promise<CityAirQuality> {
    return this.prisma.cityAirQuality.create({ data })
  }

  async getMaxPollutedTime(where: Prisma.CityAirQualityWhereInput): Promise<CityAirQuality[]> {
    return this.prisma.cityAirQuality.findMany({
      where,
      orderBy: {
        aqi: 'desc'
      },
      take: 1
    })
  }

}
