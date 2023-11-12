import '../pages/global.css'
import Head from 'next/head'
import GlobalNav from '../components/GlobalNav';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AppProps } from 'next/app';
// 전역적으로 사용되는 부분
export default function MyApp({ Component, pageProps }:AppProps) {
  return (
    <>
      <Head>
        <title>whatsub</title>
        <meta name="sandwich recipe" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <nav className='mb-12'>{/*globalNav이 가리는 부분을 방지하는 여백*/}
          <GlobalNav></GlobalNav>
        </nav>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}