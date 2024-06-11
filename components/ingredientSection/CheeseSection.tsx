import React, {forwardRef, useState} from 'react';
import {cheeseNutrientArray} from '../../utils/menuArray';
import IngredientsSection from './sub/IngredientsSection';
import RadioBox from './sub/RadioBox';
import EmptyRadioBox from './sub/EmptyRadioBox';

export type propsType = {
	prop1: {
		state: string;
		onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
	};
	prop2: {
		state: string;
		onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
	};
};
const CheeseSection = forwardRef<HTMLDivElement, propsType>(
	({prop1, prop2}, ref) => {
		//추가하기
		const [isShow, setIsShow] = useState<boolean>(false);

		return (
			<IngredientsSection ref={ref} id="cheese">
				<h3 className="text-xl font-[seoul-metro]">치즈 선택</h3>
				<ul className="p-2">
					{cheeseNutrientArray.map(item => (
						<RadioBox
							key={item.name}
							name={item.name}
							addContext=""
							checked={prop1.state === item.name}
							onChange={prop1.onChange}></RadioBox>
					))}
					<EmptyRadioBox
						name="치즈"
						addContext=" 없음"
						checked={prop1.state === ''}
						onChange={prop1.onChange}
					/>
				</ul>

				<h3 className="text-xl font-[seoul-metro]">치즈 추가</h3>
				<div className="p-2">
					{isShow === false && (
						<button
							className="w-full"
							onClick={() => setIsShow(true)}>
							추가하기
						</button>
					)}
					<ul
						className={
							isShow
								? 'max-h-[1000px] transition-all duration-500'
								: 'max-h-0 overflow-hidden transition-all duration-500'
						}>
						<EmptyRadioBox
							name="치즈 추가"
							addContext=" 없음"
							checked={prop2.state === ''}
							onChange={prop2.onChange}
							setIsShow={setIsShow}
						/>
						{cheeseNutrientArray.map(item => (
							<RadioBox
								key={item.name}
								name={item.name}
								addContext=""
								checked={prop2.state === item.name}
								onChange={prop2.onChange}></RadioBox>
						))}
					</ul>
				</div>
			</IngredientsSection>
		);
	},
);

CheeseSection.displayName = 'CheeseSection';
export default CheeseSection;
