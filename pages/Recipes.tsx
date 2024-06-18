import React, {useRef, useEffect, useState} from 'react';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCard';
import RecipesBanner from '../components/RecipesBanner/RecipesBanner';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {recipeType} from '../interfaces/api/recipes';
import {totalMenuInfoType} from '../interfaces/api/menus';
import Head from 'next/head';
import {useInfiniteQuery} from 'react-query';
import {MdKeyboardDoubleArrowDown} from 'react-icons/md';
import {LuLoader2} from 'react-icons/lu';
import {useSearchParams} from 'next/navigation';

export async function getServerSideProps() {
	//보여줄 레시피 가져오기
	const loadRecommendRecipes = async () => {
		const result = await fetch(
			`${process.env.URL}/api/recipes/recommended`,
		);
		return result.json();
	};
	const loadRecommendMenus = async () => {
		const result = await fetch(`${process.env.URL}/api/menus/recommended`);
		return result.json();
	};

	return {
		props: {
			recipeData: await loadRecommendRecipes(),
			menuData: await loadRecommendMenus(),
		},
	};
}

type propsType = {
	recipeData: recipeType[];
	menuData: totalMenuInfoType[];
};

const Recipes = ({recipeData, menuData}: propsType) => {
	const router = useRouter();
	const [recipes, setRecipes] = useState<recipeType[]>([]);
	const [sorting, setSorting] = useState<string>('최신순');
	const filter: string[] = useSelector(
		(state: RootState) => state.page.FILTER_ARRAY,
	);
	const [endRecipe, setEndRecipe] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const user = useSelector((state: RootState) => state.user);

	//api 통신을 위해 필요한 값들
	const filterQuery = filter.join('&filter=');
	const {
		refetch,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		isError,
		data: queryData,
	} = useInfiniteQuery(
		[
			Object.keys(router.query),
			router.query.query,
			router.query.param,
			0,
			9,
			3,
			filterQuery,
			sorting,
			searchParams?.has('favorite') ? 'favorite' : 'not-favorite',
		],
		async ({queryKey, pageParam = 0}) => {
			const [
				,
				query,
				param,
				offset,
				limit,
				dynamicLimit,
				filter,
				sorting,
			] = queryKey;
			const response =
				(searchParams?.has('write') &&
					(await fetch(
						'/api/recipes?userId=' +
							encodeURIComponent(String(user.userName)) +
							`&offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? limit : dynamicLimit}&filter=${['작성자']}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`,
					))) ||
				(searchParams?.has('favorite') &&
					(await fetch(
						'/api/recipes?recipeId=' +
							user.recipeLikeArray.join('&recipeId=') +
							`&offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? limit : dynamicLimit}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`,
					))) ||
				(await fetch(
					query || param
						? '/api/recipes?query=' +
								encodeURIComponent(
									String(param ? param : query),
								) +
								`&offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? (param ? Number(limit) - 1 : limit) : dynamicLimit}&filter=${param ? ['메뉴이름'] : filter}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`
						: `/api/recipes?offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? limit : dynamicLimit}&filter=${filter}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`,
				));

			if (response.status === 200) {
				return response.json();
			} else if (response.status === 204) {
				setEndRecipe(true);
				return [];
			} else throw new Error(response.status.toString());
		},
		{
			getNextPageParam: (_lastPage, allPages) => allPages.flat().length,
			staleTime: 1000 * 60 * 1,
			enabled: false,
		},
	);

	useEffect(() => {
		if (queryData) {
			setRecipes(queryData.pages.flat());
		}
	}, [queryData]);

	//초기 레시피 불러오기
	useEffect(() => {
		refetch();
	}, [refetch, router.isReady]);
	//레시피 초기화
	useEffect(() => {
		refetch();
		setEndRecipe(false);
	}, [sorting, router.query, refetch]);

	const scrollAnchor = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !endRecipe) {
					fetchNextPage();
				}
			},
			{threshold: 0.9},
		);

		if (scrollAnchor.current) {
			observer.observe(scrollAnchor.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [endRecipe, fetchNextPage]);

	return (
		<>
			<Head>
				<title>WhatSub : 레시피</title>
				<meta
					name="description"
					content="서브웨이 조합법을 검색해서 찾아보고 각 조합 재료를 비교하면서 영양정보, 그리고 맛과 관련한 의견을 나눠보세요"
				/>
			</Head>
			<RecipesBanner
				recipeData={recipeData}
				menuData={menuData}
				sorting={sorting}
				setSorting={setSorting}
			/>
			<main className={'w-full max-w-screen-lg mx-auto p-2'}>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-flow-row gap-2 max-w-[1024px]">
					{typeof router.query.param === 'string' && (
						<EmptyCard></EmptyCard>
					)}
					{recipes.map((recipe, index) => (
						<Card key={index} recipe={recipe}></Card>
					))}
					<div
						className="col-span-2 md:col-span-4 lg:col-span-6 h-[200px] flex justify-center items-center"
						ref={scrollAnchor}>
						{endRecipe ? (
							<>레시피를 모두 읽었어요</>
						) : (
							<>
								{hasNextPage && (
									<>
										<p>스크롤을 내려서 더 읽어 볼까요?</p>
										<MdKeyboardDoubleArrowDown className="animate-bounce" />
									</>
								)}
								{isLoading ||
									(isFetching && (
										<LuLoader2 className="animate-spin w-10 h-10" />
									))}
								{isError && (
									<>
										<p>
											레시피 불러오는 중에 문제가
											발생했어요
										</p>
										<p>새로고침 후 다시 시도해주세요</p>
									</>
								)}
							</>
						)}
					</div>
				</div>
			</main>
		</>
	);
};

export default Recipes;
