import * as knexLib from 'knex'
import { Model as ModelLibrary } from 'objection'
import 'pg'
import { config } from './'

export const knex = knexLib({
  client: 'pg',
  debug: true,
  connection: config.get('database')
})
ModelLibrary.knex(knex)

export const Model = ModelLibrary
