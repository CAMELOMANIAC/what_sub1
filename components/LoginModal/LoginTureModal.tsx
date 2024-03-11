import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { deleteCookie } from "../../utils/publicFunction";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { actionSetLogoutData } from "../../redux/reducer/userReducer";
import { PiHeartStraightFill } from "react-icons/pi";
import { RiPencilFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";

type BubbleTailProps = {
    $tailRight?: string;
}

const BubbleTail = styled.div<BubbleTailProps>`
    &:after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 0 15px 15px;
        border-color: white transparent;
        display: block;
        width: 0;
        top: -15px;
        right: ${props => props.$tailRight || 'auto'};
    }
    &::before {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 0 15px 15px;
        border-color: rgb(229 231 235) transparent;
        display: block;
        width: 0;
        z-index: 0;
        top: -16.5px;
        right: ${props => props.$tailRight || 'auto'};
    }
`

const LoginTureModal = ({handleClose, buttonRef}:{handleClose:()=>void, buttonRef:HTMLButtonElement}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [tailRight, setTailRight] = useState<string>('auto');//tailLeft값을 상태값으로 설정
    const dispatch = useDispatch();
    const router = useRouter();

    //모달창 외부 클릭시 모달창 닫기
    useEffect(() => {
        const handleOutSideClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {//contains 함수는 인자로 전달된 노드가 해당 노드의 자손인지 판단
                handleClose();
            }
        }
        document.addEventListener('mousedown', handleOutSideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutSideClick);
        };
    }, [handleClose]);

    //모달 위치 설정
    useEffect(() => {
        const rect = buttonRef.getBoundingClientRect();

        if (ref.current) {//모달 위치 설정
            ref.current.style.top = `${rect.bottom+15}px`;
            setTailRight(`${rect.width/2-15}px`);
        }
        
    }, [buttonRef]);

    //로그아웃 요청
    const {refetch} = useQuery('user', () => {
        fetch('/api/users/deleteCookie',{method:'POST'})
    },{
        enabled: false,
        onSuccess:()=>{
            deleteCookie('user');
            handleClose();
            dispatch(actionSetLogoutData());
            router.push('/');
        }
    })

    const logoutHandler = () => {
        refetch();
    }

    return (
        <BubbleTail ref={ref} className="absolute w-max right-2 bg-white border p-5 text-end" $tailRight={tailRight}>
            <ul>
                <li><Link href={'/Recipes?write'}>내가 쓴 글<RiPencilFill className="inline-block text-gray-400"/></Link></li>
                <li><Link href={'/Recipes?favorite'}>내가 좋아요 한 글<PiHeartStraightFill className="inline-block text-gray-400"/></Link></li>
                <li><button onClick={()=>logoutHandler()}>로그아웃<IoLogOut className="inline-block text-gray-400"/></button></li>
            </ul>
        </BubbleTail>
    );
};

export default LoginTureModal;