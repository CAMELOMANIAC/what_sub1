import React, {useEffect, useState} from 'react';
import {menuArray, menuArrayType} from '../utils/menuArray';
import Image from 'next/image';

type propsType = {
	setSelected: React.Dispatch<React.SetStateAction<menuArrayType>>;
};
const MenusList = ({setSelected}: propsType) => {
	//정렬
	const [order, setOrder] = useState('favorit');
	const arrayTemplate: {
		name: string;
		favorit: string;
		recipes: string;
		likeRecipe: string;
		matches: string;
	} = {
		name: '메뉴 이름',
		favorit: '메뉴 좋아요',
		recipes: '레시피 수',
		likeRecipe: '레시피 좋아요',
		matches: '더 하면 좋은 재료',
	};
	const orderChangeFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
		const id = e.currentTarget.id;
		setOrder(prevOrder => {
			if (id === 'favorit' && prevOrder === 'favorit') {
				return 'reverseFavorit';
			} else if (id === 'favorit' && prevOrder === 'reverseFavorit') {
				return 'favorit';
			}
			return 'favorit';
		});
	};

	const orderChangeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
		const id = e.currentTarget.id;
		setOrder(prevOrder => {
			if (id === 'recipes' && prevOrder === 'recipes') {
				return 'reverseRecipes';
			} else if (id === 'recipes' && prevOrder === 'reverseRecipes') {
				return 'recipes';
			}
			return 'recipes';
		});
	};

	const orderChangeLikeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
		const id = e.currentTarget.id;
		setOrder(prevOrder => {
			if (id === 'likeRecipe' && prevOrder === 'likeRecipe') {
				return 'reverselikeRecipe';
			} else if (
				id === 'likeRecipe' &&
				prevOrder === 'reverselikeRecipe'
			) {
				return 'likeRecipe';
			}
			return 'likeRecipe';
		});
	};

	//얕은검사는 배열의 순서가 바껴도 인식하지 못함으로 배열을 복사해서 정렬해야함
	const [sortedArray, setSortedArray] = useState<menuArrayType[]>([
		...menuArray,
	]);

	useEffect(() => {
		const sorted = [...menuArray];

		switch (order) {
			case 'favorit':
				sorted.sort((a, b) => b.favorit - a.favorit);
				break;
			case 'reverseFavorit':
				sorted.sort((a, b) => a.favorit - b.favorit);
				break;
			case 'recipes':
				sorted.sort((a, b) => b.recipes - a.recipes);
				break;
			case 'reverseRecipes':
				sorted.sort((a, b) => a.recipes - b.recipes);
				break;
			case 'likeRecipe':
				sorted.sort((a, b) => b.likeRecipe - a.likeRecipe);
				break;
			case 'reverselikeRecipe':
				sorted.sort((a, b) => a.likeRecipe - b.likeRecipe);
				break;
			default:
				break;
		}
		setSortedArray(sorted);
	}, [order]);

	return (
		<div className="col-span-6 md:col-span-4 border bg-white relative w-full divide-y text-sm">
			{/*위쪽 라벨 */}
			<div className="flex items-center bg-slate-100 text-gray-400">
				<span className="inline-block w-[10%] text-center">순위</span>
				<span className="inline-block w-[30%]">
					{arrayTemplate.name}
				</span>
				<span className="inline-block w-10"></span>
				<button
					name="orderFavorit"
					className={
						`inline-block w-[15%] text-center py-1 ` +
						`${order === 'favorit' && ' border-b-4 border-green-600 text-green-600 '}` +
						`${order === 'reverseFavorit' && ' border-t-4 border-yellow-500 text-yellow-500'}`
					}
					id="favorit"
					onClick={orderChangeFavorit}>
					{arrayTemplate.favorit}
				</button>
				<button
					name="orderLikeRecipe"
					className={
						`inline-block w-[15%] text-center py-1 ` +
						`${order === 'likeRecipe' && ' border-b-4 border-green-600 text-green-600 '}` +
						`${order === 'reverselikeRecipe' && ' border-t-4 border-yellow-500 text-yellow-500'}`
					}
					id="likeRecipe"
					onClick={orderChangeLikeRecipes}>
					{arrayTemplate.likeRecipe}
				</button>
				<button
					name='orderRecipesCount'
					className={
						`inline-block w-[15%] text-center py-1 ` +
						`${order === 'recipes' && ' border-b-4 border-green-600 text-green-600 '}` +
						`${order === 'reverseRecipes' && ' border-t-4 border-yellow-500 text-yellow-500'}`
					}
					id="recipes"
					onClick={orderChangeRecipes}>
					{arrayTemplate.recipes}
				</button>
				<span className="inline-block w-[30%] text-center">
					{arrayTemplate.matches}
				</span>
			</div>
			{/*실제 리스트 */}
			{sortedArray?.map((item, index) => (
				<button
					key={index}
					className="flex items-stretch w-full"
					onClick={() => setSelected(item)}>
					<span className="flex justify-center items-center  w-[10%] text-center text-gray-400">
						{index + 1}
					</span>
					<div className="inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1">
						<Image
							width={100}
							height={100}
							src={`/images/sandwich_menu/${item.name}.png`}
							alt={item.name}
							className="relative object-cover scale-[2.7] origin-[85%_40%]"></Image>
					</div>
					<span className="flex justify-start items-center  w-[30%] font-bold pl-2">
						{item.name}
					</span>
					<span
						className={
							`flex justify-center items-center w-[15%] text-center ` +
							`${(order === 'favorit' || order === 'reverseFavorit') && 'bg-gray-100 '}`
						}>
						{item.favorit}
					</span>
					<span
						className={
							`flex justify-center items-center w-[15%] text-center ` +
							`${(order === 'likeRecipe' || order === 'reverselikeRecipe') && 'bg-gray-100 '}`
						}>
						{item.likeRecipe}
					</span>
					<span
						className={
							`flex justify-center items-center w-[15%] text-center ` +
							`${(order === 'recipes' || order === 'reverseRecipes') && 'bg-gray-100 '}`
						}>
						{item.recipes}
					</span>
					<span className="flex justify-center items-center  w-[30%] text-center">
						{item.matches}
					</span>
				</button>
			))}
		</div>
	);
};

export default MenusList;
