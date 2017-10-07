import { PubSub } from 'graphql-subscriptions'
import { Subscription } from './Subscription'

export class EventManager {
  private subscription: Subscription
  private graphQLPubSub: PubSub

  constructor() {
    this.subscription = new Subscription()
    this.graphQLPubSub = new PubSub()
  }

  async publish(event: string, data: any) {
    const resolvedData = await Promise.resolve(data)
    this.subscription.publish(event, resolvedData)
    this.graphQLPubSub.publish(event, { [event]: resolvedData })
  }

  getSubscription() {
    return this.subscription
  }

  getAsyncIterator<T>(event: string | string[]) {
    return this.graphQLPubSub.asyncIterator<T>(event)
  }
}
