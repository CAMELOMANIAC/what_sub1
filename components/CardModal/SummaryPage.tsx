import React, { useCallback, useEffect, useRef, useState } from 'react';
import { recipeType, replyType } from '../../interfaces/api/recipes';
import Link from 'next/link';
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi';
import { TbAlertCircle } from 'react-icons/tb';
import { breadNutrientArray, cheeseNutrientArray, menuNutrientArray, sauceNutrientArray } from '../../utils/menuArray';
import { useRecipeLike } from '../../utils/recipesLikeHook';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MemoizedChart } from '../IngredientRadarChart';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type props = {
    recipe: recipeType,
    className?: string
}

const SummaryPage = ({ recipe, className }: props) => {

    //재료에 맞게 재분류
    const ingredientsArray = recipe.recipe_ingredients.split(',');
    const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const cheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addCheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);

    const { likeCount, recipeLikeHandler } = useRecipeLike(recipe);
    const [reply, setReply] = useState<replyType[]>();
    const [content, setContent] = useState<string>('');
    const [isLogin, setIslogin] = useState<boolean>(false);
    const likeRecipe: string[] = useSelector((state: RootState) => state.user.recipeLikeArray);

    const scrollRef = useRef<HTMLUListElement>(null);

    const getReply = async ({ queryKey }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_key, recipeId] = queryKey;
        try {
            const response = await fetch(`/api/recipes/reply?recipeId=${recipeId}`);
            if (response.status === 200) {
                const result: replyType[] = await response.json();
                return result;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const { refetch } = useQuery(['reply', recipe.recipe_id], getReply, {
        staleTime: 1000 * 60 * 1,
        onSuccess: (data) => {
            if (data) {
                setReply(data)
            }
        }
    })

    const queryClient = useQueryClient();
    useEffect(() => {//초기 렌더링시 캐시에 저장된 댓글 불러오기(쿼리키가 존재하면 통신하지 않으므로 직접 상태값에 추가)
        const data: replyType[] | undefined = queryClient.getQueryData(['reply', recipe.recipe_id])
        if (data) {
            setReply(data)
        }
    }, [])

    const mutation = useMutation(
        async ({ recipe_id }: { recipe_id: string }) => {
            const response = await fetch(`/api/recipes/reply?recipeId=${recipe_id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: recipe_id,
                    content: content
                }),
            });
            if (!response.ok) {
                throw new Error('댓글 등록에 실패 했습니다.')
            }
        },
        {
            onSuccess: () => {
                alert('댓글 등록 성공');
                setContent('')
                refetch();//댓글 등록 성공시 다시 불러오기
            }
        }
    );

    const insertReply = async () => {
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

        mutation.mutate({ recipe_id: recipe.recipe_id });

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

    return (
        <div className={className}>
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
                        </div>
                    </div>
                    <div>{recipe.tag}</div>
                    <div className='flex flex-row overflow-hidden flex-wrap'>{ingredientsArray.map((item) =>
                        <img src={'/images/sandwich_menu/ingredients/' + item + '.jpg'} key={item} className='object-cover w-12 aspect-square rounded-md' alt={item}></img>
                    )}</div>
                    <div className='flex flex-row justify-end mt-auto text-gray-400'>
                        <div className='mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28'>{recipe.user_table_user_id}</div>
                        <button className='flex items-center mr-2 hover:text-green-600 active:scale-150 transition-transform'
                            onClick={(e) => { e.stopPropagation(); recipeLikeHandler() }}>
                            {likeRecipe.find(item => item == recipe.recipe_id) ? <PiHeartStraightFill className='m-1 text-green-600' /> : <PiHeartStraight className='m-1' />}{likeCount}
                        </button>
                    </div>
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
                        {reply && reply.map((item, index) =>
                            <li key={index} className='m-1 border-t-[1px]'>
                                <p className='font-bold'>{item.user_table_user_id}</p> {item.reply_context}
                            </li>
                        )}
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
    );
};

export default SummaryPage;