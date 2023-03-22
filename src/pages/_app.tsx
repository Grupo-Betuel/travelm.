import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import AppLayout from '@shared/layout'
import { ConfigProvider, Spin } from 'antd'
import { defaultValidateMessages as validateMessages } from '../config/form-validation.config'
import { defaultTheme } from '../config/theme.config'
import { createContext, useEffect, useState } from 'react'
import { getAuthData } from '../utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useAppStore } from '@services/store'
import { IPostFilters } from '@interfaces/posts.interface'

export interface IAppProps {
  protected?: boolean
}

export interface IAppLoadingContextValue {
  appLoading?: boolean
  setAppLoading: (value: boolean) => void
}

{
  /*TODO: Check if global posts filters is neccesarry*/
}
export interface IAppPostsFiltersContextValue {
  appPostsFilters: IPostFilters
  setAppPostsFilters: (data: IPostFilters) => void
}
export const appLoadingContext = createContext<IAppLoadingContextValue>(
  {} as IAppLoadingContextValue
)

{
  /*TODO: Check if global posts filters is neccesarry*/
}
export const appPostsFiltersContext =
  createContext<IAppPostsFiltersContextValue>(
    {} as IAppPostsFiltersContextValue
  )

function MyApp({ Component, pageProps }: AppProps<IAppProps>) {
  const userEntity = useAppStore((state) => state.users((s) => s))
  const productEntity = useAppStore((state) => state.posts((s) => s))
  const authEntity = useAppStore((state) => state['auth/login']((s) => s))
  const [user, setUser] = useState<UserEntity | unknown>(null)
  const [appLoading, setAppLoading] = useState<boolean>(false)
  const [appPostsFilters, setAppPostsFilters] = useState<IPostFilters>({})

  useEffect(() => {
    setAppLoading(
      !!userEntity.loading || !!productEntity.loading || !!authEntity.loading
    )
  }, [userEntity.loading, productEntity.loading, authEntity.loading])

  useEffect(() => {
    setUser(getAuthData())
  }, [pageProps])

  if (pageProps.protected && !user) {
    return <div>Invalid</div>
  }

  return (
    <ConfigProvider form={{ validateMessages }} theme={defaultTheme}>
      {appLoading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}

      {/*TODO: Check if global posts filters is neccesarry*/}
      {/*<appPostsFiltersContext.Provider*/}
      {/*  value={{ appPostsFilters, setAppPostsFilters }}*/}
      {/*>*/}
      <appLoadingContext.Provider value={{ appLoading, setAppLoading }}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </appLoadingContext.Provider>
      {/*</appPostsFiltersContext.Provider>*/}
      <ToastContainer />
    </ConfigProvider>
  )
}

export default MyApp
