import { useRouter } from "next/router";
import { useState } from "react";

const LoginModal = ({ handleClose }) => {
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
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
        }
      })
      .catch(error => console.error('Error:', error));
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
        <button onClick={handleLogin}>그냥 로그인</button>
        <button onClick={handleKakaoLogin}>카카오 로그인</button>
        <button onClick={handleClose}>닫기</button>
    </div>
  );
}

export default LoginModal;