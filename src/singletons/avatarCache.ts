import { SimpleCache } from '../models/SimpleCache'
import { AvatarData } from '../utils/attendance'

export const avatarCache = new SimpleCache<AvatarData[]>()
