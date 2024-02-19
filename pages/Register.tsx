import React, { useEffect, useRef, useState } from 'react';
import { deleteCookie, getCookieValue, isValidEmail, isValidId, isValidPassword } from '../utils/publicFunction';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Logo from '../components/Logo';
import useAnimation from '../utils/animationHook';

const Register = () => {
    const router = useRouter();
    const [id, setId] = useState<string>('')
    const [pwd, setPwd] = useState<string>('')
    const [checkPwd, setCheckPwd] = useState<string>('')
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
    const handleChangeCheckPwd = (e) => {
        setCheckPwd(e.target.value)
    }


    //일반 회원가입
    const handleRegister = async () => {
        if (pwd !== checkPwd) {
            alert('비밀번호가 일치하지 않습니다')
            return;
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

        switch (response.status) {
            case 200: alert('계정 확인 메일을 전송했습니다 30분이내에 확인해주세요'); break;
            case 400: alert('입력 정보를 다시 확인해주세요'); break;
            case 409: alert('이미 존재하는 아이디 또는 이메일입니다'); break;
            default: alert('회원가입에 실패했습니다'); break;
        }
    }

    //카카오계정으로 회원가입
    const handleKakaoRegister = async () => {
        const response = await fetch('api/users/socialKakaoRegister', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id,
                pwd: pwd,
                kakaoCode: kakaoCode,
            })
        })
        switch (response.status) {
            case 200: alert('카카오 계정으로 회원가입이 완료되었습니다.'); router.push('/'); break;
            case 400: alert('입력 정보를 다시 확인해주세요'); break;
            case 409: alert('이미 존재하는 아이디 또는 이메일입니다'); break;
            default: alert('회원가입에 실패했습니다'); break;
        }
    }

    const handleKakaoAccount = () => {
        router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.URL}/api/users/socialKakao?register=1&client_secret=${process.env.KAKAO_CLIENT_SECRET}`)
    }

    useEffect(() => {
        setKakaoCode(getCookieValue('kakaoCode'))
        //사용 후 kakaoCode 쿠키 제거 필요(인덱스 페이지에서 계속 쿠키여부를 확인함)
        deleteCookie('kakaoCode')
    }, [])


    const alertIdRef = useRef<HTMLDivElement>(null);
    useAnimation(alertIdRef, isValidId, id);
    const alertPwdRef = useRef<HTMLDivElement>(null);
    useAnimation(alertPwdRef, isValidPassword, pwd);
    const alertCheckPwdRef = useRef<HTMLDivElement>(null);
    useAnimation(alertCheckPwdRef, () => pwd === checkPwd, checkPwd);
    const alertEmailRef = useRef<HTMLDivElement>(null);
    useAnimation(alertEmailRef, isValidEmail, email);

    return (
        <>
            <Head>
                <title>WhatSub : 회원가입</title>
                <meta name="robots" content="noindex" />
                <meta name="description" content="WhatSub 회원가입 페이지 입니다." />
            </Head>
            <article className='w-[500px] p-10 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg flex flex-col justify-center items-center'>
                <div className='w-full flex flex-col my-auto justify-center items-center'>
                    <Logo />
                    {kakaoCode === '' ?
                        <>
                            <p className="text-lg font-bold">회원가입</p>
                            <section className='p-2'>
                                <label htmlFor="userId" className="block text-sm">아이디</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangeId} type="" id="userId" placeholder="아이디"></input>
                                {!isValidId(id) && <p className='text-red-600 text-sm' ref={alertIdRef}>1~10사이의 영문이거나 숫자여야만 합니다.</p>}
                            </section>

                            <section className='p-2'>
                                <label htmlFor="userPwd" className="block text-sm">비밀번호</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangePwd} type="password" id="userPwd" placeholder="비밀번호"></input>
                                {!isValidPassword(pwd) && <p className='text-red-600 text-sm' ref={alertPwdRef}>1~15사이의 문자여야만 합니다.</p>}
                            </section>

                            <section className='p-2'>
                                <label htmlFor="checkUserPwd" className="block text-sm">비밀번호 확인</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangeCheckPwd} type="password" id="checkUserPwd" placeholder="비밀번호 확인"></input>
                                {checkPwd !== pwd && <p className='text-red-600 text-sm' ref={alertCheckPwdRef}>비밀번호와 일치하지 않습니다</p>}
                            </section>

                            <section className='p-2'>
                                <label htmlFor="userEmail" className="block text-sm">이메일</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangeEmail} type="email" id="userEmail" placeholder="이메일"></input>
                                {!isValidEmail(email) && <p className='text-red-600 text-sm' ref={alertEmailRef}>올바른 이메일 형식이 아닙니다.</p>}
                            </section>
                            <button onClick={() => handleRegister()}>회원가입</button>
                            <button onClick={() => handleKakaoAccount()}>카카오 계정으로 회원가입</button>
                        </>
                        :
                        <>
                            <p className="text-lg font-bold">카카오 계정 회원가입</p>
                            <section className='w-[300px] text-sm mb-4'>
                                <p>카카오 계정으로 회원 가입시 메일 인증 없이 회원가입이 가능하며 추후 로그인 시 아이디, 비밀번호를 입력하지 않고 카카오 계정으로 즉시 로그인 할 수 있습니다.</p>
                            </section>
                            <section className='p-2'>
                                <label htmlFor="userId" className="block text-sm">아이디</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangeId} type="" id="userId" placeholder="아이디"></input>
                                {!isValidId(id) && <p className='text-red-600 text-sm' ref={alertIdRef}>1~10사이의 영문이거나 숫자여야만 합니다.</p>}
                            </section>

                            <section className='p-2'>
                                <label htmlFor="userPwd" className="block text-sm">비밀번호</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangePwd} type="password" id="userPwd" placeholder="비밀번호"></input>
                                {!isValidPassword(pwd) && <p className='text-red-600 text-sm' ref={alertPwdRef}>1~15사이의 문자여야만 합니다.</p>}
                            </section>

                            <section className='p-2'>
                                <label htmlFor="checkUserPwd" className="block text-sm">비밀번호 확인</label>
                                <input className='border-2 w-[300px] p-2 rounded' onChange={handleChangeCheckPwd} type="password" id="checkUserPwd" placeholder="비밀번호 확인"></input>
                                {checkPwd !== pwd && <p className='text-red-600 text-sm' ref={alertCheckPwdRef}>비밀번호와 일치하지 않습니다</p>}
                            </section>
                            <button onClick={() => handleKakaoRegister()}>회원가입</button>
                            <button onClick={() => setKakaoCode('')}>일반 회원가입으로 전환</button>
                        </>
                    }
                </div>
            </article>
        </>
    );
};

export default Register;