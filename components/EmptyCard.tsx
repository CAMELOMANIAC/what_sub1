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
        <article onClick={clickHandler} className='col-span-2 aspect-[4/3] bg-white rounded-xl hover:shadow-lg flex justify-center items-center shadow-sm hover:scale-105 transition-transform group'>
            <div className='text-gray-200 text-8xl text-center group-hover:text-green-600'><HiPlus></HiPlus></div>
        </article>
    );
};

export default EmptyCard;