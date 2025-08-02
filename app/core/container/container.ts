import { Container } from 'inversify'
import { PrismaClient } from '@prisma/client'
import { TYPES } from '@/core/types/container'
import {
  IApiService,
  IIQAirService,
  IAirQualityRepository,
  IAirQualityService,
} from '@/core/interfaces'
import { AirQualityRepository } from '@/core/repositories/air-quality.repository'
import { ApiService } from '@/core/services/api.service'
import { IQAirService } from '@/core/services/iqair.service'
import { AirQualityService } from '@/core/services/air-quality.service'
import { AirQualityController } from '@/core/controllers/air-quality.controller'

const container = new Container()

// Database bindings
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient())

// Repository bindings
container.bind<IAirQualityRepository>(TYPES.AirQualityRepository).to(AirQualityRepository).inSingletonScope()

// Service bindings
container.bind<IApiService>(TYPES.ApiService).to(ApiService).inSingletonScope()
container.bind<IIQAirService>(TYPES.IQAirService).to(IQAirService).inSingletonScope()
container.bind<IAirQualityService>(TYPES.AirQualityService).to(AirQualityService).inSingletonScope()

// Controller bindings
container.bind<AirQualityController>(TYPES.AirQualityController).to(AirQualityController).inSingletonScope()

export { container }
