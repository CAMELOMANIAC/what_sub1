import '../pages/global.css'
import Head from 'next/head'
import GlobalNav from '../components/GlobalNav';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// 전역적으로 사용되는 부분
export default function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>('');
  const sandwichRef = useRef<HTMLImageElement>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>();
  const [url, setUrl] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };

    const end = () => {
      if (sandwichRef.current)
        sandwichRef.current.style.animation = 'move 0.5s infinite';
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // 0.5초 최소 로딩 유지(애니메이션이 부드럽게 종료될수있게)
    };

    // 라우터 도착위치를 저장하기 위한 함수
    const handleDestination = (url) => {
      const pathName = url.split('?')[0];
      setUrl((prev) => { setPrevUrl(prev); return pathName })

      switch (pathName) {
        case '/': setDestination('홈 페이지'); break;
        case '/AddRecipe': setDestination('레시피 작성 페이지'); break;
        case '/Menus': setDestination('메뉴 페이지'); break;
        case '/Recipes': setDestination('레시피 페이지'); break;
        default: setDestination('페이지 이름 정의 안됨'); break;
      }
    }

    //next.js는 라우터관련 이벤트를 제공해 주므로 이걸로 로딩 상태값 변경
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    router.events.on('routeChangeStart', handleDestination);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
      router.events.off('routeChangeStart', handleDestination);
    };
  }, [])

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
        <Component {...pageProps} />
        {isLoading && (url != prevUrl) &&
          <div className="w-screen h-screen flex flex-col justify-center items-center top-0 left-0 fixed bg-white" >
            <p className='text-green-600 font-bold text-2xl'>이번열차: <span className='text-yellow-600'>{destination}</span><br /> 열차가 잠시후 도착합니다</p>
            <div className='overflow-hidden animate-pulse w-full'>
              <img src={'/images/front_banner.png'} width={100} ref={sandwichRef} className='absolute'></img>
            </div>
          </div>}
      </Provider>
    </>
  );
}