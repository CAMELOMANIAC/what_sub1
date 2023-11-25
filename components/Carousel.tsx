import React, { Dispatch, ReactNode, RefObject, SetStateAction, useEffect } from 'react';
import { recipeContextType } from '../interfaces/AddRecipe';

type PropsType = {
    children?: ReactNode,
    cardRefs: RefObject<HTMLDivElement[]>,
    crouselRef: RefObject<HTMLDivElement>,
    recipeArray: recipeContextType[],
    setCurrentItem:Dispatch<SetStateAction<number>>
};

const Carousel = ({ children, cardRefs,recipeArray,crouselRef,setCurrentItem }: PropsType) => {
    //옵저버 객체 생성 및 탐지 요소 등록
    useEffect(() => {
        const observer = new IntersectionObserver(callback)
        for (const key in cardRefs) {
            if (key!=='current') {
                observer.observe(cardRefs[key]);
            }
        }
        return () => {
            observer.disconnect(); //옵저버 연결 해제
        }
    }, [cardRefs])

    //요소가 감지되면 실행될 콜백
    const callback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting === false && entry.target === cardRefs[recipeArray.length /2 -1]) {
                if (crouselRef.current) {
                    crouselRef.current.scrollLeft = 12;//레시피 사이 여백을 감안해서 스크롤 위치를 처음으로 되돌림
                    setCurrentItem(0)
                }
            }
        });

    }


    return (
        <>
            {children}
        </>
    );
};

export default Carousel;
