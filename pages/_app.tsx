import '../pages/global.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>whatsub</title>
        <meta name="sandwich recipe" content="initial-scale=1.0, width=device-width"/>      
      </Head>
      <Component {...pageProps} />
    </>
  );
}