import * as knexLib from 'knex'
import 'mysql'
import { Model as ModelLibrary } from 'objection'
import { config } from './'

export const knex = knexLib({
  client: 'mysql',
  debug: true,
  connection: config.get('database')
})
ModelLibrary.knex(knex)

export const Model = ModelLibrary
