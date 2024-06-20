import Image from 'next/image';
import React, {useEffect, useRef, useState} from 'react';
import {BiSolidBaguette, BiSolidCheese} from 'react-icons/bi';
import {GiTomato, GiKetchup, GiMeat} from 'react-icons/gi';
import {MdOutdoorGrill, MdSummarize} from 'react-icons/md';

type props = {
	className: string;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	page: number;
};

const CardHorizontalNav = ({className, setPage, page}: props) => {
	const buttonRefArray = useRef<HTMLLIElement[] | null[]>([]);
	const [sandwichX, setSandwichX] = useState<number>(0);
	const sandwichRef = useRef<HTMLImageElement>(null);

	const buttonArray = [
		{name: '소개', icon: <MdSummarize className="inline ml-3" />},
		{name: '미트', icon: <GiMeat className="inline ml-3" />},
		{name: '빵', icon: <BiSolidBaguette className="inline ml-3" />},
		{name: '치즈', icon: <BiSolidCheese className="inline ml-3" />},
		{name: '토스팅', icon: <MdOutdoorGrill className="inline ml-3" />},
		{name: '채소', icon: <GiTomato className="inline ml-3" />},
		{name: '소스', icon: <GiKetchup className="inline ml-3" />},
	];

	const buttons = (index: number, name: string) => {
		return (
			<li
				className="relative col-span-1 grow border-b-8 border-green-600 flex items-center justify-center"
				key={name}
				ref={element => (buttonRefArray.current[index] = element)}>
				<div className="absolute bg-white w-[18px] h-[18px] right-1/2 bottom-0 translate-x-1/2 translate-y-[13px] rounded-full border-[3px] border-green-600"></div>
				<button className="mb-4" onClick={() => setPage(index)}>
					{name}
				</button>
			</li>
		);
	};

	//크기변화를 감지하는 ResizeObserver API
	//li태그가 렌더링 이후에 크기가 변하므로 li태그 크기에 맞게 샌드위치(네비게이션 아이콘)를 조정하도록함
	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			if (sandwichRef.current) {
				sandwichRef.current.style.width = `${buttonRefArray.current[0]?.offsetHeight}px`;
			}
		});

		if (buttonRefArray.current[0]) {
			resizeObserver.observe(buttonRefArray.current[0]);
		}

		const currentButtonRefArray = buttonRefArray.current[0];
		return () => {
			if (currentButtonRefArray) {
				resizeObserver.unobserve(currentButtonRefArray);
			}
		};
	}, []);

	useEffect(() => {
		if (sandwichRef.current) {
			sandwichRef.current.style.left = `${sandwichX}px`;
		}
	}, [sandwichX]);

	useEffect(() => {
		const parentTop =
			buttonRefArray.current[page]?.offsetParent?.getBoundingClientRect()
				.left;
		const childTop =
			buttonRefArray.current[page]?.getBoundingClientRect().left;
		setSandwichX(childTop! - parentTop!);
	}, [page]);

	return (
		<nav className={className}>
			<ul className="h-full font-bold items-end grid grid-cols-7 mb-4">
				{buttonArray.map((items, index) => buttons(index, items.name))}
			</ul>
			<Image
				src="/images/front_banner.png"
				className="absolute transition-all duration-200 transform -translate-y-1/2"
				ref={sandwichRef}
				alt="front_banner"
				width={60}
				height={100}
			/>
		</nav>
	);
};

export default CardHorizontalNav;
