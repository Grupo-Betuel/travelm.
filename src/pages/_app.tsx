import "@styles/globals.scss";
import type { AppProps } from "next/app";
import AppLayout from "@shared/layout";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import { defaultValidateMessages as validateMessages } from "../config/form-validation.config";
import { defaultTheme } from "../config/theme.config";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ConfigProvider form={{ validateMessages }} theme={defaultTheme}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ConfigProvider>

    </QueryClientProvider>
  );
}

export default MyApp;
