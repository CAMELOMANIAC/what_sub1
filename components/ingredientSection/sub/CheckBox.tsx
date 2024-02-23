import Image from 'next/image';
import React from 'react';
import { BsFillCheckSquareFill } from 'react-icons/bs';

type propsType = {
    name: string,
    addContext: string,
    checked: boolean,
    onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckBox = ({ name, addContext, checked, onChange }: propsType) => {
    return (
        <li className='h-12 flex items-center'>
            <label className='my-auto flex items-center group'>
            <BsFillCheckSquareFill className={`relative w-6 h-6 mr-2 border rounded group-hover:border-gray-600 group-hover:border ${checked ? 'text-green-600 border-0' : 'text-white '}`}></BsFillCheckSquareFill>
                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                    <Image width={70} height={70} src={'/images/sandwich_menu/ingredients/' + name + '.jpg'} alt={name} className='object-cover w-12 aspect-square rounded-md mr-2'></Image>
                </div>
                <span className='font-[noto-sans]'>{name}{addContext}</span>
                <input className='invisible absolute' type='checkBox' onChange={onChange} value={name}></input>
            </label>

        </li>
    );
};

export default CheckBox;