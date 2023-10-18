import { useRouter } from "next/router";
import { useState } from "react";

const LoginModal = ({handleClose}) => {
  const router = useRouter()
  const handleKakaoLogin = () => {
    //window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000/api/socialLogIn`;
    router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/socialLogIn&client_secret=${process.env.KAKAO_CLIENT_SECRET}`)
  }

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
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
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
    <div className='absolute w-[600px] h-[800px] bg-white mx-auto my-auto'>
      <input className='border-2' onChange={handleChangeId} type=""></input>
      <input className='border-2' onChange={handleChangePwd}></input>
      <button onClick={handleKakaoLogin}>카카오 로그인</button>
      <button onClick={handleLogin}>그냥 로그인</button>
      <button onClick={handleClose}>닫기</button>
    </div>
  );
}

export default LoginModal;