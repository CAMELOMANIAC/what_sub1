import React, {ReactNode, forwardRef} from 'react';

type propsType = {
	children?: ReactNode;
	className?: string;
	id?: string;
};

const IngredientsSection = forwardRef<HTMLDivElement, propsType>(
	({children, className, id}, ref?) => {
		return (
			<div
				ref={ref}
				className={`bg-white rounded-md shadow-sm mb-2 p-6 ${className}`}
				id={id}>
				<div className={`m-2`}>
					<div>{children}</div>
				</div>
			</div>
		);
	},
);

export default IngredientsSection;

IngredientsSection.displayName = 'AddRecipeIngredientsSection';
