import koa = require('koa-router')

declare module 'koa-router' {
  interface IRouterContext {
    compress?: boolean
  }
}
