import { AxiosInstance } from 'axios'
import axios from 'axios'
import { stringify } from 'qs'

export interface ISlackClientConstructor {
  token: string
}

export class SlackClient {
  static filterActiveUsers(users: any[]) {
    return users.filter(user => !user.deleted && !user.is_restricted && !user.is_ultra_restricted && !user.is_bot)
  }

  token: string
  private api: AxiosInstance

  constructor({ token }: ISlackClientConstructor) {
    this.token = token
    this.api = axios.create({
      baseURL: 'https://slack.com/api/',
      timeout: 30000,
      transformRequest: [
        data =>
          stringify({
            ...data,
            token
          })
      ]
    })
    this.api.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  async getAllUsers(accumulated: any[] = [], cursor?: string): Promise<any[]> {
    const response = await this.callMethod('users.list', { cursor })
    if (response.response_metadata && response.response_metadata.next_cursor) {
      return await this.getAllUsers(accumulated, response.response_metadata.next_cursor)
    }
    return [...accumulated, ...response.members]
  }

  async getAllActiveUsers() {
    const users = await this.getAllUsers()
    return SlackClient.filterActiveUsers(users)
  }

  private async callMethod(method: string, data?: any) {
    const response = await this.api.post(method, data)
    if (!response.data.ok) throw new Error(response.data.error)
    return response.data
  }
}
