import '../pages/global.css'
import Head from 'next/head'
import GlobalNav from '../components/GlobalNav';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { Router } from 'next/router';


// 전역적으로 사용되는 부분
export default function MyApp({ Component, pageProps }: AppProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 0.5초 최소 로딩 유지(애니메이션이 부드럽게 종료될수있게)
    };
    //next.js는 라우터관련 이벤트를 제공해 주므로 이걸로 로딩 상태값 변경
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, [])

  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 애니메이션을 무한 반복 상태로 시작
    if (animationRef.current) {
      animationRef.current.style.animationIterationCount = 'infinite';
      animationRef.current.style.display = 'block';
    }
    // 특정 조건이 충족되면
    if (isLoading === false && animationRef.current) {
      // 현재 진행 중인 애니메이션을 완료하고 정지
      animationRef.current.style.animationIterationCount = '1';
      animationRef.current.style.display = 'none';
    }
  }, [isLoading]);


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
        {<>
          <div className="object_container">
            <div className="shape one" ref={animationRef}><br /></div>
          </div>
          <Component {...pageProps} />
        </>}
      </Provider>
    </>
  );
}