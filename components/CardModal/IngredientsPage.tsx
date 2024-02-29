import React from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import { breadNutrientArray, cheeseNutrientArray, menuNutrientArray, ingredientsArray as addIngredientsArray, pickleArray, sauceNutrientArray, vegetableArray } from '../../utils/menuArray';
import { styled } from 'styled-components';
import { TbGrill, TbGrillOff } from 'react-icons/tb';
import { PiProhibitBold } from 'react-icons/pi';

type imgProps = {
    $image: string
}
const ImgDiv = styled.div<imgProps>`
    background:linear-gradient(rgba(0, 0, 0, 0) 10%, white 100%),     url("${props => props.$image}");
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
`
type props = {
    recipe: recipeType,
    page: number,
    className?: string
}

const IngredientsPage = ({ recipe, page, className }: props) => {
    //재료에 맞게 재분류
    const ingredientsArray = recipe.recipe_ingredients.split(',');
    const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addIngredient = addIngredientsArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const breadSummary = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.summary;
    const cheese = cheeseNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const cheeseSummary = cheeseNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.summary);
    const vegetable = vegetableArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const pickle = pickleArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const sauceSummary = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.summary);
    const isToasting = ingredientsArray.includes('true');

    const Img = () => {
        switch (page) {
            case 1: return (
                <div className='flex flex-col w-full h-full pb-10'>
                    <ImgDiv className='' $image={'/images/sandwich_menu/' + param + '.png'}>
                        <div className='flex flex-col justify-end w-full h-full pl-10'>
                            <p className='text-lg font-bold'>{param}</p>
                        </div>
                    </ImgDiv>
                    {addMeat?.length && <ImgDiv className='' $image={'/images/sandwich_menu/' + addMeat + '.png'}>
                        <div className='flex flex-col justify-end w-full h-full pl-10'>
                            <p className='text-lg font-bold'>{addMeat} 추가</p>
                        </div>
                    </ImgDiv>}
                    {addIngredient && addIngredient.map((item) => {
                        return (
                            <ImgDiv key={item} className='' $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>
                                <div className='flex flex-col justify-end w-full h-full pl-10'>
                                    <p className='text-lg font-bold'>{item}</p>
                                </div>
                            </ImgDiv>
                        )
                    })}
                </div>
            );
            case 2: return (
                <div className='h-full pb-10'>
                    <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>
                        <div className='flex flex-col justify-end w-full h-full pl-10'>
                            <p className='text-lg font-bold'>{bread}</p>
                            <p className=''>{breadSummary}</p>
                        </div>
                    </ImgDiv>
                </div>)
            case 3: return (
                <div className='flex flex-col h-full pb-10'>
                    {(cheese.length === 0) &&
                        <div className='mx-auto my-auto'>
                            <PiProhibitBold className='object-cover w-[70px] h-[70px] rounded-md text-gray-300 mx-auto my-auto' />
                            <p>치즈를 사용하지 않는 레시피에요</p>
                        </div>
                    }
                    {cheese.map((item, index) => {
                        return (
                            <ImgDiv key={item} className='' $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>
                                <div className='flex flex-col justify-end w-full h-full pl-10'>
                                    <p className='text-lg font-bold'>{item}</p>
                                    <p className=''>{cheeseSummary[index]}</p>
                                </div>
                            </ImgDiv>
                        )
                    })}
                </div>
            );
            case 4: return (
                <div className='flex flex-col h-full pb-10'>
                    {isToasting ?
                        <div className='mx-auto my-auto'>
                            <TbGrill className='object-cover w-[70px] h-[70px] rounded-md text-green-600 mx-auto my-auto' />
                            <p>토스팅을 해주세요</p>
                        </div>
                        :
                        <div className='mx-auto my-auto'>
                            <TbGrillOff className='object-cover w-[70px] h-[70px] rounded-md text-gray-300 mx-auto my-auto' />
                            <p>토스팅을 하지 않는 레시피에요</p>
                        </div>
                    }
                </div>
            );
            case 5: return (
                <div className='flex flex-col w-full h-full pb-10'>
                    {(vegetable.length + pickle.length === 0) &&
                        <div className='mx-auto my-auto'>
                            <PiProhibitBold className='object-cover w-[70px] h-[70px] rounded-md text-gray-300 mx-auto my-auto' />
                            <p>채소를 사용하지 않는 레시피에요</p>
                        </div>
                    }
                    {vegetable.map((item) => {
                        return (
                            <ImgDiv key={item} className='' $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>
                                <div className='flex flex-col justify-end w-full h-full pl-10'>
                                    <p className='text-lg font-bold'>{item}</p>
                                </div>
                            </ImgDiv>
                        )
                    })}
                    {pickle.map((item) => {
                        return (
                            <ImgDiv key={item} className='' $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>
                                <div className='flex flex-col justify-end w-full h-full pl-10'>
                                    <p className='text-lg font-bold'>{item}</p>
                                </div>
                            </ImgDiv>
                        )
                    })}
                </div>
            );
            case 6: return (
                <div className='flex flex-col h-full pb-10'>
                    {(sauce.length + pickle.length === 0) &&
                        <div className='mx-auto my-auto'>
                            <PiProhibitBold className='object-cover w-[70px] h-[70px] rounded-md text-gray-300 mx-auto my-auto' />
                            <p>소스를 사용하지 않는 레시피에요</p>
                        </div>
                    }
                    {sauce.map((item, index) => {
                        return (
                            <ImgDiv key={item} className='' $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>
                                <div className='flex flex-col justify-end w-full h-full pl-10'>
                                    <p className='text-lg font-bold'>{item}</p>
                                    <p className=''>{sauceSummary[index]}</p>
                                </div>
                            </ImgDiv>
                        )
                    })}
                </div>
            );
            default: return <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>{bread}</ImgDiv>;
        }
    }

    return (
        <div className={className}>
            <Img />
        </div>
    );
};

export default IngredientsPage;