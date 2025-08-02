import { Request, Response } from 'express'
import { AirQualityController } from '../../app/core/controllers/air-quality.controller'
import { IIQAirService } from '../../app/core/interfaces/services/iqair.interface'
import { AirQualityService } from '../../app/core/services/air-quality.service'
import { IQAirResponse, Coordinates } from '../../app/core/types/iqair.types'

// Mock the response utility
const mockResponseJson = jest.fn((res, data) => {
  res.status(data.status).json({
    message: data.message,
    data: data.data,
    error: data.error,
  })
  return res
})

jest.doMock('../../app/core/utils/response', () => ({
  responseJson: mockResponseJson,
}))

describe('AirQualityController', () => {
  let controller: AirQualityController
  let mockIQAirService: jest.Mocked<IIQAirService>
  let mockAirQualityService: jest.Mocked<AirQualityService>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  // Mock data
  const mockCoordinates: Coordinates = { latitude: 48.8566, longitude: 2.3522 }
  const mockIQAirResponse: IQAirResponse = {
    status: 'success',
    data: {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      location: {
        type: 'Point',
        coordinates: [2.3522, 48.8566],
      },
      current: {
        pollution: {
          ts: '2024-01-01T12:00:00.000Z',
          aqius: 42,
          mainus: 'p2',
          aqicn: 35,
          maincn: 'p2',
        },
        weather: {
          ts: '2024-01-01T12:00:00.000Z',
          tp: 15,
          pr: 1013,
          hu: 65,
          ws: 5.2,
          wd: 180,
          ic: '01d',
        },
      },
    },
  }

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Create mocked services
    mockIQAirService = {
      getNearestCityAirQuality: jest.fn(),
    }

    mockAirQualityService = {
      create: jest.fn(),
      getMostPollutedTime: jest.fn(),
    } as any

    // Create controller instance with mocked dependencies
    controller = new AirQualityController(mockIQAirService, mockAirQualityService)

    // Setup mock request and response
    mockRequest = {
      query: {},
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  describe('getNearestCityAirQuality', () => {
    it('should return air quality data successfully', async () => {
      // Arrange
      mockRequest.query = mockCoordinates as any
      mockIQAirService.getNearestCityAirQuality.mockResolvedValue(mockIQAirResponse)

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).toHaveBeenCalledWith(mockCoordinates)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data retrieved successfully',
        data: {
          result: {
            pollution: mockIQAirResponse.data.current.pollution,
          },
        },
        error: undefined,
      })
    })

    it('should return validation error when latitude is missing', async () => {
      // Arrange
      mockRequest.query = { longitude: 2.3522 } as any

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should return validation error when longitude is missing', async () => {
      // Arrange
      mockRequest.query = { latitude: 48.8566 } as any

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should return validation error when both coordinates are missing', async () => {
      // Arrange
      mockRequest.query = {}

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should handle service errors gracefully', async () => {
      // Arrange
      const errorMessage = 'External API error'
      mockRequest.query = mockCoordinates as any
      mockIQAirService.getNearestCityAirQuality.mockRejectedValue(new Error(errorMessage))

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).toHaveBeenCalledWith(mockCoordinates)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve air quality history',
        data: {
          success: false,
          error: new Error(errorMessage),
        },
        error: undefined,
      })
    })

    it('should handle string coordinates by converting them', async () => {
      // Arrange
      mockRequest.query = { latitude: '48.8566', longitude: '2.3522' } as any
      mockIQAirService.getNearestCityAirQuality.mockResolvedValue(mockIQAirResponse)

      // Act
      await controller.getNearestCityAirQuality(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockIQAirService.getNearestCityAirQuality).toHaveBeenCalledWith({
        latitude: '48.8566',
        longitude: '2.3522',
      })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe('getMostPollutedTime', () => {
    it('should return most polluted time successfully when data exists', async () => {
      // Arrange
      const mockDate = new Date('2024-01-15T14:30:00Z')
      mockRequest.query = mockCoordinates as any
      mockAirQualityService.getMostPollutedTime.mockResolvedValue(mockDate)

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).toHaveBeenCalledWith(mockCoordinates)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data retrieved successfully',
        data: {
          date: '2024-01-15',
          time: '02:30', // formatted time
        },
        error: undefined,
      })
    })

    it('should return null values when no data exists', async () => {
      // Arrange
      mockRequest.query = mockCoordinates as any
      mockAirQualityService.getMostPollutedTime.mockResolvedValue(null)

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).toHaveBeenCalledWith(mockCoordinates)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data retrieved successfully',
        data: {
          date: null,
          time: null,
        },
        error: undefined,
      })
    })

    it('should return validation error when latitude is missing', async () => {
      // Arrange
      mockRequest.query = { longitude: 2.3522 } as any

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should return validation error when longitude is missing', async () => {
      // Arrange
      mockRequest.query = { latitude: 48.8566 } as any

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should return validation error when both coordinates are missing', async () => {
      // Arrange
      mockRequest.query = {}

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error, Latitude and longitude are required',
        data: undefined,
        error: undefined,
      })
    })

    it('should handle service errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Database connection error'
      mockRequest.query = mockCoordinates as any
      mockAirQualityService.getMostPollutedTime.mockRejectedValue(new Error(errorMessage))

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).toHaveBeenCalledWith(mockCoordinates)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve air quality history',
        data: {
          success: false,
          error: new Error(errorMessage),
        },
        error: undefined,
      })
    })

    it('should handle string coordinates by converting them', async () => {
      // Arrange
      const mockDate = new Date('2024-01-15T14:30:00Z')
      mockRequest.query = { latitude: '48.8566', longitude: '2.3522' } as any
      mockAirQualityService.getMostPollutedTime.mockResolvedValue(mockDate)

      // Act
      await controller.getMostPollutedTime(
        mockRequest as Request,
        mockResponse as Response
      )

      // Assert
      expect(mockAirQualityService.getMostPollutedTime).toHaveBeenCalledWith({
        latitude: '48.8566',
        longitude: '2.3522',
      })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })

    it('should format date and time correctly', async () => {
      // Arrange
      const testCases = [
        {
          inputDate: new Date('2024-12-25T09:05:00Z'),
          expectedDate: '2024-12-25',
          expectedTime: '09:5',
        },
        {
          inputDate: new Date('2024-06-15T23:45:00Z'),
          expectedDate: '2024-06-15',
          expectedTime: '11:45',
        },
      ]

      for (const testCase of testCases) {
        mockRequest.query = mockCoordinates as any as any
        mockAirQualityService.getMostPollutedTime.mockResolvedValue(testCase.inputDate)

        // Act
        await controller.getMostPollutedTime(
          mockRequest as Request,
          mockResponse as Response
        )

        // Assert
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Data retrieved successfully',
          data: {
            date: testCase.expectedDate,
            time: testCase.expectedTime,
          },
          error: undefined,
        })
      }
    })
  })
})
