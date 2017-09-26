import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import * as KoaRouter from 'koa-router'
import * as koaSwagger from 'koa2-swagger-ui'
import * as path from 'path'
import * as swaggerJSDoc from 'swagger-jsdoc'
import { router as controllers } from './controllers'
import { schema } from './graphql/schema'

const API_V1 = '/api'

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Little Hut',
      version: '1.0',
      basePath: API_V1
    }
  },
  apis: [
    path.resolve(__dirname, './controllers/**/*.ts'),
    path.resolve(__dirname, './controllers/**/*.js'),
    path.resolve(__dirname, './entities/**/*.ts'),
    path.resolve(__dirname, './entities/**/*.js'),
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
  '/',
  koaSwagger({
    routePrefix: false,
    swaggerOptions: {
      spec: swaggerSpec
    }
  })
)
router.post('/graphql', graphqlKoa({ schema }))
router.get('/graphql', graphiqlKoa({ endpointURL: '/api/graphql' }))
