import { createContext } from 'react'

export interface IAppLoadingContextValue {
  appLoading?: boolean
  setAppLoading: (value: boolean) => void
}

export const AppLoadingContext = createContext<IAppLoadingContextValue>(
  {} as IAppLoadingContextValue
)
