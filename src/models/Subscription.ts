import { PassThrough } from 'stream'

export class Subscription extends PassThrough {
  async publish(event: string, data: any) {
    const resolvedData = await Promise.resolve(data)
    this.push(JSON.stringify({ event, data: resolvedData }))
  }
}
