import {useRouter} from 'next/router';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
	actionLoginChangeId,
	actionSetMenuLike,
	actionSetRecipeLike,
} from '../../redux/reducer/userReducer';
import {loadMenuLike, loadRecipeLike} from '../../utils/publicFunction';
import Link from 'next/link';
import {useMutation, useQuery} from 'react-query';
import Logo from '../Logo';
import Image from 'next/image';
import {LuLoader2} from 'react-icons/lu';
import useModalAnimationHook from '../../utils/modalAnimationHook';
import MediumModal from '../interface/MediumModal';

const LoginModal = ({handleClose}: {handleClose: (arg: boolean) => void}) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [id, setId] = useState('');
	const [pwd, setPwd] = useState('');
	const handleChangeId = e => {
		setId(e.target.value);
	};
	const handleChangePwd = e => {
		setPwd(e.target.value);
	};
	const handleKakaoLogin = () => {
		router.push(
			`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.URL}/api/users/kakao&client_secret=${process.env.KAKAO_CLIENT_SECRET}`,
		);
	};

	//일반 로그인 (카카오 로그인은 인덱스 페이지에서 처리-리다이렉트됨)
	const handleLogin = async () => {
		loginMutation.mutate({id, pwd});
	};

	const recipeLikeQuery = useQuery('recipeLike', loadRecipeLike, {
		enabled: false,
	});
	const menuLikeQuery = useQuery('menuLike', loadMenuLike, {enabled: false});

	const loginMutation = useMutation(
		//useMutation의 뮤테이션함수의 매개변수는 두개이상 사용할수없음 MutationFunction<any> 사용하려면 객체로 묶어서 사용
		async ({id, pwd}: {id: string; pwd: string}) => {
			const response = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: id,
					pwd: pwd,
				}),
			});

			if (!response.ok) {
				throw new Error((await response.json()).message);
			}

			return response.json();
		},
		{
			onSuccess: async data => {
				//로그인 정보를 전역 상태값으로 저장
				dispatch(actionLoginChangeId(data.userId));

				//레시피 좋아요 정보를 전역 상태값으로 저장
				const {data: recipeLikeData} = await recipeLikeQuery.refetch();
				dispatch(
					actionSetRecipeLike(
						recipeLikeData.map(item => item.recipe_table_recipe_id),
					),
				);

				//메뉴좋아요 정보를 전역 상태값으로 저장
				const {data: menuLikeData} = await menuLikeQuery.refetch();
				dispatch(
					actionSetMenuLike(
						menuLikeData.map(
							item => item.sandwich_table_sandwich_name,
						),
					),
				);
				setIsLoaded(false);
			},
			onError: (error: Error) => {
				alert(error.message);
			},
		},
	);

	const {isLoaded, setIsLoaded} = useModalAnimationHook(handleClose);

	return (
		<MediumModal setIsLoaded={setIsLoaded} isLoaded={isLoaded}>
			<div className="flex flex-col justify-center items-center m-auto">
				<Logo />
				<p className="text-lg font-bold">로그인</p>
				<section className="p-2 pb-0">
					<label htmlFor="userId" className="block text-sm">
						아이디
					</label>
					<input
						className="border-2 w-[300px] p-2 rounded"
						onChange={handleChangeId}
						type=""
						id="userId"
						placeholder="아이디"></input>
				</section>
				<section className="p-2">
					<label htmlFor="userPwd" className="block text-sm">
						비밀번호
					</label>
					<input
						className="border-2 w-[300px] p-2 rounded"
						onChange={handleChangePwd}
						type="password"
						id="userPwd"
						placeholder="비밀번호"></input>
				</section>
				<button
					onClick={handleLogin}
					className="flex items-center rounded w-[300px] h-[45px] bg-green-600 text-white ">
					{loginMutation.isLoading ? (
						<>
							<div className="flex justify-center items-center w-full text-sm mr-[7.5px] my-auto">
								<LuLoader2 className="animate-spin m-[7.5px] mr-0 w-[30px] h-[30px]" />
							</div>
						</>
					) : (
						<>
							<Image
								src="/images/샌드위치-아이콘.svg"
								className="m-[7.5px] mr-0 h-[30px] invert"
								alt="샌드위치_아이콘"
								width={30}
								height={30}></Image>
							<div className="flex justify-center items-center w-full text-sm mr-[7.5px] my-auto">
								일반 로그인
							</div>
						</>
					)}
				</button>
				<div className="h-5"></div>
				<button onClick={handleKakaoLogin}>
					<Image
						src="/images/kakao_login_medium_wide.png"
						alt="카카오 로그인"
						width={300}
						height={45}
					/>
				</button>
				<section className="text-sm">
					아직 회원이 아니신가요?
					<Link
						href="/Register"
						onClick={() => setIsLoaded(false)}
						className="italic underline decoration-1 underline-offset-3 text-green-600">
						회원가입
					</Link>
				</section>
			</div>
		</MediumModal>
	);
};

export default LoginModal;
