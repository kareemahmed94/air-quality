import Joi from 'joi'
import { AnySchema, ValidationError } from 'joi'

export type ValidationResult<T> = { error: ValidationError; value: undefined } | { error: undefined; value: T }

export function validate<T extends AnySchema>(validation: T, body: unknown, options?: Joi.ValidationOptions): ValidationResult<Joi.ValidationResult<T>> {
  return validation.validate(body, { abortEarly: false, ...options })
}
