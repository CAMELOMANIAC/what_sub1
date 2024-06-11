import Logo from './Logo';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState, useEffect, useRef} from 'react';
import {FaRegUserCircle} from 'react-icons/fa';
import {FaUserCircle} from 'react-icons/fa';
import LoginModal from './LoginModal/LoginModal';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../redux/store';
import {
	actionLoginChangeId,
	actionSetMenuLike,
	actionSetRecipeLike,
} from '../redux/reducer/userReducer';
import {
	getCookieValue,
	loadMenuLike,
	loadRecipeLike,
} from '../utils/publicFunction';
import LoginTureModal from './LoginModal/LoginTureModal';
import {useQuery} from 'react-query';

const GlobalNav = () => {
	const router = useRouter();
	const [currentPath, setCurrentPath] = useState(router.pathname); //pathname속성은 현재 경로만 저장되는 속성
	const [isLoginModal, setLoginModal] = useState(false);
	const [isLoginTureModal, setLoginTureModal] = useState(false);
	const userName = useSelector((state: RootState) => state.user.userName);
	const buttonRef = useRef<HTMLButtonElement>(null);

	//새로고침시 좋아요 목록을 불러와서 전역 상태값으로 저장
	const {refetch: refetchRecipeLike} = useQuery(
		'recipeLike',
		loadRecipeLike,
		{
			onSuccess: data => {
				dispatch(
					actionSetRecipeLike(
						data.map(item => item.recipe_table_recipe_id),
					),
				);
			},
			enabled: false,
		},
	);
	const {refetch: refetchMenuLike} = useQuery('menuLike', loadMenuLike, {
		onSuccess: data => {
			dispatch(
				actionSetMenuLike(
					data.map(item => item.sandwich_table_sandwich_name),
				),
			);
		},
		enabled: false,
	});
	useEffect(() => {
		if (getCookieValue('user')) {
			refetchRecipeLike();
			refetchMenuLike();
		}
	}, [refetchMenuLike, refetchRecipeLike]);

	//router.events는 라우터 이벤트로 이벤트객체가 변경될때(=주소창 경로가 바뀔때) 상태값을 변경하는 이벤트핸들러 추가
	useEffect(() => {
		const handleRouteChange = url => {
			setCurrentPath(url);
		};
		//next.js는 js의 addEventListener에 이벤트 핸들러를 등록하는 것처럼 router.events객체에 on/off메서드를 사용해서 등록/해제
		router.events.on('routeChangeComplete', handleRouteChange);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(actionLoginChangeId(getCookieValue('user')));
	}, [dispatch]);

	return (
		<div className="w-full fixed left-0 bg-white z-20 border-gray-200 border-b mb-auto flex align-middle min-w-[500px]">
			<Link href="/" className="mx-2">
				<Logo size="2rem" />
			</Link>
			<div className="flex align-middle ml-2">
				<Link
					href="/"
					className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath == '/' ? 'border-green-600 border-b-4 text-green-600' : ''}`}>
					홈
				</Link>
				<Link
					href="/Menus"
					className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath.includes('/Menus') && 'border-green-600 border-b-4 text-green-600'}`}>
					메뉴
				</Link>
				<Link
					href="/Recipes"
					className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath.includes('/Recipes') && 'border-green-600 border-b-4 text-green-600'}`}>
					레시피
				</Link>
				<button
					className={
						'absolute flex items-center right-2 top-2 px-1 h-4/6 rounded-full border-green-600 text-sm z-30 ' +
						`${userName !== '' ? 'bg-green-600 text-white' : 'text-green-600 bg-white'}`
					}
					onClick={() =>
						userName ? setLoginTureModal(true) : setLoginModal(true)
					}
					ref={buttonRef}>
					{userName === '' && (
						<>
							<span className="m-1">로그인</span>
							<FaUserCircle className="inline text-2xl" />
						</>
					)}
					{userName !== '' && (
						<>
							<FaRegUserCircle className="inline text-2xl" />
							<span className="m-1">{userName}</span>
						</>
					)}
				</button>
				{isLoginModal && (
					<LoginModal handleClose={() => setLoginModal(false)} />
				)}
				{isLoginTureModal && buttonRef.current && (
					<LoginTureModal
						handleClose={() => setLoginTureModal(false)}
						buttonRef={buttonRef.current}
					/>
				)}
			</div>
		</div>
	);
};

export default GlobalNav;
