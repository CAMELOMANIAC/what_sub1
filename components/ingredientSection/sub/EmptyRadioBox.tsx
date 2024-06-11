import React from 'react';
import {FaDotCircle} from 'react-icons/fa';

type propsType = {
	name: string;
	addContext: string;
	checked: boolean;
	onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
	setIsShow?: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmptyRadioBox = ({
	name,
	addContext,
	checked,
	onChange,
	setIsShow,
}: propsType) => {
	const onChangeHandler = e => {
		onChange(e);
		setIsShow && setIsShow(false);
	};
	return (
		<li className="h-12 flex items-center">
			<label className="my-auto flex items-center group">
				<FaDotCircle
					className={`relative w-6 h-6 mr-2 rounded-full group-hover:border group-hover:border-gray-500 ${checked ? 'text-green-600 border-0' : 'text-white border'}`}></FaDotCircle>
				<span className="font-[noto-sans]">
					{name}
					{addContext}
				</span>
				<input
					className="peer invisible absolute"
					type="checkBox"
					onChange={onChangeHandler}
					value={''}></input>
			</label>
		</li>
	);
};

export default EmptyRadioBox;
