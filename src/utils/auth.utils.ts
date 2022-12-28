import { isExpired } from 'react-jwt'
import { UserEntity } from '@models/UserEntity'

export const getLoggedUser = (): UserEntity | unknown => {
  try {
    console.log('check logged')
    const token = localStorage.getItem('token') || ''
    const tokenIsExpired = isExpired(token)
    if (!token || tokenIsExpired) return null
    const user = localStorage.getItem('user')
    if (!user) return null
    return JSON.parse(user) as UserEntity
  } catch (err: any) {
    console.log('errrrorrr', err.message)
  }
}
