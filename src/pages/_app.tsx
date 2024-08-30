'use strict';
import React from 'react';
import { AppProps } from 'next/app';
import {NextUIProvider} from '@nextui-org/react';

import 'tailwindcss/tailwind.css';

const App: React.FC<App.Props> = (props) => {
  const { Component, pageProps } = props;

  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  )
};

namespace App {
  export type Props = AppProps & {};
};

export default App;