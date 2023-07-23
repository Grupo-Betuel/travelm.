import '@styles/globals.scss';
import type { AppProps } from 'next/app';
import AppLayout from '@shared/layout';
import { Affix, ConfigProvider, Spin } from 'antd';
import {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { ClientEntity } from '@shared/entities/ClientEntity';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useAppStore } from '@services/store';
import { IPostFilters } from '@interfaces/posts.interface';
import { layoutId, navbarOptionsHeight } from 'src/utils/layout.utils';
import { AppLoadingContext } from '@shared/contexts/AppLoadingContext';
import { AppViewportHeightContext } from '@shared/contexts/AppViewportHeightContext';
import { OrderContext } from '@shared/contexts/OrderContext';
import OrderService from '@services/orderService';
import { useAuthClientHook } from '@shared/hooks/useAuthClientHook';
import { getAuthData } from '../utils/auth.utils';
import { defaultTheme } from '../config/theme.config';
import { defaultValidateMessages as validateMessages } from '../config/form-validation.config';

export interface IAppProps {
  protected?: boolean
}

{
  /* TODO: Check if global posts filters is neccesarry */
}
export interface IAppPostsFiltersContextValue {
  appPostsFilters: IPostFilters
  setAppPostsFilters: (data: IPostFilters) => void
}

{
  /* TODO: Check if global posts filters is neccesarry */
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
  const [appLoading, setAppLoading] = useState<boolean>();
  const [appViewportHeightClassName, setAppViewportHeightClassName] = useState<AppViewportHeightClassNames>(
    AppViewportHeightClassNames.WITH_NAVBAR_OPTION,
  );
  const orderService = useMemo(() => new OrderService(), []);
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const { client } = useAuthClientHook();
  useEffect(() => {
    setAppLoading(!!clientEntity.loading);
  }, [clientEntity.loading]);

  if (pageProps.protected && !client) {
    return <div>Invalid</div>;
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
  );
}

export default MyApp;
