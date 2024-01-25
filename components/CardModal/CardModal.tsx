import { useState } from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import Nav from './CardNav';
import SummaryPage from './SummaryPage';
import IngredientsPage from './IngredientsPage';
import { GrClose } from "react-icons/gr";

type props = {
    recipe: recipeType,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    ingredients: string[]
}

const CardModal = ({ recipe, setIsActive }: props) => {
    const [page, setPage] = useState<number>(0);

    return (
        <div className='fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10'
            onClick={(e) => { if (e.target === e.currentTarget) setIsActive(false) }}>
            <article className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1024px] bg-white text-black shadow rounded-lg'>
                <button className={'fixed right-5 top-5 z-10'} onClick={() => setIsActive(false)}>
                    <GrClose/>
                </button>
                <div className='grid grid-cols-8 gap-4'>
                    <Nav className='h-full col-span-2 rounded-l-lg' setPage={setPage} page={page}></Nav>
                    {page === 0 && <SummaryPage recipe={recipe} className='col-span-6 py-5 pr-5'></SummaryPage>}
                    {page !== 0 && <IngredientsPage recipe={recipe} page={page} className='col-span-6 h-[500px]' />}
                </div>
            </article>
        </div>
    );
};

export default CardModal;