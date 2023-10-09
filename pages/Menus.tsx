import { useState } from 'react';
import styled from 'styled-components';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';

const StyledImg = styled.img`
`

const Menus = () => {
    const menuArray: { name: string, value: string }[] = [
        { name: '0', value: '1' },
        { name: '2', value: '1' },
        { name: '4', value: '1' },
        { name: '5', value: '1' },
        { name: '1', value: '4' },
        { name: '3', value: '3' },
    ];

    const [menuType, setMenuType] = useState(0);
    const menuSelectorArray: { menuName: string, src: string, type?: number }[] = [
        { menuName: '로스티드 치킨', src: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', type:0},
        { menuName: '로티세리 바베큐', src: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png' },
        { menuName: '베지', src: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png' },
        { menuName: '서브웨이클럽', src: '/images/sandwich_menu/Subway-Club™_20211231095518589.png' },
        { menuName: '스파이시 쉬림프', src: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png' },
        { menuName: '스파이시 바베큐', src: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png' },
        { menuName: '스파이시 이탈리안', src: '/images/sandwich_menu/spicy_italian_20211231095435532.png' },
        { menuName: '스테이크 & 치즈', src: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png' },
        { menuName: '쉬림프', src: '/images/sandwich_menu/Shrimp_20211231095411189.png' },
        { menuName: '이탈리안 B.M.T', src: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png' },
        { menuName: '에그마요', src: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png' },
        { menuName: '치킨 베이컨 아보카도', src: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png' },
        { menuName: '참치', src: '/images/sandwich_menu/Tuna_20211231095535268.png' },
        { menuName: '치킨 슬라이스', src: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png' },
        { menuName: '치킨 데리야끼', src: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png' },
        { menuName: '풀드포크', src: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png' },
        { menuName: '햄', src: '/images/sandwich_menu/Ham_20211231094833168.png' },
        { menuName: 'B.L.T', src: '/images/sandwich_menu/B.L.T_20211231094744175.png' },
        { menuName: 'K-bbq', src: '/images/sandwich_menu/K-BBQ_20211231094930225.png' },
    ]

    return (
        <main className='w-full max-w-screen-xl mx-auto'>

            <div className="grid grid-cols-6 gap-2 w-[66rem] pt-4">
                <div className="col-span-6 border bg-white">
                    {/*메뉴 간단정보*/}
                    ㄴㅁㅇㄹ
                </div>

                <div className="col-span-2 border bg-white p-2">
                    {/*메뉴 선택기 */}
                    <input type="text" className='border placeholder:text-gray-400 focus:ring-0 w-full p-1' />
                    <div className="flex w-full pt-2">
                        <button className={`border rounded-l py-2 w-full text-xs ${menuType === 0 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(0)}>all</button>
                        <button className={`border-y py-2 w-full text-xs ${menuType === 1 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(1)}>클래식</button>
                        <button className={`border-y border-x py-2 w-full text-xs ${menuType === 2 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(2)}>프레쉬</button>
                        <button className={`border-y py-2 w-full text-xs ${menuType === 3 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(3)}>프리미엄</button>
                        <button className={`border rounded-r py-2 w-full text-xs ${menuType === 4 ? 'bg-blue-500 text-white' : ''}`} onClick={() => setMenuType(4)}>신제품</button>
                    </div>

                    {menuType === 0 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {menuSelectorArray.map((index) => (<MenusSelectorGridItem menuName={index.menuName} src={index.src} key={index.menuName}/>))}
                        </div>
                    }{menuType === 1 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {menuSelectorArray.map((index) => (index.type === 0 && <MenusSelectorGridItem menuName={index.menuName} src={index.src} />))}
                        </div>
                    }{menuType === 2 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {menuSelectorArray.map((index) => (<MenusSelectorGridItem menuName={index.menuName} src={index.src} />))}
                        </div>
                    }{menuType === 3 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {menuSelectorArray.map((index) => (<MenusSelectorGridItem menuName={index.menuName} src={index.src} />))}
                        </div>
                    }{menuType === 4 &&
                        <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                            {menuSelectorArray.map((index) => (<MenusSelectorGridItem menuName={index.menuName} src={index.src} />))}
                        </div>
                    }

                </div>

                <div className="col-span-4 border bg-white">
                    {/*메뉴 순위 */
                        menuArray?.map((item, index) => (
                            <div className={`relative w-96 h-12 flex justify-center items-center`} key={index}>
                                <p className="absolute left-4">{index + 1}</p>{item.name} + {item.value}
                            </div>
                        ))}
                </div>
            </div>
        </main>
    );
};

export default Menus;