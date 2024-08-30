'use strict';
import React, { useEffect, useRef } from 'react';
import { AppProps } from 'next/app';
import {NextUIProvider} from '@nextui-org/react';

import 'tailwindcss/tailwind.css';

const App: React.FC<App.Props> = (props) => {
  const { Component, pageProps } = props;

  const refObserver = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = refObserver.current;

    if (!div) {
      return;
    }

    const observer = new IntersectionObserver(() => {
      const isDark = window.getComputedStyle(div).display === 'block';

      document.documentElement.classList.toggle('dark', isDark);
    });

    observer.observe(div);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <NextUIProvider>
      <Component {...pageProps} />

      <div
      className='fixed top-0 left-0 -z-10 hidden size-0'
      id='preferThemeObserver'
      ref={ refObserver }>
        <style>{`
          @media (prefers-color-scheme: dark) {
            div#preferThemeObserver {
              display: block;
            }
          }
        `}</style>
      </div>
    </NextUIProvider>
  )
};

namespace App {
  export type Props = AppProps & {};
};

export default App;