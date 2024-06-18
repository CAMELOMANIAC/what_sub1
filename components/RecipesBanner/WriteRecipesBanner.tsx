import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useQuery} from 'react-query';
import {userRecipeLikeTopDataType} from '../../interfaces/api/recipes';
import {userMenuWriteTopData} from '../../interfaces/api/menus';
import Link from 'next/link';
import {MdOutlineArrowForward} from 'react-icons/md';
import RecipesBannerContainer from './RecipesBannerContainer';
const WriteRecipesBanner = () => {
	const user = useSelector((state: RootState) => state.user);
	const [menuWriteTop, setMenuWriteTop] = React.useState<
		userMenuWriteTopData[]
	>([]);
	const [recipeLikeTop, setRecipeLikeTop] = React.useState<
		userRecipeLikeTopDataType[]
	>([]);
	const [recipeCount, setRecipeCount] = React.useState<number>(0);
	const [recipeLikeCount, setRecipeLikeCount] = React.useState<number>(0);

	const {data: userRecipeCountData} = useQuery(
		'userRecipeCount',
		async () => {
			const response = await fetch('/api/users/recipes/count');
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('실패');
			}
		},
	);

	useEffect(() => {
		if (userRecipeCountData) {
			setRecipeCount(userRecipeCountData[0].count);
		}
	}, [userRecipeCountData]);

	const {data: userRecipeLikeCount} = useQuery(
		'userRecipeLikeCount',
		async () => {
			const response = await fetch('/api/users/recipes/like/count');
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('실패');
			}
		},
	);

	useEffect(() => {
		if (userRecipeLikeCount) {
			setRecipeLikeCount(userRecipeLikeCount[0].like_count);
		}
	}, [userRecipeLikeCount]);

	const {data: userMenuWriteTopData} = useQuery(
		'userMenuWriteTop',
		async () => {
			const response = await fetch('/api/users/menus');
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('실패');
			}
		},
	);

	useEffect(() => {
		if (userMenuWriteTopData) {
			setMenuWriteTop(userMenuWriteTopData);
		}
	}, [userMenuWriteTopData]);

	const {data: userRecipeLikeTop} = useQuery(
		'userRecipeLikeTop',
		async () => {
			const response = await fetch('/api/users/recipes/popular');
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('실패');
			}
		},
	);
	useEffect(() => {
		if (userRecipeLikeTop) {
			setRecipeLikeTop(userRecipeLikeTop);
		}
	}, [userRecipeLikeTop]);

	return (
		<RecipesBannerContainer>
			<section className="flex flex-col pb-5 pl-4 border-l">
				<h1 className="font-bold text-3xl inline text-black pb-4">
					{user.userName}님의 작성 레시피
				</h1>
				<div className="whitespace-pre-line">
					<div className="flex flex-row text-sm m-2">
						<div className="w-40 px-3">
							<div className="text-gray-500">
								레시피 작성 갯수
							</div>
							<div className="font-bold">{recipeCount}</div>
						</div>
						<div className="border-l w-40 px-3">
							<div className="text-gray-500">
								받은 좋아요 갯수
							</div>
							<div className="font-bold">{recipeLikeCount}</div>
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row max-h-0 sm:max-h-[1000px] transition-all duration-500 ease-in-out overflow-hidden">
				<article className="md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3">
					<span className=" font-bold">주요 메뉴 top3</span>
					<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
						<span className="col-span-5 text-left">레시피</span>
						<span className="col-span-2">좋아요</span>
						<span className="col-span-2">보러가기</span>
					</div>
					{Array.isArray(menuWriteTop) &&
						menuWriteTop.map((item, index) => (
							<div
								key={index}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2">
								<span className="col-span-5 flex items-center justify-start text-black font-bold">
									{index + 1}
									{' ' + item.sandwich_table_sandwich_name}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									{item.count}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									<Link
										href={`/Recipes?param=${item.sandwich_table_sandwich_name}`}>
										<MdOutlineArrowForward />
									</Link>
								</span>
							</div>
						))}
				</article>
				<article className="md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0">
					<span className=" font-bold">인기 레시피 top3</span>
					<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
						<span className="col-span-5 text-left">레시피</span>
						<span className="col-span-2">좋아요</span>
						<span className="col-span-2">보러가기</span>
					</div>
					{Array.isArray(recipeLikeTop) &&
						recipeLikeTop.map((item, index) => (
							<div
								key={index}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2">
								<span className="col-span-5 flex items-center justify-start text-black font-bold">
									{index + 1}
									{' ' + item.recipe_name}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									{item.like_count}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									<Link
										href={`/Recipes?query=${item.recipe_name}`}>
										<MdOutlineArrowForward />
									</Link>
								</span>
							</div>
						))}
				</article>
			</section>
		</RecipesBannerContainer>
	);
};

export default WriteRecipesBanner;
