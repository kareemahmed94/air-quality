export interface Coordinates {
  latitude: number
  longitude: number
}

export interface AirQualityData {
  ts: string // timestamp
  aqius: number // AQI value based on US EPA standard
  mainus: string // main pollutant for US AQI
  aqicn: number // AQI value based on China MEP standard
  maincn: string // main pollutant for Chinese AQI
}

export interface Weather {
  ts: string // timestamp
  tp: number // temperature in Celsius
  pr: number // atmospheric pressure in hPa
  hu: number // humidity %
  ws: number // wind speed (m/s)
  wd: number // wind direction, as an angle of 360° (N=0, E=90, S=180, W=270)
  ic: string // weather icon code
}

export interface Location {
  type: string
  coordinates: [number, number]
}

export interface IQAirResponse {
  status: string
  data: {
    city: string
    state: string
    country: string
    location: Location
    current: {
      pollution: AirQualityData
      weather: Weather
    }
  }
}

export interface AirQualityInfoResponse {
  result: {
    pollution: AirQualityData
  }
}
export interface AirQualityInfo {
  city: string
  state: string
  country: string
  coordinates: Coordinates
  result: {
    pollution: AirQualityData
  }
  airQuality: {
    aqi: number
    mainPollutant: string
    timestamp: Date
  }
  weather: {
    temperature: number
    humidity: number
    pressure: number
    windSpeed: number
    windDirection: number
    timestamp: Date
  }
}
