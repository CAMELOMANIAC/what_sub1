import React from 'react';
import {TbAlertCircle} from 'react-icons/tb';
import {
	breadNutrientArray,
	cheeseNutrientArray,
	menuNutrientArray,
	sauceNutrientArray,
} from '../../../utils/menuArray';
//import { MemoizedChart } from "../IngredientRadarChart";
import dynamic from 'next/dynamic';
import {recipeType} from '../../../interfaces/api/recipes';
const IngredientsRadarChart = dynamic(
	() => import('../../IngredientRadarChart'),
	{
		loading: () => <div>차트를 불러오고 있습니다</div>,
		ssr: false,
	},
);

type props = {
	recipe: recipeType;
	className?: string;
};

const ChartSection = ({recipe, className}: props) => {
	const ingredientsArray = recipe.recipe_ingredients.split(',');
	const param = menuNutrientArray.find(
		item => item.name === recipe.sandwich_table_sandwich_name,
	)?.name;
	const addMeat = menuNutrientArray.find(item =>
		ingredientsArray.includes(item.name),
	)?.name;
	const bread = breadNutrientArray.find(item =>
		ingredientsArray.includes(item.name),
	)?.name;
	const cheese = cheeseNutrientArray.find(item =>
		ingredientsArray.includes(item.name),
	)?.name;
	const addCheese = cheeseNutrientArray.find(item =>
		ingredientsArray.includes(item.name),
	)?.name;
	const sauce = sauceNutrientArray
		.filter(item => ingredientsArray.includes(item.name))
		.map(item => item.name);

	return (
		<section className={className}>
			<h3 className="text-gray-500 group z-10 h-full">
				<TbAlertCircle />
				<div className="absolute w-80 bg-gray-200 p-1 rounded text-xs invisible group-hover:visible whitespace-pre-line z-10">
					{'일일섭취권장량은 2000kcal를 기준으로 작성되었습니다\n샌드위치 재료의 영양성분은 23.10.5 기준 서브웨이 홈페이지 제공 내용입니다.' +
						'\n신선채소의 영양성분은 주메뉴에 포함되어 있습니다\n절임채소, 추가재료는 정보가 제공되지 않아 포함되지 않습니다\n후추,소금 정보가 제공되지 않아 포함되지 않습니다' +
						'\n메뉴 이름에 치즈가 포함된 재료는 이미 치즈의 영양성분이 포함되어 있으나\n 관련 정보가 제공되지 않아 치즈 영양정보가 중복해서 포함될 수 있습니다'}
				</div>
			</h3>
			<IngredientsRadarChart
				context={{
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
					addIngredient: [],
				}}
			/>
		</section>
	);
};

export default ChartSection;
