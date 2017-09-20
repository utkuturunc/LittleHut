import * as convict from 'convict'

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  `mysql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env
    .RDS_PORT}/${process.env.RDS_DB_NAME}`

const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  slack: {
    accessToken: {
      format: String,
      default: null,
      env: 'SLACK_ACCESS_TOKEN'
    },
    clientID: {
      format: String,
      default: null,
      env: 'SLACK_CLIENT_ID'
    },
    clientSecret: {
      format: String,
      default: null,
      env: 'SLACK_CLIENT_SECRET'
    },
    scope: {
      format: Array,
      default: ['identity.basic', 'identity.email']
    }
  },
  microsoft: {
    clientID: {
      format: String,
      default: null,
      env: 'MICROSOFT_CLIENT_ID'
    },
    clientSecret: {
      format: String,
      default: null,
      env: 'MICROSOFT_CLIENT_SECRET'
    }
  },
  jwt: {
    secret: {
      format: String,
      default: null,
      env: 'JWT_SECRET'
    },
    expiresIn: {
      format: String,
      default: '90 days',
      env: 'JWT_EXPIRATION'
    },
    issuer: {
      format: String,
      default: 'LittleHut'
    },
    audience: {
      format: String,
      default: 'Valensas'
    }
  },
  session: {
    key: {
      format: String,
      default: 'lilhut:sess'
    },
    secret: {
      format: String,
      default: null,
      env: 'SESSION_SECRET'
    }
  },
  build: {
    name: {
      format: String,
      default: 'LittleHut'
    },
    version: {
      format: String,
      default: '{{version}}'
    },
    build: {
      format: String,
      default: '{{build}}'
    },
    commit: {
      format: String,
      default: '{{commit}}'
    }
  },
  database: {
    doc: 'Database url',
    format: String,
    default: null,
    env: 'DATABASE_URL'
  },
  port: {
    doc: 'Port',
    format: 'int',
    default: 80,
    env: 'PORT'
  },
  domain: {
    doc: 'Domain',
    format: String,
    default: null,
    env: 'DOMAIN'
  }
})

// Perform validation
conf.validate({ allowed: 'strict' })

export { conf as config }
