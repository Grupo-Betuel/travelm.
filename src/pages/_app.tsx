import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import AppLayout from '@shared/layout'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import { defaultValidateMessages as validateMessages } from '../config/form-validation.config'
import { defaultTheme } from '../config/theme.config'
import { useEffect, useState } from 'react'
import { getLoggedUser } from '../utils/auth.utils'
import { UserEntity } from '@models/UserEntity'

const queryClient = new QueryClient()

export interface IAppProps {
  protected?: boolean
}

function MyApp({ Component, pageProps }: AppProps<IAppProps>) {
  const [user, setUser] = useState<UserEntity | unknown>(null)

  useEffect(() => {
    setUser(getLoggedUser())
  }, [pageProps])

  if (pageProps.protected && !user) {
    return <div>Invalid</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ConfigProvider form={{ validateMessages }} theme={defaultTheme}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default MyApp
