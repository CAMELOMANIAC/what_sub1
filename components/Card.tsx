import {PiHeartStraight, PiHeartStraightFill} from 'react-icons/pi';
import {HiOutlineChatBubbleLeft} from 'react-icons/hi2';
import {TbGrill, TbGrillOff} from 'react-icons/tb';
import Link from 'next/link';
import {forwardRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {recipeType} from '../interfaces/api/recipes';
import CardModal from './CardModal/CardModal';
import {useRecipeLike} from '../utils/recipesLikeHook';
import {
	breadNutrientArray,
	cheeseNutrientArray,
	ingredientsArray,
	menuNutrientArray,
	pickleArray,
	sauceNutrientArray,
	vegetableArray,
} from '../utils/menuArray';
import Image from 'next/image';

type CardProps = {
	recipe: recipeType;
	className?: string;
	refetch?: () => void;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
	({recipe, className, refetch}, ref) => {
		const {likeCount, recipeLikeHandler} = useRecipeLike(recipe);
		const recipeTag: string[] = [];
		const likeRecipe: string[] = useSelector(
			(state: RootState) => state.user.recipeLikeArray,
		);
		const visibleItem: string[] = useSelector(
			(state: RootState) => state.page.VISIBLE_ARRAY,
		);
		const [isActive, setIsActive] = useState<boolean>(false);

		if (recipe.tag) {
			const tag = recipe.tag.split(',');
			recipeTag.push(...tag);
		}
		let ingredients: string[] = [];
		if (recipe.recipe_ingredients) {
			const ingredient = recipe.recipe_ingredients.split(',');
			const meatIngredients: string[] = [];
			const breadIngredients: string[] = [];
			const cheeseIngredients: string[] = [];
			const vegetableIngredients: string[] = [];
			const sauceIngredients: string[] = [];
			ingredient.forEach(item => {
				if (visibleItem.includes('미트')) {
					const itemName = menuNutrientArray.find(
						meat => meat.name === item,
					)?.name;
					if (itemName) meatIngredients.push(itemName);
					if (item.includes('재료'))
						ingredientsArray
							.filter(meat => meat.name.includes(item))
							.forEach(item => meatIngredients.push(item.name));
				}
				if (visibleItem.includes('빵')) {
					const itemName = breadNutrientArray.find(
						bread => bread.name === item,
					)?.name;
					if (itemName) breadIngredients.push(itemName);
				}
				if (visibleItem.includes('치즈')) {
					cheeseNutrientArray
						.filter(cheese => cheese.name === item)
						.forEach(item => cheeseIngredients.push(item.name));
				}
				if (visibleItem.includes('채소')) {
					vegetableArray
						.filter(vegetable => vegetable.name === item)
						.forEach(item => vegetableIngredients.push(item.name));
					pickleArray
						.filter(vegetable => vegetable.name === item)
						.forEach(item => vegetableIngredients.push(item.name));
				}
				if (visibleItem.includes('소스')) {
					sauceNutrientArray
						.filter(vegetable => vegetable.name === item)
						.forEach(item => sauceIngredients.push(item.name));
				}
			});

			ingredients = [
				...meatIngredients,
				...breadIngredients,
				...cheeseIngredients,
				...vegetableIngredients,
				...sauceIngredients,
			];
			if (visibleItem.includes('토스팅')) {
				if (ingredient.includes('true')) ingredients.push('true');
				else ingredients.push('false');
			}
		}

		return (
			<>
				<article
					className={`col-span-2 sm:aspect-[8/3] md:aspect-[8/7] bg-white border hover:border rounded-xl p-6 shadow-md hover:shadow-xl cursor-pointer flex flex-col hover:scale-105 transition-transform ${className}`}
					ref={ref}
					onClick={() => {
						setIsActive(true);
					}}>
					<div className="flex flex-row items-center">
						<div className="inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2">
							<Image
								src={`/images/sandwich_menu/${recipe.sandwich_table_sandwich_name}.png`}
								className="relative object-cover scale-[2.7] origin-[85%_40%]"
								alt={recipe.sandwich_table_sandwich_name}
								width={120}
								height={120}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Link
								href={`/Recipes?param=${encodeURIComponent(recipe.sandwich_table_sandwich_name)}`}
								className="text-sm text-gray-400 hover:text-green-600"
								onClick={e => {
									e.stopPropagation();
								}}>
								{recipe.sandwich_table_sandwich_name}
							</Link>
							<h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]">
								{recipe.recipe_name}
							</h2>
						</div>
					</div>
					<div className="flex flex-row justify-end text-sm w-full h-5 mb-2 text-gray-400">
						{recipeTag.map((item, index) => (
							<span
								key={index}
								className={index !== 0 ? 'ml-1' : ''}>
								{'#' + item}
							</span>
						))}
					</div>
					<section className="flex flex-row overflow-hidden flex-wrap h-[140px]">
						{ingredients.map(item =>
							item === 'true' ? (
								<TbGrill
									key={item}
									className="object-cover w-[70px] h-[70px] rounded-md text-gray-300"
								/>
							) : item === 'false' ? (
								<TbGrillOff
									key={item}
									className="object-cover w-[70px] h-[70px] rounded-md text-gray-300"
								/>
							) : (
								<Image
									src={
										menuNutrientArray.some(
											someItem => item === someItem.name,
										)
											? '/images/sandwich_menu/' +
												item +
												'.png'
											: '/images/sandwich_menu/ingredients/' +
												item +
												'.jpg'
									}
									key={item}
									className="object-cover w-[70px] h-[70px] rounded-md"
									alt={item}
									width={120}
									height={120}></Image>
							),
						)}
					</section>
					<div className="flex flex-row justify-end mt-auto text-gray-400">
						<div className="mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28">
							{recipe.user_table_user_id}
						</div>
						<button
							className="flex items-center mr-2"
							onClick={e => {
								e.stopPropagation();
							}}>
							<HiOutlineChatBubbleLeft className="m-1" />
							{recipe.reply_count}
						</button>
						<button
							className="flex items-center mr-2 hover:text-green-600 active:scale-150 transition-transform"
							onClick={e => {
								e.stopPropagation();
								recipeLikeHandler();
							}}>
							{likeRecipe.find(
								item => item == recipe.recipe_id,
							) ? (
								<PiHeartStraightFill className="m-1 text-green-600" />
							) : (
								<PiHeartStraight className="m-1" />
							)}
							{likeCount}
						</button>
					</div>
				</article>
				{isActive && (
					<CardModal
						recipe={recipe}
						setIsActive={setIsActive}
						ingredients={ingredients}
						refetch={refetch}></CardModal>
				)}
			</>
		);
	},
);

Card.displayName = 'Card';
export default Card;
