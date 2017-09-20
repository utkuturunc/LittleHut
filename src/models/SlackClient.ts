import { AxiosInstance } from 'axios'
import axios from 'axios'
import { stringify } from 'qs'

export interface ISlackClientConstructor {
  token: string
}

export class SlackClient {
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

  getUserList() {
    return this.callMethod('users.list', 'members')
  }

  private async callMethod(method: string, outputKey: string, data?: any) {
    const response = await this.api.post(method, data)
    if (!response.data.ok) throw new Error(response.data.error)
    return response.data[outputKey]
  }
}
