import * as jwt from 'jsonwebtoken'
import { config } from '../config'
import { BaseModel } from './Base'
import { BusAttendance } from './BusAttendance'
import { Microsoft } from './Microsoft'
import { Slack } from './Slack'

export interface IUserConstructor {
  name: string
  email: string
}

export interface IMicrosoftInput {
  objectID: string
  tenantID: string
  accessToken: string
  refreshToken?: string
}

export interface ISlackInput {
  slackUserID: string
  slackTeamID: string
  accessToken: string
  refreshToken?: string
}

export class User extends BaseModel implements IUserConstructor {
  static tableName = 'users'
  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'isComplete'],

    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      isComplete: { type: 'boolean' },

      id: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      createdAt: { type: ['object', 'null'] },
      updatedAt: { type: ['object', 'null'] },
      isActive: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
    slack: {
      relation: BaseModel.HasOneRelation,
      modelClass: Slack as any,
      join: {
        to: 'users.id',
        from: 'slack.userID'
      }
    },
    microsoft: {
      relation: BaseModel.HasOneRelation,
      modelClass: Microsoft as any,
      join: {
        from: 'users.id',
        to: 'microsoft.userID'
      }
    },
    attendance: {
      relation: BaseModel.HasManyRelation,
      modelClass: BusAttendance as any,
      join: {
        from: 'users.id',
        to: 'busAttendance.userID'
      }
    }
  }

  static async create(user: User) {
    return await User.query().insert(user)
  }

  static async findByID(id: string) {
    return User.query().findById(id)
  }

  static async findByEmail(email: string) {
    return User.query()
      .where('email', '=', email)
      .first()
  }

  static async list() {
    return await User.query()
  }

  static async associateSlack(user: IUserConstructor, slack: ISlackInput) {
    return User.createAssociator<ISlackInput>('slack', Slack.insertIfNotExistsBySlackIDs)(user, slack)
  }

  static async associateMicrosoft(user: IUserConstructor, microsoft: IMicrosoftInput) {
    return User.createAssociator<IMicrosoftInput>('microsoft', Microsoft.insertIfNotExistsByMicrosoftIDs)(
      user,
      microsoft
    )
  }

  private static createAssociator<T>(name: string, insertFunction: Function) {
    return async (user: IUserConstructor, input: T): Promise<User> => {
      const userFromDatabase: any = await User.findByEmail(user.email)

      if (userFromDatabase) {
        if (!userFromDatabase.id) throw new Error('Uninitialized user')
        const channelFromDatabase = await insertFunction({
          ...input as any,
          userID: userFromDatabase.id
        })
        userFromDatabase[name] = channelFromDatabase
        return userFromDatabase
      } else {
        const userPrototype = {
          ...user,
          isComplete: true,
          [name]: input
        }
        return (await User.query().insertGraph(userPrototype as any)) as any
      }
    }
  }

  name: string
  email: string
  slack?: Slack
  microsoft?: Microsoft
  isComplete: boolean
  password?: string

  $beforeInsert() {
    super.$beforeInsert()
    this.isComplete = this.isComplete ? this.isComplete : false
  }

  $formatJson(json: any) {
    json = super.$formatJson(json)
    json.password = undefined
    json.isComplete = json.isComplete === 1 ? true : json.isComplete
    return json
  }

  secure() {
    super.secure()
    delete this.password
  }

  generateJWT(type: 'authentication' | 'refresh' | 'forgot'): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { type, id: this.id },
        config.get('jwt.secret'),
        {
          expiresIn: config.get('jwt.expiresIn'),
          issuer: config.get('jwt.issuer'),
          audience: config.get('jwt.audience')
        },
        (err, token) => {
          if (err) return reject(err)
          return resolve(token)
        }
      )
    })
  }
}
