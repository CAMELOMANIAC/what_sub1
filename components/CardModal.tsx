import React from 'react';
import { recipeType } from '../interfaces/api/recipes';
import Link from 'next/link';
import { GrClose } from "react-icons/gr";
import IngredientsRadarChart from './IngredientRadarChart';
import { breadNutrientArray, cheeseNutrientArray, sauceNutrientArray, menuNutrientArray } from "../utils/menuArray"
import { TbAlertCircle } from 'react-icons/tb';

type props = {
    recipe: recipeType,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    ingredients: string[]
}
const CardModal = ({ recipe, setIsActive, ingredients }: props) => {

    const ingredientsArray = recipe.recipe_ingredients.split(',');
    //재료에 맞게 재분류
    const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const cheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addCheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);

    const response = fetch(`/api/recipes/reply?recipeId=${recipe.recipe_id}`);

    return (
        <div className='fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10'
            onClick={(e) => { if (e.target === e.currentTarget) setIsActive(false) }}>
            <article className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1024px] bg-white text-black shadow rounded-lg p-5'>
                <div className='grid grid-cols-6 gap-4'>
                    <nav className='col-span-2 border-r-2'>
                        <ul>
                            <li>소개</li>
                            <li>빵</li>
                            <li>치즈</li>
                            <li>토스팅</li>
                            <li>채소</li>
                            <li>소스</li>
                        </ul>
                    </nav>
                    <div className='col-span-4'>
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
                                            <GrClose className='absolute right-5 top-5' />
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
                                <IngredientsRadarChart context={{
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
                            <section>
                                댓글
                            </section>

                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default CardModal;