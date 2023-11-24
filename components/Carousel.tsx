import React, { RefObject, createRef, useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { recipeContextType } from '../interfaces/AddRecipe';
import Card from './Card';

const CarouselContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }

    /* Firefox */
    & {
        scrollbar-width: none;
    }
`
type PropsType = {
    recipeData: recipeContextType[];
};

const Carousel = ({ recipeData }: PropsType) => {
    const [recipeArray] = useState<recipeContextType[]>([...recipeData, ...recipeData]);
    const crouselRef = useRef<HTMLInputElement>(null);
    const [isMove] = useState<boolean>(true)

    //옵저버 객체 생성 및 탐지 요소 등록
    const recipeRefArray = useRef<RefObject<HTMLDivElement>[]>(recipeArray.map(() => createRef()));
    useEffect(() => {
        const observer = new IntersectionObserver(callback)
        recipeRefArray.current.forEach((ref, index) => {
            if (recipeArray[index]) {
                if (ref.current instanceof Element) {
                    observer.observe(ref.current);
                }
            }
        });

        let timer;
        if (isMove) {
            timer = setInterval(() => setCurrentCarousel(prev => prev + 1), 5000)
        }

        return () => {
            observer.disconnect();
            clearInterval(timer)
        };
    }, [])


    //요소가 감지되면 실행될 콜백
    const callback = (entries) => {
        entries.forEach((entry, _index) => {
            if (entry.isIntersecting === false && entry.target === recipeRefArray.current[recipeRefArray.current.length / 2 - 1].current) {
                if (crouselRef.current) {
                    crouselRef.current.scrollLeft = 12;//레시피 사이 여백을 감안해서 스크롤 위치를 다시 지정
                    setCurrentCarousel(0)
                }
            }
        });
    }

    //캐러셀 사용자가 움직이는 기능
    const [currentCarousel, setCurrentCarousel] = useState<number>(0);
    useEffect(() => {
        console.log(currentCarousel)
        recipeRefArray.current[currentCarousel].current!.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    }, [currentCarousel])

    return (
        <>
            <CarouselContainer className='max-w-[100vw] pt-12 p-5 flex flex-row overflow-scroll gap-2' ref={crouselRef}>
                {recipeArray.map((recipe, index) => (
                    <Card key={index} recipe={recipe} ref={recipeRefArray.current[index]} id={index}></Card>
                ))}
            </CarouselContainer>
            <button onClick={() => setCurrentCarousel(prev => (prev > 1) ? prev - 1 : 0)}>이전</button>
            <button onClick={() => setCurrentCarousel(prev => (prev < recipeRefArray.current.length - 1) ? prev + 1 : 0)}>다음</button>
        </>
    );
};

export default Carousel;
