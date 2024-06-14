import React from 'react';
import {GrClose} from 'react-icons/gr';

type propsType = {
	setIsLoaded: (arg: boolean) => void;
	isLoaded: boolean;
	children?: React.ReactNode;
};

const MediumModal = ({setIsLoaded, isLoaded, children}: propsType) => {
	return (
		<div
			className="fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm"
			onClick={e => {
				if (e.target === e.currentTarget) setIsLoaded(false);
			}}>
			<article
				className={`w-[500px] h-[550px] bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg flex flex-row overflow-hidden transition-all duration-500 ease-in-out ${isLoaded ? 'max-h-[550px]' : 'max-h-0'}`}>
				{children}
				<button
					className={'fixed right-5 top-5'}
					onClick={() => setIsLoaded(false)}>
					<GrClose />
				</button>
			</article>
		</div>
	);
};

export default MediumModal;
