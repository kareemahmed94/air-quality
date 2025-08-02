import { ErrorRequestHandler, Request, Response } from 'express';

export const FourHundredErrorName = 'FourHundredError';
export class CustomError extends Error {
  payload: string | Error | Record<string, unknown>;

  extra?: Record<string, unknown>;

  constructor(
    payload: string | Error | Record<string, unknown>,
    extra?: Record<string, unknown>
  ) {
    if (payload instanceof Error) super(payload.message);
    else if (typeof payload === 'string') super(payload);
    else super(payload.message as string | undefined);

    this.name = 'CustomError';
    this.payload = payload;
    this.extra = extra;
  }
}

type FourHundredBody = {
  data?: null;
  error: string;
  error_code: string;
  details?: Record<string, unknown>;
};
export class FourHundredError extends Error {
  body: FourHundredBody;

  constructor(body: FourHundredBody) {
    super(body.error);

    this.name = FourHundredErrorName;
    this.body = { data: null, ...body };
  }
}

export const handleRequestError: ErrorRequestHandler = (
  e,
  req: Request,
  res: Response
) => {
  if (e.name === 'CustomError') {
    if (e.extra?.status) {
      res.status(e.extra.status as number);
      if (e.extra?.body) res.send(e.extra.body);
      return res.end();
    }
  } else if (e.name === FourHundredErrorName) {
    return res.status(400).send(e.body);
  } else {
  }
  return res.status(500).end();
};

export const handleAxiosError = (e: any): void => {
  if (e instanceof CustomError) throw e;
  if (e.response) {
    throw new CustomError({
      message: 'invalid response code',
      errorMessage: e.message,
      data: e.response.data
    });
  } else {
    throw e;
  }
};

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
