import Carousel from '../components/Carousel';
import IndexLogo from '../components/IndexLogo';
import { recipeType } from '../interfaces/api/recipes';

import Card from '../components/Card';
import { styled } from 'styled-components';
import { useEffect, useRef, useState } from 'react';

const CarouselContainer = styled.div`
    &::-webkit-scrollbar {
        display: none;
    }

    /* Firefox */
    & {
        scrollbar-width: none;
    }
`

export async function getServerSideProps() {
	//보여줄 레시피 가져오기
	const loadTotalMenuInfo = async () => {
		const result = await fetch(`${process.env.URL}/api/recipes`);
		return result.json();
	}
	return {
		props: { recipeData: await loadTotalMenuInfo() },
	};
}

const IndexPage = ({ recipeData }: { recipeData: recipeType[] }) => {
	const [recipeArray] = useState([...recipeData, ...recipeData]);
	const cardRefs = useRef<HTMLDivElement[]>([]);
	const crouselRef = useRef<HTMLDivElement>(null);
	const [isMoving, setIsMoving] = useState<boolean>(true);

	useEffect(() => {
		let animationId;

		const carouselMove = () => {
			// 애니메이션 코드
			if (isMoving === false) {
				cancelAnimationFrame(animationId);
			} else {
				animationId = requestAnimationFrame(carouselMove);
				if (crouselRef.current) {
					crouselRef.current.scrollLeft += 1;
				}
			}
		};
		animationId = requestAnimationFrame(carouselMove);

		return () => {
			cancelAnimationFrame(animationId);
		}
	}, [isMoving])

	//캐러셀 사용자가 움직이는 기능
	const [currentItem, setCurrentItem] = useState<number>(0);

	useEffect(() => {
		cardRefs[currentItem].scrollIntoView({ behavior: 'smooth', inline: 'start' })
		console.log(currentItem)
	}, [currentItem])

	//setTimeout변수를 저장한 타이머 변수가 렌더링시 매번 초기화되어서 (상태값을 변경하니까 변수들은 초기화됨)
	//clearTimeout으로 지워지지 않았는데 useRef로 timer변수의 참조를 저장하면 렌더링해도 초기화되지 않음
	const timer = useRef<NodeJS.Timeout>();
	const prevItem = () => {
		setCurrentItem(prev => (prev > 1) ? prev - 1 : recipeArray.length / 2 - 1);
		setIsMoving(false);
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			setIsMoving(true);
		}, 500);
	};

	const nextItem = () => {
		setCurrentItem(prev => (prev < recipeArray.length / 2 - 1) ? prev + 1 : 0)
		setIsMoving(false);
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			setIsMoving(true);
		}, 500);
	};

	return (
		<main className=' w-full max-w-screen-xl mx-auto'>
			<IndexLogo prevHandler={prevItem} nextHandler={nextItem} />
			<Carousel cardRefs={cardRefs} recipeArray={recipeArray} crouselRef={crouselRef}>
				<CarouselContainer className='max-w-[100vw] pt-12 p-5 flex flex-row gap-2 overflow-x-auto' ref={crouselRef}>
					{recipeArray.map((recipe, index) => (
						<Card key={index} recipe={recipe} ref={(element) => cardRefs[index] = element} className=''></Card>
					))}
				</CarouselContainer>
			</Carousel>
		</main>
	)
}

export default IndexPage