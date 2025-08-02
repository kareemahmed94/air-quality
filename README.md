# 🌍 Air Quality Monitoring System

A comprehensive air quality monitoring system built with Node.js, TypeScript, and modern architecture patterns. This system provides real-time air quality data by integrating with the IQAir API and offers historical tracking capabilities.

## ⚙️ Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **PostgreSQL**: Version 12.x or higher
- **Git**: For version control

## 🔧 Setup Instructions

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd air-quality
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

### **4. Database Setup**

#### **Option A: Local PostgreSQL**
```bash
# Create a new PostgreSQL database
createdb air_quality

# Update DATABASE_URL in .env file
DATABASE_URL="postgresql://username:password@localhost:5432/air_quality"
```

# Update DATABASE_URL in .env file
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/air_quality"
```

### **5. Database Migration**

# Generate Prisma client
```bash
npx prisma generate
```
# Run database migrations
```bash
npx prisma migrate dev
```

### **6. Start the Application**

#### **Development Mode**
```bash
npm run dev
```

#### **Production Mode**
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🚀 Features

- **Real-time Air Quality Data**: Fetch current air quality information for any coordinates
- **Historical Tracking**: Store and analyze historical air quality data
- **Most Polluted Time Analysis**: Find peak pollution times for specific locations
- **Automated Data Collection**: Background jobs for continuous data gathering
- **RESTful API**: Well-structured API endpoints with comprehensive documentation
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Comprehensive Testing**: Unit tests with high coverage using Jest
- **Swagger Documentation**: Interactive API documentation
- **Dependency Injection**: Clean architecture with InversifyJS
- **Database ORM**: Type-safe database operations with Prisma

## 🏗️ Tech Stack

### **Core Technologies**
- **Runtime**: Node.js
- **Language**: TypeScript 5.6.3
- **Framework**: Express.js 4.21.1
- **Database**: PostgreSQL
- **ORM**: Prisma 5.22.0

### **Architecture & Patterns**
- **Dependency Injection**: InversifyJS 7.6.1
- **Validation**: Joi 17.13.3
- **HTTP Client**: Axios 1.7.9
- **Date Manipulation**: date-fns 4.1.0

### **Development & Testing**
- **Testing Framework**: Jest 29.7.0
- **Test Types**: Unit tests with ts-jest
- **Linting**: ESLint 9.15.0
- **Code Formatting**: Prettier 3.3.3
- **Process Management**: ts-node-dev 2.0.0

### **Documentation & API**
- **API Documentation**: Swagger UI Express 5.0.1
- **Auto-generation**: swagger-autogen 2.23.7
- **Schema Documentation**: joi-to-swagger 6.2.0

### **Background Processing**
- **Job Scheduling**: node-cron 4.2.1
- **Logging**: Winston 3.17.0
- **Error Tracking**: Custom error handling

### **Security & Authentication**
- **JWT**: jsonwebtoken 9.0.2
- **Password Hashing**: bcrypt 5.1.1
- **CORS**: cors 2.8.5

## 🎯 Architecture & Design Patterns

This project follows **Clean Architecture** principles with clear separation of concerns:

### **Layered Architecture**
```
┌─────────────────────────────────────┐
│             Controllers             │  ← HTTP Layer (Express Routes)
├─────────────────────────────────────┤
│              Services               │  ← Business Logic Layer
├─────────────────────────────────────┤
│            Repositories             │  ← Data Access Layer
├─────────────────────────────────────┤
│              Database               │  ← PostgreSQL + Prisma
└─────────────────────────────────────┘
```

### **Design Patterns Used**

1. **Dependency Injection Pattern**
   - Uses InversifyJS for IoC container
   - Promotes loose coupling and testability
   - Located in: `app/core/container/`

2. **Repository Pattern**
   - Abstracts data access logic
   - Enables easy testing with mocks
   - Located in: `app/core/repositories/`

3. **Service Layer Pattern**
   - Contains business logic
   - Orchestrates between controllers and repositories
   - Located in: `app/core/services/`

4. **Interface Segregation**
   - Clear interface contracts
   - Enables dependency inversion
   - Located in: `app/core/interfaces/`

5. **Factory Pattern**
   - Used in API service for HTTP clients
   - Centralized configuration management

### **SOLID Principles Implementation**
- ✅ **Single Responsibility**: Each class has one reason to change
- ✅ **Open/Closed**: Open for extension, closed for modification
- ✅ **Liskov Substitution**: Interfaces are properly implemented
- ✅ **Interface Segregation**: Focused, cohesive interfaces
- ✅ **Dependency Inversion**: Depends on abstractions, not concretions

## 📁 Project Structure

```
air-quality/
├── app/                          # Application source code
│   ├── config/                   # Configuration files
│   │   └── constants/
│   │       └── env.ts           # Environment variables configuration
│   ├── core/                    # Core application logic
│   │   ├── container/           # Dependency injection setup
│   │   │   ├── container.ts     # IoC container configuration
│   │   │   └── index.ts
│   │   ├── controllers/         # HTTP request handlers
│   │   │   └── air-quality.controller.ts
│   │   ├── interfaces/          # TypeScript interfaces
│   │   │   ├── repositories/    # Repository interfaces
│   │   │   ├── services/        # Service interfaces
│   │   │   └── index.ts
│   │   ├── jobs/               # Background jobs
│   │   │   └── city-air-quality.job.ts
│   │   ├── plugins/            # Express plugins and middleware
│   │   │   ├── createRouter.ts  # Custom router factory
│   │   │   ├── swagger.ts       # Swagger configuration
│   │   │   └── validate.ts      # Validation middleware
│   │   ├── repositories/       # Data access layer
│   │   │   └── air-quality.repository.ts
│   │   ├── services/           # Business logic layer
│   │   │   ├── air-quality.service.ts
│   │   │   ├── api.service.ts   # HTTP client wrapper
│   │   │   └── iqair.service.ts # IQAir API integration
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── air-quality.types.ts
│   │   │   ├── common.ts
│   │   │   ├── container.ts     # DI container types
│   │   │   └── iqair.types.ts
│   │   └── utils/              # Utility functions
│   │       ├── customError.ts   # Custom error classes
│   │       ├── pagination.ts    # Pagination helpers
│   │       └── response.ts      # Response formatting
│   ├── index.d.ts              # Global type declarations
│   ├── path.ts                 # Path configuration
│   ├── server.ts               # Application entry point
│   └── swagger.ts              # Swagger setup
├── prisma/                     # Database configuration
│   ├── migrations/            # Database migrations
│   └── schema.prisma          # Database schema definition
├── routes/                    # Route definitions
│   ├── api.ts                # API routes
│   └── index.ts              # Route registration
├── tests/                    # Test files
│   ├── controllers/          # Controller tests
│   └── setup.ts             # Test configuration
├── dist/                     # Compiled JavaScript (generated)
├── .env                     # Environment variables (create from template)
├── env.example             # Environment variables template
├── jest.config.js           # Jest testing configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md              # This documentation
```

### **8. Verify Installation**
- Application: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

## 🧪 Testing

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### **Test Structure**
```
tests/
├── controllers/
│   └── air-quality.controller.test.ts  # Controller unit tests
└── setup.ts                           # Test configuration
```

### **Test Coverage**
The project maintains high test coverage with comprehensive unit tests:

- ✅ **Controllers**: 100% function coverage
- ✅ **Services**: Mocked dependencies for isolated testing
- ✅ **Error Scenarios**: All error paths tested
- ✅ **Validation**: Input validation thoroughly tested
- ✅ **Edge Cases**: Null values, missing parameters, etc.

### **Test Features**
- **Dependency Mocking**: All external dependencies properly mocked
- **Type Safety**: Full TypeScript support in tests
- **Assertion Library**: Jest matchers for comprehensive testing
- **Coverage Reports**: HTML and LCOV reports generated

## 🔧 Development Workflow

### **Available Scripts**
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run watch        # Start with file watching
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
npm test             # Run tests
npm run test:coverage # Run tests with coverage report
```

