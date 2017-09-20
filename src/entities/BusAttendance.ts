import * as moment from 'moment'
import { Moment } from 'moment'
import { ModelOptions } from 'objection'
import { BaseModel } from './Base'
import { User } from './User'

export interface IBusAttendanceConstructor {
  userID: string
  date: Moment
  isAttending: boolean
}

/**
 * @swagger
 * definitions:
 *   BusAttendance:
 *     type: object
 *     required:
 *       - date
 *       - isAttending
 *     properties:
 *       date:
 *         type: string
 *         format: date
 *       isAttending:
 *         type: boolean
 *       id:
 *         type: string
 *       userID:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: dateTime
 *       updatedAt:
 *         type: string
 *         format: dateTime
 *       isActive:
 *         type: boolean
 */

export class BusAttendance extends BaseModel implements IBusAttendanceConstructor {
  static tableName = 'busAttendance'
  static jsonSchema = {
    type: 'object',
    required: ['userID', 'date', 'isAttending'],

    properties: {
      userID: { type: 'string' },
      date: { type: 'object' },
      isAttending: { type: 'boolean' },

      id: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      createdAt: { type: ['object', 'null'] },
      updatedAt: { type: ['object', 'null'] },
      isActive: { type: ['boolean', 'null'] }
    }
  }

  static async create(busAttendance: IBusAttendanceConstructor) {
    return BusAttendance.query().insert(busAttendance)
  }

  static async update(busAttendance: IBusAttendanceConstructor & Partial<BusAttendance>) {
    if (!busAttendance.id) throw new Error('First save the attendance to database.')
    return BusAttendance.query().updateAndFetchById(busAttendance.id, busAttendance)
  }

  static async list() {
    return BusAttendance.query()
  }

  static async todaysAttendance() {
    const today = moment().format('YYYY-MM-DD')
    return BusAttendance.query().where('date', '=', today)
  }

  static async getUserResponseForToday(user: User) {
    const today = moment().format('YYYY-MM-DD')
    if (!user.id) throw new Error('Save the user to database first.')
    return BusAttendance.query()
      .where('date', '=', today)
      .where('userID', '=', user.id)
      .first()
  }

  // static async getTodaysAttendance(objectID: string, tenantID: string) {
  //   return BusAttendance.query()
  //     .where('objectID', '=', objectID)
  //     .where('tenantID', '=', tenantID)
  //     .first()
  // }

  userID: string
  date: Moment
  isAttending: boolean

  $parseDatabaseJson(json: any) {
    const date = json.date && moment(json.date, 'YYYY-MM-DD')
    json = super.$parseDatabaseJson(json)
    json.date = date
    return json
  }

  $formatDatabaseJson(json: any) {
    const date = json.date && json.date.format('YYYY-MM-DD')
    json = super.$formatDatabaseJson(json)
    json.date = date
    return json
  }

  $parseJson(json: any, opt?: ModelOptions) {
    const date = json.date && moment(json.date, 'YYYY-MM-DD')
    json = super.$parseJson(json)
    json.date = date
    return json
  }

  $formatJson(json: any) {
    const date = json.date && json.date.format('YYYY-MM-DD')
    json = super.$formatJson(json)
    json.isAttending = json.isAttending === 1 ? true : json.isAttending
    json.date = date
    return json
  }
}
