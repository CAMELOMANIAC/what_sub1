import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { menuArray } from './Menus'
import Card from '../components/Card';
import { PiHeartStraight } from 'react-icons/Pi';

const Recipes = () => {
    const router = useRouter();
    const bannerRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    //배너랑 글로벌네비 높이 여백계산
    useEffect(() => {
        if (bannerRef.current) {
            console.log(bannerRef.current)
            console.log(bannerRef.current.offsetHeight)
            if (mainRef.current)
                mainRef.current.style.marginTop = bannerRef.current.offsetHeight + 50 + 'px';
        }
    }, [router.isReady]);

    type MenuItem = {
        name: string;
        image: string;
        ingredients: string[];
    };
    let selected: MenuItem[] = [];
    if (router.isReady) {
        const { param } = router.query;
        selected = menuArray.filter((item) => (item.name == String(param).replaceAll('+', ' ')));//쿼리로 값을 전달할때 뛰어쓰기는 +기호로 치환되므로 적절히 조치해야함
    }
    const recipesTop3: Array<string>[] = [['레드와인식초.jpg', '마요네즈.jpg'], ['레드와인식초.jpg', '마요네즈.jpg'], ['레드와인식초.jpg', '마요네즈.jpg']];
    const breadTop3: string[] = ['레드와인식초.jpg', '마요네즈.jpg', '아보카도.png'];

    return (
        <>
            {//next.js는 서바사이드와 클라이언트사이드의 절충이라서 리액트처럼 새로고침 한다고 파라메터객체가 클라이언트에서 바로 새로고침 되지않고 서버에서 값을 다시 받아야 새로고쳐진다
                //(다른 서버사이드렌더링 프레임워크는 그냥 통째로 정보를 전송하니까 에러가 아니라 그냥 빈화면을 보여주겠지만 next.js는 일단 서버쪽을 제외한 화면을 먼저 보여주려하니까 에러발생)
                //서버가 값을 전달하기 전까지는 일단 param이 비어있는 상태이므로 그 사이에 js는 param 값이 없다고 에러를 띄우게된다. param값을 사용하는 요소들은 값을 받고나서 렌더링 할수있도록 조치해줘야한다
                router.isReady === true && selected.length > 0 &&
                <div className="absolute flex justify-center w-screen min-w-[1024px] right-0 bg-white border-gray-200 border-b" ref={bannerRef}>
                    <div className="flex flex-col justify-start ml-[15px] w-[1024px] max-w-[1024px] py-10">
                        <div className='flex flex-row mb-5'>
                            <div className='inline-block w-[100px] overflow-hidden relative rounded-md aspect-square'>
                                <img src={selected[0].image} alt='selected[0].image' className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                            </div>
                            <div className='whitespace-pre-line'>
                                <div className='flex items-center'>
                                    <h1 className='font-bold text-3xl inline text-black pb-4'>{selected[0].name}</h1>
                                    <button className='flex items-center text-xl'><PiHeartStraight className='inline-block' /></button>
                                </div>
                                <div className='flex flex-row text-sm m-2'>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>메뉴 좋아요</div>
                                        <div className='font-bold'>12313</div>
                                    </div>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>레시피 수</div>
                                        <div className='font-bold'>12313</div>
                                    </div>
                                    <div className='border-l w-28 px-3'>
                                        <div className='text-gray-500'>레시피 평균</div>
                                        <div className='font-bold'>12313</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 grid-flow-row'>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천 브레드 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>브레드</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>평균 좋아요</span>
                                </div>
                                {breadTop3.map((item, index) => (
                                    <div key={item} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row'>
                                        <span className='col-span-5 flex items-center justify-start'>
                                            <img
                                                src={'images/sandwich_menu/ingredients/' + item}
                                                alt={item}
                                                className='w-12 aspect-square inline object-cover'
                                            />
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>10%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>103</span>
                                    </div>
                                ))}
                            </div>
                            <div className='border-l px-4'>
                                <span className=' font-bold'>추천재료 top3</span>
                                <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                                    <span className='col-span-5 text-left'>조합법</span>
                                    <span className='col-span-2'>조합 선택율</span>
                                    <span className='col-span-2'>평균 좋아요</span>
                                </div>
                                {recipesTop3.map((item, index) => (
                                    <div key={index} className='font-normal text-gray-500 grid grid-cols-10 grid-flow-row'>
                                        <span className='col-span-5 flex items-center justify-start'>{
                                            item.map((subItem, subIndex) => (//<React.Fragment>태그를 이용하면 실제 렌더링하지 않고 태그를 묶어서 사용할 수 있고 속성도 사용할수있다 (<></>은 똑같지만 속성 못 씀)
                                                <React.Fragment key={subIndex}>
                                                    {subIndex % 2 === 1 ? '+' : null}
                                                    <img
                                                        src={'images/sandwich_menu/ingredients/' + subItem}
                                                        alt={subItem}
                                                        className='w-12 aspect-square inline object-cover'
                                                    />
                                                </React.Fragment>
                                            ))
                                        }
                                        </span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>10%</span>
                                        <span className='col-span-2 flex items-center justify-center text-sm text-black font-bold'>103</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }


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