import React, { useRef, useEffect, useState } from 'react';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCard';
import RecipesBanner from '../components/RecipesBanner';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { actionSetMenuLike, actionSetRecipeLike } from '../redux/reducer/userReducer';
import { getCookieValue, loadMenuLike, loadRecipeLike } from '../utils/publicFunction';
import { RootState } from '../redux/store';
import styled from 'styled-components';
import { recipeType } from '../interfaces/api/recipes';
import { totalMenuInfoType } from '../interfaces/api/menus';

type loadingType = {
    pending: number,
    fullfiled: number,
    error: number,
    end: number
}
const loadingState: loadingType = {
    pending: 0,
    fullfiled: 1,
    error: -1,
    end: -2
}
const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 200px;
    background-color: #fff;
`
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
    const filter = useSelector((state: RootState) => state.page.FILTER_ARRAY);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<number>(loadingState.fullfiled);
    const disptach = useDispatch();

    //새로고침시 좋아요 정보 불러오는용
    useEffect(() => {
        if (getCookieValue('user').length > 0) {//로그인 정보가 있을경우
            loadRecipeLike().then(data => {//레시피 좋아요 정보 가져와서 전역 상태값에 저장
                disptach(actionSetRecipeLike(data))
            })

            loadMenuLike().then(data => {//메뉴 좋아요 정보 가져와서 전역 상태값에 저장
                disptach(actionSetMenuLike(data))
            })
        }
    }, [])

    const searchHandler = (limit: number) => {
        if (router.query) {
            if (router.query.query) {//쿼리로 검색
                if (typeof router.query.query === 'string') {
                    getRecipes(router.query.query, page, limit, filterQuery)
                }
            } else if (router.query.param) {//파라메터로 검색
                if (typeof router.query.param === 'string') {
                    getRecipes(router.query.param, page, limit - 1, '메뉴이름')
                }
            } else {
                getRecipes('', page, limit, filterQuery)
            }
        }
    }

    // 라우팅-> 초기화-> 파라메터로 api통신-> 스크롤시 추가 api통신 
    const filterQuery = filter.join('&filter=')
    //페이지 로딩후(라우팅 후) 보여줄 레시피 통신
    useEffect(() => {
        setPage(0);
        setRecipes([])//레시피 배열을 비우기
    }, [router]);

    useEffect(() => {
        if (page === 0 && recipes.length === 0) {
            searchHandler(9);
        }
    }, [page, recipes]);

    //recipe카드 통신함수
    const getRecipes = async (query = '', offset = 0, limit = 3, filter = filterQuery) => {
        //레시피 로딩 상태
        setLoading(loadingState.pending)
        //클라이언트에서 서버로 값을 보낼때 한글은 인코딩해야함
        //node.js서버에서는 쿼리값이 자동으로 디코딩되서 디코딩 함수안써도됨
        const fetchRecipes = async () => {
            try {
                const response = await fetch(query !== '' ? '/api/recipes/' + encodeURIComponent(query) + `?offset=${offset}&limit=${limit}&filter=${filter}`
                    : `/api/recipes?offset=${offset}&limit=${limit}&filter=${filter}&sort=${sorting==='최신순'?'recipe_id':'like_count'}`)

                if (response.status === 200) {
                    setLoading(loadingState.fullfiled);

                    const data = await response.json();
                    setRecipes(prev => [...prev, ...data]);
                    setPage(prev => prev + data.length)
                }
                if (response.status === 204) {
                    setLoading(loadingState.end);
                }
                if (response.status === 400) {
                    setLoading(loadingState.error);
                    throw response
                }
            } catch (err) {
                console.log(err)
            }
        }
        await fetchRecipes();
    }

    const lastRecipeRef = useRef<HTMLDivElement | null>(null);

    //무한스크롤
    useEffect(() => {
        console.log(recipes)
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                // 타겟 요소가 화면에 보이는 경우
                if (entry.isIntersecting) {
                    if (loading !== loadingState.end) {
                        searchHandler(3)
                    }
                    observer.unobserve(lastRecipeRef.current);
                }
            });
        };
        // Intersection Observer 인스턴스 생성
        const observer = new IntersectionObserver(callback);
        if (lastRecipeRef.current) {
            observer.observe(lastRecipeRef.current);
        }

        // 컴포넌트가 언마운트될 때 관찰 중지
        return () => {
            if (lastRecipeRef.current) {
                observer.unobserve(lastRecipeRef.current);
            }
        };
    }, [recipes]);

    //레시피 정렬
    useEffect(() => {
        let sortedRecipes;
        if (sorting === '인기순') {
            sortedRecipes = [...recipes].sort((a, b) => parseInt(a.like_count) - parseInt(b.like_count));
        } else {
            sortedRecipes = [...recipes].sort((a, b) => parseInt(a.recipe_id) - parseInt(b.recipe_id));
        }
        setRecipes(sortedRecipes);
        console.log(sorting)
    }, [sorting])
    
    

    return (
        <>
            {/*문제 발동상황 : 컴포넌트가 (내가보기엔)정상적으로 렌더링됬는데 하이드레이션 오류발생
            발생 : 부모에서 조건부렌더링할때 {router.isReady && <RecipesBanner ref={bannerRef}/>} 이렇게했을때
            원인추측 : 개발자모드에서 중단점으로 확인했는데 요소를 두번 실행함 아마 부모요소에서 조건으로 Router.isReady를 확인해서 렌더링하고
            자식요소에서 다시 확인해서 렌더링 하도록 했는데 부모가 렌더링을 안했는데 임포트된 리액트js가 자식껄 한번더 확인하니까 
            첫번째 실행에서는 정상적으로 렌더링하고 두번째 실행에서 하이드레이션 오류가 발생한듯*/}
            <RecipesBanner recipeData={recipeData} menuData={menuData} setSorting={setSorting} />
            <main className={'w-full max-w-screen-lg mx-auto pt-2'}>
                <div className='grid grid-cols-6 grid-flow-row gap-2 min-w-[1024px]'>
                    {typeof router.query.param === 'string' && <EmptyCard></EmptyCard>}
                    {recipes.map((recipe, index) => (
                        <Card key={index} recipe={recipe} ref={lastRecipeRef}></Card>
                    ))}
                    {loading === loadingState.pending && <StyledDiv>레시피를 불러오고 있어요</StyledDiv>}
                    {loading === loadingState.error && <StyledDiv>레시피 불러오는 중에 문제가 발생했어요</StyledDiv>}
                    {loading === loadingState.end && <div className='max-w-5xl h-52 flex justify-center items-center'>레시피를 모두 읽었어요</div>}
                </div>
            </main>
        </>
    );
};

export default Recipes;