export interface AirQualityRecord {
  id: string
  city: string
  state?: string
  country: string
  latitude: number
  longitude: number
  aqi: number
  main_pollutant: string
  temperature: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_direction: number
  recorded_at: Date
  created_at: Date
  updated_at: Date
}

export interface CreateAirQualityRecord {
  city: string
  state?: string
  country: string
  latitude: number
  longitude: number
  aqi: number
  main_pollutant: string
  temperature: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_direction: number
  recorded_at?: Date
}

export interface AirQualitySearchFilters {
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  date_from?: Date
  date_to?: Date
}

export interface AirQualityPaginatedResult {
  records: AirQualityRecord[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}