import React, { forwardRef, useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi';
import { IoIosArrowBack } from 'react-icons/io';
import { HiFilter, HiAdjustments } from 'react-icons/hi';
import Link from 'next/link';
import { menuArray } from '../utils/menuArray';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { BsFillCheckSquareFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { set_filter_action, add_Filter_action, add_visible_action, remove_visible_action } from '../redux/reducer/pageReducer'
import { RootState } from '../redux/store';
import { recipeType } from '../interfaces/api/recipes';
import { totalMenuInfoType } from '../interfaces/api/menus';
import { GiKetchup, GiMeat, GiTomato } from 'react-icons/gi';
import { BiSolidBaguette, BiSolidCheese } from 'react-icons/bi';
import { MdOutdoorGrill } from 'react-icons/md';
import useMenuLike from '../utils/menuLikeHook';
import { useQuery } from 'react-query';
import Image from 'next/image';

export const StyleTag = styled.button`
    height:100%;
    display:inline-block;
    border:1px solid gray;
    border-radius:9999px;
    border-color: rgb(107 114 128);
    margin-right:0.1rem;
    padding:0.1rem 0.5rem 0.1rem 0.5rem;
    font-size:0.875rem;
    color: rgb(107 114 128);
`
export const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))25%, rgb(22 163 74 / var(--tw-bg-opacity))25%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;

export const StyledDiv2 = styled.div`
    background:linear-gradient(to right, rgb(234 179 8) 0%, rgb(234 179 8) 50%, rgb(22 163 74) 50%, rgb(22 163 74) 100%);
`;

type Props = {
    className?: string,
    recipeData: recipeType[],
    menuData: totalMenuInfoType[],
    sorting: string,
    setSorting: React.Dispatch<React.SetStateAction<string>>;
}
type MenuItem = {
    name: string;
    ingredients: string[];
};

