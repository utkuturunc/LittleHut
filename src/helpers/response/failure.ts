import { badImplementation } from 'boom'

export const unexpected = (message: string = 'An unexpected error has occurred.') => badImplementation(message)
