import { IoIosArrowForward } from 'react-icons/io';
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi';
import { RiPencilFill } from 'react-icons/ri';
import styled from 'styled-components';
import Link from 'next/link';
import { menuArrayType } from '../utils/menuArray';
import useMenuLike from '../utils/menuLikeHook';
import Image from 'next/image';

const StyledDiv = styled.div`
    background: linear-gradient(45deg, rgb(234 179 8 / var(--tw-bg-opacity))0%, rgb(234 179 8 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity))40%, rgb(22 163 74 / var(--tw-bg-opacity)) 100%);
`;

type propsType = {
    selected: menuArrayType,
    sessionCheck: boolean,
}

const MenusBanner = ({ selected, sessionCheck }: propsType) => {
    const { isLike, menuLike, menuLikeHandler } = useMenuLike(selected.name);

    return (
        <StyledDiv className="absolute w-screen min-w-[1024px] right-0 mx-auto h-[300px] grid grid-cols-6 bg-white overflow-hidden">
            {/*메뉴 간단정보*/}
            <div className="col-span-3 h-[300px]">
                <Image width={600} height={600} src={`/images/sandwich_menu/${selected.name}.png`} alt={selected.name} className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></Image>
            </div>
            <div className="col-span-3 whitespace-pre-line flex flex-col justify-center">
                <div className='flex flex-row items-center text-white pb-4'>
                    <h1 className='font-bold text-3xl mr-4'>{selected.name}</h1>
                    <button className='flex items-center text-xl' onClick={() => menuLikeHandler()}>
                        {isLike ? <PiHeartStraightFill className='inline-block' /> : <PiHeartStraight className='inline-block' />}{menuLike}
                    </button>
                </div>
                <div className='text-white/70 mb-2'>{selected.summary}</div>
                <div className='flex flex-row'>{selected.ingredients.map((item) =>
                    <Image width={100} height={100} src={'/images/sandwich_menu/ingredients/' + item} key={item} className='object-cover w-10 aspect-square rounded-md mr-1 mb-8' alt='item'></Image>
                )}</div>
                <div className='flex flex-row'>
                    <Link href={{
                        pathname: '/Recipes',
                        query: { param: selected.name }
                    }}
                        className='font-bold rounded-full px-3 py-2 mr-2 text-black bg-yellow-500 flex justify-center items-center'>자세히 보기<IoIosArrowForward className='inline-block text-xl' />
                    </Link>
                    {sessionCheck ? <Link href={{
                        pathname: '/AddRecipe',
                        query: { param: selected.name }
                    }}
                        className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center'>레시피 작성<RiPencilFill className='inline-block text-xl' />
                    </Link> :
                        <button className='font-bold rounded-full px-3 py-2 mr-2 text-white underline decoration-1 underline-offset-3 flex justify-center items-center' onClick={() => alert('로그인이 필요한 기능입니다')}>
                            레시피 작성<RiPencilFill className='inline-block text-xl' />
                        </button>}
                </div>
            </div>
        </StyledDiv>
    );
};

export default MenusBanner;