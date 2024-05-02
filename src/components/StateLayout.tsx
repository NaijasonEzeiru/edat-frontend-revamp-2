"use client";

import { wrapper } from "@/store/store";
import { NextComponentType, NextPageContext } from "next";
import { AppProps } from "next/app";
import { Router } from "next/router";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import AuthProvider from "./route/AuthProvider";

type AppPropsWithLayout = {
  pageProps: any;
  Component: NextComponentType<NextPageContext<any>, any, any>;
  router: Router;
  __N_SSG?: boolean | undefined;
  __N_SSP?: boolean | undefined;
} & {
  children: ReactNode;
};

function StateLayout({ children, ...rest }: AppPropsWithLayout) {
  const { store } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}

export default StateLayout;
