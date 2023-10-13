import Link from "next/link";
import styled from "styled-components";

const Marquee = styled.div`
width: 100%;
overflow: hidden;
white-space: nowrap;

span {
    display: inline-block;
    animation: marquee 0s linear infinite;
}

&:hover span {
    animation: marquee 3s linear infinite;
}

@keyframes marquee {
    from { transform: translate(100%, 0); }
    to { transform: translate(-100%, 0); }
  }
`

const MenusSelectorGridItem = ({ menuName, src, clickHandler }) => {
    return (
        <button className="col-span-1" onClick={clickHandler}>
            <Marquee>
                <div className=' overflow-hidden relative rounded-md aspect-square bg-gray-100'>
                    <img src={src} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                </div>
                <div className='text-left text-xs text-gray-600 align-top leading-3 text-ellipsis overflow-hidden whitespace-nowrap mt-1'>
                    <span>{menuName}</span>
                </div>
            </Marquee>
        </button>
    );
};

export default MenusSelectorGridItem;