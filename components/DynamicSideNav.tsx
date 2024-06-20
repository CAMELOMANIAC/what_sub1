import React, {Dispatch, SetStateAction} from 'react';
import useModalAnimationHook from '../utils/modalAnimationHook';
import {GrClose} from 'react-icons/gr';
import Link from 'next/link';
import {FaRegUserCircle} from 'react-icons/fa';
import {RiPencilFill} from 'react-icons/ri';
import {PiHeartStraightFill} from 'react-icons/pi';
import {FaGear} from 'react-icons/fa6';
import {IoLogOut} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useMutation} from 'react-query';
import {deleteCookie} from '../utils/publicFunction';
import {useDispatch} from 'react-redux';
import {actionSetLogoutData} from '../redux/reducer/userReducer';

type Props = {
	handleClose: Dispatch<SetStateAction<boolean>>;
	userName: string;
	setLoginModal: Dispatch<SetStateAction<boolean>>;
};
const DynamicSideNav = ({handleClose, userName, setLoginModal}: Props) => {
	const {isLoaded, setIsLoaded} = useModalAnimationHook(handleClose);
	const router = useRouter();
	const dispatch = useDispatch();
	//로그아웃 요청
	const logoutMutation = useMutation(
		'user',
		async () => {
			fetch('/api/users/deleteCookie', {method: 'POST'});
		},
		{
			onSuccess: () => {
				deleteCookie('user');
				handleClose(false);
				dispatch(actionSetLogoutData());
				router.push('/');
			},
		},
	);

	const logoutHandler = () => {
		logoutMutation.mutate();
	};

	const AccountHandler = () => {
		router.push('/Account');
	};
	return (
		<nav
			className="fixed sm:hidden bg-gray-600/10 top-0 left-0 w-full h-screen backdrop-blur-sm"
			onClick={e => {
				if (e.target === e.currentTarget) setIsLoaded(false);
			}}>
			<article
				className={`w-5/6 h-screen bg-white fixed top-0 right-0 shadow-lg flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isLoaded ? 'max-w-[640px]' : 'max-w-0'}`}>
				<div className="w-[640px]">
					<button
						className={'relative ml-5 mt-5 w-fit h-fit'}
						onClick={() => setIsLoaded(false)}>
						<GrClose />
					</button>
					<div className="flex flex-col h-fit">
						<div className="relative flex flex-col border-b-2 border-gray-300 text-xl mx-6">
							<button
								name="loginButton"
								className="flex justify-center items-center w-fit"
								onClick={() =>
									!userName && setLoginModal(true)
								}>
								{userName === '' && (
									<span className="m-1 text-green-600">
										로그인 또는 회원가입
									</span>
								)}
							</button>

							{userName !== '' && (
								<>
									<div className="w-fit">
										<FaRegUserCircle className="inline text-2xl text-white" />
										<span className="m-1">
											{userName}님, 안녕하세요
										</span>
									</div>
									<ul
										className="text-base m-2 space-y-2"
										onClick={() => setIsLoaded(false)}>
										<li>
											<Link href={'/Recipes?write'}>
												내가 쓴 글
												<RiPencilFill className="inline-block ml-2 text-gray-600" />
											</Link>
										</li>
										<li>
											<Link href={'/Recipes?favorite'}>
												내가 남긴 좋아요
												<PiHeartStraightFill className="inline-block ml-2 text-gray-600" />
											</Link>
										</li>
										<li>
											<button onClick={AccountHandler}>
												계정 관리
												<FaGear className="inline-block ml-2 text-gray-600" />
											</button>
										</li>
										<li>
											<button
												onClick={() => logoutHandler()}>
												로그아웃
												<IoLogOut className="inline-block ml-2 text-gray-600" />
											</button>
										</li>
									</ul>
								</>
							)}
						</div>

						<Link
							href="/"
							className={`font-[seoul-metro] text-2xl py-2 px-6 my-auto text-black`}
							onClick={() => setIsLoaded(false)}>
							홈
						</Link>
						<Link
							href="/Menus"
							className={`font-[seoul-metro] text-2xl py-2 px-6 my-auto text-black`}
							onClick={() => setIsLoaded(false)}>
							메뉴
						</Link>
						<Link
							href="/Recipes"
							className={`font-[seoul-metro] text-2xl py-2 px-6 my-auto text-black`}
							onClick={() => setIsLoaded(false)}>
							레시피
						</Link>
					</div>
				</div>
			</article>
		</nav>
	);
};

export default DynamicSideNav;
