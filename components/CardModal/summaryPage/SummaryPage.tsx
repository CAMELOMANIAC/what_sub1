import React from 'react';
import {recipeType} from '../../../interfaces/api/recipes';
import {PiHeartStraight, PiHeartStraightFill} from 'react-icons/pi';
import {useRecipeLike} from '../../../utils/recipesLikeHook';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useMutation} from 'react-query';
import Image from 'next/image';
import ReplySection from './ReplySection';
import ChartSection from './ChartSection';
import {menuNutrientArray} from '../../../utils/menuArray';

type props = {
	recipe: recipeType;
	className?: string;
	refetch?: () => void;
	setIsLoaded?: () => void;
};

const SummaryPage = ({recipe, className, refetch, setIsLoaded}: props) => {
	//재료에 맞게 재분류
	const ingredientsArray = recipe.recipe_ingredients.split(',');
	const {likeCount, recipeLikeHandler} = useRecipeLike(recipe);
	const likeRecipe: string[] = useSelector(
		(state: RootState) => state.user.recipeLikeArray,
	);

	//로그인 여부 체크
	const userName = useSelector((state: RootState) => state.user.userName);
	//레시피 삭제 요청 뮤테이션
	const recipeDeleteMutation = useMutation(
		async ({recipeId}: {recipeId: string}) => {
			const response = await fetch(`/api/recipes/${recipeId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
			});
			if (!response.ok) {
				throw new Error('레시피 삭제에 실패 했습니다.');
			}
		},
		{
			onSuccess: () => {
				alert('레시피 삭제 성공');
				refetch && refetch();
				setIsLoaded && setIsLoaded();
			},
			onError: error => {
				alert('잠시후 다시 시도해주세요' + error);
			},
		},
	);

	//레시피 삭제 여부 이중 확인
	const recipeDeleteHandler = () => {
		if (confirm('정말 삭제하시겠습니까?')) {
			recipeDeleteMutation.mutate({recipeId: recipe.recipe_id});
		}
	};

	return (
		<div className={className}>
			<div className="grid grid-cols-2 sm:grid-rows-3 grid-rows-5 overflow-y-auto max-h-[32rem] overflow-x-hidden">
				<section className="sm:col-span-1 col-span-2 sm:row-span-2 row-span-2 h-fit">
					<div className="flex flex-row overflow-hidden flex-wrap items-center h-fit">
						{ingredientsArray.map(
							item =>
								(item !== 'true'
									? item !== 'false'
									: false) && (
									<Image
										width={70}
										height={70}
										src={
											menuNutrientArray.some(
												someItem =>
													item === someItem.name,
											)
												? '/images/sandwich_menu/' +
													item +
													'.png'
												: '/images/sandwich_menu/ingredients/' +
													item +
													'.jpg'
										}
										key={item}
										className="object-cover w-12 aspect-square rounded-md"
										alt={item}></Image>
								),
						)}
					</div>
					<div className="flex flex-row justify-end mt-auto text-gray-400">
						<div className="mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28">
							{recipe.user_table_user_id}
							<button
								className={`ml-2 text-red-600 ${userName === recipe.user_table_user_id ? 'inline-block' : 'hidden'}`}
								onClick={recipeDeleteHandler}>
								레시피 삭제
							</button>
						</div>
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
				</section>
				<ChartSection
					recipe={recipe}
					className="flex flex-row justify-center sm:col-span-1 col-span-2 sm:row-span-2 row-span-2 items-center"
				/>
				<ReplySection
					recipe={recipe}
					className="col-span-2 row-span-1"
					userName={userName}
				/>
			</div>
		</div>
	);
};

export default SummaryPage;
