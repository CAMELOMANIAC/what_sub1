import React, { useEffect, useRef, useState } from 'react';
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

const Carousel = ({recipeData}:PropsType) => {
    const [velocity,setVelocity] = useState<number>(0.5);
    const crouselRef = useRef<HTMLInputElement>(null);
    const carouselMoveHandler = () => {
        if (crouselRef.current) {
            crouselRef.current.scrollLeft += velocity;
            requestAnimationFrame(carouselMoveHandler);
        }
    }
    useEffect(()=>{
        const moveCarousel = requestAnimationFrame(carouselMoveHandler);

        return () => {
            cancelAnimationFrame(moveCarousel);
        }
    },[velocity])

    return (
    <>
        <CarouselContainer className='max-w-[100vw] pt-12 p-5 flex flex-row overflow-scroll gap-2' ref={crouselRef}>
            {recipeData.map((recipe, index) => (
                <Card key={index} recipe={recipe}></Card>
            ))}
        </CarouselContainer>
        <button onClick={()=>setVelocity(prev=> prev>0 ? -0.5 : 0.5)}>정지</button></>
    );
};

export default Carousel;
