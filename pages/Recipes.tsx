import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { menuArray } from './Menus'
import Card from '../components/Card';

const Recipes = () => {
    const router = useRouter();
    type MenuItem = {
        name: string;
        image: string;
        ingredients: string[];
    };
    let selected: MenuItem[] = [];
    if (router.isReady) {
        const { param } = router.query;
        selected = menuArray.filter((item) => (item.name == String(param).replaceAll('+', ' ')));//쿼리로 값을 전달할때 뛰어쓰기는 +기호로 치환되므로 적절히 조치해야함
        console.log(String(param));
        console.log(selected)
    }
    return (
        <>
            {//next.js는 서바사이드와 클라이언트사이드의 절충이라서 리액트처럼 새로고침 한다고 파라메터객체가 클라이언트에서 바로 새로고침 되지않고 서버에서 값을 다시 받아야 새로고쳐진다
                //(다른 서버사이드렌더링 프레임워크는 그냥 통째로 정보를 전송하니까 에러가 아니라 그냥 빈화면을 보여주겠지만 next.js는 일단 서버쪽을 제외한 화면을 먼저 보여주려하니까 에러발생)
                //서버가 값을 전달하기 전까지는 일단 param이 비어있는 상태이므로 그 사이에 js는 param 값이 없다고 에러를 띄우게된다. param값을 사용하는 요소들은 값을 받고나서 렌더링 할수있도록 조치해줘야한다
                router.isReady === true && selected.length > 0 &&
                <div className="absolute w-screen min-w-[1080px] right-0 bg-white border-gray-200 border-b p-10">
                    <div className="flex flex-col justify-start w-[1080px] mx-auto">
                        <div className='flex flex-row'>
                            <div className='inline-block w-[100px] overflow-hidden relative rounded-md aspect-square'>
                                <img src={selected[0].image} alt='selected[0].image' className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                            </div>
                            <div className='whitespace-pre-line'>
                                <h2 className='font-bold text-2xl text-black pb-4'>{selected[0].name}</h2>
                                <div>프레쉬</div>
                                <div className='flex flex-row'>{selected[0].ingredients.map((item) =>
                                    <img src={'/images/sandwich_menu/ingredients/' + item} alt={item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-10'></img>
                                )}</div>
                            </div>

                        </div>
                        <div>
                            기본구성

                        </div>
                    </div>

                </div>
            }


            <main className={'w-full max-w-screen-lg mx-auto pt-2 '+`${router.isReady === true && selected.length > 0 && 'mt-[calc(300px+3rem)]'}`}>
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