import { groupBy } from 'lodash'
import * as moment from 'moment'
import { Moment } from 'moment'
import { ModelOptions } from 'objection'
import { BaseModel } from './Base'

export interface IMicrosoftConstructor {
  userID: string
  objectID: string
  tenantID: string
  accessToken: string
  refreshToken?: string
}

export class Microsoft extends BaseModel implements IMicrosoftConstructor {
  static tableName = 'microsoft'
  static jsonSchema = {
    type: 'object',
    required: ['userID', 'objectID', 'tenantID', 'accessToken'],

    properties: {
      userID: { type: 'string', minLength: 1, maxLength: 255 },
      objectID: { type: 'string', minLength: 1, maxLength: 255 },
      tenantID: { type: 'string', minLength: 1, maxLength: 255 },
      accessToken: { type: 'string', minLength: 1, maxLength: 16384 },
      refreshToken: { type: ['string', 'null'], minLength: 1, maxLength: 16384 },

      id: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      createdAt: { type: ['object', 'null'] },
      updatedAt: { type: ['object', 'null'] },
      isActive: { type: ['boolean', 'null'] }
    }
  }

  static async create(microsoft: IMicrosoftConstructor) {
    return Microsoft.query().insert(microsoft)
  }

  static async list() {
    return Microsoft.query()
  }

  static async findByMicrosoftIDs(objectID: string, tenantID: string) {
    return Microsoft.query()
      .where('objectID', '=', objectID)
      .where('tenantID', '=', tenantID)
      .first()
  }

  static async insertIfNotExistsByMicrosoftIDs(input: IMicrosoftConstructor) {
    const microsoft = await Microsoft.findByMicrosoftIDs(input.objectID, input.tenantID)
    if (microsoft) return microsoft
    return await Microsoft.create(input)
  }

  userID: string
  objectID: string
  tenantID: string
  refreshToken?: string
  accessToken: string

  $formatJson(json: any) {
    super.$formatJson(json)
    json.accessToken = undefined
    json.refreshToken = undefined
  }

  secure() {
    super.secure()
    delete this.accessToken
    delete this.refreshToken
  }
}
