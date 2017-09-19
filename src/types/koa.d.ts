import koa = require('koa')

declare module 'koa' {
  interface Request extends BaseRequest {
    body?: { [t: string]: any }
    files?: { [t: string]: any }
  }
}
