import React, { useCallback, useEffect, useRef, useState } from 'react';
import { recipeType, replyType } from '../interfaces/api/recipes';
import Link from 'next/link';
import { GrClose } from "react-icons/gr";
import { MemoizedChart } from './IngredientRadarChart';
import { breadNutrientArray, cheeseNutrientArray, sauceNutrientArray, menuNutrientArray } from "../utils/menuArray"
import { TbAlertCircle } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { MdSummarize } from "react-icons/md";
import { BiSolidBaguette } from "react-icons/bi";
import { BiSolidCheese } from "react-icons/bi";
import { MdOutdoorGrill } from "react-icons/md";
import { GiTomato } from "react-icons/gi";
import { GiKetchup } from "react-icons/gi";

type props = {
    recipe: recipeType,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    ingredients: string[]
}

const CardModal = ({ recipe, setIsActive, ingredients }: props) => {
    const [reply, setReply] = useState<replyType[]>();
    const [content, setContent] = useState<string>('');
    const [isLogin, setIslogin] = useState<boolean>(false);

    const scrollRef = useRef<HTMLUListElement>(null);

    const getReply = async () => {
        try {
            const response = await fetch(`/api/recipes/reply?recipeId=${recipe.recipe_id}`);
            const result: replyType[] = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    const insertReply = async () => {
        try {

            if (userName.length === 0) {
                alert('로그인 후 이용 가능합니다.')
                return
            }
            if (content.length === 0) {
                alert('댓글을 입력해주세요')
                return
            }
            if (content.length > 100) {
                alert('댓글은 100자 이하로 입력해주세요')
                return
            }
            if (content.length < 1) {
                alert('댓글은 1자 이상 입력해주세요')
                return
            }
            if (content.includes('<')) {
                alert('태그 사용 불가')
                return
            }

            const response = await fetch(`/api/recipes/reply?recipeId=${recipe.recipe_id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: recipe.recipe_id,
                    content: content
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('댓글 등록 성공');
                setContent('')
                getReply().then(replyResult => {
                    setReply(replyResult);
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                })
                return result;
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            alert('댓글 등록에 실패 했습니다.')
            //console.error(error);
        }
    }

    //로그인 여부 체크
    const userName = useSelector((state: RootState) => state.user.userName);
    const checkLogin = useCallback(() => { userName }, [userName])

    useEffect(() => {
        //로그인 여부 체크
        checkLogin();
        if (userName.length > 0) {
            setIslogin(true)
        }
    }, [checkLogin])

    useEffect(() => {
        //댓글 가져오기
        getReply().then(result => setReply(result))

    }, [])

    //재료에 맞게 재분류
    const ingredientsArray = recipe.recipe_ingredients.split(',');
    const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const cheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addCheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);

    return (
        <div className='fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10'
            onClick={(e) => { if (e.target === e.currentTarget) setIsActive(false) }}>
            <article className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1024px] bg-white text-black shadow rounded-lg'>
                <div className='grid grid-cols-8 gap-4'>
                    <nav className='h-full col-span-2 rounded-l-lg'>
                        <ul className='h-full py-10 font-bold flex flex-col items-end '>
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>소개<MdSummarize className='inline ml-3'/></button>
                            </li>
                            
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>빵<BiSolidBaguette className='inline ml-3'/></button>
                            </li>
                            
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>치즈<BiSolidCheese className='inline ml-3'/></button>
                            </li>
                            
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>토스팅<MdOutdoorGrill className='inline ml-3'/></button>
                            </li>
                            
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>채소<GiTomato className='inline ml-3'/></button>
                            </li>
                            
                            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                                <button className='mr-5'>소스<GiKetchup className='inline ml-3'/></button>
                            </li>
                        </ul>
                    </nav>
                    <div className='col-span-6 p-10'>
                        <div className='grid grid-cols-2'>
                            <section className='col-span-1'>
                                <div className='flex flex-row items-center'>
                                    <div className='inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2'>
                                        <img src={`/images/sandwich_menu/${recipe.sandwich_table_sandwich_name}.png`}
                                            className='relative object-cover scale-[2.7] origin-[85%_40%]'
                                            alt={recipe.sandwich_table_sandwich_name}></img>
                                    </div>
                                    <div className='flex flex-col'>
                                        <Link href={`/Recipes?param=${encodeURIComponent(recipe.sandwich_table_sandwich_name)}`}
                                            className='text-sm text-gray-400 hover:text-green-600'
                                            onClick={(e) => { e.stopPropagation(); }}>
                                            {recipe.sandwich_table_sandwich_name}
                                        </Link>
                                        <h2 className='text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]'>{recipe.recipe_name}</h2>
                                        <button onClick={() => setIsActive(false)}>
                                            <GrClose className='absolute right-5 top-5 z-10' />
                                        </button>
                                    </div>
                                </div>
                                <div>{recipe.tag}</div>
                                <div className='flex flex-row overflow-hidden flex-wrap'>{ingredients.map((item) =>
                                    <img src={'/images/sandwich_menu/ingredients/' + item + '.jpg'} key={item} className='object-cover w-12 aspect-square rounded-md' alt={item}></img>
                                )}</div>
                            </section>
                            <section className='flex justify-center col-span-1'>
                                <h3 className='text-gray-500 group'>
                                    <TbAlertCircle />
                                    <div className="absolute bg-gray-200 p-1 rounded text-xs invisible group-hover:visible whitespace-pre-line z-10">
                                        {'일일섭취권장량은 2000kcal를 기준으로 작성되었습니다\n샌드위치 재료의 영양성분은 23.10.5 기준 서브웨이 홈페이지 제공 내용입니다.' +
                                            '\n신선채소의 영양성분은 주메뉴에 포함되어 있습니다\n절임채소, 추가재료는 정보가 제공되지 않아 포함되지 않습니다\n후추,소금 정보가 제공되지 않아 포함되지 않습니다' +
                                            '\n메뉴 이름에 치즈가 포함된 재료는 이미 치즈의 영양성분이 포함되어 있으나\n 관련 정보가 제공되지 않아 치즈 영양정보가 중복해서 포함될 수 있습니다'}
                                    </div>
                                </h3>
                                <MemoizedChart context={{
                                    recipeName: '',
                                    tagArray: [],
                                    param: param!,
                                    addMeat: addMeat || '',
                                    bread: bread!,
                                    cheese: cheese || '',
                                    addCheese: addCheese || '',
                                    isToasting: '',
                                    vegetable: [],
                                    pickledVegetable: [],
                                    sauce: sauce,
                                    addIngredient: []
                                }} />
                            </section>
                            <section className='col-span-2'>
                                댓글
                                <ul className='max-h-48 overflow-y-auto' ref={scrollRef}>
                                    {reply?.length && reply?.map((item, index) =>
                                        <li key={index} className='m-1 border-t-[1px]'>
                                            <p className='font-bold'>{item.user_table_user_id}</p> {item.reply_context}
                                        </li>)}
                                </ul>
                                <div className='flex m-1'>
                                    <textarea rows={3} placeholder={isLogin ? '바르고 고운 말로 생각을 표현해주세요' : '로그인이 필요한 기능입니다'}
                                        maxLength={80}
                                        className='w-5/6 resize-none border-t-[1px]'
                                        value={content}
                                        onChange={(e) => { setContent(e.target.value); }}></textarea>
                                    <button type='submit' className='w-1/6 grow rounded-lg bg-green-600 text-white' onClick={insertReply}>댓글 작성</button>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default CardModal;