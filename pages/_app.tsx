import '../pages/global.css'
import Head from 'next/head'
import GlobalNav from '../components/GlobalNav';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Router } from 'next/router';
// 전역적으로 사용되는 부분
export default function MyApp({ Component, pageProps }: AppProps) {
  
  const [isLoading,setIsLoading] = useState<boolean>(false);
  useEffect(()=>{
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setIsLoading(false);
    };
  
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
  
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  },[])

  return (
    <>
      <Head>
        <title>whatSub</title>
        <meta name="sandwich recipe" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <nav className='mb-12'>{/*globalNav이 가리는 부분을 방지하는 여백*/}
          <GlobalNav></GlobalNav>
        </nav>
        {isLoading ? <div>로딩중인데스</div>:<Component {...pageProps} />}
      </Provider>
    </>
  );
}