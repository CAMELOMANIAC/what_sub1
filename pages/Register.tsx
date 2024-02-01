import React, { useEffect, useState } from 'react';
import { deleteCookie, getCookieValue } from '../utils/publicFunction';

const Register = () => {
    const [id, setId] = useState<string>('')
    const [pwd, setPwd] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [kakaoCode, setKakaoCode] = useState<string>('')
    const handleChangeId = (e) => {
        setId(e.target.value)
    }
    const handleChangePwd = (e) => {
        setPwd(e.target.value)
    }
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }


    //일반 회원가입
    const handleRegister = async () => {
        const response = await fetch('api/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id,
                pwd: pwd,
                email: email,
            })
        })

        if (response.status === 200) {
            alert('계정 확인 메일을 전송했습니다 30분이내에 확인해주세요')
        }
        if (response.status === 400) {
            alert('입력 정보를 다시 확인해주세요')
        }
        if (response.status === 409) {
            alert('이미 존재하는 아이디 또는 이메일입니다')
        }
    }

    //카카오 로그인
    const handleKakaoRegister = async () => {
        if (kakaoCode) {
            
        }
        const response = await fetch('api/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id,
                pwd: pwd,
                email: email,
            })
        })

    }

    useEffect(() => {
        setKakaoCode(getCookieValue('kakaoCode'))
        //사용 후 kakaoCode 쿠키 제거 필요(인덱스 페이지에서 계속 쿠키여부를 확인함)
        deleteCookie('kakaoCode')
    }, [])

    return (
        <div className='w-full h-screen flex flex-col my-auto justify-center items-center'>
            {kakaoCode === '' ?
                <>
                    <input className='border-2' onChange={handleChangeId} placeholder='아이디'></input>
                    <input className='border-2' onChange={handleChangePwd} placeholder='비밀번호'></input>
                    <input className='border-2' onChange={handleChangeEmail} placeholder='이메일'></input>
                    <button onClick={() => handleRegister()}>회원가입</button>
                    <button onClick={() => handleKakaoRegister()}>카카오 계정으로 회원가입</button>
                </>
                :
                <>
                    <p>카카오 계정으로 회원 가입시 메일 인증 없이 회원가입이 가능하며</p>
                    <p>로그인 시 아이디,비밀번호를 입력하지 않고 카카오 계정으로 즉시 로그인 할 수 있습니다.</p>
                    <input className='border-2' onChange={handleChangeId} placeholder='아이디'></input>
                    <input className='border-2' onChange={handleChangePwd} placeholder='비밀번호'></input>
                    <button onClick={() => handleRegister()}>회원가입</button>
                </>
            }
        </div>
    );
};

export default Register;