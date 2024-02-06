import { HiPlus } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const EmptyCard = () => {
    const router = useRouter();
    const param = router.query.param
    const userName = useSelector((state: RootState) => state.user.userName);

    const clickHandler = () => (
        userName && router.push(`/AddRecipe?param=${encodeURIComponent(String(param))}`)
    )

    return (
        <article onClick={clickHandler} className='col-span-2 aspect-[8/7] bg-white border rounded-xl shadow-md hover:shadow-xl flex justify-center items-center hover:scale-105 transition-transform group'>
            <div className='text-gray-200 text-8xl text-center group-hover:text-green-600'><HiPlus></HiPlus></div>
        </article>
    );
};

export default EmptyCard;