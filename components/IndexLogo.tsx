import React, {useEffect, useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import Logo from './Logo';
import SandwichBanner from './SandwichBanner';
import {useRouter} from 'next/router';
import {MdOutlineArrowBack} from 'react-icons/md';
import {MdOutlineArrowForward} from 'react-icons/md';

type PropsType = {
	prevHandler: () => void;
	nextHandler: () => void;
	carouselItemName: string;
};

const IndexLogo = ({prevHandler, nextHandler, carouselItemName}: PropsType) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isFocus, setFocus] = useState<boolean>(false);
	const divRef = useRef<HTMLDivElement>(null);
	const decoLineRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isFocus) {
			inputRef.current && inputRef.current.focus();
		}
	}, [isFocus]);

	useEffect(() => {
		const focusOutHandler = e => {
			//포커스 해제
			if (e.target !== inputRef.current && searchQuery === '') {
				setFocus(false);
			}
		};
		addEventListener('mousedown', focusOutHandler);
		return () => {
			removeEventListener('mousedown', focusOutHandler);
		};
	}, [searchQuery]);

	const router = useRouter();
	const searchEnterHandler = e => {
		//엔터 누르면 검색 페이지로 이동
		if (e.key === 'Enter') {
			queryPushHandler();
		}
	};
	const queryPushHandler = () => {
		if (searchQuery !== '') router.push(`/Recipes?query=${searchQuery}`);
		else router.push(`/Recipes`);
	};

	useEffect(() => {
		if (decoLineRef.current && divRef.current) {
			decoLineRef.current.style.position = `absolute`;
			decoLineRef.current.style.backgroundColor = `rgb(22 163 74)`;
			decoLineRef.current.style.width = `100%`;
			decoLineRef.current.style.height = `80px`;
			decoLineRef.current.style.left = `0px`;
			decoLineRef.current.style.top = `${divRef.current.offsetTop + divRef.current.offsetHeight / 2 - 40}px`;
			decoLineRef.current.style.zIndex = `-1`;
		}
	}, [divRef]);

	return (
		<div className="flex flex-col items-center justify-center mx-auto mb-4 rounded-full w-full">
			<SandwichBanner />
			<div className="flex flex-row">
				<button
					className="sm:flex justify-center items-center font-[seoul-metro] text-xl text-white mr-4 hidden"
					onClick={prevHandler}
					name="carouselPrev">
					<MdOutlineArrowBack className="text-2xl"></MdOutlineArrowBack>
					이전
				</button>
				<div
					className="w-fit max-w-[100vw] bg-white border-[12px] border-green-600 rounded-full px-6 py-2 flex flex-row justify-center items-center"
					ref={divRef}>
					<span className="justify-center items-center w-[70px] text-white text-4xl font-extrabold font-[seoul-metro] rounded-full bg-green-600 aspect-square sm:flex hidden">
						<button onClick={queryPushHandler} name="searchButton">
							<FaSearch />
						</button>
					</span>

					<div
						className="flex flex-col flex-nowrap justify-center items-center my-2 text-5xl"
						onClick={() => setFocus(true)}>
						{isFocus ? (
							<input
								className="p-3 mt-3 text-lg text-center font-bold"
								type="text"
								ref={inputRef}
								onChange={e =>
									setSearchQuery(e.currentTarget.value)
								}
								onKeyDown={searchEnterHandler}></input>
						) : (
							<Logo />
						)}
						<div className="font-[seoul-metro] text-gray-600 text-lg">
							{carouselItemName ? carouselItemName : '넌 뭐먹어?'}
						</div>
					</div>
				</div>
				<button
					className="sm:flex justify-center items-center font-[seoul-metro] text-xl text-white ml-4 hidden"
					onClick={nextHandler}
					name="carouselNext">
					다음
					<MdOutlineArrowForward className="text-2xl"></MdOutlineArrowForward>
				</button>
				<div ref={decoLineRef}></div>
			</div>
		</div>
	);
};

export default IndexLogo;
