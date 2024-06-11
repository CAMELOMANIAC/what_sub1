import React, {forwardRef} from 'react';
import {useRouter} from 'next/router';
import {recipeType} from '../../interfaces/api/recipes';
import {totalMenuInfoType} from '../../interfaces/api/menus';
import ParamRecipesBanner from './ParamRecipesBanner';
import QueryRecipesBanner from './QueryRecipesBanner';
import ResultFilter from './ResultFilter';
import {useSearchParams} from 'next/navigation';
import WriteRecipesBanner from './WriteRecipesBanner';
import FavoriteRecipesBanner from './FavoriteRecipesBanner';

type Props = {
	className?: string;
	recipeData: recipeType[];
	menuData: totalMenuInfoType[];
	sorting: string;
	setSorting: React.Dispatch<React.SetStateAction<string>>;
};

//타입스크립트에서 useRef를 컴포넌트 속성에 할당할 수 있도록 forwardRef를 사용해야함 일반 타입으로 사용시 일반적인 속성이 되버림
const RecipesBanner = forwardRef<HTMLDivElement, Props>(
	({recipeData, menuData, sorting, setSorting}, ref) => {
		const router = useRouter();
		const searchParams = useSearchParams();

		return (
			<>
				{router.isReady &&
				router.query.param &&
				router.query.param.length !== 0 ? (
					<ParamRecipesBanner ref={ref} />
				) : (
					(searchParams?.has('write') && (
						<WriteRecipesBanner ref={ref} />
					)) ||
					(searchParams?.has('favorite') && (
						<FavoriteRecipesBanner ref={ref} />
					)) || (
						<QueryRecipesBanner
							ref={ref}
							menuData={menuData}
							recipeData={recipeData}
						/>
					)
				)}
				<ResultFilter sorting={sorting} setSorting={setSorting} />
			</>
		);
	},
);

//eslint가 규칙상 displayname이없으면 오류를 뿜어냄
RecipesBanner.displayName = 'RecipesBanner';

export default RecipesBanner;