### **Development Best Practices**
1. **Code Formatting**: Automatic formatting with Prettier
2. **Linting**: ESLint for code quality
3. **Type Safety**: Strict TypeScript configuration
4. **Git Hooks**: Pre-commit hooks for quality assurance
5. **Testing**: Test-driven development approach

### **Code Style Guidelines**
- Use TypeScript for all new code
- Follow SOLID principles
- Write comprehensive tests for new features
- Use meaningful variable and function names
- Document complex business logic
- Handle errors gracefully

## 📊 Background Jobs

### **Air Quality Data Collection**
The system includes automated data collection for continuous monitoring:

### **Starting Background Jobs**
Jobs are automatically started when the application boots. To manually control:


## 📖 API Documentation

### **Swagger Documentation**
Interactive API documentation is available at:
```
http://localhost:3000/api/docs
```

**Authentication:**
- Username: Set via `SWAGGER_AUTH_USERNAME` environment variable
- Password: Set via `SWAGGER_AUTH_PASSWORD` environment variable

### **API Features**
- **Auto-generated Documentation**: Using swagger-autogen
- **Interactive Testing**: Try endpoints directly from docs
- **Schema Validation**: Request/response schemas included
- **Authentication**: Basic auth protected documentation

## 🚀 Deployment

### **Production Build**
```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start the production server
npm start
```



### **Environment Setup**
1. Copy `env.example` to `.env`
2. Update all required variables
3. Set production values for deployment

---
