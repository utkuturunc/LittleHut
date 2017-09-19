import * as moment from 'moment'
import { Moment } from 'moment'
import { ModelOptions } from 'objection'
import { v4 } from 'uuid'
import { Model } from '../config/database'

interface IBase {
  readonly id?: string
  createdAt?: Moment
  updatedAt?: Moment
  isActive?: boolean
}

export class BaseModel extends Model implements IBase {
  static eliminateDangerousFields(body: IBase) {
    delete body.createdAt
    delete body.updatedAt
    return body
  }

  id?: string
  createdAt?: Moment
  updatedAt?: Moment
  isActive?: boolean

  $parseDatabaseJson(json: any) {
    const createdAt = json.createdAt && moment(json.createdAt, 'YYYY-MM-DD HH:mm:ss')
    const updatedAt = json.updatedAt && moment(json.updatedAt, 'YYYY-MM-DD HH:mm:ss')
    json = super.$parseDatabaseJson(json)
    json.createdAt = createdAt
    json.updatedAt = updatedAt
    return json
  }

  $formatDatabaseJson(json: any) {
    const createdAt = json.createdAt && json.createdAt.format('YYYY-MM-DD HH:mm:ss')
    const updatedAt = json.updatedAt && json.updatedAt.format('YYYY-MM-DD HH:mm:ss')
    json = super.$formatDatabaseJson(json)
    json.createdAt = createdAt
    json.updatedAt = updatedAt
    return json
  }

  $parseJson(json: any, opt?: ModelOptions) {
    const createdAt = json.createdAt && moment(json.createdAt)
    const updatedAt = json.updatedAt && moment(json.updatedAt)
    json = super.$parseJson(json)
    json.createdAt = createdAt
    json.updatedAt = updatedAt
    return json
  }

  $formatJson(json: any) {
    const createdAt = json.createdAt && json.createdAt.format()
    const updatedAt = json.updatedAt && json.updatedAt.format()
    json = super.$formatJson(json)
    json.isActive = json.isActive === 1 || json.isActive === true
    json.createdAt = createdAt
    json.updatedAt = updatedAt
    return json
  }

  $beforeInsert() {
    if (!this.$id()) {
      this.$id(v4())
    }
    this.isActive = true
    this.updatedAt = moment()
    this.createdAt = moment()
  }

  $beforeUpdate() {
    this.updatedAt = moment()
  }

  secure() {
    delete this.createdAt
    delete this.updatedAt
    this.isActive = true
  }
}
