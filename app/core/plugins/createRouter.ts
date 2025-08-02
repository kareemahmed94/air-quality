import { RequestHandler, Router } from 'express'
import Joi from 'joi'
import { AnySchema } from 'joi'
import { mapSwaggerPathParamsFromStrings, mapSwaggerQueryParamsFromStrings, ResponseSchema, swagger } from '@/swagger'
import { validate } from './validate'
import { handleRequestError } from '@/core/utils/customError'

export const routes: string[] = []

type Options<S extends AnySchema> = {
  readonly tags?: Array<string>
  readonly summary: string
  readonly requestSchema?: S
  readonly responseSchema: ResponseSchema
  readonly queryParams?: string[]
  readonly middleware?: RequestHandler[]
  readonly requestFormFields?: {
    [key: string]: { type: string; format?: string }
  }
  readonly validationOptions?: Joi.ValidationOptions
}

type Handler<S extends AnySchema> = RequestHandler<Record<string, string>, unknown, Joi.ObjectSchema<S>>

// match anything between a : and / or end of line
export const matchPathParams = (path: string) => path.match(/(?<=:).*?(?=\/|$)\w+/g) ?? []

export const createRouter = (baseUrl: string, baseTags: string[] = [], version: number | string = 1) => {
  const router = Router()

  type AvailableMethods = 'get' | 'post' | 'put' | 'patch' | 'delete'

  const route =
    (method: AvailableMethods) =>
    <TPath extends string, S extends AnySchema>(path: TPath, options: Options<S>, handler: Handler<S>) => {
      routes.push(baseUrl + path)

      const pathParams = mapSwaggerPathParamsFromStrings(matchPathParams(path))

      const queryParams = mapSwaggerQueryParamsFromStrings(options.queryParams)

      // replace express path params with swagger path params
      // :path_name to {path_name}
      const swaggerPath = path.replace(/:.*?(?=\/||$)\w+/g, (match) => `{${match.replace(':', '')}}`)

      const swaggerTags = [...baseTags, ...(options.tags ?? [])]

      swagger[method](baseUrl + swaggerPath, swaggerTags, options.summary, options.responseSchema, {
        requestSchema: options.requestSchema,
        requestFormFields: options.requestFormFields,
        pathParams,
        queryParams,
        version,
      })

      router[method](path,async (req, res, next) => {
        try {
          if (options.requestSchema) {
            const result = validate(options.requestSchema, req.body, options.validationOptions)
            if (result.error) {
              return res.status(422).send({
                error: 'validation error',
                error_code: 400,
                details: result.error,
              })
            }
          }

          return handler(req, res, next)
        } catch (e) {
          console.log({ error: e })
          handleRequestError(e, req as any, res, next)
        }
      })
    }

  return {
    get: route('get'),
    post: route('post'),
    put: route('put'),
    patch: route('patch'),
    delete: route('delete'),
    router,
  }
}
