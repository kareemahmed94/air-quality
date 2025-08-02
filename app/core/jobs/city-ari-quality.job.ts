import { injectable, inject } from 'inversify'
import * as cron from 'node-cron'
import { TYPES } from '@/core/types/container'
import { Coordinates } from '@/core/types/iqair.types'
import { AirQualityService } from '@/core/services/air-quality.service'
import { IAirQualityRepository, IApiService, IIQAirService } from '@/core/interfaces'
import { IQAirService } from '@/core/services/iqair.service'
import { ApiService } from '@/core/services/api.service'
import { AirQualityRepository } from '@/core/repositories/air-quality.repository'
import { PrismaClient } from '@prisma/client'
import console from 'node:console'

@injectable()
class CityAirQualityJob {
  private cronJob: cron.ScheduledTask | null = null
  private readonly parisCoordinates: Coordinates = {
    latitude: 48.856613,
    longitude: 2.352222
  }

  constructor(
    @inject(TYPES.AirQualityService) private readonly airQualityService: AirQualityService,
  ) {}

  start(): void {
    if (this.cronJob) {
      return
    }

    // Run every minute: '* * * * *'
    this.cronJob = cron.schedule('* * * * *', async () => {
      try {
        console.log('creating record')
        await this.airQualityService.create(this.parisCoordinates)
      } catch (error) {
        console.error('Error in air quality CRON job:', error)
      }
    })

    this.cronJob.start()
  }
}

const prisma: PrismaClient = new PrismaClient()
const apiService: IApiService = new ApiService()
const iqairService: IIQAirService = new IQAirService(apiService)
const airQualityRepository: IAirQualityRepository = new AirQualityRepository(prisma)
const airQualityService: AirQualityService = new AirQualityService(iqairService, airQualityRepository)
export const cityAirQualityJob = new CityAirQualityJob(airQualityService)
