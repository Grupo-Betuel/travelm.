import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import AppLayout from '@shared/layout'
import { Affix, ConfigProvider, Spin } from 'antd'
import { defaultValidateMessages as validateMessages } from '../config/form-validation.config'
import { defaultTheme } from '../config/theme.config'
import { createContext, useEffect, useState } from 'react'
import { getAuthData } from '../utils/auth.utils'
import { UserEntity } from '@shared/entities/UserEntity'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useAppStore } from '@services/store'
import { IPostFilters } from '@interfaces/posts.interface'
import { layoutId, navbarOptionsHeight } from 'src/utils/layout.utils'
import { AppLoadingContext } from '@shared/contexts/AppLoadingContext'
import { AppViewportHeightContext } from '@shared/contexts/AppViewportHeightContext'

export interface IAppProps {
  protected?: boolean
}

{
  /*TODO: Check if global posts filters is neccesarry*/
}
export interface IAppPostsFiltersContextValue {
  appPostsFilters: IPostFilters
  setAppPostsFilters: (data: IPostFilters) => void
}

{
  /*TODO: Check if global posts filters is neccesarry*/
}
export const appPostsFiltersContext =
  createContext<IAppPostsFiltersContextValue>(
    {} as IAppPostsFiltersContextValue
  )
export enum AppViewportHeightClassNames {
  WITH_NAVBAR = 'FullAppViewPortHeight',
  WITH_NAVBAR_OPTION = 'FullAppViewPortHeightNavbarOptions',
}
function MyApp({ Component, pageProps }: AppProps<IAppProps>) {
  const userEntity = useAppStore((state) => state.users((s) => s))
  const productEntity = useAppStore((state) => state.posts((s) => s))
  const authEntity = useAppStore((state) => state['auth/login']((s) => s))
  const [user, setUser] = useState<UserEntity | unknown>(null)
  const [appLoading, setAppLoading] = useState<boolean>(false)
  const [appPostsFilters, setAppPostsFilters] = useState<IPostFilters>({})
  const [appViewportHeightClassName, setAppviewPortHeightClassName] =
    useState<AppViewportHeightClassNames>(
      AppViewportHeightClassNames.WITH_NAVBAR
    )

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

  const onChangeLayoutAffix = (affixed?: boolean) => {
    if (affixed) {
      setAppviewPortHeightClassName(
        AppViewportHeightClassNames.WITH_NAVBAR_OPTION
      )
    } else {
      setAppviewPortHeightClassName(AppViewportHeightClassNames.WITH_NAVBAR)
    }
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
      <AppLoadingContext.Provider value={{ appLoading, setAppLoading }}>
        <AppViewportHeightContext.Provider
          value={{ appViewportHeightClassName, setAppviewPortHeightClassName }}
        >
          <AppLayout>
            <Affix
              offsetTop={navbarOptionsHeight}
              target={() => document.getElementById(layoutId)}
              onChange={onChangeLayoutAffix}
              children=""
            />
            <Component {...pageProps} />
          </AppLayout>
        </AppViewportHeightContext.Provider>
      </AppLoadingContext.Provider>
      {/*</appPostsFiltersContext.Provider>*/}
      <ToastContainer />
    </ConfigProvider>
  )
}

export default MyApp
