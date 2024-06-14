import Image from 'next/image';
import React, {useEffect, useMemo, useState} from 'react';
import {PiHeartStraightFill, PiHeartStraight} from 'react-icons/pi';
import useMenuLike from '../../utils/menuLikeHook';
import {menuArray} from '../../utils/menuArray';
import {useQuery} from 'react-query';
import {useRouter} from 'next/router';
import RecipesBannerContainer from './RecipesBannerContainer';

type MenuItem = {
	name: string;
	ingredients: string[];
};
const ParamRecipesBanner = () => {
	const router = useRouter();

	const selected: MenuItem[] = useMemo(() => {
		if (router.isReady) {
			return menuArray.filter(
				item =>
					item.name ==
					String(router.query.param).replaceAll('+', ' '),
			);
		} else {
			return [];
		}
	}, [router.isReady, router.query.param]);

	//쿼리스트링 변경시
	useEffect(() => {
		if (router.isReady) {
			if (router.isReady && selected.length !== 0) {
				setSelectedName(selected[0]?.name);
			}
		}
	}, [router.isReady, router.query, selected]);

	const [selectedName, setSelectedName] = useState('');
	const {isLike, menuLikeHandler} = useMenuLike(selectedName);

	//추천 브레드 및 추천 소스관련내용
	const [breadTop, setBreadTop] = useState<string[]>();
	const [breadTopLike, setBreadTopLike] = useState<string[]>();
	const [breadTopOccurrence, setBreadTopOccurrence] = useState<string[]>();
	const [sauceTop, setSauceTop] = useState<string[][]>();
	const [sauceTopLike, setSauceTopLike] = useState<string[]>();
	const [sauceTopOccurrence, setSauceTopOccurrence] = useState<string[]>();
	const [menuLike, setMenuLike] = useState<string>();
	const [menuRecipe, setMenuRecipe] = useState<string>();
	const [recipeLike, setRecipeLike] = useState<string>();

	const paramQuery = encodeURIComponent(String(router.query.param));

	useQuery(
		['bread', paramQuery],
		async ({queryKey}) => {
			const [, param] = queryKey;
			const response = await fetch(
				`/api/menus/ingredients/bread?sandwichMenu=${param}`,
			);
			if (response.ok) {
				return await response.json();
			} else {
				throw new Error('실패');
			}
		},
		{
			enabled: !!router.query.param,
			onError: error => console.log(error),
			onSuccess: data => {
				let parsedResult = data.map(item => item?.recipe_ingredients);
				setBreadTop(parsedResult);
				parsedResult = data.map(item => item?.likes);
				setBreadTopLike(parsedResult);
				parsedResult = data.map(item => item?.occurrence);
				setBreadTopOccurrence(parsedResult);
			},
		},
	);
	useQuery(
		['sauce', paramQuery],
		async ({queryKey}) => {
			const [, param] = queryKey;
			const response = await fetch(
				`/api/menus/ingredients/sauce?sandwichMenu=${param}`,
			);
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('실패');
			}
		},
		{
			enabled: !!router.query.param,
			onError: error => console.log(error),
			onSuccess: data => {
				let parsedResult = data.map(item =>
					item?.combined_ingredients?.split(', '),
				);
				setSauceTop(parsedResult);
				parsedResult = data.map(item => item?.likes);
				setSauceTopLike(parsedResult);
				parsedResult = data.map(item => item?.occurrence);
				setSauceTopOccurrence(parsedResult);
			},
		},
	);
	useQuery(
		['menuInfo', paramQuery],
		async ({queryKey}) => {
			const [, param] = queryKey;
			const response = await fetch(`/api/menus/${param}`);
			if (response.ok) {
				return await response.json();
			} else {
				throw new Error('실패');
			}
		},
		{
			enabled: !!router.query.param,
			onSuccess: data => {
				setMenuLike(data[0].like_count);
				setMenuRecipe(data[0].recipe_count);
				setRecipeLike(data[0].recipe_like_count);
			},
		},
	);

	return (
		<RecipesBannerContainer>
			<section className="flex flex-row pb-5 pl-4 border-l">
				<div className="inline-block w-[100px] overflow-hidden relative rounded-md aspect-square">
					<Image
						width={350}
						height={350}
						src={`/images/sandwich_menu/${selected[0].name}.png`}
						alt={`${selected[0].name}.png`}
						className="relative object-cover scale-[2.7] origin-[85%_40%]"></Image>
				</div>
				<div className="whitespace-pre-line">
					<div className="flex items-center m-2">
						<h1 className="font-bold text-3xl inline text-black pb-4">
							{selected[0].name}
						</h1>
						<button
							className="flex items-center text-xl"
							onClick={menuLikeHandler}>
							{isLike ? (
								<PiHeartStraightFill className="inline-block" />
							) : (
								<PiHeartStraight className="inline-block" />
							)}
						</button>
					</div>
					<div className="flex flex-row text-sm m-2">
						<div className="border-l w-28 px-3">
							<div className="text-gray-500">메뉴 좋아요</div>
							<div className="font-bold">{menuLike}</div>
						</div>
						<div className="border-l w-28 px-3">
							<div className="text-gray-500">레시피 좋아요</div>
							<div className="font-bold">{recipeLike}</div>
						</div>
						<div className="border-l w-28 px-3">
							<div className="text-gray-500">레시피 수</div>
							<div className="font-bold">{menuRecipe}</div>
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row max-h-0 sm:max-h-[1000px] transition-all duration-500 ease-in-out overflow-hidden">
				<article className="md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3">
					<span className=" font-bold">추천 브레드 top3</span>
					<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
						<span className="col-span-5 text-left">브레드</span>
						<span className="col-span-2">조합 선택율</span>
						<span className="col-span-2">좋아요 수</span>
					</div>
					{Array.isArray(breadTop) &&
						breadTop.map((item, index) => (
							<div
								key={item}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row breadTest">
								<span className="col-span-5 flex items-center justify-start">
									<Image
										width={70}
										height={70}
										src={
											'/images/sandwich_menu/ingredients/' +
											item +
											'.jpg'
										}
										alt={item}
										className="w-12 aspect-square inline object-cover"
									/>
									{item}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black font-bold">
									{breadTopOccurrence &&
										Math.round(
											(parseInt(
												breadTopOccurrence[index],
											) /
												parseInt(menuRecipe!)) *
												100,
										)}
									%
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black font-bold">
									{breadTopLike && breadTopLike[index]}
								</span>
							</div>
						))}
				</article>
				<article className="md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0">
					<span className=" font-bold">추천 소스 top3</span>
					<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
						<span className="col-span-5 text-left">조합법</span>
						<span className="col-span-2">조합 선택율</span>
						<span className="col-span-2">좋아요 수</span>
					</div>
					{Array.isArray(sauceTop) &&
						sauceTop.map((item, index) => (
							<div
								key={index}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row sauceTest">
								<span className="col-span-5 flex items-center justify-start">
									{item.map(
										(
											subItem,
											subIndex, //<React.Fragment>태그를 이용하면 실제 렌더링하지 않고 태그를 묶어서 사용할 수 있고 속성도 사용할수있다 (<></>은 똑같지만 속성 못 씀)
										) => (
											<React.Fragment
												key={subItem + subIndex}>
												{subIndex !== 0 && '+'}
												<Image
													width={50}
													height={50}
													src={
														'/images/sandwich_menu/ingredients/' +
														subItem +
														'.jpg'
													}
													alt={subItem}
													className="w-12 aspect-square inline object-cover"
												/>
											</React.Fragment>
										),
									)}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black font-bold">
									{sauceTopOccurrence &&
										Math.round(
											(parseInt(
												sauceTopOccurrence[index],
											) /
												parseInt(menuRecipe!)) *
												100,
										)}
									%
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black font-bold">
									{sauceTopLike && sauceTopLike[index]}
								</span>
							</div>
						))}
				</article>
			</section>
		</RecipesBannerContainer>
	);
};

export default ParamRecipesBanner;
