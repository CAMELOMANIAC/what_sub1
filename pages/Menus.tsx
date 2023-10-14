import React, { useState, useEffect } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineArrowRight } from 'react-icons/Ai';
import { PiHeartStraight } from 'react-icons/Pi';
import { RiPencilFill } from 'react-icons/ri';
import styled from 'styled-components';

const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;
const StyledImg = styled.img`
/*
    -webkit-mask-image: linear-gradient(to left, black 70%, transparent 100%);
    mask-image: linear-gradient(to left, black 70%, transparent 100%);*/
`

//메뉴 배열
export const menuArray: { name: string, image: string, favorit: number, recipes: number, avgRecipe: number, ingredients: Array<string>, matches?: Array<any>, type: number, summary: string }[] = [
    { name: '로스티드 치킨', image: '/images/sandwich_menu/Roasted-Chicken_20211231095032718.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '오븐에 구워 담백한 저칼로리 닭가슴살의 건강한 풍미', ingredients: ['치킨 브레스트.jpg', '아메리칸 치즈.jpg', '스위트어니언.jpg', '올리브오일.jpg'] },
    { name: '로티세리 바베큐', image: '/images/sandwich_menu/Rotisserie-Barbecue-Chicken_20211231023137878.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '촉촉한 바비큐 치킨의 풍미가득.\n 손으로 찢어 더욱 부드러운 치킨의 혁명', ingredients: ['로티세리 치킨.jpg', '아메리칸 치즈.jpg', '스위트칠리.jpg', '랜치.jpg'] },
    { name: '베지', image: '/images/sandwich_menu/Veggie-Delite_20211231095658375.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '갓 구운 빵과 신선한 8가지 야채로 즐기는 깔끔한 한끼', ingredients: ['각종 야채.jpg', '아메리칸 치즈.jpg', '레드와인식초.jpg', '올리브오일.jpg'] },
    { name: '서브웨이 클럽', image: '/images/sandwich_menu/Subway-Club™_20211231095518589.png', favorit: 2, recipes: 1, avgRecipe: 5, type: 2, summary: '고소한 베이컨, 담백한 치킨 슬라이스에 햄까지 더해\n 완벽해진 조화를 즐겨보세요!', ingredients: ['치킨 브레스트 햄.jpg', '햄.jpg', '베이컨.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스파이시 쉬림프', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프에 이국적인 시즈닝을 더해 색다른 매콤함을 만나보세요!', ingredients: ['스파이시 쉬림프.jpg', '아메리칸 치즈.jpg', '랜치.jpg'] },
    { name: '스파이시 바베큐', image: '/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png', favorit: 4, recipes: 1, avgRecipe: 1, type: 4, summary: '부드러운 풀드포크에 매콤한 맛을 더했다!\n 올 겨울 자꾸만 생각 날 매콤한 맛을 써브웨이 스파이시 바비큐로 만나보세요!', ingredients: ['스파이시 바비큐.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '스파이시 이탈리안', image: '/images/sandwich_menu/spicy_italian_20211231095435532.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '페퍼로니 & 살라미가 입안 가득,\n 페퍼로니의 부드러운 매콤함을 만나보세요!', ingredients: ['페퍼로니.jpg', '살라미.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트어니언.jpg'] },
    { name: '스테이크 & 치즈', image: '/images/sandwich_menu/Steak-&-Cheese_20211231095455613.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '육즙이 쫙~풍부한 비프 스테이크의 풍미가 입안 한가득', ingredients: ['스테이크.jpg', '아메리칸 치즈.jpg', '뉴 사우스웨스트 치폴레.jpg', '마요네즈.jpg'] },
    { name: '쉬림프', image: '/images/sandwich_menu/Shrimp_20211231095411189.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '탱글한 쉬림프 5마리가 그대로,\n 신선하고 담백한 쉬림프의 맛 그대로 즐겨보세요!', ingredients: ['새우.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '이탈리안 B.M.T', image: '/images/sandwich_menu/Italian_B.M.T_20211231094910899.png', favorit: 1, recipes: 4, avgRecipe: 4, type: 1, summary: '페퍼로니, 살라미 그리고 햄이 만들어내는 최상의 조화!\n 전세계가 사랑하는 써브웨이의 베스트셀러!\n Biggest Meatiest Tastiest, its’ B.M.T.', ingredients: ['페퍼로니.jpg', '살라미.jpg', '햄.jpg', '아메리칸 치즈.jpg', '스위트어니언.jpg', '랜치.jpg'] },
    { name: '에그마요', image: '/images/sandwich_menu/Egg-Mayo_20211231094817112.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '부드러운 달걀과 고소한 마요네즈가\n 만나 더 부드러운 스테디셀러', ingredients: ['에그마요.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '스위트칠리.jpg'] },
    { name: '참치', image: '/images/sandwich_menu/Tuna_20211231095535268.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '남녀노소 누구나 좋아하는 담백한 참치와\n 고소한 마요네즈의 완벽한 조화', ingredients: ['참치.jpg', '아메리칸 치즈.jpg', '핫칠리.jpg', '스위트칠리.jpg'] },
    { name: '치킨 베이컨 아보카도', image: '/images/sandwich_menu/치킨베이컨아보카도샌드위치_20220804012954461.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '담백하게 닭가슴살로 만든 치킨 슬라이스와\n 베이컨, 부드러운 아보카도의 만남', ingredients: ['치킨 브레스트 햄.jpg', '베이컨.jpg', '아보카도.jpg', '아메리칸 치즈.jpg', '랜치.jpg', '홀스래디쉬.jpg'] },
    { name: '치킨 슬라이스', image: '/images/sandwich_menu/치킨슬라이스샌드위치_20220804012537491.png', favorit: 2, recipes: 1, avgRecipe: 1, type: 2, summary: '닭가슴살로 만든 치킨 슬라이스로 즐기는 담백한 맛!', ingredients: ['치킨 브레스트 햄.jpg', '아메리칸 치즈.jpg', '스위트칠리.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: '치킨 데리야끼', image: '/images/sandwich_menu/Chicken-Teriyaki_20211231094803381.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '담백한 치킨 스트립에\n 달콤짭쪼름한 써브웨이 특제 데리야끼 소스와의 환상적인 만남', ingredients: ['치킨 데리야끼.jpg', '아메리칸 치즈.jpg', '스모크바베큐.jpg', '마요네즈.jpg'] },
    { name: '풀드포크', image: '/images/sandwich_menu/Pulled-Pork+cheese_20211231095012512.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '미국 스타일의 풀드 포크 바비큐가 가득 들어간 샌드위치', ingredients: ['풀드포크 바비큐.jpg', '아메리칸 치즈.jpg', '스모크바베큐.jpg', '랜치.jpg'] },
    { name: '햄', image: '/images/sandwich_menu/Ham_20211231094833168.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '풍부한 햄이 만들어내는 담백함을 입 안 가득 즐겨보세요!', ingredients: ['햄.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '홀스래디쉬.jpg'] },
    { name: 'B.L.T', image: '/images/sandwich_menu/B.L.T_20211231094744175.png', favorit: 1, recipes: 1, avgRecipe: 1, type: 1, summary: '오리지널 아메리칸 스타일 베이컨의 풍미와 바삭함 그대로~', ingredients: ['베이컨.jpg', '아메리칸 치즈.jpg', '마요네즈.jpg', '뉴 사우스웨스트 치폴레.jpg'] },
    { name: 'K-bbq', image: '/images/sandwich_menu/K-BBQ_20211231094930225.png', favorit: 3, recipes: 1, avgRecipe: 1, type: 3, summary: '써브웨이의 코리안 스타일 샌드위치!\n 마늘, 간장 그리고 은은한 불맛까지!', ingredients: ['k-바비큐.jpg', '아메리칸 치즈.jpg', '올리브오일.jpg', '후추.jpg'] },
];

const Menus = () => {
    const arrayTemplate: { name: string, favorit: string, recipes: string, avgRecipe: string, matches: string } = {
        name: '메뉴 이름', favorit: '메뉴 좋아요', recipes: '레시피 수', avgRecipe: '레시피 평균', matches: '더 하면 좋은 재료'
    }
    const [selected, setSelected] = useState<{ name: string, image: string, favorit: number, recipes: number, ingredients: Array<string>, matches?: Array<any>, type: number, summary: string }>(menuArray[0]);
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

    const orderChangeAvgRecipes = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        setOrder(prevOrder => {
            if (id === 'avgRecipe' && prevOrder === 'avgRecipe') {
                return 'reverseAvgRecipe';
            }
            else if (id === 'avgRecipe' && prevOrder === 'reverseAvgRecipe') {
                return 'avgRecipe';
            }
            return 'avgRecipe';
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
        if (order === 'avgRecipe')
            sorted.sort((a, b) => (b.avgRecipe - a.avgRecipe));
        if (order === 'reverseAvgRecipe')
            sorted.sort((a, b) => (a.avgRecipe - b.avgRecipe));
        setSortedArray(sorted);
    }, [order]);

    return (
        <>
            <StyledDiv className="absolute w-screen min-w-[1024px] right-0 mx-auto h-[300px] grid grid-cols-6 bg-white overflow-hidden">
                {/*메뉴 간단정보*/}
                <div className="col-span-3 h-[300px]">
                    <StyledImg src={selected.image} alt='sandwich_image' className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></StyledImg>
                </div>
                <div className="col-span-3 whitespace-pre-line flex flex-col justify-center">
                    <div className='flex flex-row items-center text-white pb-4'>
                        <h1 className='font-bold text-3xl mr-4'>{selected.name}</h1>
                        <button className='flex items-center text-xl'><PiHeartStraight className='inline-block'/>12</button>
                    </div>
                    <div className='text-white/70 mb-2'>{selected.summary}</div>
                    <div className='flex flex-row'>{selected.ingredients.map((item) =>
                        <img src={'/images/sandwich_menu/ingredients/' + item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-8' alt='item'></img>
                    )}</div>
                    <div className='flex flex-row'>
                        <Link href={{
                            pathname: '/Recipes',  // 이동할 페이지의 경로
                            query: { param: selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-black bg-yellow-500 flex justify-center items-center'>자세히 보기<AiOutlineArrowRight className='inline-block text-xl' /></Link>
                        <Link href={{
                            pathname: '/Recipes',  // 이동할 페이지의 경로
                            query: { param: selected.name }  /* URL에 전달할 쿼리 매개변수*/
                        }}
                            className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center'>레시피 작성<RiPencilFill className='inline-block text-xl' /></Link>
                    </div>{/*
                    <div className='flex flex-row'>
                        <button className='border-2 font-bold rounded-full px-3 py-1 mr-2 text-white flex justify-center items-center'>보러가기<AiOutlineArrowRight className='inline-block text-xl' /></button>
                        <button className='border-2 font-bold rounded-full px-3 py-1 mr-2 text-white flex justify-center items-center'>작성하기<RiPencilFill className='inline-block text-xl' /></button>
                    </div> */}
                </div>
            </StyledDiv>

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
                                {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 1 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 2 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 3 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} clickHandler={() => setSelected(index)} />))}
                            </div>
                        }{menuType === 4 &&
                            <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                                {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.name} src={index.image} key={index.name} clickHandler={() => setSelected(index)} />))}
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
                            <button className={`inline-block w-[15%] text-center py-1 ` + `${order === 'avgRecipe' && ' border-b-4 border-green-600 text-green-600 '}` + `${order === 'reverseAvgRecipe' && ' border-t-4 border-yellow-500 text-yellow-500'}`}
                                id='avgRecipe' onClick={orderChangeAvgRecipes}>{arrayTemplate.avgRecipe}</button>
                            <span className="inline-block w-[30%] text-center">{arrayTemplate.matches}</span>
                        </div>
                        {sortedArray?.map((item, index) => (
                            <button key={index} className='flex items-stretch w-full' onClick={() => setSelected(item)}>
                                <span className="flex justify-center items-center  w-[10%] text-center text-gray-400">{index + 1}</span>
                                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1'>
                                    <img src={item.image} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                                </div>
                                <span className="flex justify-start items-center  w-[30%] font-bold pl-2">{item.name}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'favorit') || (order === 'reverseFavorit')) && 'bg-gray-100 '}`}>{item.favorit}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'recipes') || (order === 'reverseRecipes')) && 'bg-gray-100 '}`}>{item.recipes}</span>
                                <span className={`flex justify-center items-center w-[15%] text-center ` + `${((order === 'avgRecipe') || (order === 'reverseAvgRecipe')) && 'bg-gray-100 '}`}>{item.avgRecipe}</span>
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