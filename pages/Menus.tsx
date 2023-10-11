import React, { useState, useEffect } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

const Menus = () => {
    const arrayTemplate: { name: string, favorit: string, recipes: string, matches: string } = {
        name: '메뉴 이름', favorit: '좋아요 수', recipes: '레시피 수', matches: '더 하면 좋은 재료'
    }
    //메뉴 순위용 배열
    const menuArray: { name: string, image: string, favorit: number, recipes: number, matches?: Array<any> }[] = [
        { name: '로스티드 치킨', image: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', favorit: 2, recipes: 1 },
        { name: '로티세리 바베큐', image: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png', favorit: 2, recipes: 1 },
        { name: '베지', image: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png', favorit: 2, recipes: 1 },
        { name: '서브웨이 클럽', image: '/images/sandwich_menu/Subway-Club™_20211231095518589.png', favorit: 2, recipes: 1 },
        { name: '스파이시 쉬림프', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 3, recipes: 1 },
        { name: '스파이시 바베큐', image: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png', favorit: 4, recipes: 1 },
        { name: '스파이시 이탈리안', image: '/images/sandwich_menu/spicy_italian_20211231095435532.png', favorit: 3, recipes: 1 },
        { name: '스테이크 & 치즈', image: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png', favorit: 3, recipes: 1 },
        { name: '쉬림프', image: '/images/sandwich_menu/Shrimp_20211231095411189.png', favorit: 3, recipes: 1 },
        { name: '이탈리안 B.M.T', image: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png', favorit: 1, recipes: 4 },
        { name: '에그마요', image: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png', favorit: 1, recipes: 1 },
        { name: '참치', image: '/images/sandwich_menu/Tuna_20211231095535268.png', favorit: 1, recipes: 1 },
        { name: '치킨 베이컨 아보카도', image: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png', favorit: 2, recipes: 1 },
        { name: '치킨 슬라이스', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 2, recipes: 1 },
        { name: '치킨 데리야끼', image: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png', favorit: 3, recipes: 1 },
        { name: '풀드포크', image: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png', favorit: 3, recipes: 1 },
        { name: '햄', image: '/images/sandwich_menu/Ham_20211231094833168.png', favorit: 1, recipes: 1 },
        { name: 'B.L.T', image: '/images/sandwich_menu/B.L.T_20211231094744175.png', favorit: 1, recipes: 1 },
        { name: 'K-bbq', image: '/images/sandwich_menu/K-BBQ_20211231094930225.png', favorit: 3, recipes: 1 },
    ];

    //메뉴 선택기용 배열
    const [menuType, setMenuType] = useState(0);
    const menuSelectorArray: { name: string, image: string, type?: number }[] = [
        { name: '로스티드 치킨', image: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', type: 2 },
        { name: '로티세리 바베큐', image: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png', type: 2 },
        { name: '베지', image: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png', type: 2 },
        { name: '서브웨이 클럽', image: '/images/sandwich_menu/Subway-Club™_20211231095518589.png', type: 2 },
        { name: '스파이시 쉬림프', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', type: 3 },
        { name: '스파이시 바베큐', image: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png', type: 4 },
        { name: '스파이시 이탈리안', image: '/images/sandwich_menu/spicy_italian_20211231095435532.png', type: 3 },
        { name: '스테이크 & 치즈', image: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png', type: 3 },
        { name: '쉬림프', image: '/images/sandwich_menu/Shrimp_20211231095411189.png', type: 3 },
        { name: '이탈리안 B.M.T', image: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png', type: 1 },
        { name: '에그마요', image: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png', type: 1 },
        { name: '참치', image: '/images/sandwich_menu/Tuna_20211231095535268.png', type: 1 },
        { name: '치킨 베이컨 아보카도', image: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png', type: 2 },
        { name: '치킨 슬라이스', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', type: 2 },
        { name: '치킨 데리야끼', image: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png', type: 3 },
        { name: '풀드포크', image: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png', type: 3 },
        { name: '햄', image: '/images/sandwich_menu/Ham_20211231094833168.png', type: 1 },
        { name: 'B.L.T', image: '/images/sandwich_menu/B.L.T_20211231094744175.png', type: 1 },
        { name: 'K-bbq', image: '/images/sandwich_menu/K-BBQ_20211231094930225.png', type: 3 },
    ]
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuSelectorArray.filter((item) => item.name.includes(searchQuery))

    const [order, setOrder] = useState('favorit'); const orderChangeFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        console.log(order);
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

    //얕은검사는 배열의 순서가 바껴도 인식하지 못함으로 배열을 복사해서 정렬해야함
    const [sortedArray, setSortedArray] = useState([...menuArray]);

    useEffect(() => {
        let sorted = [...menuArray];
        if (order === 'favorit')
            sorted.sort((a, b) => (b.favorit - a.favorit));
        if (order === 'reverseFavorit')
            sorted.sort((a, b) => (a.favorit - b.favorit));
        if (order === 'recipes')
            sorted.sort((a, b) => (b.recipes - a.recipes));
        if (order === 'reverseRecipes')
            sorted.sort((a, b) => (a.recipes - b.recipes));
        setSortedArray(sorted);
    }, [order]);

    return (
        <main className='w-full max-w-screen-xl mx-auto'>

            <div className="grid grid-cols-6 gap-2 w-[66rem] pt-4">
                <div className="col-span-6 border bg-white">
                    {/*메뉴 간단정보*/}
                    {order}
                </div>

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
                            {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} href={''} />))}
                        </div>
                    }{menuType === 1 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} href={''} />))}
                        </div>
                    }{menuType === 2 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} href={''} />))}
                        </div>
                    }{menuType === 3 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} href={''} />))}
                        </div>
                    }{menuType === 4 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} href={''} />))}
                        </div>
                    }
                </div>

                {/*메뉴 순위 */}
                <div className="col-span-4 border bg-white relative w-full divide-y text-sm">
                    <div className='flex items-center bg-slate-100 text-gray-400'>
                        <span className="inline-block w-[10%] text-center">순위</span>
                        <span className="inline-block w-[30%]">{arrayTemplate.name}</span><span className='inline-block w-10'></span>
                        <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'favorit' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseFavorit' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                            id='favorit' onClick={orderChangeFavorit}>{arrayTemplate.favorit}</button>
                        <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'recipes' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseRecipes' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                            id='recipes' onClick={orderChangeRecipes}>{arrayTemplate.recipes}</button>
                        <span className="inline-block w-[30%] text-center">{arrayTemplate.matches}</span>
                    </div>
                    {sortedArray?.map((item, index) => (
                        <Link href={'/'} key={index} className='flex items-center py-1'>
                            <span className="inline-block w-[10%] text-center text-gray-400">{index + 1}</span>
                            <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto'>
                                <img src={item.image} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                            </div>
                            <span className="inline-block w-[30%] font-bold pl-2">{item.name}</span>
                            <span className="inline-block w-[15%] text-center">{item.favorit}</span>
                            <span className="inline-block w-[15%] text-center">{item.recipes}</span>
                            <span className="inline-block w-[30%] text-center">{item.matches}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Menus;