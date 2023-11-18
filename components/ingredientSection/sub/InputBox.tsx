import { BsFillCheckSquareFill } from "react-icons/bs";
import { FaDotCircle } from "react-icons/fa";

export type propsType = {
    name: string,
    addContext: string,
    checked: boolean,
    onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    inputType: string
}

const InputBox = ({ name, addContext, checked, onChange, inputType }: propsType) => {
    return (
        <li className='h-12 flex items-center'>
            <label className='my-auto flex items-center group'>
                {inputType === 'radio' &&
                    <FaDotCircle className={`relative w-6 h-6 mr-2 rounded-full group-hover:border group-hover:border-gray-500 ${checked ? 'text-green-600 border-0' : 'text-white border'}`}></FaDotCircle>
                }{inputType === 'checkBox' &&
                    <BsFillCheckSquareFill className={`relative w-6 h-6 mr-2 border rounded group-hover:border-gray-600 group-hover:border ${checked ? 'text-green-600 border-0' : 'text-white '}`}></BsFillCheckSquareFill>
                }
                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                    <img src={'/images/sandwich_menu/ingredients/' + name + '.jpg'} alt={name} className='object-cover w-12 aspect-square rounded-md mr-2'></img>
                </div>
                <span className='font-[noto-sans]'>{name}{addContext}</span>
                <input className='invisible absolute' type={inputType} onChange={onChange} value={name}></input>
            </label>

        </li>
    );
};

export default InputBox;
