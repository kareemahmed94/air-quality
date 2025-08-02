// DI Container symbols and types
export const TYPES = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  AirQualityRepository: Symbol.for('AirQualityRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  ApiService: Symbol.for('ApiService'),
  IQAirService: Symbol.for('IQAirService'),
  AirQualityService: Symbol.for('AirQualityService'),

  // Controllers
  AirQualityController: Symbol.for('AirQualityController'),
} as const

export type DITypes = typeof TYPES
