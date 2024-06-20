import Carousel from '../components/Carousel';
import IndexLogo from '../components/IndexLogo';
import {recipeType} from '../interfaces/api/recipes';

import Card from '../components/Card';
import {styled} from 'styled-components';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import {
	getCookieValue,
	loadMenuLike,
	loadRecipeLike,
} from '../utils/publicFunction';
import {
	actionLoginChangeId,
	actionSetMenuLike,
	actionSetRecipeLike,
} from '../redux/reducer/userReducer';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';

const CarouselContainer = styled.article`
	&::-webkit-scrollbar {
		display: none;
	}

	/* Firefox */
	& {
		scrollbar-width: none;
	}
`;

export async function getServerSideProps() {
	//보여줄 레시피 가져오기
	const loadTotalMenuInfo = async () => {
		const result = await fetch(`${process.env.URL}/api/recipes`);
		return result.json();
	};
	return {
		props: {recipeData: await loadTotalMenuInfo()},
	};
}

const IndexPage = ({recipeData}: {recipeData: recipeType[]}) => {
	const [recipeArray] = useState([
		...recipeData,
		...recipeData,
		...recipeData,
	]);

	const cardRefs = useRef<HTMLDivElement[]>([]);
	const carouselRef = useRef<HTMLDivElement>(null);
	const [isMoving, setIsMoving] = useState<boolean>(false);
	const router = useRouter();
	const dispatch = useDispatch();

	const kakaoLoginQuery = useQuery(
		'kakaoLogin',
		async () => {
			const kakaoCode = getCookieValue('kakaoCode');
			const response = await fetch(
				`/api/users/kakao/login?kakaoCode=${kakaoCode}`,
			);
			switch (response.status) {
				case 204:
					throw new Error(
						'회원이 존재하지 않습니다. 회원가입 페이지로 이동합니다.',
					);
				case 400:
					throw new Error('잘못된 요청입니다.');
			}
			if (response.ok) {
				return response.json();
			}
		},
		{
			enabled: !!router.query.param,
			onError: (error: Error) => {
				alert(error.message);
				router.push('/Register');
			},
		},
	);

	const {data: recipeLikeData} = useQuery('recipeLike', loadRecipeLike, {
		enabled: false,
	});

	const {data: menuLikeData} = useQuery('menuLike', loadMenuLike, {
		enabled: false,
	});

	useEffect(() => {
		if (kakaoLoginQuery.isSuccess) {
			dispatch(actionLoginChangeId(getCookieValue('user')));
		}
		if (recipeLikeData) {
			dispatch(
				actionSetRecipeLike(
					recipeLikeData.map(item => item.recipe_table_recipe_id),
				),
			);
		}
		if (menuLikeData) {
			dispatch(
				actionSetMenuLike(
					menuLikeData.map(item => item.sandwich_table_sandwich_name),
				),
			);
		}
	}, [kakaoLoginQuery.isSuccess, recipeLikeData, menuLikeData, dispatch]);

	const kakaoLoginQueryRef = useRef(kakaoLoginQuery);

	useEffect(() => {
		const kakaoCode = getCookieValue('kakaoCode');
		if (kakaoCode) {
			kakaoLoginQueryRef.current.refetch();
		}
	}, [router.isReady]);

	//캐러셀
	useEffect(() => {
		let animationId;

		const carouselMove = () => {
			//자동으로 우측으로 스크롤
			if (isMoving === true) {
				cancelAnimationFrame(animationId);
			} else {
				animationId = requestAnimationFrame(carouselMove);
				if (carouselRef.current) {
					carouselRef.current.scrollLeft += 1;
				}
			}
		};
		animationId = requestAnimationFrame(carouselMove);

		return () => {
			cancelAnimationFrame(animationId);
		};
	}, [isMoving]);

	const currentItemRef = useRef<number>(0);
	useEffect(() => {
		cardRefs.current &&
			isMoving &&
			carouselRef.current?.scrollTo({
				behavior: 'smooth',
				left:
					cardRefs.current[currentItemRef.current + 1].offsetLeft -
					8 -
					carouselRef.current.offsetLeft,
			});
	}, [isMoving]);

	//setTimeout변수를 저장한 타이머 변수가 렌더링시 매번 초기화되어서 (상태값을 변경하니까 변수들은 초기화됨)
	//clearTimeout으로 지워지지 않았는데 useRef로 timer변수의 참조를 저장하면 렌더링해도 초기화되지 않음
	const timer = useRef<NodeJS.Timeout>();
	const prevItem = () => {
		currentItemRef.current -= 1;
		setIsMoving(true);
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			setIsMoving(false);
		}, 500);
	};

	const nextItem = () => {
		currentItemRef.current + 1 > recipeArray.length * (2 / 3)
			? (currentItemRef.current = recipeArray.length * (1 / 3) + 1)
			: (currentItemRef.current += 1);
		setIsMoving(true);
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			setIsMoving(false);
		}, 500);
	};

	const [carouselItemName, setCarouselItemName] = useState<string>('');

	return (
		<div className="w-screen mx-auto">
			<IndexLogo
				prevHandler={prevItem}
				nextHandler={nextItem}
				carouselItemName={carouselItemName}
			/>
			<Carousel
				cardRefs={cardRefs}
				recipeArray={recipeArray}
				carouselRef={carouselRef}
				currentItemRef={currentItemRef}
				setCarouselItemName={setCarouselItemName}>
				<CarouselContainer
					className="w-screen mx-auto max-w-5xl left-0 p-0 sm:p-12 my-auto flex flex-row gap-2 overflow-x-auto overflow-y-hidden transition-all duration-500 ease-in-out max-h-0 sm:max-h-[400px]"
					ref={carouselRef}>
					{cardRefs.current &&
						recipeArray.map((recipe, index) => (
							<Card
								key={index}
								recipe={recipe}
								ref={element => {
									if (
										element &&
										!cardRefs.current.includes(element)
									) {
										cardRefs.current.push(element);
									}
								}}
								className=""></Card>
						))}
				</CarouselContainer>
			</Carousel>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-flow-row gap-2 max-w-[1024px] p-4 w-full sm:hidden">
				{recipeArray.map((recipe, index) => (
					<Card key={index} recipe={recipe}></Card>
				))}
			</div>
		</div>
	);
};

export default IndexPage;
