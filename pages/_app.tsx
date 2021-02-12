import '../styles/globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';

export const pathPrefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href={`${pathPrefix}/favicon.ico`} />
        <title>Bridge and torch problem</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
