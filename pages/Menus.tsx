import React, { useState, useEffect } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import { PiHeartStraight } from 'react-icons/Pi';
import { RiPencilFill } from 'react-icons/ri';
import styled from 'styled-components';
import { menuArray, menuArrayType } from '../utils/menuArray';
import {checkSession} from '../utils/checkSession';

const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;

export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie;
    const sessionCheck = await checkSession(cookie);

    return {
        props: {
            sessionCheck,
        },
    };
}

const Menus = ({sessionCheck}) => {
    console.log(sessionCheck)
    const arrayTemplate: { name: string, favorit: string, recipes: string, avgRecipe: string, matches: string } = {
        name: '메뉴 이름', favorit: '메뉴 좋아요', recipes: '레시피 수', avgRecipe: '레시피 평균', matches: '더 하면 좋은 재료'
    }
    const [selected, setSelected] = useState<menuArrayType>(menuArray[0]);
    const [menuType, setMenuType] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuArray.filter((item: { name: string }) => item.name.includes(searchQuery))

    //정렬
    const [order, setOrder] = useState('favorit');
    const orderChangeFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'favorit' && prevOrder === 'favorit') {
                return 'reverseFavorit';
            }
            else if (id === 'favorit' && prevOrder === 'reverseFavorit') {
                return 'favorit';
            }
            return 'favorit';
        });
        console.log(order);
    }

    const orderChangeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'recipes' && prevOrder === 'recipes') {
                return 'reverseRecipes';
            }
            else if (id === 'recipes' && prevOrder === 'reverseRecipes') {
                return 'recipes';
            }
            return 'recipes';
        });
    }

    const orderChangeAvgRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'avgRecipe' && prevOrder === 'avgRecipe') {
                return 'reverseAvgRecipe';
            }
            else if (id === 'avgRecipe' && prevOrder === 'reverseAvgRecipe') {
                return 'avgRecipe';
            }
            return 'avgRecipe';
        });
    }

    //얕은검사는 배열의 순서가 바껴도 인식하지 못함으로 배열을 복사해서 정렬해야함
    const [sortedArray, setSortedArray] = useState<menuArrayType[]>([...menuArray]);

    useEffect(() => {
        let sorted = [...menuArray];
        if (order === 'favorit')
            sorted.sort((a, b) => (b.favorit - a.favorit));
        if (order === 'reverseFavorit')
            sorted.sort((a, b) => (a.favorit - b.favorit));
        if (order === 'recipes')
            sorted.sort((a, b) => (b.recipes - a.recipes));
        if (order === 'reverseRecipes')
            sorted.sort((a, b) => (a.recipes - b.recipes));
        if (order === 'avgRecipe')
            sorted.sort((a, b) => (b.avgRecipe - a.avgRecipe));
        if (order === 'reverseAvgRecipe')
            sorted.sort((a, b) => (a.avgRecipe - b.avgRecipe));
        setSortedArray(sorted);
    }, [order]);

    return (
        <>
            <StyledDiv className="absolute w-screen min-w-[1024px] right-0 mx-auto h-[300px] grid grid-cols-6 bg-white overflow-hidden">
                {/*메뉴 간단정보*/}
                <div className="col-span-3 h-[300px]">
                    <img src={`/images/sandwich_menu/${selected.name}.png`} alt={selected.name} className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></img>
                </div>
                <div className="col-span-3 whitespace-pre-line flex flex-col justify-center">
                    <div className='flex flex-row items-center text-white pb-4'>
                        <h1 className='font-bold text-3xl mr-4'>{selected.name}</h1>
                        <button className='flex items-center text-xl'><PiHeartStraight className='inline-block'/>12</button>
                    </div>
                    <div className='text-white/70 mb-2'>{selected.summary}</div>
                    <div className='flex flex-row'>{selected.ingredients.map((item) =>
                        <img src={'/images/sandwich_menu/ingredients/' + item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-8' alt='item'></img>
                    )}</div>
                    <div className='flex flex-row'>
                        <Link href={{
                            pathname: '/Recipes',  // 이동할 페이지의 경로
                            query: { param: selected.name, query:selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-black bg-yellow-500 flex justify-center items-center'>자세히 보기<IoIosArrowForward className='inline-block text-xl' /></Link>
                        <Link href={{
                            pathname: '/AddRecipe',  // 이동할 페이지의 경로
                            query: { param: selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center'>레시피 작성<RiPencilFill className='inline-block text-xl' /></Link>
                    </div>{/*
                    <div className='flex flex-row'>
                        <button className='border-2 font-bold rounded-full px-3 py-1 mr-2 text-white flex justify-center items-center'>보러가기<AiOutlineArrowRight className='inline-block text-xl' /></button>
                        <button className='border-2 font-bold rounded-full px-3 py-1 mr-2 text-white flex justify-center items-center'>작성하기<RiPencilFill className='inline-block text-xl' /></button>
                    </div> */}
                </div>
            </StyledDiv>

            <main className='w-full max-w-screen-xl mx-auto pt-2 mt-[calc(300px+3rem)]'>
                <div className="grid grid-cols-6 gap-2 w-[1024px]">
                    <div className="col-span-2 border bg-white h-fit p-2">
                        {/*메뉴 선택기 */}
                        <div className="flex flex-row items-center border placeholder:text-gray-400 focus-within:ring-2 ring-green-600 p-1">
                            <FiSearch className='text-lg mx-1 text-gray-400' />
                            <input type="text" className='focus-within:outline-none w-full' onChange={queryChange} />
                        </div>
                        <div className="flex w-full pt-2">
                            <button className={`border rounded-l py-2 w-full text-xs ${menuType === 0 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(0)}>all</button>
                            <button className={`border-y py-2 w-full text-xs ${menuType === 1 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(1)}>클래식</button>
                            <button className={`border-y border-x py-2 w-full text-xs ${menuType === 2 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(2)}>프레쉬</button>
                            <button className={`border-y py-2 w-full text-xs ${menuType === 3 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(3)}>프리미엄</button>
                            <button className={`border rounded-r py-2 w-full text-xs ${menuType === 4 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(4)}>신제품</button>
                        </div>

                        {menuType === 0 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 1 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 2 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 3 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 4 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }
                    </div>

                    {/*메뉴 순위 */}
                    <div className="col-span-4 border bg-white relative w-full divide-y text-sm">
                        <div className='flex items-center bg-slate-100 text-gray-400'>
                            <span className="inline-block w-[10%] text-center">순위</span>
                            <span className="inline-block w-[30%]">{arrayTemplate.name}</span><span className='inline-block w-10'></span>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'favorit' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseFavorit' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='favorit' onClick={orderChangeFavorit}>{arrayTemplate.favorit}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'recipes' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseRecipes' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='recipes' onClick={orderChangeRecipes}>{arrayTemplate.recipes}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'avgRecipe' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseAvgRecipe' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='avgRecipe' onClick={orderChangeAvgRecipes}>{arrayTemplate.avgRecipe}</button>
                            <span className="inline-block w-[30%] text-center">{arrayTemplate.matches}</span>
                        </div>
                        {sortedArray?.map((item, index) => (
                            <button key={index} className='flex items-stretch w-full' onClick={() => setSelected(item)}>
                                <span className="flex justify-center items-center  w-[10%] text-center text-gray-400">{index + 1}</span>
                                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1'>
                                    <img src={`/images/sandwich_menu/${item.name}.png`} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                                </div>
                                <span className="flex justify-start items-center  w-[30%] font-bold pl-2">{item.name}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'favorit') || (order === 'reverseFavorit')) && 'bg-gray-100 '}`}>{item.favorit}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'recipes') || (order === 'reverseRecipes')) && 'bg-gray-100 '}`}>{item.recipes}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'avgRecipe') || (order === 'reverseAvgRecipe')) && 'bg-gray-100 '}`}>{item.avgRecipe}</span>
                                <span className="flex justify-center items-center  w-[30%] text-center">{item.matches}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Menus;