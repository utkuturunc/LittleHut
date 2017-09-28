export class SimpleCache<D> {
  private data?: D
  constructor(data?: D) {
    this.data = data
  }
  set(data: D) {
    this.data = data
  }
  get() {
    return this.data
  }
  clear() {
    this.data = undefined
  }
}
