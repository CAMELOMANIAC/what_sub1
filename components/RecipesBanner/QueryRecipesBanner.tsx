import Link from 'next/link';
import React, {RefObject, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {BsFillCheckSquareFill} from 'react-icons/bs';
import {HiFilter} from 'react-icons/hi';
import SearchBar from '../SearchBar';
import {useDispatch, useSelector} from 'react-redux';
import {
	set_filter_action,
	add_Filter_action,
} from '../../redux/reducer/pageReducer';
import {RootState} from '../../redux/store';
import Image from 'next/image';
import {styled} from 'styled-components';
import {totalMenuInfoType} from '../../interfaces/api/menus';
import {filterType, recipeType} from '../../interfaces/api/recipes';

export const StyleTag = styled.button`
	height: 100%;
	display: inline-block;
	border: 1px solid gray;
	border-radius: 9999px;
	border-color: rgb(107 114 128);
	margin-right: 0.1rem;
	padding: 0.1rem 0.5rem 0.1rem 0.5rem;
	font-size: 0.875rem;
	color: rgb(107 114 128);
`;
type Props = {
	menuData: totalMenuInfoType[];
	recipeData: recipeType[];
	parentRef: RefObject<HTMLDivElement>;
};

const QueryRecipesBanner = ({menuData, recipeData, parentRef}: Props) => {
	const dispatch = useDispatch();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [refReady, setRefReady] = useState<Array<number>>([]);

	useEffect(() => {
		const updatePosition = () => {
			if (buttonRef.current && containerRef.current) {
				const rect = buttonRef.current.getBoundingClientRect();
				containerRef.current.style.left = `${rect.left + buttonRef.current.offsetWidth}px`;
				containerRef.current.style.top = `${rect.top}px`;
			}
		};
		window.addEventListener('resize', updatePosition);

		//컴포넌트가 마운트되면서 ref객체가 생성됨을 감지하지 못하므로 observer객체를 생성하여 감지
		const buttonRefObserver = new MutationObserver(() => {
			//요소가 변경됨을 감지하는 observer객체 생성
			setRefReady(prev => [...prev, 0]);
		});

		if (buttonRef.current) {
			buttonRefObserver.observe(buttonRef.current, {
				attributes: true, //dom의 속성 변경을 감지
				childList: true, //자식 노드의 추가, 삭제를 감지
				subtree: true, //하위 노드까지 모두 감지
			});
		}
		const containerRefObserver = new MutationObserver(() => {
			//요소가 변경됨을 감지하는 observer객체 생성
			setRefReady(prev => [...prev, 1]);
		});

		if (containerRef.current) {
			containerRefObserver.observe(containerRef.current, {
				attributes: true, //dom의 속성 변경을 감지
				childList: true, //자식 노드의 추가, 삭제를 감지
				subtree: true, //하위 노드까지 모두 감지
			});
		}

		return () => {
			window.removeEventListener('resize', updatePosition);
			buttonRefObserver.disconnect();
			containerRefObserver.disconnect();
			setRefReady([]);
		};
	}, []);

	useEffect(() => {
		//refReady가 변경되면 위치 재조정
		if (buttonRef.current && containerRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			containerRef.current.style.left = `${rect.left + buttonRef.current.offsetWidth}px`;
			containerRef.current.style.top = `${rect.top}px`;
		}
	}, [refReady]);

	//검색 필터 관련
	const queryFilterArray = [
		filterType.menuName,
		filterType.recipeName,
		filterType.writer,
		filterType.ingredients,
		filterType.tag,
	];
	const [isFilter, setIsFilter] = useState<boolean>(false);
	const filterState = useSelector(
		(state: RootState) => state.page.FILTER_ARRAY,
	);
	const setFilter = filter => {
		dispatch(set_filter_action(filter));
	};
	const addFilter = filter => {
		dispatch(add_Filter_action(filter));
	};

	return (
		<div className={`relative bg-white border-gray-200 w-full`}>
			<div className="mx-auto pt-4 md:pb-8 max-w-[1024px]">
				<section className="sm:pb-8 pb-2">
					<div className="flex flex-row justify-start items-center my-2 sticky">
						<SearchBar className="ml-0 mr-2" />
						<div className="relative z-10">
							{parentRef.current &&
								ReactDOM.createPortal(
									/*검색 필터옵션 */
									<div
										className={`absolute bg-white z-10 top-0 border w-fit ${isFilter ? '' : 'hidden'}`}
										ref={containerRef}>
										<ul className=" p-1">
											{queryFilterArray.map(item => (
												<li
													key={item}
													className="text-sm flex flex-row p-1">
													<label>
														{
															<input
																type="checkbox"
																value={item}
																id={item}
																checked={filterState.includes(
																	item,
																)}
																onChange={() =>
																	filterState.includes(
																		item,
																	)
																		? setFilter(
																				filterState.filter(
																					filterItem =>
																						filterItem !==
																						item,
																				),
																			)
																		: addFilter(
																				item,
																			)
																}
																className="peer invisible absolute"></input>
														}
														<BsFillCheckSquareFill className="relative w-6 h-6 mr-2 text-white border rounded peer-checked:text-green-600 peer-checked:border-0"></BsFillCheckSquareFill>
													</label>
													<label
														htmlFor={item}
														className="my-auto flex items-center w-max">
														{item}
													</label>
												</li>
											))}
										</ul>
									</div>,
									parentRef.current,
								)}
							<button
								className="relative text-green-600 text-2xl w-[42px] h-[42px] text-center align-middle flex justify-center items-center z-10"
								onClick={() =>
									!isFilter
										? setIsFilter(true)
										: setIsFilter(false)
								}
								ref={buttonRef}>
								<HiFilter
									className={`${isFilter ? 'rotate-90' : 'rotate-0'} transition-all duration-500`}
								/>
							</button>
						</div>
					</div>
					<Link href={`/Recipes?query=달콤&filter=태그`}>
						<StyleTag>#달콤</StyleTag>
					</Link>
					<Link
						href={`/Recipes?query=로스티드 치킨&filter=${[filterType.menuName]}`}>
						<StyleTag>로스티드 치킨</StyleTag>
					</Link>
					<Link
						href={`/Recipes?query=허니머스타드&filter=${[filterType.ingredients]}`}>
						<StyleTag>허니머스타드</StyleTag>
					</Link>
					<span className="text-sm text-gray-500">
						으로 검색해보세요
					</span>
				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row max-h-0 sm:max-h-[1000px] transition-all duration-500 ease-in-out overflow-hidden">
					<article className="md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3">
						<span className=" font-bold">추천 메뉴 top3</span>
						<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
							<span className="col-span-5 text-left">메뉴</span>
							<span className="col-span-2">메뉴 좋아요</span>
							<span className="col-span-2">레시피 수</span>
						</div>
						{Array.isArray(menuData) &&
							menuData.map((item, index) => (
								<div
									key={index}
									className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row my-2">
									<span className="col-span-5 flex items-center justify-start">
										<span className="w-10 aspect-square overflow-hidden rounded-md">
											<Image
												width={100}
												height={100}
												src={`/images/sandwich_menu/${item.sandwich_name}.png`}
												className="relative object-cover scale-[2.7] origin-[85%_40%]"
												alt="item.sandwich_name"></Image>
										</span>
										<span className="text-black ml-1 font-bold">
											{item.sandwich_name}
										</span>
									</span>
									<span className="col-span-2 flex items-center justify-center text-sm text-black">
										{item.like_count}
									</span>
									<span className="col-span-2 flex items-center justify-center text-sm text-black">
										{item.recipe_count}
									</span>
								</div>
							))}
					</article>
					<article className="border-l px-4 col-span-1">
						<span className=" font-bold">추천 레시피 top3</span>
						<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
							<span className="col-span-5 text-left">
								레시피 이름
							</span>
							<span className="col-span-2">좋아요 수</span>
							<span className="col-span-2">태그</span>
						</div>
						{Array.isArray(recipeData) &&
							recipeData.map((item, index) => (
								<div
									key={index}
									className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2">
									<span className="col-span-5 flex items-center justify-start text-black font-bold">
										{index + 1}
										{' ' + item.recipe_name}
									</span>
									<span className="col-span-2 flex items-center justify-center text-sm text-black">
										{item.like_count}
									</span>
									<div className="col-span-2 flex items-center text-sm text-black text-ellipsis overflow-hidden">
										{item.tag}
									</div>
								</div>
							))}
					</article>
				</section>
			</div>
		</div>
	);
};

export default QueryRecipesBanner;
