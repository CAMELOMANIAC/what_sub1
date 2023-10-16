import {HiPlus} from 'react-icons/hi';


const EmptyCard = () => {
    return (
        <article className='col-span-2 aspect-[4/3] bg-white rounded-xl hover:shadow-lg flex justify-center items-center shadow-sm'>
            <div className='text-gray-200 text-8xl text-center'><HiPlus></HiPlus></div>
        </article>
    );
};

export default EmptyCard;