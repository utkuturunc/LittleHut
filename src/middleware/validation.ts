import { badRequest } from 'boom'
import { Context, Middleware } from 'koa'
import { unexpected } from '../helpers/response/failure'
import { ajv } from '../helpers/validation'

export const validateQuery = (schema: string, message?: string): Middleware => async (
  ctx: Context,
  next: Function
) => {
  const validate = ajv.getSchema(schema)
  if (!validate) throw unexpected('Wrong schema name')
  const isValid = validate(ctx.query)
  if (!isValid && validate.errors) throw badRequest(message, validate.errors)
  await next()
}

export const validateBody = (schema: string, message?: string): Middleware => async (
  ctx: Context,
  next: Function
) => {
  const validate = ajv.getSchema(schema)
  if (!validate) throw unexpected('Wrong schema name')
  const isValid = validate(ctx.request.body)
  if (!isValid && validate.errors) throw badRequest(message, validate.errors)
  await next()
}
