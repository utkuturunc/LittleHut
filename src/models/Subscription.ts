import { PassThrough } from 'stream'

export class Subscription extends PassThrough {
  publish(event: string, data: any) {
    this.push(JSON.stringify({ event, data }))
  }
}
