import React from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import { breadNutrientArray, cheeseNutrientArray, menuNutrientArray, pickleArray, sauceNutrientArray, vegetableArray } from '../../utils/menuArray';
import { styled } from 'styled-components';

type imgProps = {
    $image: string
}
const ImgDiv = styled.div<imgProps>`
    background:linear-gradient(rgba(0, 0, 0, 0) 10%, white 70%),     url("${props => props.$image}");
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
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const breadSummary = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.summary;
    const cheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addCheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const vegetable = vegetableArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const pickle = pickleArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);

    const Img = () => {
        switch (page) {
            case 1: return (
                <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>
                    <div className='flex flex-col justify-end w-full h-full'>
                        <p className='text-lg font-bold'>{bread}</p>
                        <p className=''>{breadSummary}</p>
                    </div>
                </ImgDiv>)
            case 2: return (
                    <div className='flex flex-row h-full'>
                        {cheese && <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + cheese + '.jpg'}>{cheese}<p>asdasd</p></ImgDiv>}
                        {addCheese && <ImgDiv className='' $image={'/images/sandwich_menu/ingredients/' + addCheese + '.jpg'}>{addCheese + ' 추가'}<p>asdasd</p></ImgDiv>}
                    </div>
            );
            case 3: return <div>토스팅 여부</div>;
            case 4: return (
                <div className=''>
                    {vegetable.map((item) =>
                        <ImgDiv key={item} $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>{item}<p>asdasd</p></ImgDiv>
                    )}
                    {pickle.map((item) =>
                        <ImgDiv key={item} $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>{item}<p>asdasd</p></ImgDiv>
                    )}
                </div>
            );
            case 5: return (
                <div>
                    {sauce.map((item) =>
                        <ImgDiv key={item} $image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>{item}</ImgDiv>
                    )}
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