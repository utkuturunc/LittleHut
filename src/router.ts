import * as KoaRouter from 'koa-router'
import * as koaSwagger from 'koa2-swagger-ui'
import * as path from 'path'
import * as swaggerJSDoc from 'swagger-jsdoc'
import { router as controllers } from './controllers'

const API_V1 = '/api'

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'VoT Assistant',
      version: '1.0',
      basePath: API_V1
    }
  },
  apis: [
    path.resolve(__dirname, './controllers/**/*.ts'),
    path.resolve(__dirname, './controllers/**/*.ts'),
    path.resolve(__dirname, './models/**/*.ts'),
    path.resolve(__dirname, './models/**/*.js')
  ]
})

export const router = new KoaRouter({
  prefix: API_V1
})

router.use('', controllers.routes())
router.get('/api-docs.json', ctx => {
  ctx.body = swaggerSpec
})
router.get(
  '/docs',
  koaSwagger({
    routePrefix: `${API_V1}/docs`,
    swaggerOptions: {
      spec: swaggerSpec
    }
  })
)
