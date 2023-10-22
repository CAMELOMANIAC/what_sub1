import React from 'react';
import { useRouter } from 'next/router';

const AddRecipe = () => {
    const router = useRouter();
    const param = router.query.param;
    console.log(param);


    return (
        <main className={'w-full max-w-screen-lg mx-auto'}>
            <div className='w-[1024px] grid grid-cols-6'>
                <div className="col-span-3 h-[300px]">
                    <img src={`/images/sandwich_menu/${param}.png`} alt={String(param)} className='absolute right-[50%] object-contain object-right h-[350px] drop-shadow-lg'></img>
                </div>

            </div>
        </main>
    );
};

export default AddRecipe;