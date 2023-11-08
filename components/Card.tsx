import { PiHeartStraight } from 'react-icons/Pi';
import { HiOutlineChatBubbleLeft } from 'react-icons/Hi2';
import Link from 'next/link';
import { useState } from 'react';


const Card = ({ recipe }) => {
    const [likeCount, setLikeCount] = useState<number>(recipe.like_count);
    const recipeTag: string[] = [];
    if (recipe.tag) {
        const tag = recipe.tag.split(',');
        recipeTag.push(...tag);
    }
    const ingredients: string[] = [];
    if (recipe.recipe_ingredients) {
        const ingredient = recipe.recipe_ingredients.split(',');
        ingredients.push(...ingredient);
    }

    const insertRecipeLike = async(recipe_id:string)=>{
        const response = await fetch('/api/recipe?insert=recipeLike', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(recipe_id)
        })
        return response.json();
    }
    const recipeLikeHandler = async(recipe_id:string) => {
        const result = await insertRecipeLike(recipe_id);
        if (result === 'insertRecipeLike성공')
            setLikeCount(prev=>prev+1)
        else if (result === 'deleteRecipeLike성공')
            setLikeCount(prev=>prev-1)
        console.log(result);
    }

    return (
        <article className='col-span-2 aspect-[4/3] bg-white rounded-xl p-6 hover:shadow-lg flex flex-col shadow-sm'>
            {/**/}
            <div className='flex flex-row items-center'>
                <div className='inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2'>
                    <img src={`/images/sandwich_menu/${recipe.sandwich_name}.png`} className='relative object-cover scale-[2.7] origin-[85%_40%]' alt='Card_sandwich_type'></img>
                </div>
                <div className='flex flex-col w-full'>
                    <Link href={`/Recipes?param=${recipe.sandwich_name}`} className='text-sm text-gray-400'>{recipe.sandwich_name}</Link>
                    <h2 className='text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]'>{recipe.recipe_name}</h2>
                </div>
            </div>
            <div className='flex flex-row justify-end text-sm w-full text-gray-400'>
                {recipeTag.map((item, index) => <span key={index}>{'#' + item}</span>)}
            </div>
            <section className='flex flex-row overflow-hidden flex-wrap'>{ingredients.map((item) =>
                <img src={'/images/sandwich_menu/ingredients/' + item + '.jpg'} key={item} className='object-cover w-12 aspect-square rounded-md' alt={item}></img>
            )}</section>
            <div className='flex flex-row justify-end mt-auto text-gray-400'>
                <div className='mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28'>{recipe.user_id}</div>
                <button className='flex items-center mr-2 hover:text-green-600' onClick={()=>recipeLikeHandler(recipe.recipe_id)}><PiHeartStraight className='m-1' />{likeCount}</button>
                <button className='flex items-center mr-2 hover:text-green-600'><HiOutlineChatBubbleLeft className='m-1' />{recipe.reply_count}</button>
            </div>

        </article>
    );
};

export default Card;