import React, { useState } from 'react';
import { menuArray, menuArrayType } from '../utils/menuArray';
import { totalMenuInfoType } from '../interfaces/api/menus';
import MenusBanner from '../components/MenusBanner';
import MenusList from '../components/MenusList';
import MenusGrid from '../components/MenusGrid';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export async function getServerSideProps() {
    const loadTotalMenuInfo = async () => {
        const result = await fetch(process.env.URL + '/api/menus')
        return result.json();
    }
    const totalMenuInfo = await loadTotalMenuInfo();
    return {
        props: {
            totalMenuInfo
        },
    };
}

type props = {
    totalMenuInfo: totalMenuInfoType[]
}

const Menus = ({ totalMenuInfo }: props) => {
    const fixedMenuArray: menuArrayType[] = menuArray;
    fixedMenuArray.map(menuArray => {
        totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)
            ? (menuArray.recipes = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.recipe_count ?? '0'),
                menuArray.favorit = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.like_count ?? '0'),
                menuArray.likeRecipe = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.recipe_like_count ?? '0'))
            : null
    })
    
    const [selected, setSelected] = useState<menuArrayType>(menuArray[0]);

    const sessionCheck = useSelector((state: RootState) => state.user.userName)? true : false;

    return (
        <>
            <Head>
                <title>WhatSub : 메뉴</title>
                <meta name="description" content="서브웨이 샌드위치 메뉴의 인기와 정보를 여기서 한눈으로 비교해보세요."/>
            </Head>
            <MenusBanner selected={selected} sessionCheck={sessionCheck}></MenusBanner>
            <main className='w-full max-w-screen-xl mx-auto pt-2 mt-[calc(300px+3rem)]'>
                <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 w-screen lg:w-[1024px] min-w-[640px]">
                    {/*메뉴 선택기 */}
                    <MenusGrid setSelected={setSelected}></MenusGrid>
                    {/*메뉴 순위 */}
                    <MenusList setSelected={setSelected}></MenusList>
                </div>
            </main>
        </>
    );
};

export default Menus;