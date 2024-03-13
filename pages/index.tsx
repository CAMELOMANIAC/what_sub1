import Carousel from '../components/Carousel';
import IndexLogo from '../components/IndexLogo';
import { recipeType } from '../interfaces/api/recipes';

import Card from '../components/Card';
import { styled } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookieValue, loadMenuLike, loadRecipeLike } from '../utils/publicFunction';
import { actionLoginChangeId, actionSetMenuLike, actionSetRecipeLike } from '../redux/reducer/userReducer';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';

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
	const router = useRouter();
	const dispatch = useDispatch();

	const recipeLikeQuery = useQuery('recipeLike', loadRecipeLike, { enabled: false });
	const menuLikeQuery = useQuery('menuLike', loadMenuLike, { enabled: false });

	const kakaoLoginQuery = useQuery('kakaoLogin', async () => {
		const kakaoCode = getCookieValue('kakaoCode');
		const response = await fetch(`/api/users/kakao/login?kakaoCode=${kakaoCode}`);
		switch (response.status) {
			case 204: throw new Error('회원이 존재하지 않습니다. 회원가입 페이지로 이동합니다.');
			case 400: throw new Error('잘못된 요청입니다.');
		}
	}, {
		enabled: false,
		onSuccess: async () => {
			//새로고침시에 쿠키값을 가져와서 로그인여부를 판단하고 전역상태로 저장
			dispatch(actionLoginChangeId(getCookieValue('user')))
			//레시피 좋아요 정보를 전역 상태값으로 저장
			const { data: recipeLikeData } = await recipeLikeQuery.refetch();
			dispatch(actionSetRecipeLike(recipeLikeData.map(item => item.recipe_table_recipe_id)));

			//메뉴좋아요 정보를 전역 상태값으로 저장
			const { data: menuLikeData } = await menuLikeQuery.refetch();
			dispatch(actionSetMenuLike(menuLikeData.map(item => item.sandwich_table_sandwich_name)));
		},
		onError: (error: Error) => {
			alert(error.message)
			router.push('/Register')
		}
	})
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
		<main className=' w-full max-w-screen-xl min-w-[640px] mx-auto'>
			<IndexLogo prevHandler={prevItem} nextHandler={nextItem} />
			<Carousel cardRefs={cardRefs} recipeArray={recipeArray} crouselRef={crouselRef}>
				<CarouselContainer className='w-screen max-w-screen-xl min-w-[640px] pt-12 p-5 flex flex-row gap-2 overflow-x-auto' ref={crouselRef}>
					{recipeArray.map((recipe, index) => (
						<Card key={index} recipe={recipe} ref={(element) => cardRefs[index] = element} className=''></Card>
					))}
				</CarouselContainer>
			</Carousel>
		</main>
	)
}

export default IndexPage