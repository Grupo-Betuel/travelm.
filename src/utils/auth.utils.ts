import { isExpired } from 'react-jwt'
import { UserEntity } from '@shared/entities/UserEntity'
import { BaseService } from '@services/BaseService'
import { IAuthResponse } from '@interfaces/auth.interface'

const authServiceMock = new BaseService('auth/login')

export const resetAuthData = () => {
  localStorage.removeItem(authServiceMock.localStorageKey.add)
}

export const appLogOut = () => {
  resetAuthData()
  location.reload()
}

// @ts-ignore
export const getAuthData = (
  type: keyof IAuthResponse | 'all' = 'access_token'
): IAuthResponse | string | UserEntity => {
  try {
    const authString =
      localStorage && localStorage.getItem(authServiceMock.localStorageKey.add)
    const authData = JSON.parse(authString || '{}') as IAuthResponse
    const tokenIsExpired = isExpired(authData.access_token)

    if (!authString || tokenIsExpired) {
      resetAuthData()
      return ''
    }

    console.log(authData, 'key', authServiceMock.localStorageKey.add)
    return type === 'all' ? authData : authData[type]
  } catch (err: any) {
    console.log('errrrorrr', err.message)
  }
}
