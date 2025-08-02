// Test setup file
import 'reflect-metadata'

// Mock console to reduce noise during tests unless specifically testing console output
global.console = {
  ...console,
  // uncomment to ignore all console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}

// Setup any global test configuration here