import React, { useRef, useEffect, useState } from 'react';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCard';
import RecipesBanner from '../components/RecipesBanner';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { actionSetMenuLike, actionSetRecipeLike } from '../redux/reducer/userReducer';
import { getCookieValue, loadMenuLike, loadRecipeLike } from '../utils/publicFunction';
import { RootState } from '../redux/store';
import { recipeType } from './api/recipe';

const Recipes = () => {
    const router = useRouter();
    const bannerRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [recipes, setRecipes] = useState<recipeType[]>([]);
    const [param, setParam] = useState<string | string[]>(router.query.param)
    const [query, setQuery] = useState<string | string[]>(router.query.query)
    const filter = useSelector((state: RootState) => state.page.FILTER_ARRAY)

    const disptach = useDispatch();
    //새로고침시 정보 불러오는용
    useEffect(() => {
        if (getCookieValue('user').length > 0) {//로그인 정보가 있을경우
            loadRecipeLike().then(data => {//레시피 좋아요 정보 가져와서 전역 상태값에 저장
                disptach(actionSetRecipeLike(data))
                console.log(data)
            })

            loadMenuLike().then(data => {//메뉴 좋아요 정보 가져와서 전역 상태값에 저장
                disptach(actionSetMenuLike(data))
                console.log(data)
            })
        }
    }, [])
    //배너랑 글로벌네비 높이 여백계산(router.query가 변경되면 bannerRef의 높이가 변경되므로 의존성배열에 추가함)
    useEffect(() => {
        if (bannerRef.current) {
            if (mainRef.current) {
                mainRef.current.style.marginTop = bannerRef.current.offsetHeight + 50 + 'px';
            }
        }
    }, [bannerRef.current && bannerRef.current.offsetHeight]);

    const filterQuery = filter.join('&filter=')
    //보여줄 레시피불러오기
    useEffect(() => {
        //query 쿼리스트링은 검색어
        setQuery(router.query.query)
        //param 쿼리스트링은 배너 간단 정보
        setParam(router.query.param)

        if (Object.keys(router.query).length !== 0) {
            console.log(router.query)
            if (query) {
                getRecipes(String(query), 0, 9, filterQuery)
            } if (param) {
                getRecipes(String(param), 0, 8, ['메뉴이름'])
            }
        } else {
            getRecipes('', 0, 9, filterQuery)
        }

    }, [router.query, query, param]);

    //recipe카드 통신함수
    const getRecipes = (query = '', offset = 0, limit = 3, filter = filterQuery) => {
        //클라이언트에서 서버로 값을 보낼때 한글은 인코딩해야함
        //node.js서버에서는 쿼리값이 자동으로 디코딩되서 디코딩함수안써도됨
        fetch('/api/recipe?query=' + encodeURIComponent(query) + `&offset=${offset}&limit=${limit}&filter=${filter}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('서버 응답:', data);
                setRecipes(data);
            })
            .catch(error => {
                console.error('에러 발생:', error);
            });
    }

    return (
        <>
            {/*문제 발동상황 : 컴포넌트가 (내가보기엔)정상적으로 렌더링됬는데 하이드레이션 오류발생
            발생 : 부모에서 조건부렌더링할때 {router.isReady && <RecipesBanner ref={bannerRef}/>} 이렇게했을때
            원인추측 : 개발자모드에서 중단점으로 확인했는데 요소를 두번 실행함 아마 부모요소에서 조건으로 Router.isReady를 확인해서 렌더링하고
            자식요소에서 다시 확인해서 렌더링 하도록 했는데 부모가 렌더링을 안했는데 임포트된 리액트js가 자식껄 한번더 확인하니까 
            첫번째 실행에서는 정상적으로 렌더링하고 두번째 실행에서 하이드레이션 오류가 발생한듯*/}
            <RecipesBanner ref={bannerRef} />
            <main className={'w-full max-w-screen-lg mx-auto pt-2'} ref={mainRef}>
                <div className='grid grid-cols-6 grid-flow-row gap-2 w-[1024px]'>
                    {query !== '' && param && <EmptyCard></EmptyCard>}
                    {recipes.map((recipe, index) => (
                        <Card key={index} recipe={recipe}></Card>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Recipes;