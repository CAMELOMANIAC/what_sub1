import React, {
	Dispatch,
	MutableRefObject,
	ReactNode,
	RefObject,
	SetStateAction,
	useEffect,
} from 'react';
import {recipeType} from '../interfaces/api/recipes';

type PropsType = {
	children?: ReactNode;
	cardRefs: RefObject<HTMLDivElement[]>;
	carouselRef: RefObject<HTMLDivElement>;
	recipeArray: recipeType[];
	currentItemRef: MutableRefObject<number>;
	setCarouselItemName: Dispatch<SetStateAction<string>>;
};

const Carousel = ({
	children,
	cardRefs,
	recipeArray,
	carouselRef,
	currentItemRef,
	setCarouselItemName,
}: PropsType) => {
	//옵저버 객체 생성 및 탐지 요소 등록
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting === false) {
					cardRefs.current?.forEach((element, index) => {
						if (element === entry.target) {
							currentItemRef.current = index; //현재 보여지는 카드의 인덱스를 저장하는 Ref
							setCarouselItemName(
								//indexlogocomponent에 보여줄 이름을 설정하는 상태함수
								recipeArray[
									index > recipeArray.length * (2 / 3) //스크롤위치 초기화시 보여줄 레시피 이름 설정
										? 1
										: index + 1
								]?.recipe_name,
							);
						}
					});

					cardRefs.current?.forEach((element, index) => {
						if (
							//지정된 최대 위치 도달하면 스크롤 위치를 조정하는 코드
							cardRefs.current &&
							element === entry.target &&
							index === cardRefs.current.length * (2 / 3)
						) {
							if (carouselRef.current) {
								const startScroll =
									cardRefs.current[
										cardRefs.current.length * (1 / 3) + 1
									].offsetLeft;

								const parentOffset =
									carouselRef.current.offsetLeft;
								carouselRef.current.scrollLeft =
									startScroll - 8 - parentOffset; //레시피 사이 여백 8px - 부모 요소의 offsetLeft(hidden으로 숨겨진 컨테이너의 크기를 포함해야함)
							}
						}
					});
				}
			});
		});
		if (cardRefs.current) {
			for (const element of cardRefs.current) {
				observer.observe(element);
			}
		}
		return () => {
			observer.disconnect(); //옵저버 연결 해제
		};
	}, [
		cardRefs,
		carouselRef,
		currentItemRef,
		recipeArray,
		recipeArray.length,
		setCarouselItemName,
	]);

	return <>{children}</>;
};

export default Carousel;
