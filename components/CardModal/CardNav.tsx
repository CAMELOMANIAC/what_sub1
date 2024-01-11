import React, { useRef } from 'react';
import { BiSolidBaguette, BiSolidCheese } from 'react-icons/bi';
import { GiTomato, GiKetchup } from 'react-icons/gi';
import { MdOutdoorGrill, MdSummarize } from 'react-icons/md';

type props = {
    className: string;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number
}

const Nav = ({ className, setPage, page }: props) => {
    const buttonArray = [
        { name: '소개', icon: <MdSummarize className='inline ml-3' /> },
        { name: '빵', icon: <BiSolidBaguette className='inline ml-3' /> },
        { name: '치즈', icon: <BiSolidCheese className='inline ml-3' /> },
        { name: '토스팅 여부', icon: <MdOutdoorGrill className='inline ml-3' /> },
        { name: '채소', icon: <GiTomato className='inline ml-3' /> },
        { name: '소스', icon: <GiKetchup className='inline ml-3' /> },
    ]

    const buttons = (index: number, name: string, icon: React.JSX.Element) => {
        return (
            <li className='relative grow border-r-8 border-green-600 flex items-center'>
                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                <button className='mr-5 hover:text-lg transition-all duration-200' onClick={() => setPage(index)}>{name}{icon}</button>
            </li>
        )
    }

    return (
        <nav className={className}>
            <img src='/images/front_banner.png' width={50} className='absolute' style={{ transform: `translateY(${page * 100}px)` }}></img>
            <ul className='h-full py-10 font-bold flex flex-col items-end '>
                {buttonArray.map((items, index) => buttons(index, items.name, items.icon))}
            </ul>
        </nav>
    );
};

export default Nav;