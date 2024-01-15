import React from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import { breadNutrientArray, cheeseNutrientArray, menuNutrientArray, sauceNutrientArray } from '../../utils/menuArray';
import { styled } from 'styled-components';

type imgProps = {
    image: string
}
const ImgDiv = styled.div<imgProps>`
    background:linear-gradient(rgba(0, 0, 0, 0) 10%, white 70%),
     url(${props => props.image});
    width: 570px;
    height: 400px;
`
type props = {
    recipe: recipeType,
    page: number,
    className: string
}

const IngredientsPage = ({ recipe, page, className }: props) => {
    //재료에 맞게 재분류
    const ingredientsArray = recipe.recipe_ingredients.split(',');
    const param = menuNutrientArray.find((item) => item.name === recipe.sandwich_table_sandwich_name)?.name
    const addMeat = menuNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const bread = breadNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const cheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const addCheese = cheeseNutrientArray.find(item => ingredientsArray.includes(item.name))?.name;
    const sauce = sauceNutrientArray.filter(item => ingredientsArray.includes(item.name)).map((item) => item.name);

    const Img = () => {
        switch (page) {
            case 1: return <ImgDiv className='' image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>{bread}</ImgDiv>;
            case 2: return <ImgDiv className='' image={'/images/sandwich_menu/ingredients/' + cheese + '.jpg'}>{cheese}</ImgDiv>;
            case 3: return <ImgDiv className='' image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>{bread}</ImgDiv>;
            case 4: return <ImgDiv className='' image={'/images/sandwich_menu/ingredients/' + sauce + '.jpg'}>{sauce}</ImgDiv>;
            case 5: return sauce.map((item) =>
                <React.Fragment key={item}>
                    <ImgDiv image={'/images/sandwich_menu/ingredients/' + item + '.jpg'}>{item}</ImgDiv>
                </React.Fragment>);
            default: return <ImgDiv className='' image={'/images/sandwich_menu/ingredients/' + bread + '.jpg'}>{bread}</ImgDiv>;
        }
    }

    return (
        <div className={className}>
            <Img/>
        </div>
    );
};

export default IngredientsPage;