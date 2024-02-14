import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginChangeId, actionSetMenuLike, actionSetRecipeLike } from "../redux/reducer/userReducer";
import { RootState } from '../redux/store'
import { loadMenuLike, loadRecipeLike } from "../utils/publicFunction";
import Link from "next/link";
import { useMutation } from "react-query";

const LoginModal = ({ handleClose }:{handleClose: ()=> void}) => {
	const disptach = useDispatch();
	const userName = useSelector((state: RootState) => state.user.userName);
	const router = useRouter();
	const [id, setId] = useState('')
	const [pwd, setPwd] = useState('')
	const handleChangeId = (e) => {
		setId(e.target.value)
	}
	const handleChangePwd = (e) => {
		setPwd(e.target.value)
	}
	const handleKakaoLogin = () => {
		router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.URL}/api/users/socialKakao&client_secret=${process.env.KAKAO_CLIENT_SECRET}`)
	}

	//일반 로그인 (카카오 로그인은 인덱스 페이지에서 처리-리다이렉트됨)
	const handleLogin = async () => {
		loginMutation.mutate({ id, pwd });
	}

	const loginMutation = useMutation(//useMutation의 뮤테이션함수의 매개변수는 두개이상 사용할수없음 MutationFunction<any> 사용하려면 객체로 묶어서 사용
		async ({ id, pwd }: { id: string, pwd: string }) => {
			const response = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: id,
					pwd: pwd
				}),
			});

			if (!response.ok) {
				throw new Error('로그인 실패');
			}

			return response.json();
		},
		{
			onSuccess: async (data) => {
				//로그인 정보를 전역 상태값으로 저장
				disptach(actionLoginChangeId(data.userId));

				//레시피 좋아요 정보를 전역 상태값으로 저장
				const recipeLikeData = await loadRecipeLike();
				disptach(actionSetRecipeLike(recipeLikeData.map(item => item.recipe_table_recipe_id)));

				//메뉴좋아요 정보를 전역 상태값으로 저장
				const menuLikeData = await loadMenuLike();
				disptach(actionSetMenuLike(menuLikeData.map(item => item.sandwich_table_sandwich_name)));

				handleClose();
			},
			onError: (error: Error) => {
				alert(error.message);
			},

		}
	)


	return (
		<div className='w-[500px] h-[550px] bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex flex-col justify-center items-center'>
			<input className='border-2 w-1/2 p-2' onChange={handleChangeId} type=""></input>
			<input className='border-2' onChange={handleChangePwd}></input>
			<button onClick={handleLogin}>일반 로그인</button>
			<button onClick={handleKakaoLogin}>카카오 로그인</button>
			<button onClick={handleClose}>닫기</button>
			리덕스로 받아온 유저이름:{userName}<br />
			<Link href='/Register' onClick={handleClose}>회원가입</Link>
		</div>
	);
}

export default LoginModal;