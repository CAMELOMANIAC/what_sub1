import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaRegUserCircle } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import LoginModal from "./LoginModal";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../redux/store";
import { actionLoginChangeId} from '../redux/reducer/userReducer';
import { getCookieValue } from "../utils/publicFunction";

const GlobalNav = () => {
    const router = useRouter()
    const [currentPath, setCurrentPath] = useState(router.pathname)//pathname속성은 현재 경로만 저장되는 속성
    const [isLoginModal, setLoginModal] = useState(false)
    const userName = useSelector((state: RootState) => state.user.userName);

    //router.events는 라우터 이벤트로 이벤트객체가 변경될때(=주소창 경로가 바뀔때) 상태값을 변경하는 이벤트핸들러 추가
    useEffect(() => {
        const handleRouteChange = (url) => {
            setCurrentPath(url)
        }
        //next.js는 js의 addEventListener에 이벤트 핸들러를 등록하는 것처럼 router.events객체에 on/off메서드를 사용해서 등록/해제
        router.events.on('routeChangeComplete', handleRouteChange)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actionLoginChangeId(getCookieValue('user')))
    }, [])

    return (
        <div className="w-full fixed left-0 bg-white z-20 border-gray-200 border-b mb-auto flex align-middle min-w-[500px]">
            <Link href="/" className="mx-2"><Logo size="2rem" /></Link>
            <div className="flex align-middle ml-2">
                <Link href="/" className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath == '/' ? 'border-green-600 border-b-4 text-green-600' : ''}`}>홈</Link>
                <Link href="/Menus" className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath.includes('/Menus') && 'border-green-600 border-b-4 text-green-600'}`}>메뉴</Link>
                <Link href="/Recipes" className={`font-[seoul-metro] text-xl py-2 px-6 my-auto text-black hover:text-green-600 ${currentPath.includes('/Recipes') && 'border-green-600 border-b-4 text-green-600'}`}>레시피</Link>
                <button className={"absolute flex items-center right-2 top-2 px-1 h-4/6 rounded-full border-green-600 text-sm " + `${userName !== '' ? 'bg-green-600 text-white' : 'text-green-600 bg-white'}`} onClick={() => setLoginModal(true)}>
                    {userName === '' && <><span className="m-1">로그인</span><FaUserCircle className="inline text-2xl" /></>}
                    {userName !== '' && <><FaRegUserCircle className="inline text-2xl" /><span className="m-1">{userName}</span></>}
                </button>
                {isLoginModal && <LoginModal handleClose={() => setLoginModal(false)} />}
            </div>
        </div>
    );
};

export default GlobalNav;