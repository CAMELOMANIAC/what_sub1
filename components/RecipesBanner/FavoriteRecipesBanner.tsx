import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import useMenuLike from '../../utils/menuLikeHook';
import {PiHeartStraightFill, PiHeartStraight} from 'react-icons/pi';
import {MdOutlineArrowForward} from 'react-icons/md';
import Link from 'next/link';
import RecipesBannerContainer from './RecipesBannerContainer';

const WriteRecipesBanner = () => {
	const user = useSelector((state: RootState) => state.user);
	const [menuLikeArrayL, setMenuLikeArrayL] = useState<Array<string>>([]);
	const [menuLikeArrayR, setMenuLikeArrayR] = useState<Array<string>>([]);

	const menuLikeArray = useSelector(
		(state: RootState) => state.user.menuLikeArray,
	);
	useEffect(() => {
		const left = menuLikeArray.slice(0, menuLikeArray.length / 2);
		const right = menuLikeArray.slice(
			menuLikeArray.length / 2,
			menuLikeArray.length,
		);
		setMenuLikeArrayL(left);
		setMenuLikeArrayR(right);
	}, [menuLikeArray]);

	const recipeLikeCount = useSelector(
		(state: RootState) => state.user.recipeLikeArray.length,
	);
	const menuLikeCount = useSelector(
		(state: RootState) => state.user.menuLikeArray.length,
	);
	const MenuLikeButton = ({menuName}: {menuName: string}) => {
		const {menuLikeHandler} = useMenuLike(menuName);
		const [hover, setHover] = useState<boolean>(false);
		return (
			<button
				className="flex items-center text-xl text-green-600"
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => menuLikeHandler()}>
				{!hover ? (
					<PiHeartStraightFill className="inline-block" />
				) : (
					<PiHeartStraight className="inline-block" />
				)}
			</button>
		);
	};

	return (
		<RecipesBannerContainer>
			<section className="flex flex-col pb-5 pl-4 border-l">
				<h1 className="font-bold text-3xl inline text-black pb-4">
					{user.userName}님이 남긴 좋아요
				</h1>
				<div className="whitespace-pre-line">
					<div className="flex flex-row text-sm m-2">
						<div className="w-40 px-3">
							<div className="text-gray-500">
								레시피 좋아요 갯수
							</div>
							<div className="font-bold">{recipeLikeCount}</div>
						</div>
						<div className="border-l w-40 px-3">
							<div className="text-gray-500">
								메뉴 좋아요 갯수
							</div>
							<div className="font-bold">{menuLikeCount}</div>
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row max-h-0 sm:max-h-[1000px] transition-all duration-500 ease-in-out overflow-hidden">
				<article className="md:border-l md:mb-0 px-4 col-span-1 border-l-0">
					<span className=" font-bold">메뉴 좋아요</span>
					<div className="text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center">
						<span className="col-span-5 text-left">메뉴이름</span>
						<span className="col-span-2">좋아요</span>
						<span className="col-span-2">보러가기</span>
					</div>
					{Array.isArray(menuLikeArrayL) &&
						menuLikeArrayL.map((item, index) => (
							<div
								key={index}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2">
								<span className="col-span-5 flex items-center justify-start text-black font-bold">
									{' ' + item}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									{<MenuLikeButton menuName={item} />}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									<Link href={`/Recipes?param=${item}`}>
										<MdOutlineArrowForward />
									</Link>
								</span>
							</div>
						))}
				</article>
				<article className="md:border-l md:border-b-0 px-4 col-span-1 border-b border-l-0 md:mb-3">
					<span className="invisible font-bold hidden md:block">
						메뉴 좋아요
					</span>
					<div className="text-sm text-gray-500 md:grid grid-cols-10 grid-flow-row text-center hidden">
						<span className="col-span-5 text-left">메뉴이름</span>
						<span className="col-span-2">좋아요</span>
						<span className="col-span-2">보러가기</span>
					</div>
					{Array.isArray(menuLikeArrayR) &&
						menuLikeArrayR.map((item, index) => (
							<div
								key={index}
								className="font-normal text-gray-500 grid grid-cols-10 grid-flow-row h-10 my-2">
								<span className="col-span-5 flex items-center justify-start text-black font-bold">
									{' ' + item}
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									<MenuLikeButton menuName={item} />
								</span>
								<span className="col-span-2 flex items-center justify-center text-sm text-black">
									<Link href={`/Recipes?param=${item}`}>
										<MdOutlineArrowForward />
									</Link>
								</span>
							</div>
						))}
				</article>
			</section>
		</RecipesBannerContainer>
	);
};

export default WriteRecipesBanner;
