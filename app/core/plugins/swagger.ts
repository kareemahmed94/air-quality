import { schema } from '@/swagger'

const getSwaggerSchema = (version: number | string = 1) => ({
  openapi: '3.0.0',
  info: {
    title: 'AIR QUALITY',
    version,
    description: 'API Documentation',
  },
  paths: {
    ...schema[version],
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
})

export default getSwaggerSchema
