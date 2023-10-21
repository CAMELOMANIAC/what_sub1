import { PiHeartStraight } from 'react-icons/Pi';
import { HiOutlineChatBubbleLeft } from 'react-icons/Hi2';


const Card = ({recipe}) => {
    const selected: string[] = ['각종 야채.jpg', '뉴 사우스웨스트 치폴레.jpg', '새우.jpg','베이컨.png', '로티세리 치킨.jpg', '오이.jpg']
    const recipeTag: string[] = [];
    if (recipe.tag) {
        const tag = recipe.tag.split(',');
        recipeTag.push(...tag);
        console.log(recipeTag)
    }
    const ingredients: string[] =[];
    if (recipe.recipe_ingredients) {
        const ingredient = recipe.recipe_ingredients.split(',');
        ingredients.push(...ingredient);
        console.log(ingredients)
    }
    const fileExtension = '.jpg'

    return (
        <article className='col-span-2 aspect-[4/3] bg-white rounded-xl p-6 hover:shadow-lg flex flex-col shadow-sm'>
            {/**/}
            <div className='flex flex-row items-center'>
                <div className='inline-block w-[60px] overflow-hidden relative rounded-md aspect-square mr-2'>
                    <img src={'/images/sandwich_menu/스파이시바비큐_정면_20221031041334845.png'} className='relative object-cover scale-[2.7] origin-[85%_40%]' alt='Card_sandwich_type'></img>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='text-sm text-gray-400'>{recipe.sandwich_name}</div>
                    <h2 className='text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[220px]'>{recipe.recipe_name}</h2>
                </div>
            </div>
            <div className='flex flex-row justify-end text-sm w-full text-gray-400'>
                {recipeTag.map((item,index) => <span key={index}>{'#'+item}</span>)}
            </div>
            <section className='flex flex-row overflow-hidden flex-wrap'>{ingredients.map((item) =>
                <img src={'/images/sandwich_menu/ingredients/' + item +fileExtension} key={item} className='object-cover w-12 aspect-square rounded-md' alt={item}></img>
            )}</section>
            <div className='flex flex-row justify-end mt-auto text-gray-400'>
                <div className='mr-auto text-sm text-ellipsis overflow-hidden whitespace-nowrap w-28'>{recipe.user_id}</div>
                <button className='flex items-center mr-2 hover:text-green-600'><PiHeartStraight className='m-1' />{recipe.like_count}</button>
                <button className='flex items-center mr-2 hover:text-green-600'><HiOutlineChatBubbleLeft className='m-1' />{recipe.reply_count}</button>
            </div>

        </article>
    );
};

export default Card;