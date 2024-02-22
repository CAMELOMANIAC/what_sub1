import React, { useRef, useEffect, useState } from 'react';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCard';
import RecipesBanner from '../components/RecipesBanner';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { recipeType } from '../interfaces/api/recipes';
import { totalMenuInfoType } from '../interfaces/api/menus';
import Head from 'next/head';
import { useInfiniteQuery } from 'react-query';

export async function getServerSideProps() {
    //보여줄 레시피 가져오기
    const loadRecommendRecipes = async () => {
        const result = await fetch(`${process.env.URL}/api/recipes/recommended`);
        return result.json();
    }
    const loadRecommendMenus = async () => {
        const result = await fetch(`${process.env.URL}/api/menus/recommended`);
        return result.json();
    }

    return {
        props: {
            recipeData: await loadRecommendRecipes(),
            menuData: await loadRecommendMenus()
        },
    };
}

type propsType = {
    recipeData: recipeType[],
    menuData: totalMenuInfoType[],
}

const Recipes = ({ recipeData, menuData }: propsType) => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<recipeType[]>([]);
    const [sorting, setSorting] = useState<string>('최신순');
    const filter: string[] = useSelector((state: RootState) => state.page.FILTER_ARRAY);
    const [endRecipe, setEndRecipe] = useState<boolean>(false);

    //api 통신을 위해 필요한 값들
    const filterQuery = filter.join('&filter=')

    const recipeQuery = useInfiniteQuery(['recipes', router.query.query, router.query.param, 0, 9, 3, filterQuery, sorting],
        async ({ queryKey, pageParam = 0 }) => {
            const [_key, query, param, offset, limit, dynamicLimit, filter, sorting] = queryKey;//eslint-disable-line
            console.log(dynamicLimit)
            const response = await fetch(query || param ? '/api/recipes/' + encodeURIComponent(String(param ? param : query)) + `?offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? (param ? (Number(limit) - 1) : limit) : dynamicLimit}&filter=${param ? ['메뉴이름'] : filter}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`
                : `/api/recipes?offset=${pageParam === 0 ? offset : pageParam}&limit=${pageParam === 0 ? limit : dynamicLimit}&filter=${filter}&sort=${sorting === '최신순' ? 'recipe_id' : 'like_count'}`)
            if (response.status === 200)
                return response.json();
            else if (response.status === 204) {
                setEndRecipe(true);
                return [];
            }
            else throw new Error((response.status).toString())
        }, {
        getNextPageParam: (_lastPage, allPages) => allPages.flat().length,
        onSuccess: (data) => {
            setRecipes(data.pages.flat())
        },
        staleTime: 1000 * 60 * 1,
        enabled: false
    })

    //초기 레시피 불러오기
    useEffect(() => {
        recipeQuery.refetch();
    }, [router.isReady])//eslint-disable-line
    //레시피 초기화
    useEffect(() => {
        recipeQuery.refetch();
        setEndRecipe(false);
    }, [sorting, router.query]);//eslint-disable-line

    const scrollAnchor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !endRecipe) {
                recipeQuery.fetchNextPage();
            }
        }, { threshold: 0.9 });

        if (scrollAnchor.current) {
            observer.observe(scrollAnchor.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [endRecipe])//eslint-disable-line

    return (
        <>
            <Head>
                <title>WhatSub : 레시피</title>
                <meta name="description" content="서브웨이 조합법을 검색해서 찾아보고 각 조합 재료를 비교하면서 영양정보, 그리고 맛과 관련한 의견을 나눠보세요" />
            </Head>
            <RecipesBanner recipeData={recipeData} menuData={menuData} sorting={sorting} setSorting={setSorting} />
            <main className={'w-full max-w-screen-lg mx-auto p-2'}>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-flow-row gap-2 max-w-[1024px]'>
                    {typeof router.query.param === 'string' && <EmptyCard></EmptyCard>}
                    {recipes.map((recipe, index) => (
                        <Card key={index} recipe={recipe}></Card>
                    ))}
                    <div className='col-span-2 md:col-span-4 lg:col-span-6 h-[290px] flex justify-center items-center' ref={scrollAnchor}>
                        {endRecipe ?
                            <>
                                레시피를 모두 읽었어요
                            </>
                            : <>
                                {recipeQuery.hasNextPage && '스크롤을 내려서 더 읽어 볼까요?'}
                                {recipeQuery.isLoading || recipeQuery.isFetching && '레시피를 불러오고 있어요'}
                                {recipeQuery.isError && '레시피 불러오는 중에 문제가 발생했어요'}
                            </>
                        }
                    </div>
                </div>
            </main>
        </>
    );
};

export default Recipes;