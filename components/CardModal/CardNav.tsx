import React, { useEffect, useRef, useState } from 'react';
import { BiSolidBaguette, BiSolidCheese } from 'react-icons/bi';
import { GiTomato, GiKetchup, GiMeat } from 'react-icons/gi';
import { MdOutdoorGrill, MdSummarize } from 'react-icons/md';

type props = {
    className: string;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    page: number
}

const Nav = ({ className, setPage, page }: props) => {
    const buttonRefArray = useRef<HTMLLIElement[] | null[]>([]);
    const [sandwichY, setSandwichY] = useState<number>(0);
    const sandwichRef = useRef<HTMLImageElement>(null);

    const buttonArray = [
        { name: '소개', icon: <MdSummarize className='inline ml-3' /> },
        { name: '미트', icon: <GiMeat className='inline ml-3' /> },
        { name: '빵', icon: <BiSolidBaguette className='inline ml-3' /> },
        { name: '치즈', icon: <BiSolidCheese className='inline ml-3' /> },
        { name: '토스팅', icon: <MdOutdoorGrill className='inline ml-3' /> },
        { name: '채소', icon: <GiTomato className='inline ml-3' /> },
        { name: '소스', icon: <GiKetchup className='inline ml-3' /> },
    ]

    const buttons = (index: number, name: string, icon: React.JSX.Element) => {
        return (
            <li className='relative grow border-r-8 border-green-600 flex items-center' key={name} ref={(element) => buttonRefArray.current[index] = element}>
                <div className='absolute bg-white w-[18px] h-[18px] translate-x-[13px] right-0 rounded-full border-[3px] border-green-600'></div>
                <button className='mr-5 transition-all duration-200' onClick={() => setPage(index)}>
                    {name}{icon}
                </button>
            </li>
        )
    }

    //크기변화를 감지하는 ResizeObserver API
    //li태그가 렌더링 이후에 크기가 변하므로 li태그 크기에 맞게 샌드위치(네비게이션 아이콘)를 조정하도록함
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (sandwichRef.current) {
                sandwichRef.current.style.height = `${buttonRefArray.current[0]?.offsetHeight}px`;
            }
        });

        if (buttonRefArray.current[0]) {
            resizeObserver.observe(buttonRefArray.current[0]);
        }

        return () => {
            if (buttonRefArray.current[0]) {
                resizeObserver.unobserve(buttonRefArray.current[0]);
            }
        };
    }, []);

    useEffect(() => {
        if (sandwichRef.current) {
            sandwichRef.current.style.top = `${sandwichY}px`;
        }
    }, [sandwichY])

    useEffect(() => {
        const parentTop = buttonRefArray.current[page]?.offsetParent?.getBoundingClientRect().top
        const childTop = buttonRefArray.current[page]?.getBoundingClientRect().top;
        setSandwichY(childTop! - parentTop!);
    }, [page])

    return (
        <nav className={className}>
            <img src='/images/front_banner.png' className='absolute left-10 transition-all duration-200' ref={sandwichRef}></img>
            <ul className='h-full font-bold flex flex-col items-end '>
                {buttonArray.map((items, index) => buttons(index, items.name, items.icon))}
            </ul>
        </nav>
    );
};

export default Nav;