import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginChangeId,actionSetRecipeLike} from "../redux/reducer/userReducer";
import { RootState } from '../redux/store'

const LoginModal = ({ handleClose }) => {
  const disptach = useDispatch();
  const userName = useSelector((state: RootState) => state.user.userName);
  const likeRecipe : string[] = useSelector((state: RootState) => state.user.recipeLikeArray);
  const router = useRouter();
  const handleKakaoLogin = () => {
    router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/socialLogIn&client_secret=${process.env.KAKAO_CLIENT_SECRET}`)
  }

  //로그인시 좋아요 목록을 전역상태로 저장하기 위한 함수
  const loadRecipeLike = async () => {
    const response = await fetch('/api/recipe?likeRecipe=true', {
      method: 'GET',
      credentials: 'include',
    });
    return await response.json();;
  }
  

  //일반 로그인
  const handleLogin = () => {
    fetch('/api/Login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        pwd: pwd
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }else{
        return response.json();
      }
    }).then((data) => {
      disptach(actionLoginChangeId(data.userId));
      handleClose();
      console.log('로그인 성공')
      loadRecipeLike().then(data=>disptach(actionSetRecipeLike(data)));
    }).catch(error => console.error('Error:', error));
  }

  const [id, setId] = useState('')
  const [pwd, setPwd] = useState('')
  const handleChangeId = (e) => {
    setId(e.target.value)
  }
  const handleChangePwd = (e) => {
    setPwd(e.target.value)
  }

  return (
    <div className='w-[500px] h-[550px] bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex flex-col justify-center items-center'>
      <input className='border-2 w-1/2 p-2' onChange={handleChangeId} type=""></input>
      <input className='border-2' onChange={handleChangePwd}></input>
      <button onClick={handleLogin}>일반 로그인</button>
      <button onClick={handleKakaoLogin}>카카오 로그인</button>
      <button onClick={handleClose}>닫기</button>
      리덕스로 받아온 유저이름:{userName}
      <ul>
      리덕스로 받아온 좋아요 레시피 번호:
        {likeRecipe.map(item=><li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default LoginModal;