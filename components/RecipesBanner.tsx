import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PiHeartStraight } from 'react-icons/Pi';
import { IoIosArrowBack } from 'react-icons/io';
import { HiFilter } from 'react-icons/hi';
import Link from 'next/link';
import { menuArray } from '../utils/menuArray';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { BsFillCheckSquareFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { set_filter_action, add_Filter_action } from '../redux/reducer/pageReducer'
import { RootState } from '../redux/store';

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

type Props = {
    className?: string
}

//타입스크립트에서 useRef를 컴포넌트 속성에 할당할 수 있도록 forwardRef를 사용해야함 그냥 타입에 넣어버리면 일반적인 속성이 되버림
const RecipesBanner = forwardRef<HTMLDivElement, Props> ((props, ref) => {
    const router = useRouter();
    type MenuItem = {
        name: string;
        ingredients: string[];
    };
    let selected: MenuItem[] = [];

    if (router.isReady) {
        const { param } = router.query;
        selected = menuArray.filter((item) => (item.name == String(param).replaceAll('+', ' ')));//쿼리로 값을 전달할때 뛰어쓰기는 +기호로 치환되므로 적절히 조치해야함
    }

    const queryFilterArray = ['메뉴이름', '레시피제목', '작성자', '재료', '태그']
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const filterRef = useRef(null);
    const dispatch = useDispatch();
    const filterState = useSelector((state: RootState) => state.page.FILTER_ARRAY);
    const setFilter = (filter) => {
        dispatch(set_filter_action(filter));
    }
    const addFilter = (filter) => {
        dispatch(add_Filter_action(filter));
    }

    //추천 브레드 및 추천 소스관련내용
    const [breadTop, setBreadTop] = useState<string[]>(['1', '2', '3']);
    const [breadTopLike, setBreadTopLike] = useState<string[]>(['1', '2', '3']);
    const [breadTopOccurrence, setBreadTopOccurrence] = useState<string[]>(['1', '2', '3']);
    const [sauceTop, setSauceTop] = useState<string[][]>([['1'], ['2'], ['3']]);
    const [sauceTopLike, setSauceTopLike] = useState<string[]>(['1', '2', '3']);
    const [sauceTopOccurrence, setSauceTopOccurrence] = useState<string[]>(['1', '2', '3']);
    const [menuLike, setMenuLike] = useState<string>();
    const [menuRecipe, setMenuRecipe] = useState<string>();
    const [recipeLike, setRecipeLike] = useState<string>();
    const loadTopIngredients = async (query:string, topIngredients:string) => {
        console.log(query)
        const response = await fetch(`/api/menu?query=${query}&topIngredients=${topIngredients}`);
        return await response.json();
    }
    const loadMenuInfo = async (query) => {
        const response = await fetch(`/api/menu?query=${query}`);
        return await response.json();
    }
    //쿼리스트링 변경시
    useEffect(() => {
        if (router.isReady) {
            const { param } = router.query;
            if (router.isReady && selected.length !== 0) {
                loadTopIngredients(encodeURIComponent(String(param)), 'bread').then(result => {
                    let parsedResult = result.map(item => item.recipe_ingredients);
                    setBreadTop(parsedResult);
                    parsedResult = result.map(item => item.likes);
                    setBreadTopLike(parsedResult);
                    parsedResult = result.map(item => item.occurrence);
                    setBreadTopOccurrence(parsedResult);
                });
                loadTopIngredients(encodeURIComponent(String(param)), 'sauce').then(result => {
                    let parsedResult = result.map(item => item.combined_ingredients.split(', '));
                    setSauceTop(parsedResult);
                    parsedResult = result.map(item => item.likes);
                    setSauceTopLike(parsedResult);
                    parsedResult = result.map(item => item.occurrence);
                    setSauceTopOccurrence(parsedResult);
                });
                loadMenuInfo(encodeURIComponent(String(param))).then(result => {
                    setMenuLike(result[0].like_count);
                    setMenuRecipe(result[0].recipe_count);
                    setRecipeLike(result[0].recipe_like_count);
                });
            }
        }
    }, [router.query])
    //next.js는 서바사이드와 클라이언트사이드의 절충이라서 리액트처럼 새로고침 한다고 파라메터객체가 클라이언트에서 바로 새로고침 되지않고 서버에서 값을 다시 받아야 새로고쳐진다
    //(다른 서버사이드렌더링 프레임워크는 그냥 통째로 정보를 전송하니까 에러가 아니라 그냥 빈화면을 보여주겠지만 next.js는 일단 서버쪽을 제외한 화면을 먼저 보여주려하니까 에러발생)
    //서버가 값을 전달하기 전까지는 일단 param이 비어있는 상태이므로 그 사이에 js는 param 값이 없다고 에러를 띄우게된다. param값을 사용하는 요소들은 값을 받고나서 렌더링 할수있도록 조치해줘야한다

    return (
        <>
            {router.isReady && selected.length !== 0 ? (
                <div className={`absolute flex justify-center w-screen right-0 min-w-[1024px] bg-white border-gray-200 border-b`} ref={ref}>
                    <Link href={'/Recipes'} className='py-10 my-auto h-full bg-gray-100 hover:text-green-600'><IoIosArrowBack className='inline text-lg h-1/2' /></Link>
                    <div className="flex flex-col justify-start pt-4 pb-10 w-[1024px] max-w-[1024px]">
                        <div className='flex flex-row pb-5 pl-4 border-l'>
                            <div className='inline-block w-[100px] overflow-hidden relative rounded-md aspect-square'>
                                <img src={`/images/sandwich_menu/${selected[0].name}.png`} alt={`${selected[0].name}.png`} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                            </div>
                            <div className='whitespace-pre-line'>
                                <div className='flex items-center m-2'>
                                    <h1 className='font-bold text-3xl inline text-black pb-4'>{selected[0].name}</h1>
                                    <button className='flex items-center text-xl'><PiHeartStraight className='inline-block' /></button>
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

                        <div className='grid grid-cols-2 grid-flow-row'>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천 브레드 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>브레드</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>좋아요 수</span>
                                </div>
                                {breadTop.map((item, index) => (
                                    <div key={item} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row'>
                                        <span className='col-span-5 flex items-center justify-start'>
                                            <img
                                                src={'images/sandwich_menu/ingredients/' + item + '.jpg'}
                                                alt={item}
                                                className='w-12 aspect-square inline object-cover'
                                            />
                                            {item}
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{Math.round((parseInt(breadTopOccurrence[index])/parseInt(menuRecipe!))*100)}%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{breadTopLike[index]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천 소스 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>조합법</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>좋아요 수</span>
                                </div>
                                {sauceTop.map((item, index) => (
                                    <div key={index} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row'>
                                        <span className='col-span-5 flex items-center justify-start'>{
                                            item.map((subItem, subIndex) => (//<React.Fragment>태그를 이용하면 실제 렌더링하지 않고 태그를 묶어서 사용할 수 있고 속성도 사용할수있다 (<></>은 똑같지만 속성 못 씀)
                                                <React.Fragment key={subItem + index}>
                                                    {subIndex !== 0 && '+'}
                                                    <img
                                                        src={'images/sandwich_menu/ingredients/' + subItem + '.jpg'}
                                                        alt={subItem}
                                                        className='w-12 aspect-square inline object-cover'
                                                    />
                                                </React.Fragment>
                                            ))
                                        }
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{Math.round((parseInt(sauceTopOccurrence[index])/parseInt(menuRecipe!))*100)}%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>{sauceTopLike[index]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`absolute w-screen min-w-[1024px] right-0 bg-white border-gray-200 border-b`} ref={ref}>
                    <div className='w-[1024px] mx-auto pt-4 pb-10'>
                        <div className='mb-4'>
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
                        <div className='grid grid-cols-2 grid-flow-row'>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천 검색어 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>브레드</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>평균 좋아요</span>
                                </div>
                            </div>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천 레시피 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>조합법</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>평균 좋아요</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )

            }
        </>
    );

});

//eslint가 규칙상 displayname이없으면 오류를 뿜어냄
RecipesBanner.displayName = 'RecipesBanner'

export default RecipesBanner;