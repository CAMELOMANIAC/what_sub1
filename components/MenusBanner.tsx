import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/Pi';
import { RiPencilFill } from 'react-icons/ri';
import styled from 'styled-components';
import Link from 'next/link';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddMenuLike, actionRemoveMenuLike } from '../redux/reducer/userReducer';
import { menuArrayType } from '../utils/menuArray';

const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;

type propsType={
    selected : menuArrayType,
    sessionCheck : boolean,
}

const MenusBanner = ({selected,sessionCheck} : propsType) => {
    const menuLikeArray = useSelector((state: RootState) => state.user.menuLikeArray)
    const [menuLike, setMenuLike] = useState<number>(0);
    const dispatch = useDispatch();
    
    //메뉴선택시 메뉴 좋아요 갯수 정보 불러오는용
    useEffect(() => {
        fetch(`/api/menus/like?menuName=${selected.name}`
        ).then(
            response => response.json()
        ).then(
            data => setMenuLike(parseInt(data))
        )
    }, [selected])

    //메뉴 좋아요 처리
    const insertMenuLike = async (menuName: string) => {
        const response = await fetch(`/api/menus/like`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(menuName)
        })
        return response.json();
    }

    const menuLikeHandler = async (menuName: string) => {
        const result = await insertMenuLike(menuName);
        if (result === 'insertMenuLike성공') {
            dispatch(actionAddMenuLike(menuName))
            setMenuLike(prev => prev + 1)
        }
        else if (result === 'deleteMenuLike성공') {
            dispatch(actionRemoveMenuLike(menuName))
            setMenuLike(prev => prev - 1)
        }
    }
    return (
        <StyledDiv className="absolute w-screen min-w-[1024px] right-0 mx-auto h-[300px] grid grid-cols-6 bg-white overflow-hidden">
            {/*메뉴 간단정보*/}
            <div className="col-span-3 h-[300px]">
                <img src={`/images/sandwich_menu/${selected.name}.png`} alt={selected.name} className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></img>
            </div>
            <div className="col-span-3 whitespace-pre-line flex flex-col justify-center">
                <div className='flex flex-row items-center text-white pb-4'>
                    <h1 className='font-bold text-3xl mr-4'>{selected.name}</h1>
                    <button className='flex items-center text-xl' onClick={() => menuLikeHandler(selected.name)}>
                        {menuLikeArray.includes(selected.name) ? <PiHeartStraightFill className='inline-block' /> : <PiHeartStraight className='inline-block' />}{menuLike}
                    </button>
                </div>
                <div className='text-white/70 mb-2'>{selected.summary}</div>
                <div className='flex flex-row'>{selected.ingredients.map((item) =>
                    <img src={'/images/sandwich_menu/ingredients/' + item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-8' alt='item'></img>
                )}</div>
                <div className='flex flex-row'>
                    <Link href={{
                        pathname: '/Recipes',
                        query: { param: selected.name }
                    }}
                        className='font-bold rounded-full px-3 py-2 mr-2 text-black bg-yellow-500 flex justify-center items-center'>자세히 보기<IoIosArrowForward className='inline-block text-xl' />
                    </Link>
                    {sessionCheck && <Link href={{
                        pathname: '/AddRecipe',
                        query: { param: selected.name }
                    }}
                        className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center'>레시피 작성<RiPencilFill className='inline-block text-xl' />
                    </Link>}
                </div>
            </div>
        </StyledDiv>
    );
};

export default MenusBanner;