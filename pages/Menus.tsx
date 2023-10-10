import React, { useState } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import Link from 'next/link';

const Menus = () => {
    const arrayTemplate: { name: string, favorit: string, recipes: string, matches: string } = {
        name: '메뉴 이름', favorit: '좋아요 수', recipes: '레시피 수', matches: '더 하면 좋은 재료'
    }
    const menuArray: { name: string, favorit: string, recipes: string, matches?: Array<any> }[] = [
        { name: '베지', favorit: '1', recipes: '1' },
        { name: '서브웨이클럽', favorit: '2', recipes: '1' },
        { name: '스파이시 쉬림프', favorit: '3', recipes: '1' },
        { name: '스파이시 바베큐', favorit: '1', recipes: '1' },
        { name: '스파이시 이탈리안', favorit: '4', recipes: '1' },
        { name: '스테이크 & 치즈', favorit: '3', recipes: '1' },
    ];

    const [menuType, setMenuType] = useState(0);
    const menuSelectorArray: { menuName: string, src: string, type?: number }[] = [
        { menuName: '로스티드 치킨', src: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', type: 2 },
        { menuName: '로티세리 바베큐', src: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png', type: 2 },
        { menuName: '베지', src: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png', type: 2 },
        { menuName: '서브웨이클럽', src: '/images/sandwich_menu/Subway-Club™_20211231095518589.png', type: 2 },
        { menuName: '스파이시 쉬림프', src: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', type: 3 },
        { menuName: '스파이시 바베큐', src: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png', type: 4 },
        { menuName: '스파이시 이탈리안', src: '/images/sandwich_menu/spicy_italian_20211231095435532.png', type: 3 },
        { menuName: '스테이크 & 치즈', src: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png', type: 3 },
        { menuName: '쉬림프', src: '/images/sandwich_menu/Shrimp_20211231095411189.png', type: 3 },
        { menuName: '이탈리안 B.M.T', src: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png', type: 1 },
        { menuName: '에그마요', src: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png', type: 1 },
        { menuName: '참치', src: '/images/sandwich_menu/Tuna_20211231095535268.png', type: 1 },
        { menuName: '치킨 베이컨 아보카도', src: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png', type: 2 },
        { menuName: '치킨 슬라이스', src: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', type: 2 },
        { menuName: '치킨 데리야끼', src: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png', type: 3 },
        { menuName: '풀드포크', src: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png', type: 3 },
        { menuName: '햄', src: '/images/sandwich_menu/Ham_20211231094833168.png', type: 1 },
        { menuName: 'B.L.T', src: '/images/sandwich_menu/B.L.T_20211231094744175.png', type: 1 },
        { menuName: 'K-bbq', src: '/images/sandwich_menu/K-BBQ_20211231094930225.png', type: 3 },
    ]
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuSelectorArray.filter((item) => item.menuName.includes(searchQuery))
    const [order, setOrder] = useState(0);

    return (
        <main className='w-full max-w-screen-xl mx-auto'>

            <div className="grid grid-cols-6 gap-2 w-[66rem] pt-4">
                <div className="col-span-6 border bg-white">
                    {/*메뉴 간단정보*/}
                    {searchQuery}
                </div>

                <div className="col-span-2 border bg-white p-2">
                    {/*메뉴 선택기 */}
                    <input type="text" className='border placeholder:text-gray-400 focus:ring-0 w-full p-1' onChange={queryChange} />
                    <div className="flex w-full pt-2">
                        <button className={`border rounded-l py-2 w-full text-xs ${menuType === 0 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(0)}>all</button>
                        <button className={`border-y py-2 w-full text-xs ${menuType === 1 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(1)}>클래식</button>
                        <button className={`border-y border-x py-2 w-full text-xs ${menuType === 2 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(2)}>프레쉬</button>
                        <button className={`border-y py-2 w-full text-xs ${menuType === 3 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(3)}>프리미엄</button>
                        <button className={`border rounded-r py-2 w-full text-xs ${menuType === 4 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(4)}>신제품</button>
                    </div>

                    {menuType === 0 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.menuName} src={index.src} key={index.menuName} href={''}/>))}
                        </div>
                    }{menuType === 1 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.menuName} src={index.src} href={''}/>))}
                        </div>
                    }{menuType === 2 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.menuName} src={index.src} href={''}/>))}
                        </div>
                    }{menuType === 3 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.menuName} src={index.src} href={''}/>))}
                        </div>
                    }{menuType === 4 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.menuName} src={index.src} href={''}/>))}
                        </div>
                    }
                </div>
                {/*메뉴 순위 */}
                <div className="col-span-4 border bg-white relative w-full p-2 divide-y text-sm">
                    <div className='py-1'>
                        <span className="inline-block w-[10%] text-center">순위</span><span className="inline-block w-[30%]">{arrayTemplate.name}</span><span className="inline-block w-[15%] text-center">{arrayTemplate.favorit}</span><span className="inline-block w-[15%] text-center">{arrayTemplate.recipes}</span><span className="inline-block w-[30%] text-center">{arrayTemplate.matches}</span>
                    </div>
                    {menuArray?.map((item, index) => (
                        <Link href={'/'} key={index} className='block py-3'>
                            <span className="inline-block w-[10%] text-center">{index + 1}</span><span className="inline-block w-[30%]">{item.name}</span><span className="inline-block w-[15%] text-center">{item.favorit}</span><span className="inline-block w-[15%] text-center">{item.recipes}</span><span className="inline-block w-[30%] text-center">{item.matches}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Menus;