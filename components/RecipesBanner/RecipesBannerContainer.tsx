import {useRouter} from 'next/router';
import React, {ReactNode} from 'react';
import {IoIosArrowBack} from 'react-icons/io';

const RecipesBannerContainer = ({children}: {children: ReactNode}) => {
	const router = useRouter();
	return (
		<div className={`relative bg-white border-gray-200 w-full`}>
			<div className="mx-auto max-w-[1024px] flex justify-center">
				<button
					className="py-10 my-auto h-full bg-gray-100 hover:text-green-600"
					onClick={() => router.push('/Recipes')}>
					<IoIosArrowBack className="inline text-lg h-1/2" />
				</button>
				<div className="flex flex-col justify-start pt-4 md:pb-10 w-full max-w-[1024px]">
					{children}
				</div>
			</div>
		</div>
	);
};

export default RecipesBannerContainer;
