import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi';
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import Link from 'next/link';
import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { recipeType } from '../interfaces/api/recipes';
import CardModal from './CardModal/CardModal';
import { useRecipeLike } from '../utils/card';

type CardProps = {
    recipe: recipeType;
    className?: string;
};

const Card = forwardRef<HTMLDivElement, CardProps>(({ recipe, className }, ref) => {
    const {likeCount, recipeLikeHandler} = useRecipeLike(recipe);
    const recipeTag: string[] = [];
    const likeRecipe: string[] = useSelector((state: RootState) => state.user.recipeLikeArray);
    const [isActive, setIsActive] = useState<boolean>(false)

    if (recipe.tag) {
        const tag = recipe.tag.split(',');
        recipeTag.push(...tag);
    }
    const ingredients: string[] = [];
    if (recipe.recipe_ingredients) {
        const ingredient = recipe.recipe_ingredients.split(',');
        ingredients.push(...ingredient);
    }

    return (
        <>
            <article className={`col-span-2 aspect-[4/3] bg-white border hover:border rounded-xl p-6 shadow-md hover:shadow-xl cursor-pointer flex flex-col hover:scale-105 transition-transform ${className}`}
                ref={ref}
                onClick={() => { setIsActive(true) }}>
                <div className='flex flex-row items-center'>
                    <div className='inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2'>
                        <img src={`/images/sandwich_menu/${recipe.sandwich_table_sandwich_name}.png`}
                            className='relative object-cover scale-[2.7] origin-[85%_40%]'
                            alt={recipe.sandwich_table_sandwich_name}></img>
                    </div>
                    <div className='flex flex-col w-full'>
                        <Link href={`/Recipes?param=${encodeURIComponent(recipe.sandwich_table_sandwich_name)}`}
                            className='text-sm text-gray-400 hover:text-green-600'
                            onClick={(e) => { e.stopPropagation(); }}>{recipe.sandwich_table_sandwich_name}</Link>
                        <h2 className='text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]'>{recipe.recipe_name}</h2>
                    </div>
                </div>
                <div className='flex flex-row justify-end text-sm w-full mb-2 text-gray-400'>
                    {recipeTag.map((item, index) => <span key={index} className={index !== 0 ? 'ml-1' : ''}>{'#' + item}</span>)}
                </div>
                <section className='flex flex-row overflow-hidden flex-wrap'>{ingredients.map((item) =>
                    <img src={'/images/sandwich_menu/ingredients/' + item + '.jpg'} key={item} className='object-cover w-[70px] aspect-square rounded-md' alt={item}></img>
                )}</section>
                <div className='flex flex-row justify-end mt-auto text-gray-400'>
                    <div className='mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28'>{recipe.user_table_user_id}</div>
                    <button className='flex items-center mr-2 hover:text-green-600'
                        onClick={(e) => { e.stopPropagation(); }}><HiOutlineChatBubbleLeft className='m-1' />{recipe.reply_count}</button>
                    <button className='flex items-center mr-2 hover:text-green-600 active:scale-150 transition-transform'
                        onClick={(e) => { e.stopPropagation(); recipeLikeHandler() }}>
                        {likeRecipe.find(item => item == recipe.recipe_id) ? <PiHeartStraightFill className='m-1 text-green-600' /> : <PiHeartStraight className='m-1' />}{likeCount}
                    </button>
                </div>
            </article>
            {
                isActive &&
                <CardModal recipe={recipe} setIsActive={setIsActive} ingredients={ingredients}></CardModal>
            }
        </>
    );
});
///나중에 React.memo를 사용해서 최적화해야함
// 전역상태값 likeRecipe를 부모 페이지 컴포넌트로부터 prop로 받도록 바꿔서 likeRecipe를 사용하는 모든 카드 컴포넌트가 재렌더링하지 않도록
// 부모 페이지 컴포넌트가 재랜더링이 필요한 컴포넌트에만 props값을 변경해서 전달하게끔 해야됨

Card.displayName = 'Card';
export default Card;