import React from 'react';
import { BsFillCheckSquareFill } from 'react-icons/bs';
export type propsType = {
    prop: {
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    text: string,
    setIsShow?:React.Dispatch<React.SetStateAction<boolean>>
}
const EmptyCheckBox = ({ prop, text,setIsShow }: propsType) => {
    const onChangeHandler = () => {
        prop.setArray([]);
        setIsShow && setIsShow(false);
    }
    return (
        <li className='h-12 flex items-center'>
            <label className='my-auto flex items-center group'>
                {prop.array.length === 0 ?
                    <BsFillCheckSquareFill className='relative w-6 h-6 mr-2 text-green-600 border-0  group-hover:border group-hover:border-gray-600 rounded'></BsFillCheckSquareFill>
                    : <BsFillCheckSquareFill className='relative w-6 h-6 mr-2 text-white border group-hover:border-gray-500 rounded'></BsFillCheckSquareFill>
                }
                <span className='font-[noto-sans]'>{text}</span>
                <input type='checkBox' className='invisible absolute' onChange={()=>onChangeHandler()} checked={prop.array.length === 0} value={''}></input>
            </label>
        </li>
    );
};

export default EmptyCheckBox;