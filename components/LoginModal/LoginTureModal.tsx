import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

    
    useEffect(() => {
        const rect = buttonRef.getBoundingClientRect();

        if (ref.current) {//모달 위치 설정
            ref.current.style.top = `${rect.bottom+15}px`;
            setTailRight(`${rect.width/2-15}px`);
        }
        
    }, [buttonRef]);

    return (
        <BubbleTail ref={ref} className="absolute w-max right-2 bg-white border p-5 text-end" $tailRight={tailRight}>
            <ul>
                <li>내가 쓴 글</li>
                <li>내가 좋아요 한 글</li>
                <li>로그아웃</li>
            </ul>
        </BubbleTail>
    );
};

export default LoginTureModal;