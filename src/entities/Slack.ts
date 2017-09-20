import { BaseModel } from './Base'

export interface ISlackConstructor {
  userID: string
  slackUserID: string
  slackTeamID: string
  accessToken: string
  refreshToken?: string
}

export class Slack extends BaseModel implements ISlackConstructor {
  static tableName = 'slack'
  static jsonSchema = {
    type: 'object',
    required: ['userID', 'slackUserID', 'slackTeamID', 'accessToken'],

    properties: {
      userID: { type: 'string', minLength: 1, maxLength: 255 },
      slackUserID: { type: 'string', minLength: 1, maxLength: 255 },
      slackTeamID: { type: 'string', minLength: 1, maxLength: 255 },
      accessToken: { type: 'string', minLength: 1, maxLength: 255 },
      refreshToken: { type: ['string', 'null'], minLength: 1, maxLength: 255 },

      id: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      createdAt: { type: ['object', 'null'] },
      updatedAt: { type: ['object', 'null'] },
      isActive: { type: ['boolean', 'null'] }
    }
  }

  static async create(slack: ISlackConstructor) {
    return Slack.query().insert(slack)
  }

  static async list() {
    return Slack.query()
  }

  static async findBySlackIDs(slackUserID: string, slackTeamID: string) {
    return Slack.query()
      .where('slackUserID', '=', slackUserID)
      .where('slackTeamID', '=', slackTeamID)
      .first()
  }

  static async insertIfNotExistsBySlackIDs(input: ISlackConstructor) {
    const slack = await Slack.findBySlackIDs(input.slackUserID, input.slackTeamID)
    if (slack) return slack
    return await Slack.create(input)
  }

  userID: string
  slackUserID: string
  slackTeamID: string
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
