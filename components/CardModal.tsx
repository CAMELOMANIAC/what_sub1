import React from 'react';
import { recipeType } from '../interfaces/api/recipes';

type props = {
    recipe: recipeType,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    ingredients: string[]
}

const CardModal = ({ recipe, setIsActive,ingredients }: props) => {
    return (
        <div className='fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10'
            onClick={(e) => { if (e.target === e.currentTarget) setIsActive(false) }}>
            <article className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] py-10 px-5 bg-white text-black shadow rounded-lg'>
                {recipe.recipe_name}
                <div>
                    <h3 className='text-xl font-[seoul-metro]'>빵 선택</h3>
                    <ul className='p-2'>
                        <section className='flex flex-row overflow-hidden flex-wrap'>{ingredients.map((item) =>
                            <img src={'/images/sandwich_menu/ingredients/' + item + '.jpg'} key={item} className='object-cover w-12 aspect-square rounded-md' alt={item}></img>
                        )}</section>
                    </ul>
                </div>
            </article>
        </div>
    );
};

export default CardModal;