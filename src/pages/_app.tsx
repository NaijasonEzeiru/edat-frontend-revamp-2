import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import "../styles/main.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import AuthProvider from "../components/route/AuthProvider";
import Head from "next/head";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({ palette: { mode: "light" } });

function MyApp({ Component, ...rest }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore(rest);
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page: any) => page);
  return getLayout(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <Head>
            <title>Edat - Data in, Alpha out</title>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <Component {...props.pageProps} />
          <Toaster />
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
