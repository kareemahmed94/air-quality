import { Express, Request, Response, NextFunction } from 'express'
import env from '@/config/constants/env'
import { serve, setup } from 'swagger-ui-express'
import getSwaggerSchema from '@/core/plugins/swagger'
import auth from 'basic-auth'
import {apiRouter} from "~/routes/api";

export const routes = (app: Express) => {
  // routes goes here
  app.use('/api/v1', apiRouter.router)

  //swagger
  if (env.ENABLE_SWAGGER_UI) {
    app.use('/api/docs', serve)
    app.use(
      '/api/docs',
      async (req: Request, res: Response, next: NextFunction) => {
        const user = auth(req)
        if (user === undefined || user['name'] !== env.SWAGGER_AUTH_USERNAME || user['pass'] !== env.SWAGGER_AUTH_PASSWORD) {
          res.statusCode = 401
          res.setHeader('WWW-Authenticate', 'Basic realm="Node"')
          res.end('Unauthorized')
        } else {
          next()
        }
      },
      (...args) => setup(getSwaggerSchema(1))(...args),
    )
  }
}
