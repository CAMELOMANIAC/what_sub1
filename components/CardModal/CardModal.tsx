import {useState} from 'react';
import {recipeType} from '../../interfaces/api/recipes';
import CardNav from './CardNav';
import CardHorizontalNav from './CardHorizontalNav';
import SummaryPage from './summaryPage/SummaryPage';
import IngredientsPage from './IngredientsPage';
import {GrClose} from 'react-icons/gr';
import Link from 'next/link';
import Image from 'next/image';
import useModalAnimationHook from '../../utils/modalAnimationHook';

type props = {
	recipe: recipeType;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	ingredients: string[];
	refetch?: () => void;
};

const CardModal = ({recipe, setIsActive, refetch}: props) => {
	const [page, setPage] = useState<number>(0);
	const {isLoaded, setIsLoaded} = useModalAnimationHook(setIsActive);

	return (
		<div
			className="fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10"
			onClick={e => {
				if (e.target === e.currentTarget) setIsLoaded(false);
			}}>
			<article
				className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-fit sm:w-[640px] md:w-[768px] lg:w-[1024px] bg-white text-black shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${isLoaded ? 'max-h-[800px]' : 'max-h-0'}`}>
				<button
					className={'fixed right-5 top-5 z-10'}
					onClick={() => setIsLoaded(false)}>
					<GrClose />
				</button>
				<div className="grid grid-cols-6 gap-4 md:grid-cols-7">
					<CardNav
						className="h-full rounded-l-lg hidden md:col-span-2 md:flex md:justify-end"
						setPage={setPage}
						page={page}></CardNav>
					<section className="col-span-6 md:col-span-5 p-5">
						<div className="mb-5">
							<div className="flex flex-row items-center mb-2">
								<div className="inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2">
									<Image
										src={`/images/sandwich_menu/${recipe.sandwich_table_sandwich_name}.png`}
										className="relative object-cover scale-[2.7] origin-[85%_40%]"
										alt={
											recipe.sandwich_table_sandwich_name
										}
										width={120}
										height={120}></Image>
								</div>
								<div className="flex flex-col">
									<Link
										href={`/Recipes?param=${encodeURIComponent(recipe.sandwich_table_sandwich_name)}`}
										className="text-sm text-gray-400 hover:text-green-600"
										onClick={e => {
											e.stopPropagation();
										}}>
										{recipe.sandwich_table_sandwich_name}
									</Link>
									<h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]">
										{recipe.recipe_name}
									</h2>
								</div>
								<div className="ml-auto mt-auto text-right text-sm text-gray-400">
									{recipe.tag}
								</div>
							</div>
							<CardHorizontalNav
								className="col-span-6 border-b-[1px] rounded-l-lg md:hidden"
								setPage={setPage}
								page={page}></CardHorizontalNav>
						</div>
						{page === 0 && (
							<SummaryPage
								recipe={recipe}
								refetch={refetch}
								setIsLoaded={() => setIsLoaded(false)}
							/>
						)}
						{page !== 0 && (
							<IngredientsPage
								recipe={recipe}
								page={page}
								className="h-[500px]"
							/>
						)}
					</section>
				</div>
			</article>
		</div>
	);
};

export default CardModal;
