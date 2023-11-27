import React, { useState, useEffect } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import { FiSearch } from 'react-icons/fi';
import { menuArray, menuArrayType } from '../utils/menuArray';
import { checkSession } from '../utils/checkSession';
import { loadMenuLike } from '../utils/publicFunction';
import { useDispatch } from 'react-redux';
import { actionSetMenuLike } from '../redux/reducer/userReducer';
import { totalMenuInfoType } from '../pages/api/menu';
import MenusBanner from '../components/MenusBanner';


export async function getServerSideProps({ req }) {
    const cookie = req.headers.cookie;
    const sessionCheck = await checkSession(cookie);

    const loadTotalMenuInfo = async () => {
        const result = await fetch(process.env.URL + '/api/menu?isTotal=true')
        return result.json();
    }
    const totalMenuInfo = await loadTotalMenuInfo();

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
        totalMenuInfo.find(infoArray => infoArray.sandwichName === menuArray.name)
            ? (menuArray.recipes = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwichName === menuArray.name)?.recipeCount ?? '0'),
                menuArray.favorit = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwichName === menuArray.name)?.likeCount ?? '0'),
                menuArray.likeRecipe = parseInt(totalMenuInfo.find(infoArray => infoArray.sandwichName === menuArray.name)?.recipeLikeCount ?? '0'))
            : null
    })
    const arrayTemplate: { name: string, favorit: string, recipes: string, likeRecipe: string, matches: string } = {
        name: '메뉴 이름', favorit: '메뉴 좋아요', recipes: '레시피 수', likeRecipe: '레시피 좋아요', matches: '더 하면 좋은 재료'
    }
    const [selected, setSelected] = useState<menuArrayType>(menuArray[0]);
    const [menuType, setMenuType] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuArray.filter((item: { name: string }) => item.name.includes(searchQuery))

    //정렬
    const [order, setOrder] = useState('favorit');
    const orderChangeFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'favorit' && prevOrder === 'favorit') {
                return 'reverseFavorit';
            }
            else if (id === 'favorit' && prevOrder === 'reverseFavorit') {
                return 'favorit';
            }
            return 'favorit';
        });
    }

    const orderChangeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'recipes' && prevOrder === 'recipes') {
                return 'reverseRecipes';
            }
            else if (id === 'recipes' && prevOrder === 'reverseRecipes') {
                return 'recipes';
            }
            return 'recipes';
        });
    }

    const orderChangeLikeRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'likeRecipe' && prevOrder === 'likeRecipe') {
                return 'reverselikeRecipe';
            }
            else if (id === 'likeRecipe' && prevOrder === 'reverselikeRecipe') {
                return 'likeRecipe';
            }
            return 'likeRecipe';
        });
    }

    //얕은검사는 배열의 순서가 바껴도 인식하지 못함으로 배열을 복사해서 정렬해야함
    const [sortedArray, setSortedArray] = useState<menuArrayType[]>([...menuArray]);

    useEffect(() => {
        const sorted = [...menuArray];
        if (order === 'favorit')
            sorted.sort((a, b) => (b.favorit - a.favorit));
        if (order === 'reverseFavorit')
            sorted.sort((a, b) => (a.favorit - b.favorit));
        if (order === 'recipes')
            sorted.sort((a, b) => (b.recipes - a.recipes));
        if (order === 'reverseRecipes')
            sorted.sort((a, b) => (a.recipes - b.recipes));
        if (order === 'likeRecipe')
            sorted.sort((a, b) => (b.likeRecipe - a.likeRecipe));
        if (order === 'reverselikeRecipe')
            sorted.sort((a, b) => (a.likeRecipe - b.likeRecipe));
        setSortedArray(sorted);
    }, [order]);

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
                    <div className="col-span-2 border bg-white h-fit p-2">
                        {/*메뉴 선택기 */}
                        <div className="flex flex-row items-center border placeholder:text-gray-400 focus-within:ring-2 ring-green-600 p-1">
                            <FiSearch className='text-lg mx-1 text-gray-400' />
                            <input type="text" className='focus-within:outline-none w-full' onChange={queryChange} />
                        </div>
                        <div className="flex w-full pt-2">
                            <button className={`border rounded-l py-2 w-full text-xs ${menuType === 0 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(0)}>all</button>
                            <button className={`border-y py-2 w-full text-xs ${menuType === 1 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(1)}>클래식</button>
                            <button className={`border-y border-x py-2 w-full text-xs ${menuType === 2 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(2)}>프레쉬</button>
                            <button className={`border-y py-2 w-full text-xs ${menuType === 3 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(3)}>프리미엄</button>
                            <button className={`border rounded-r py-2 w-full text-xs ${menuType === 4 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(4)}>신제품</button>
                        </div>

                        {menuType === 0 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 1 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 2 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 3 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 4 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }
                    </div>

                    {/*메뉴 순위 */}
                    <div className="col-span-4 border bg-white relative w-full divide-y text-sm">
                        {/*위쪽 라벨 */}
                        <div className='flex items-center bg-slate-100 text-gray-400'>
                            <span className="inline-block w-[10%] text-center">순위</span>
                            <span className="inline-block w-[30%]">{arrayTemplate.name}</span><span className='inline-block w-10'></span>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'favorit' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseFavorit' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='favorit' onClick={orderChangeFavorit}>{arrayTemplate.favorit}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'likeRecipe' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverselikeRecipe' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='likeRecipe' onClick={orderChangeLikeRecipes}>{arrayTemplate.likeRecipe}</button>
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'recipes' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseRecipes' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='recipes' onClick={orderChangeRecipes}>{arrayTemplate.recipes}</button>
                            <span className="inline-block w-[30%] text-center">{arrayTemplate.matches}</span>
                        </div>
                        {sortedArray?.map((item, index) => (
                            <button key={index} className='flex items-stretch w-full' onClick={() => setSelected(item)}>
                                <span className="flex justify-center items-center  w-[10%] text-center text-gray-400">{index + 1}</span>
                                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1'>
                                    <img src={`/images/sandwich_menu/${item.name}.png`} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                                </div>
                                <span className="flex justify-start items-center  w-[30%] font-bold pl-2">{item.name}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'favorit') || (order === 'reverseFavorit')) && 'bg-gray-100 '}`}>{item.favorit}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'likeRecipe') || (order === 'reverselikeRecipe')) && 'bg-gray-100 '}`}>{item.likeRecipe}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'recipes') || (order === 'reverseRecipes')) && 'bg-gray-100 '}`}>{item.recipes}</span>
                                <span className="flex justify-center items-center  w-[30%] text-center">{item.matches}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Menus;