import React from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import { breadNutrientArray, cheeseNutrientArray, /*menuNutrientArray,*/ pickleArray, sauceNutrientArray, vegetableArray } from '../../utils/menuArray';
import { styled } from 'styled-components';

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
    // const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    // const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const breadSummary = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.summary;
    const cheese = cheeseNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const cheeseSummary = cheeseNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.summary);
    const vegetable = vegetableArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const pickle = pickleArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const sauceSummary = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.summary);

    const Img = () => {
        switch (page) {
            case 1: return (
                <div className='h-full pb-10'>
                    <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>
                        <div className='flex flex-col justify-end w-full h-full pl-10'>
                            <p className='text-lg font-bold'>{bread}</p>
                            <p className=''>{breadSummary}</p>
                        </div>
                    </ImgDiv>
                </div>)
            case 2: return (
                <div className='flex flex-col h-full pb-10'>
                    {cheese.map((item,index) => {
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
            case 3: return <div>토스팅 여부</div>;
            case 4: return (
                <div className='flex flex-col w-full h-full pb-10'>
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
            case 5: return (
                <div className='flex flex-col h-full pb-10'>
                    {sauce.map((item,index) => {
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