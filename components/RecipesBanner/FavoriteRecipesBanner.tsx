import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useQuery } from 'react-query';

const WriteRecipesBanner = ({ref}) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const [menuLikeArrayL, setMenuLikeArrayL] = useState<Array<{sandwich_table_sandwich_name:string}>>([]);
    const [menuLikeArrayR, setMenuLikeArrayR] = useState<Array<{sandwich_table_sandwich_name:string}>>([]);
    useQuery('userMenuLike', async () => {
        const response = await fetch('/api/users/menus/like');
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('실패')
        }
    },{
        onSuccess: (data) => {
            const left = data.slice(0, data.length / 2);
            const right = data.slice(data.length / 2, data.length);
            setMenuLikeArrayL(left);
            setMenuLikeArrayR(right);
        }
    });
    
    return (
        <section className={`relative flex justify-center w-screen right-0 bg-white border-gray-200 border-b min-w-[640px]`} ref={ref}>
            <button className='py-10 my-auto h-full bg-gray-100 hover:text-green-600'
                onClick={router.back}>
                <IoIosArrowBack className='inline text-lg h-1/2' />
            </button>
            <section className="flex flex-col justify-start pt-4 pb-10 w-full max-w-[1024px]">
                <article className='flex flex-col pb-5 pl-4 border-l'>
                    <h1 className='font-bold text-3xl inline text-black pb-4'>{user.userName}님이 좋아하는 레시피</h1>
                    <div className='whitespace-pre-line'>
                        <div className='flex flex-row text-sm m-2'>
                            <div className='w-40 px-3'>
                                <div className='text-gray-500'>좋아요한 갯수</div>
                                <div className='font-bold'>{0}</div>
                            </div>
                        </div>
                    </div>
                </article>
                
                <section className='grid grid-cols-1 md:grid-cols-2 grid-flow-row'>
                    <article className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                        <span className=' font-bold'>메뉴 좋아요</span>
                        <div className='text-sm text-gray-500 grid grid-cols-10 grid-flow-row text-center'>
                            <span className='col-span-5 text-left'>메뉴이름</span>
                            <span className='col-span-2'>조합 선택율</span>
                            <span className='col-span-2'>좋아요 수</span>
                        </div>
                        {Array.isArray(menuLikeArrayL) && menuLikeArrayL.map((item, index) => (
                            <div key={index} className='font-normal text-gray-500 grid grid-cols-7 grid-flow-row h-10 my-2'>
                                <span className='col-span-5 flex items-center justify-start text-black font-bold'>
                                    {' ' + item.sandwich_table_sandwich_name}
                                </span>
                                <span className='col-span-2 flex items-center justify-center text-sm text-black'>{}</span>
                            </div>
                        ))}
                    </article>
                    <article className='md:border-l md:border-b-0 md:mb-0 px-4 col-span-1 border-b border-l-0 mb-3'>
                        {Array.isArray(menuLikeArrayR) && menuLikeArrayR.map((item, index) => (
                            <div key={index} className='font-normal text-gray-500 grid grid-cols-7 grid-flow-row h-10 my-2'>
                                <span className='col-span-5 flex items-center justify-start text-black font-bold'>
                                    {' ' + item.sandwich_table_sandwich_name}
                                </span>
                                <span className='col-span-2 flex items-center justify-center text-sm text-black'>{}</span>
                            </div>
                        ))}
                    </article>
                </section>
            </section>
            
        </section>
    );
};

export default WriteRecipesBanner;