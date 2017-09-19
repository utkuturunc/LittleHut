exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table
        .uuid('id')
        .primary()
        .unique()
        .notNullable()

      table.string('name').notNullable()
      table.string('password')
      table
        .string('email')
        .notNullable()
        .unique()
        .index()

      table
        .timestamp('createdAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table
        .timestamp('updatedAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table.boolean('isComplete').notNullable()
      table.boolean('isActive').notNullable()
    })
    .createTable('slack', function(table) {
      table.uuid('id').primary()
      table
        .uuid('userID')
        .references('id')
        .inTable('users')
        .notNullable()
        .index()
      table
        .string('slackUserID')
        .notNullable()
        .index()
      table
        .string('slackTeamID')
        .notNullable()
        .index()
      table.string('accessToken').notNullable()
      table.string('refreshToken')
      table
        .timestamp('createdAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table
        .timestamp('updatedAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table.boolean('isActive').notNullable()
    })
    .createTable('microsoft', function(table) {
      table.uuid('id').primary()
      table
        .uuid('userID')
        .references('id')
        .inTable('users')
        .notNullable()
        .index()
      table
        .string('objectID')
        .notNullable()
        .index()
      table
        .string('tenantID')
        .notNullable()
        .index()
      table.string('accessToken', 16384).notNullable()
      table.string('refreshToken', 16384)
      table
        .timestamp('createdAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table
        .timestamp('updatedAt', true)
        .defaultTo(knex.raw('now()'))
        .notNullable()
      table.boolean('isActive').notNullable()
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('slack')
    .dropTableIfExists('microsoft')
}