//타입스크립트에서 useRef를 컴포넌트 속성에 할당할 수 있도록 forwardRef를 사용해야함 그냥 타입에 넣어버리면 일반적인 속성이 되버림
const RecipesBanner = forwardRef<HTMLDivElement, Props>(({ recipeData, menuData, sorting, setSorting }, ref) => {
    const router = useRouter();
    const dispatch = useDispatch();

    //검색 필터 관련
    const filterRef = useRef(null);
    const queryFilterArray = ['메뉴이름', '레시피제목', '작성자', '재료', '태그']
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const filterState = useSelector((state: RootState) => state.page.FILTER_ARRAY);
    const setFilter = (filter) => {
        dispatch(set_filter_action(filter));
    }
    const addFilter = (filter) => {
        dispatch(add_Filter_action(filter));
    }

    //레시피카드 요소 숨기기
    const visibleItem = useSelector((state: RootState) => state.page.VISIBLE_ARRAY)
    const visibleItemArray = [
        { name: '미트', element: <GiMeat className='mx-3' /> },
        { name: '빵', element: <BiSolidBaguette className='mx-3' /> },
        { name: '치즈', element: <BiSolidCheese className='mx-3' /> },
        { name: '채소', element: <GiTomato className='mx-3' /> },
        { name: '소스', element: <GiKetchup className='mx-3' /> },
        { name: '토스팅', element: <MdOutdoorGrill className='mx-3' /> },
    ]
    const sortHandler = (item) => {
        if (visibleItem.includes(item)) {
            dispatch(remove_visible_action(item))
        } else {
            dispatch(add_visible_action(item))
        }
    }

    //추천 브레드 및 추천 소스관련내용
    const [breadTop, setBreadTop] = useState<string[]>();
    const [breadTopLike, setBreadTopLike] = useState<string[]>();
    const [breadTopOccurrence, setBreadTopOccurrence] = useState<string[]>();
    const [sauceTop, setSauceTop] = useState<string[][]>();
    const [sauceTopLike, setSauceTopLike] = useState<string[]>();
    const [sauceTopOccurrence, setSauceTopOccurrence] = useState<string[]>();
    const [menuLike, setMenuLike] = useState<string>();
    const [menuRecipe, setMenuRecipe] = useState<string>();
    const [recipeLike, setRecipeLike] = useState<string>();

    const paramQuery = encodeURIComponent(String(router.query.param));
    
    useQuery(['bread', paramQuery],
        async ({ queryKey }) => {
            const [, param] = queryKey;
            const response = await fetch(`/api/menus/ingredientsBread?sandwichMenu=${param}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('실패');
            }
        }, {
        enabled: !!router.query.param,
        onError: (error) => console.log(error),
        onSuccess: (data) => {
            let parsedResult = data.map(item => item?.recipe_ingredients);
            setBreadTop(parsedResult);
            parsedResult = data.map(item => item?.likes);
            setBreadTopLike(parsedResult);
            parsedResult = data.map(item => item?.occurrence);
            setBreadTopOccurrence(parsedResult);}
    }
    );

    useQuery(['sauce', paramQuery],
        async ({ queryKey }) => {
            const [, param] = queryKey;
            console.log(param, selected);
            const response = await fetch(`/api/menus/ingredientsSauce?sandwichMenu=${param}`);
            if (response.ok) {
                console.log(await response.json);
                return await response.json();
            }
            else {
                throw new Error('실패')
            }
        }, {
        enabled: !!router.query.param,
        onError: (error) => console.log(error),
        onSuccess: (data) => {
            console.log(data.map(item => item?.combined_ingredients?.split(', ')));
            let parsedResult = data.map(item => item?.combined_ingredients?.split(', '));
            setSauceTop(parsedResult);
            parsedResult = data.map(item => item?.likes);
            setSauceTopLike(parsedResult);
            parsedResult = data.map(item => item?.occurrence);
            setSauceTopOccurrence(parsedResult);
        }
    }
    );

    const menuInfo = useQuery(['menuInfo', paramQuery],
        async () => {
            const response = await fetch(`/api/menus/${paramQuery}`);
            if (response.ok) {
                return await response.json();
            }
            else {
                throw new Error('실패')
            }
        }, { enabled: !!router.query.param });

    const selected: MenuItem[] = useMemo(() => {
        if (router.isReady) {
            return menuArray.filter((item) => (item.name == String(router.query.param).replaceAll('+', ' ')));
        } else {
            return [];
        }
    }, [router.isReady, router.query.param]);

    useEffect(() => {
        console.log(sauceTop);
    }, [sauceTop]);

    useEffect(() => {
        if (menuInfo.data) {
            setMenuLike(menuInfo.data[0].like_count);
            setMenuRecipe(menuInfo.data[0].recipe_count);
            setRecipeLike(menuInfo.data[0].recipe_like_count);
        }
    }, [menuInfo.data]);

    //쿼리스트링 변경시
    useEffect(() => {
        if (router.isReady) {
            if (router.isReady && selected.length !== 0) {
                setSelectedName(selected[0]?.name);
            }
        }
    }, [router.isReady, router.query, selected])

    const [selectedName, setSelectedName] = useState('');
    const { isLike, menuLikeHandler } = useMenuLike(selectedName);
    //next.js는 서바사이드와 클라이언트사이드의 절충이라서 리액트처럼 새로고침 한다고 파라메터객체가 클라이언트에서 바로 새로고침 되지않고 서버에서 값을 다시 받아야 새로고쳐진다
    //(다른 서버사이드렌더링 프레임워크는 그냥 통째로 정보를 전송하니까 에러가 아니라 그냥 빈화면을 보여주겠지만 next.js는 일단 서버쪽을 제외한 화면을 먼저 보여주려하니까 에러발생)
    //서버가 값을 전달하기 전까지는 일단 param이 비어있는 상태이므로 그 사이에 js는 param 값이 없다고 에러를 띄우게된다. param값을 사용하는 요소들은 값을 받고나서 렌더링 할수있도록 조치해줘야한다

    return (
        <>
            {router.isReady && router.query.param && (router.query.param).length !== 0 ? (
                <div className={`relative flex justify-center w-screen right-0 bg-white border-gray-200 border-b min-w-[640px]`} ref={ref}>
                    <Link href={'/Recipes'} className='py-10 my-auto h-full bg-gray-100 hover:text-green-600'><IoIosArrowBack className='inline text-lg h-1/2' /></Link>
                    <div className="flex flex-col justify-start pt-4 pb-10 w-full max-w-[1024px]">
                        <div className='flex flex-row pb-5 pl-4 border-l'>
                            <div className='inline-block w-[100px] overflow-hidden relative rounded-md aspect-square'>
                                <Image width={350} height={350} src={`/images/sandwich_menu/${selected[0].name}.png`} alt={`${selected[0].name}.png`} className='relative object-cover scale-[2.7] origin-[85%_40%]'></Image>
                            </div>
                            <div className='whitespace-pre-line'>
                                <div className='flex items-center m-2'>
                                    <h1 className='font-bold text-3xl inline text-black pb-4'>{selected[0].name}</h1>
                                    <button className='flex items-center text-xl' onClick={menuLikeHandler}>
                                        {isLike ? <PiHeartStraightFill className='inline-block' /> : <PiHeartStraight className='inline-block' />}
                                    </button>
                                </div>
                                <div className='flex flex-row text-sm m-2'>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>메뉴 좋아요</div>
                                        <div className='font-bold'>{menuLike}</div>
                                    </div>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>레시피 좋아요</div>
                                        <div className='font-bold'>{recipeLike}</div>
                                    </div>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>레시피 수</div>
                                        <div className='font-bold'>{menuRecipe}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 grid-flow-row'>
                            <div className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                                <span className=' font-bold'>추천 브레드 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>브레드</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>좋아요 수</span>
                                </div>
                                {Array.isArray(breadTop) && breadTop.map((item, index) => (
                                    <div key={item} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row breadTest'>
                                        <span className='col-span-5 flex items-center justify-start'>
                                            <Image width={70} height={70}
                                                src={'/images/sandwich_menu/ingredients/' + item + '.jpg'}
                                                alt={item}
                                                className='w-12 aspect-square inline object-cover'
                                            />
                                            {item}
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{breadTopOccurrence && Math.round((parseInt(breadTopOccurrence[index]) / parseInt(menuRecipe!)) * 100)}%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{breadTopLike && breadTopLike[index]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                                <span className=' font-bold'>추천 소스 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>조합법</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>좋아요 수</span>
                                </div>
                                {Array.isArray(sauceTop) && sauceTop.map((item, index) => (
                                    <div key={index} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row sauceTest'>
                                        <span className='col-span-5 flex items-center justify-start'>{
                                            item.map((subItem, subIndex) => (//<React.Fragment>태그를 이용하면 실제 렌더링하지 않고 태그를 묶어서 사용할 수 있고 속성도 사용할수있다 (<></>은 똑같지만 속성 못 씀)
                                                <React.Fragment key={subItem + subIndex}>
                                                    {subIndex !== 0 && '+'}
                                                    <Image width={50} height={50}
                                                        src={'/images/sandwich_menu/ingredients/' + subItem + '.jpg'}
                                                        alt={subItem}
                                                        className='w-12 aspect-square inline object-cover'
                                                    />
                                                </React.Fragment>
                                            ))
                                        }
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{sauceTopOccurrence && Math.round((parseInt(sauceTopOccurrence[index]) / parseInt(menuRecipe!)) * 100)}%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{sauceTopLike && sauceTopLike[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`relative w-screen bg-white border-gray-200 min-w-[640px]`} ref={ref}>
                    <div className='mx-auto pt-4 pb-8 max-w-[1024px]'>
                        <div className='mb-8'>
                            <div className='flex flex-row justify-start items-center my-2 sticky'>
                                <SearchBar className='ml-0 mr-2' />
                                <div className='relative' ref={filterRef}>
                                    <button className='relative text-green-600 text-2xl w-[42px] h-[42px] text-center align-middle flex justify-center items-center z-10'
                                        onClick={() => !isFilter ? setIsFilter(true) : setIsFilter(false)}>
                                        <HiFilter />
                                    </button>
                                </div>
                            </div>
                            {/*검색 필터옵션 */
                                filterRef.current && ReactDOM.createPortal(
                                    <div className={`absolute bg-white top-0 border ${isFilter ? '' : 'hidden'}`}>
                                        <ul className='ml-8 mr-1 p-1'>
                                            {queryFilterArray.map(item => <li key={item} className='text-sm flex flex-row p-1'>
                                                <label>
                                                    {<input type='checkbox' value={item} id={item} checked={filterState.includes((item))}
                                                        onChange={() => (filterState.includes((item)) ? setFilter(filterState.filter(filterItem => filterItem !== item))
                                                            : addFilter(item))} className='peer invisible absolute'></input>}
                                                    <BsFillCheckSquareFill className='relative w-6 h-6 mr-2 text-white border rounded peer-checked:text-green-600 peer-checked:border-0'></BsFillCheckSquareFill>
                                                </label>
                                                <label htmlFor={item} className='my-auto flex items-center w-max'>
                                                    {item}
                                                </label>
                                            </li>)}
                                        </ul>
                                    </div>
                                    , filterRef.current
                                )
                            }

                            <Link href={`/Recipes?query=달콤`}><StyleTag>#달콤</StyleTag></Link>
                            <Link href={`/Recipes?query=로스티드 치킨`}><StyleTag>로스티드 치킨</StyleTag></Link>
                            <Link href={`/Recipes?query=허니머스타드`}><StyleTag>허니머스타드</StyleTag></Link>
                            <span className='text-sm text-gray-500'>으로 검색해보세요</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 grid-flow-row'>
                            <div className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                                <span className=' font-bold'>추천 메뉴 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>메뉴</span>
                                    <span className='col-span-2'>메뉴 좋아요</span>
                                    <span className='col-span-2'>레시피 수</span>
                                </div>
                                {Array.isArray(menuData) && menuData.map((item, index) => (
                                    <div key={index} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row my-2 testMenu'>
                                        <span className='col-span-5 flex items-center justify-start'>
                                            <span className='w-10 aspect-square overflow-hidden rounded-md'>
                                                <Image width={100} height={100} src={`/images/sandwich_menu/${item.sandwich_name}.png`}
                                                    className='relative object-cover scale-[2.7] origin-[85%_40%]'
                                                    alt='item.sandwich_name'>
                                                </Image>
                                            </span>
                                            <span className='text-black ml-1 font-bold'>{item.sandwich_name}</span>
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black'>{item.like_count}</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black'>{item.recipe_count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='border-l px-4 col-span-1'>
                                <span className=' font-bold'>추천 레시피 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>레시피 이름</span>
                                    <span className='col-span-2'>좋아요 수</span>
                                    <span className='col-span-2'>태그</span>
                                </div>
                                {Array.isArray(recipeData) && recipeData.map((item, index) => (
                                    <div key={index} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2 testRecipe'>
                                        <span className='col-span-5 flex items-center justify-start text-black font-bold'>
                                            {index + 1}
                                            {' ' + item.recipe_name}
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black'>{item.like_count}</span>
                                        <div className='col-span-2 flex items-center text-sm text-black text-ellipsis overflow-hidden'>
                                            {item.tag}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <StyledDiv2 className='w-full h-fit'>
                <StyledDiv className='max-w-[1024px] min-w-[640px] h-fit relative mx-auto py-2 px-4 flex flex-row items-center'>
                    <p className='w-1/4 flex flex-row items-center'><HiAdjustments /> 검색결과</p>
                    <div className='flex flex-row w-full justify-end items-center text-white text-lg'>
                        {visibleItemArray.map((item) =>
                            <button
                                key={item.name}
                                className={visibleItem.includes(item.name) ? 'text-yellow-300' : ''}
                                onClick={() => sortHandler(item.name)}>{item.element}
                            </button>)}
                        <button className={`border rounded-full px-3 mx-1 text-sm ${sorting === '최신순' ? 'text-yellow-300 border-yellow-300' : ''}`} onClick={() => setSorting('최신순')}>최신순</button>
                        <button className={`border rounded-full px-3 text-sm ${sorting === '인기순' ? 'text-yellow-300 border-yellow-300' : ''}`} onClick={() => setSorting('인기순')}>인기순</button>
                    </div>
                </StyledDiv>
            </StyledDiv2>
        </>
    );

});

//eslint가 규칙상 displayname이없으면 오류를 뿜어냄
RecipesBanner.displayName = 'RecipesBanner'

export default RecipesBanner;