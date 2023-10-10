import Link from "next/link";
const MenusSelectorGridItem = ({ menuName, src, href }) => {
    return (
        <Link href={href} className="col-span-1">
            <div className=' overflow-hidden relative rounded-md  aspect-square'>
                <img src={src} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
            </div>
            <div className='text-left text-xs align-top leading-3'>{menuName}</div>
        </Link>
    );
};

export default MenusSelectorGridItem;