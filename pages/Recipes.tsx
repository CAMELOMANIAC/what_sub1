import React, { useRef, useEffect } from 'react';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCard';
import RecipesBanner from '../components/RecipesBanner';

const Recipes = () => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    //배너랑 글로벌네비 높이 여백계산
    useEffect(() => {
        if (bannerRef.current) {
            if (mainRef.current) {
                mainRef.current.style.marginTop = bannerRef.current.offsetHeight + 50 + 'px';
                console.log(mainRef.current.style.marginTop);
            }
        }
    }, [bannerRef.current]);


    useEffect(() => {
        //클라이언트에서 서버로 값을 보낼때 한글은 인코딩해야함
        //node.js서버에서는 쿼리값이 자동으로 디코딩되서 디코딩함수안써도됨
        fetch('/api/loadRecipes?query=' + encodeURIComponent('ㅁㄴㅇㅁㄴㅇㅁㄹ')+'&offset=0&limit=6')
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('에러 발생:', error);
            });
    }, []);

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
                    <EmptyCard></EmptyCard>
                    {}
                </div>
            </main>
        </>
    );
};

export default Recipes;