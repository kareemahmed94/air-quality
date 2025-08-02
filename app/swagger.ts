import j2s from 'joi-to-swagger';
import Joi, { Schema } from 'joi';

// TODO: use a better type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schema: any = {};

export interface PathOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryParams?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pathParams?: any[];
  requestSchema?: Schema;
  requiresAuth?: boolean;
  requestFormFields?: { [key: string]: { type: string; format?: string } };
  version?: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseSchema = Record<
    number | 'default',
    { schema?: Schema; [key: string]: any }
>;

type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : [];

type args = Tail<Parameters<typeof addSwaggerPath>>;

export const swagger = {
  get: (...args: args): void => addSwaggerPath('get', ...args),
  post: (...args: args): void => addSwaggerPath('post', ...args),
  patch: (...args: args): void => addSwaggerPath('patch', ...args),
  put: (...args: args): void => addSwaggerPath('put', ...args),
  delete: (...args: args): void => addSwaggerPath('delete', ...args)
};

export const addSwaggerPath = (
    method: string,
    url: string,
    tags: ReadonlyArray<string>,
    summary: string,
    responseSchema: ResponseSchema,
    options: PathOptions = {}
): void => {
  const object = schema[options.version ?? 1]?.[url] ?? {};
  const parameters = (options?.queryParams ?? [])
      .map((p) => ({ in: 'query', ...p }))
      .concat((options?.pathParams ?? []).map((p) => ({ in: 'path', ...p })));
  object[method] = {
    summary,
    tags,
    parameters,
    ...((options?.requestSchema || options?.requestFormFields) && {
      requestBody: {
        content: {
          ...(options?.requestSchema && {
            'application/json': {
              schema: {
                ...j2s(options.requestSchema).swagger
              }
            }
          }),
          ...(options?.requestFormFields && {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  ...options.requestFormFields
                }
              }
            }
          })
        }
      }
    }),
    responses: {
      422: {
        description: 'JOI validation errors'
      },
      400: {
        content: {
          'application/json': {
            schema: {
              ...j2s(
                  Joi.object({
                    data: Joi.string().example(null),
                    error: Joi.string(),
                    error_code: Joi.string().example('00000000'),
                    details: Joi.object()
                  })
              ).swagger
            }
          }
        }
      },
      ...Object.fromEntries(
          Object.entries(responseSchema).map(
              ([responseCode, { schema, ...rest }]) => [
                responseCode,
                {
                  ...rest,
                  content: {
                    ...(rest?.content ?? {}),
                    ...(schema && {
                      'application/json': {
                        schema: {
                          ...j2s(schema).swagger
                        }
                      }
                    })
                  }
                }
              ]
          )
      )
    },
    ...(options.requiresAuth && {
      security: [
        {
          BearerAuth: []
        }
      ]
    })
  };

  schema[options.version ?? 1] ??= {};
  schema[options.version ?? 1][url] = object;
};

export const mapSwaggerQueryParamsFromStrings = (params: string[] = []) =>
    params.map((param) => ({
      name: param,
      schema: { type: 'string' },
      required: false
    }));

export const mapSwaggerPathParamsFromStrings = (params: string[] = []) =>
    params.map((param) => ({
      name: param,
      schema: { type: 'string' },
      required: true
    }));
