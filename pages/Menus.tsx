import React, { useState, useEffect } from 'react';
import { menuArray, menuArrayType } from '../utils/menuArray';
import { checkSession } from '../utils/checkSession';
import { loadMenuLike } from '../utils/publicFunction';
import { useDispatch } from 'react-redux';
import { actionSetMenuLike } from '../redux/reducer/userReducer';
import { totalMenuInfoType } from '../interfaces/api/menus';
import MenusBanner from '../components/MenusBanner';
import MenusList from '../components/MenusList';
import MenusGrid from '../components/MenusGrid';


export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie;
    const sessionCheck = await checkSession(cookie);

    const loadTotalMenuInfo = async () => {
        const result = await fetch(process.env.URL + '/api/menus')
        return result.json();
    }
    const totalMenuInfo = await loadTotalMenuInfo();
    console.log(sessionCheck)
    return {
        props: {
            sessionCheck,
            totalMenuInfo
        },
    };
}

type props = {
    sessionCheck: boolean,
    totalMenuInfo: totalMenuInfoType[]
}

const Menus = ({ totalMenuInfo, sessionCheck }: props) => {
    const fixedMenuArray: menuArrayType[] = menuArray;
    fixedMenuArray.map(menuArray => {
        totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)
            ? (menuArray.recipes = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.recipe_count ?? '0'),
                menuArray.favorit = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.like_count ?? '0'),
                menuArray.likeRecipe = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwich_name === menuArray.name)?.recipe_count ?? '0'))
            : null
    })
    const [selected, setSelected] = useState<menuArrayType>(menuArray[0]);
    const dispatch = useDispatch();
    //새로고침시 좋아요 정보 가져오기
    useEffect(() => {
        if (sessionCheck) {//로그인 세션이 존재하면
            loadMenuLike().then(data => {//메뉴 좋아요 정보 가져와서 전역 상태값에 저장
                dispatch(actionSetMenuLike(data))
                console.log(data)
            })
        }
    }, [])

    return (
        <>
            <MenusBanner selected={selected} sessionCheck={sessionCheck}></MenusBanner>
            <main className='w-full max-w-screen-xl mx-auto pt-2 mt-[calc(300px+3rem)]'>
                <div className="grid grid-cols-6 gap-2 w-[1024px]">
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