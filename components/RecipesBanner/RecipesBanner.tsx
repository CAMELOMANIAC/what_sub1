import {useRouter} from 'next/router';
import {recipeType} from '../../interfaces/api/recipes';
import {totalMenuInfoType} from '../../interfaces/api/menus';
import ParamRecipesBanner from './ParamRecipesBanner';
import QueryRecipesBanner from './QueryRecipesBanner';
import ResultFilter from './ResultFilter';
import {useSearchParams} from 'next/navigation';
import WriteRecipesBanner from './WriteRecipesBanner';
import FavoriteRecipesBanner from './FavoriteRecipesBanner';
import {useRef} from 'react';

type Props = {
	className?: string;
	recipeData: recipeType[];
	menuData: totalMenuInfoType[];
	sorting: string;
	setSorting: React.Dispatch<React.SetStateAction<string>>;
};

const RecipesBanner = ({recipeData, menuData, sorting, setSorting}: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div ref={ref}>
			{router.isReady &&
			router.query.param &&
			router.query.param.length !== 0 ? (
				<ParamRecipesBanner />
			) : (
				(searchParams?.has('write') && <WriteRecipesBanner />) ||
				(searchParams?.has('favorite') && (
					<FavoriteRecipesBanner />
				)) || (
					<QueryRecipesBanner
						menuData={menuData}
						recipeData={recipeData}
						parentRef={ref}
					/>
				)
			)}
			<ResultFilter sorting={sorting} setSorting={setSorting} />
		</div>
	);
};

export default RecipesBanner;
