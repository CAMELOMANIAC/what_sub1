import React, {forwardRef} from 'react';
import {vegetableArray, pickleArray} from '../../utils/menuArray';
import IngredientsSection from './sub/IngredientsSection';
import CheckBox from './sub/CheckBox';
import EmptyCheckBox from './sub/EmptyCheckBox';

export type propsType = {
	prop1: {
		array: string[];
		setArray: React.Dispatch<React.SetStateAction<string[]>>;
		onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
	};
	prop2: {
		array: string[];
		setArray: React.Dispatch<React.SetStateAction<string[]>>;
		onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
	};
};
const VegetableSection = forwardRef<HTMLDivElement, propsType>(
	({prop1, prop2}, ref) => {
		return (
			<IngredientsSection ref={ref} id="vegetable">
				<h3 className="text-xl font-[seoul-metro]">신선 채소</h3>
				<ul className="mb-4 p-4">
					{vegetableArray.map(item => (
						<CheckBox
							key={item.name}
							name={item.name}
							addContext=""
							checked={prop1.array.includes(item.name)}
							onChange={prop1.onChange}></CheckBox>
					))}
					<EmptyCheckBox
						prop={prop1}
						text="신선 채소 없음"></EmptyCheckBox>
				</ul>
				<h3 className="text-xl font-[seoul-metro]">절임 채소</h3>
				<ul className="p-4">
					{pickleArray.map(item => (
						<CheckBox
							key={item.name}
							name={item.name}
							addContext=""
							checked={prop2.array.includes(item.name)}
							onChange={prop2.onChange}></CheckBox>
					))}
					<EmptyCheckBox
						prop={prop2}
						text="절임 채소 없음"></EmptyCheckBox>
				</ul>
			</IngredientsSection>
		);
	},
);
VegetableSection.displayName = 'VegetableSection';
export default VegetableSection;
