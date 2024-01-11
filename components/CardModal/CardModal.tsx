import { useState } from 'react';
import { recipeType } from '../../interfaces/api/recipes';
import Nav from './CardNav';
import Summary from './Summary';

type props = {
    recipe: recipeType,
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    ingredients: string[]
}

const CardModal = ({ recipe, setIsActive, ingredients }: props) => {
    const [page, setPage] = useState<number>(0);

    return (
        <div className='fixed bg-gray-600/10 top-0 left-0 w-full h-full backdrop-blur-sm z-10'
            onClick={(e) => { if (e.target === e.currentTarget) setIsActive(false) }}>
            <article className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1024px] bg-white text-black shadow rounded-lg'>
                <div className='grid grid-cols-8 gap-4'>
                    <Nav className='h-full col-span-2 rounded-l-lg' setPage={setPage} page={page}></Nav>
                    <Summary recipe={recipe} setIsActive={setIsActive} ingredients={ingredients} className='col-span-6 p-10'></Summary>
                </div>
            </article>
        </div>
    );
};

export default CardModal;