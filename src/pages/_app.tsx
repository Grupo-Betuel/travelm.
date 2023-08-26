import '@styles/globals.scss';
import type { AppProps } from 'next/app';
import AppLayout from '@shared/layout';
import {
  Affix, Button, ConfigProvider, Result, Spin,
} from 'antd';
import {
  createContext, useEffect, useMemo, useState,
} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppStore } from '@services/store';
import { layoutId, navbarOptionsHeight } from 'src/utils/layout.utils';
import { AppLoadingContext } from '@shared/contexts/AppLoadingContext';
import { AppViewportHeightContext } from '@shared/contexts/AppViewportHeightContext';
import { OrderContext } from '@shared/contexts/OrderContext';
import OrderService from '@services/orderService';
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook';
import Link from 'next/link';
import Head from 'next/head';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/router';
import { defaultValidateMessages as validateMessages } from '../config/form-validation.config';
import { defaultTheme } from '../config/theme.config';

export interface IAppProps {
  protected?: boolean;
}

export interface IAppPostsFiltersContextValue {
  setAppPostsFilters: (data: any) => void;
}

export const appPostsFiltersContext = createContext<IAppPostsFiltersContextValue>(
  {} as IAppPostsFiltersContextValue,
);

export enum AppViewportHeightClassNames {
  WITH_NAVBAR = 'FullAppViewPortHeight',
  WITH_NAVBAR_OPTION = 'FullAppViewPortHeightNavbarOptions',
}

function MyApp({ Component, pageProps }: AppProps<IAppProps>) {
  const clientEntity = useAppStore((state) => state.clients((s) => s));
  const productEntity = useAppStore((state) => state.products((s) => s));
  const [appLoading, setAppLoading] = useState<boolean>();
  const [
    appViewportHeightClassName,
    setAppViewportHeightClassName] = useState<AppViewportHeightClassNames>(
    AppViewportHeightClassNames.WITH_NAVBAR_OPTION,
  );
  const orderService = useMemo(() => new OrderService(), []);
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const { client } = useAuthClientHook();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setAppLoading(!!clientEntity.loading || !!productEntity.loading);
  }, [clientEntity.loading, productEntity.loading]);

  useEffect(() => {
    // START VALUE - WHEN LOADING WILL START
    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });

    // COMPLETE VALUE - WHEN LOADING IS FINISHED
    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });
  }, []);
  if (pageProps.protected && !client) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, No estas autorizado para entrar a esta pagina."
        extra={(
          <>
            <Link href="/client/auth">
              <a>
                <Button type="primary">Iniciar Sesion</Button>
              </a>
            </Link>
            <Link href="/">
              <a>
                <Button type="default">Ir al inicio</Button>
              </a>
            </Link>
          </>
        )}
      />
    );
  }

  const toggleShoppingCart = () => setCartIsOpen(!cartIsOpen);

  const onChangeLayoutAffix = (affixed?: boolean) => {
    if (affixed) {
      // setAppViewportHeightClassName(
      //   AppViewportHeightClassNames.WITH_NAVBAR_OPTION
      // )
    } else {
      // setAppViewportHeightClassName(AppViewportHeightClassNames.WITH_NAVBAR)
    }
  };

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/betueldance/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/betueldance/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/betueldance/favicon-16x16.png"
        />
        <link rel="manifest" href="/betueldance/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ConfigProvider form={{ validateMessages }} theme={defaultTheme}>
        {appLoading && (
          <div className="loading">
            <Spin size="large" />
          </div>
        )}

        {/* TODO: Check if global posts filters is neccesarry */}
        <AppLoadingContext.Provider value={{ appLoading, setAppLoading }}>
          <OrderContext.Provider
            value={{ orderService, toggleCart: toggleShoppingCart, cartIsOpen }}
          >
            <AppViewportHeightContext.Provider
              value={{
                appViewportHeightClassName,
                setAppviewPortHeightClassName: setAppViewportHeightClassName,
              }}
            >
              <LoadingBar
                color="rgb(180, 130, 251)"
                progress={progress}
                onLoaderFinished={() => {
                  setProgress(0);
                }}
                waitingTime={400}
              />
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
          </OrderContext.Provider>
        </AppLoadingContext.Provider>
        <ToastContainer />
      </ConfigProvider>
    </>
  );
}

export default MyApp;
