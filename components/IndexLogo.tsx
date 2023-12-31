import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import Logo from './Logo';
import SandwichBanner from './SandwichBanner';
import { useRouter } from 'next/router';
import { MdOutlineArrowBack } from "react-icons/md";
import { MdOutlineArrowForward } from "react-icons/md";

const LineDeco = styled.div`
  &:before {
    content: '';
    position: absolute;
    left:0;
    bottom: 50%;
    height: 70px; // 줄의 높이를 설정합니다.
    width: 100vw;
    background: rgb(22 163 74); // 줄의 색상을 설정합니다.
    z-index: -1;
  }
`
type PropsType = {
    prevHandler: () => void,
    nextHandler: () => void,
}

const IndexLogo = ({prevHandler,nextHandler}:PropsType) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFocus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        if (isFocus) {
            inputRef.current && inputRef.current.focus();
        }
    }, [isFocus]);

    useEffect(() => {
        const focusOutHandler = (e) => {
            //포커스 해제
            if (e.target !== inputRef.current && searchQuery === '') {
                setFocus(false);
            }
        }
        addEventListener("mousedown", focusOutHandler)
        return () => {
            removeEventListener("mousedown", focusOutHandler)
        }
    }, [searchQuery])

    const router = useRouter();
    const searchEnterHandler = (e) => {
        //엔터 누르면 검색 페이지로 이동
        if (e.key === 'Enter') {
            queryPushHandler();
        }
    }
    const queryPushHandler = () => {
        if (searchQuery !== '')
            router.push(`/Recipes?query=${searchQuery}`)
        else
            router.push(`/Recipes`)
    }

    return (
        <div className='flex flex-col items-center justify-center mx-auto mb-4 rounded-full w-[100%]'>
            <SandwichBanner />
            <div className='flex flex-row'>
                <button className='flex justify-center items-center font-[seoul-metro] text-xl text-white mr-4' onClick={prevHandler}><MdOutlineArrowBack className='text-2xl'></MdOutlineArrowBack>이전</button>
                {<LineDeco>
                    <div className='w-auto bg-white border-[12px] border-green-600 rounded-full px-6 py-2 flex flex-row justify-center items-center'>
                        <span className='flex justify-center items-center w-[70px] text-white text-4xl font-extrabold font-[seoul-metro] rounded-full bg-green-600 aspect-square mr-6'>
                            <button onClick={queryPushHandler}>
                                <FaSearch />
                            </button>
                        </span>

                        <div className='flex flex-col flex-nowrap justify-center items-center mr-6 my-2 text-5xl' onClick={() => setFocus(true)}>
                            {isFocus ?
                                <input className='p-3 mt-3 text-lg text-center' type='text' ref={inputRef} onChange={(e) => setSearchQuery(e.currentTarget.value)} onKeyDown={searchEnterHandler}></input> :
                                <Logo />
                            }
                            <div className='font-[seoul-metro] text-gray-600 text-lg'>넌 뭐먹어?</div>
                        </div>
                    </div>
                </LineDeco>
                }
                <button className='flex justify-center items-center font-[seoul-metro] text-xl text-white ml-4' onClick={nextHandler}>다음<MdOutlineArrowForward className='text-2xl'></MdOutlineArrowForward></button>
            </div>
        </div>
    );
};

export default IndexLogo;