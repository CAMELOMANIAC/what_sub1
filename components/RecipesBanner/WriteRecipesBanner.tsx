import { useRouter } from 'next/router';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useQuery } from 'react-query';
import { userRecipeLikeTopDataType } from '../../interfaces/api/recipes';
import { userMenuWriteTopData } from '../../interfaces/api/menus';
const WriteRecipesBanner = ({ref}) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const [menuWriteTop, setMenuWriteTop] = React.useState<userMenuWriteTopData[]>([]);
    const [recipeLikeTop, setRecipeLikeTop] = React.useState<userRecipeLikeTopDataType[]>([]);
    useQuery('userMenuWriteTop', async () => {
        const response = await fetch('/api/users/writeMenus');
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('실패')
        }
    },{
        onSuccess: (data) => {setMenuWriteTop(data);}
    });
    useQuery('userRecipeLikeTop', async () => {
        const response = await fetch('/api/users/popularRecipes');
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('실패')
        }
    },{
        onSuccess: (data) => {setRecipeLikeTop(data);}
    });

    return (
        <section className={`relative flex justify-center w-screen right-0 bg-white border-gray-200 border-b min-w-[640px]`} ref={ref}>
            <button className='py-10 my-auto h-full bg-gray-100 hover:text-green-600'
                onClick={router.back}>
                <IoIosArrowBack className='inline text-lg h-1/2' />
            </button>
            <section className="flex flex-col justify-start pt-4 pb-10 w-full max-w-[1024px]">
                <article className='flex flex-col pb-5 pl-4 border-l'>
                    <h1 className='font-bold text-3xl inline text-black pb-4'>{user.userName}님의 레시피</h1>
                    <div className='whitespace-pre-line'>
                        <div className='flex flex-row text-sm m-2'>
                            <div className='w-40 px-3'>
                                <div className='text-gray-500'>레시피 작성 갯수</div>
                                <div className='font-bold'>{0}</div>
                            </div>
                            <div className='border-l w-40 px-3'>
                                <div className='text-gray-500'>받은 좋아요 갯수</div>
                                <div className='font-bold'>{0}</div>
                            </div>
                        </div>
                    </div>
                </article>
                
                <section className='grid grid-cols-1 md:grid-cols-2 grid-flow-row'>
                    <article className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                        <span className=' font-bold'>주요 메뉴 top3</span>
                        <div className='text-sm text-gray-500 grid grid-cols-8 grid-flow-row text-center'>
                            <span className='col-span-5 text-left'>메뉴</span>
                            <span className='col-span-3'>작성 수</span>
                        </div>
                        {Array.isArray(menuWriteTop) && menuWriteTop.map((item, index) => (
                            <div key={index} className='font-normal text-gray-500 grid grid-cols-7 grid-flow-row h-10 my-2'>
                                <span className='col-span-5 flex items-center justify-start text-black font-bold'>
                                    {index + 1}
                                    {' ' + item.sandwich_table_sandwich_name}
                                </span>
                                <span className='col-span-2 flex items-center justify-center text-sm text-black'>{item.count}</span>
                            </div>
                        ))}
                    </article>
                    <article className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                        <span className=' font-bold'>인기 레시피 top3</span>
                        <div className='text-sm text-gray-500 grid grid-cols-8 grid-flow-row text-center'>
                            <span className='col-span-5 text-left'>레시피</span>
                            <span className='col-span-3'>좋아요 수</span>
                        </div>
                        
                        {Array.isArray(recipeLikeTop) && recipeLikeTop.map((item, index) => (
                            <div key={index} className='font-normal text-gray-500 grid grid-cols-7 grid-flow-row h-10 my-2'>
                                <span className='col-span-5 flex items-center justify-start text-black font-bold'>
                                    {index + 1}
                                    {' ' + item.recipe_name}
                                </span>
                                <span className='col-span-2 flex items-center justify-center text-sm text-black'>{item.like_count}</span>
                            </div>
                        ))}
                    </article>
                </section>
            </section>
            
        </section>
    );
};

export default WriteRecipesBanner;