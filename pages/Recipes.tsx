import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../components/Card';
import RecipesBanner from '../components/RecipesBanner';

const Recipes = () => {
    const router = useRouter();
    const bannerRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    //배너랑 글로벌네비 높이 여백계산
    useEffect(() => {
        if (bannerRef.current) {
            if (mainRef.current){
                mainRef.current.style.marginTop = bannerRef.current.offsetHeight + 50 + 'px';
                console.log(mainRef.current.style.marginTop);
            }
        }
        console.log(bannerRef.current)
        console.log(router.isReady);
    }, [router.isReady,bannerRef.current]);

    return (
        <>
            {router.isReady &&<RecipesBanner ref={bannerRef}/>}
            <main className={'w-full max-w-screen-lg mx-auto pt-2'} ref={mainRef}>
                <div className='grid grid-cols-6 grid-flow-row gap-2 w-[1024px]'>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </div>
            </main>
        </>
    );
};

export default Recipes;