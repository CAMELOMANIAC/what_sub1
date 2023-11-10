import React, { useState, useEffect } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/Pi';
import { RiPencilFill } from 'react-icons/ri';
import styled from 'styled-components';
import { menuArray, menuArrayType } from '../utils/menuArray';
import { checkSession } from '../utils/checkSession';
import { getCookieValue, loadMenuLike } from '../utils/publicFunction';
import { useDispatch, useSelector } from 'react-redux';
import { actionAddMenuLike, actionRemoveMenuLike, actionSetMenuLike } from '../redux/reducer/userReducer';

const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;

export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie;
    const sessionCheck = await checkSession(cookie);

    const loadTotalMenuInfo = async() =>{
        const result = await fetch(process.env.URL + '/api/menu?isTotal=true')
        return result.json();
    }
    const totalMenuInfo = await loadTotalMenuInfo();

    return {
        props: {
            sessionCheck,
            totalMenuInfo
        },
    };
}

const Menus = ({ sessionCheck, totalMenuInfo }) => {
    const fixedMenuArray : menuArrayType[] = menuArray;
    fixedMenuArray.map(menuArray=>{
        totalMenuInfo.find(infoArray=>infoArray.sandwich_name === menuArray.name)
            ? ( menuArray.recipes = totalMenuInfo.find(infoArray=>infoArray.sandwich_name === menuArray.name).recipe_count,
             menuArray.favorit = totalMenuInfo.find(infoArray=>infoArray.sandwich_name === menuArray.name).like_count ,
             menuArray.likeRecipe = totalMenuInfo.find(infoArray=>infoArray.sandwich_name === menuArray.name).recipe_like_count )
            : null
    })
    const arrayTemplate: { name: string, favorit: string, recipes: string, likeRecipe: string, matches: string } = {
        name: '메뉴 이름', favorit: '메뉴 좋아요', recipes: '레시피 수', likeRecipe: '레시피 좋아요', matches: '더 하면 좋은 재료'
    }
    const [selected, setSelected] = useState<menuArrayType>(menuArray[0]);
    const [menuType, setMenuType] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuArray.filter((item: { name: string }) => item.name.includes(searchQuery))
    const menuLikeArray = useSelector((state: any) => state.user.menuLikeArray)

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

    const orderChangeLikeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'likeRecipe' && prevOrder === 'likeRecipe') {
                return 'reverselikeRecipe';
            }
            else if (id === 'likeRecipe' && prevOrder === 'reverselikeRecipe') {
                return 'likeRecipe';
            }
            return 'likeRecipe';
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
        if (order === 'likeRecipe')
            sorted.sort((a, b) => (b.likeRecipe - a.likeRecipe));
        if (order === 'reverselikeRecipe')
            sorted.sort((a, b) => (a.likeRecipe - b.likeRecipe));
        setSortedArray(sorted);
    }, [order]);

    const dispatch = useDispatch();
    //새로고침시 정보 불러오는용
    useEffect(() => {
        if (getCookieValue('user').length > 0) {//로그인 정보가 있을경우
            loadMenuLike().then(data => {//메뉴 좋아요 정보 가져와서 전역 상태값에 저장
                dispatch(actionSetMenuLike(data))
                console.log(data)
            })
        }
    }, [])

    const [menuLike,setMenuLike] = useState<number>(0);
    //메뉴선택시 메뉴 좋아요 갯수 정보 불러오는용
    useEffect(() => {
        fetch(`/api/menu?likeMenuCount=${selected.name}`).then(
            response => response.json()
        ).then(
            data => setMenuLike(parseInt(data))
        )
    }, [selected])

    const insertMenuLike = async (menuName: string) => {
        const response = await fetch('/api/menu?insert=menuLike', {
            method: 'POST',
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
        if (result === 'insertMenuLike성공'){
            dispatch(actionAddMenuLike(menuName))
            setMenuLike(prev => prev+1)
        }
        else if (result === 'deleteMenuLike성공'){
            dispatch(actionRemoveMenuLike(menuName))
            setMenuLike(prev => prev-1)
        }
    }

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
                        <button className='flex items-center text-xl' onClick={()=>menuLikeHandler(selected.name)}>
                            { menuLikeArray.includes(selected.name) ? <PiHeartStraightFill className='inline-block'/>:<PiHeartStraight className='inline-block'/>}{menuLike}
                        </button>
                    </div>
                    <div className='text-white/70 mb-2'>{selected.summary}</div>
                    <div className='flex flex-row'>{selected.ingredients.map((item) =>
                        <img src={'/images/sandwich_menu/ingredients/' + item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-8' alt='item'></img>
                    )}</div>
                    <div className='flex flex-row'>
                        <Link href={{
                            pathname: '/Recipes',  // 이동할 페이지의 경로
                            query: { param: selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-black bg-yellow-500 flex justify-center items-center'>자세히 보기<IoIosArrowForward className='inline-block text-xl' /></Link>
                        <Link href={{
                            pathname: '/AddRecipe',  // 이동할 페이지의 경로
                            query: { param: selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center'>레시피 작성<RiPencilFill className='inline-block text-xl' /></Link>
                    </div>
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
                        {/*위쪽 라벨 */}
                        <div className='flex items-center bg-slate-100 text-gray-400'>
                            <span className="inline-block w-[10%] text-center">순위</span>
                            <span className="inline-block w-[30%]">{arrayTemplate.name}</span><span className='inline-block w-10'></span>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'favorit' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseFavorit' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='favorit' onClick={orderChangeFavorit}>{arrayTemplate.favorit}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'likeRecipe' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverselikeRecipe' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='likeRecipe' onClick={orderChangeLikeRecipes}>{arrayTemplate.likeRecipe}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'recipes' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseRecipes' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='recipes' onClick={orderChangeRecipes}>{arrayTemplate.recipes}</button>
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
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'likeRecipe') || (order === 'reverselikeRecipe')) && 'bg-gray-100 '}`}>{item.likeRecipe}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'recipes') || (order === 'reverseRecipes')) && 'bg-gray-100 '}`}>{item.recipes}</span>
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