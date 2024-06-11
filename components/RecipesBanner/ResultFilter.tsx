import React from 'react';
import {BiSolidBaguette, BiSolidCheese} from 'react-icons/bi';
import {GiMeat, GiTomato, GiKetchup} from 'react-icons/gi';
import {HiAdjustments} from 'react-icons/hi';
import {MdOutdoorGrill} from 'react-icons/md';
import {useDispatch, useSelector} from 'react-redux';
import {
	remove_visible_action,
	add_visible_action,
} from '../../redux/reducer/pageReducer';
import {RootState} from '../../redux/store';
import {styled} from 'styled-components';

export const StyledBackGroundDiv = styled.div`
	background: linear-gradient(
		45deg,
		rgb(234 179 8 / var(--tw-bg-opacity)) 0%,
		rgb(234 179 8 / var(--tw-bg-opacity)) 25%,
		rgb(22 163 74 / var(--tw-bg-opacity)) 25%,
		rgb(22 163 74 / var(--tw-bg-opacity)) 100%
	);
`;

export const StyledContainerNav = styled.section`
	background: linear-gradient(
		to right,
		rgb(234 179 8) 0%,
		rgb(234 179 8) 50%,
		rgb(22 163 74) 50%,
		rgb(22 163 74) 100%
	);
`;

type Props = {
	sorting: string;
	setSorting: React.Dispatch<React.SetStateAction<string>>;
};
const ResultFilter = ({sorting, setSorting}: Props) => {
	const dispatch = useDispatch();
	//레시피카드 요소 숨기기
	const visibleItem = useSelector(
		(state: RootState) => state.page.VISIBLE_ARRAY,
	);
	const visibleItemArray = [
		{name: '미트', element: <GiMeat className="mx-3" />},
		{name: '빵', element: <BiSolidBaguette className="mx-3" />},
		{name: '치즈', element: <BiSolidCheese className="mx-3" />},
		{name: '채소', element: <GiTomato className="mx-3" />},
		{name: '소스', element: <GiKetchup className="mx-3" />},
		{name: '토스팅', element: <MdOutdoorGrill className="mx-3" />},
	];
	const sortHandler = item => {
		if (visibleItem.includes(item)) {
			dispatch(remove_visible_action(item));
		} else {
			dispatch(add_visible_action(item));
		}
	};

	return (
		<StyledContainerNav className="w-full h-fit">
			<StyledBackGroundDiv className="max-w-[1024px] min-w-[640px] h-fit relative mx-auto py-2 px-4 flex flex-row items-center">
				<p className="w-1/4 flex flex-row items-center">
					<HiAdjustments /> 검색결과
				</p>
				<div className="flex flex-row w-full justify-end items-center text-white text-lg">
					{visibleItemArray.map(item => (
						<button
							key={item.name}
							className={
								visibleItem.includes(item.name)
									? 'text-yellow-300 transition-all duration-500 ease-in-out transform hover:scale-50'
									: 'transition-all duration-500 ease-in-out transform hover:scale-150'
							}
							onClick={() => sortHandler(item.name)}>
							{item.element}
						</button>
					))}
					<button
						className={`border rounded-full px-3 mx-1 text-sm ${
							sorting === '최신순'
								? 'text-yellow-300 border-yellow-300 transition-all duration-500 ease-in-out transform hover:scale-100'
								: 'transition-all duration-500 ease-in-out transform hover:scale-110'
						}`}
						onClick={() => setSorting('최신순')}>
						최신순
					</button>
					<button
						className={`border rounded-full px-3 text-sm ${
							sorting === '인기순'
								? 'text-yellow-300 border-yellow-300 transition-all duration-500 ease-in-out transform hover:scale-100'
								: 'transition-all duration-500 ease-in-out transform hover:scale-110'
						}`}
						onClick={() => setSorting('인기순')}>
						인기순
					</button>
				</div>
			</StyledBackGroundDiv>
		</StyledContainerNav>
	);
};

export default ResultFilter;
