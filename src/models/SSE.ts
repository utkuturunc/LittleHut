import { isArray, isObject } from 'lodash'
import { Transform } from 'stream'

export class SSE extends Transform {
  _transform(chunk: any, encoding: string, callback: Function): void {
    const parsed = JSON.parse(chunk.toString('utf8'))

    const data =
      isObject(parsed.data) || isArray(parsed.data) ? JSON.stringify(parsed.data) : parsed.data.toString()

    this.push(`\nevent: ${parsed.event}\ndata: ${data}\n`)
    callback()
  }
}
