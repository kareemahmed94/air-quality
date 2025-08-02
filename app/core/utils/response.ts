import { Response } from 'express'

interface ResponseData<T> {
  status?: number
  message: string
  data?: T
  error?: string
}

export function responseJson<T>(res: Response, { status = 200, message, data = undefined, error = undefined }: ResponseData<T>): Response {
  return res.status(status).json({
    message,
    data,
    error,
  })
}
