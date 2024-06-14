import '../pages/global.css';
import Head from 'next/head';
import GlobalNav from '../components/GlobalNav';
import {Provider} from 'react-redux';
import store from '../redux/store';
import {AppProps} from 'next/app';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import {QueryClient, QueryClientProvider} from 'react-query';
import Image from 'next/image';
import {Noto_Sans_KR} from 'next/font/google'; // 원하는 폰트 가져와서 사용하기

const notoSansKr = Noto_Sans_KR({subsets: ['latin']});

// 전역적으로 사용되는 부분
export default function MyApp({Component, pageProps}: AppProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [destination, setDestination] = useState<string>('');
	const sandwichRef = useRef<HTMLImageElement>(null);
	const [prevUrl, setPrevUrl] = useState<string | null>();
	const [url, setUrl] = useState<string | null>();
	const router = useRouter();
	const queryClient = new QueryClient();

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
		const handleDestination = url => {
			const pathName = url.split('?')[0];
			setUrl(prev => {
				setPrevUrl(prev);
				return pathName;
			});

			switch (pathName) {
				case '/':
					setDestination('홈');
					break;
				case '/AddRecipe':
					setDestination('레시피 작성');
					break;
				case '/Menus':
					setDestination('메뉴');
					break;
				case '/Recipes':
					setDestination('레시피');
					break;
				case '/Register':
					setDestination('회원가입');
					break;
				case '/Account':
					setDestination('계정 설정');
					break;
				default:
					setDestination('새로운 페이지');
					break;
			}
		};

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
	}, [router.events]);

	return (
		<>
			<Head>
				<title>whatSub</title>
				<meta charSet="utf-8" />
				<meta
					name="keywords"
					content="subway recipe, 서브웨이 레시피, 서브웨이 조합법, 서브웨이 칼로리, 서브웨이 일일권장섭취량"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<meta
					name="description"
					content="서브웨이 레시피를 작성하고, 공유하고, 의견을 나눠보세요"
				/>
				<meta httpEquiv="X-UA-Compatible" content="chrome, IE-edge" />
				<meta httpEquiv="Subject" content="subway recipes" />
				<meta httpEquiv="Title" content="WhatSub" />
				<meta
					property="og:title"
					content="서브웨이 레시피 여기서 모아보세요"
				/>
				<meta
					property="og:description"
					content="WhatSub 여러분은 어떻게 서브웨이를 드시나요? 여기서 레시피를 작성하고, 공유하고, 의견을 나눠보세요"
				/>
				<meta
					property="og:image"
					content={`${process.env.URL}/images/front_banner.png`}
				/>
				<link
					rel=" shortcut icon "
					href={`${process.env.URL}/images/front_banner.ico`}></link>
				<link
					rel="icon"
					href={`${process.env.URL}/images/front_banner.ico`}></link>
			</Head>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<nav className="mb-12">
						{/*globalNav이 가리는 부분을 방지하는 여백*/}
						<GlobalNav></GlobalNav>
					</nav>
					<main className={notoSansKr.className}>
						<Component {...pageProps} />
					</main>
					{isLoading && url != prevUrl && (
						<div className="w-screen h-screen flex flex-col justify-center items-center top-0 left-0 fixed bg-white">
							<p className="text-green-600 font-bold text-2xl">
								이번 페이지:{' '}
								<span className="text-yellow-600">
									{destination}
								</span>
								<br /> 페이지가 잠시후 도착합니다
							</p>
							<div className="overflow-hidden animate-pulse w-full">
								<Image
									width={100}
									height={100}
									src={'/images/front_banner.png'}
									ref={sandwichRef}
									className="absolute"
									alt="front_banner"></Image>
							</div>
						</div>
					)}
				</Provider>
			</QueryClientProvider>
		</>
	);
}
