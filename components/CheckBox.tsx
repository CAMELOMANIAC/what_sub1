import React, { Dispatch, SetStateAction } from 'react';
import { BsFillCheckSquareFill } from 'react-icons/bs';
import { FaDotCircle } from 'react-icons/fa';


type checkBoxType = {
    item: { name: string }
    section: string,
    addContext: string,
    getState: string | string[],
    setState?: Dispatch<SetStateAction<string | string[]>>,
    onChange?: (e) => void
}
export const CheckBox = ({ item, section, addContext, getState, setState, onChange }: checkBoxType) => {
    return (
        <>
            <label>
                {(item && setState) && <input type='checkbox' id={`${item.name} ${addContext}`} name={section} value={`${item.name} ${addContext}`}
                    checked={getState === (`${item.name} ${addContext}`)}
                    onChange={(e) => (setState(e.target.value))} className='peer invisible absolute'></input>}

                {(item && onChange) && <input type='checkbox' id={`${item.name}${addContext}`} name={section} value={`${item.name}${addContext}`}
                    checked={getState.includes((`${item.name}${addContext}`))}
                    onChange={(e) => onChange(e)} className='peer invisible absolute'></input>}
                <BsFillCheckSquareFill className='relative w-6 h-6 mr-2 text-white border rounded peer-checked:text-green-600 peer-checked:border-0'></BsFillCheckSquareFill>
            </label>
            <label htmlFor={`${item.name}${addContext}`} className='my-auto flex items-center'>
                {section === 'addMeat' ?
                    <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                        <img src={`/images/sandwich_menu/${item.name}.png`} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                    </div>
                    :
                    <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} alt={item.name} className='object-cover w-12 aspect-square rounded-md mr-2'></img>
                }
                <span className='font-[noto-sans]'>{item.name}{addContext}</span>
            </label>
        </>
    );
};

type emptyCheckBoxType = {
    section: string,
    addContext: string,
    getState?: string[],
    setState?: Dispatch<SetStateAction<string[]>>,
    onChange?: () => void
}
export const EmptyCheckBox = ({ section, addContext, getState, setState, onChange }: emptyCheckBoxType) => {
    return (
        <>
            <label className=''>
                {
                    (setState && getState) &&
                    <input type='radio' id={addContext} name={section} value={addContext} checked={(getState?.length > 0 ? false : true)} onChange={() => setState([])} className='peer invisible absolute'></input>
                }
                {
                    onChange &&
                    <input type='radio' id={addContext} name={section} value={addContext} checked={false} onChange={() => onChange()} className='peer invisible absolute'></input>
                }
                <BsFillCheckSquareFill className='relative w-6 h-6 mr-2 text-white border rounded peer-checked:text-green-600 peer-checked:border-0'></BsFillCheckSquareFill>
            </label>
            <label htmlFor={addContext}>{addContext} 없음</label>
        </>
    );
};

type radioBoxType = {
    item: { name: string },
    section: string,
    addContext: string,
    getState?: string,
    setState: Dispatch<SetStateAction<string>>
}
export const RadioBox = ({ item, section, addContext, getState, setState }:radioBoxType) => {
    return (
        <>
            <label>
                {item && <input type='checkbox' id={`${item.name} ${addContext}`} name={section} value={`${item.name}`} checked={getState === (`${item.name}`)} onChange={(e) => (setState(e.target.value))} className='peer invisible absolute'></input>}
                <FaDotCircle className='relative w-6 h-6 mr-2 text-white border rounded-full peer-checked:text-green-600 peer-checked:border-0'></FaDotCircle>
            </label>
            <label htmlFor={`${item.name} ${addContext}`} className='my-auto flex items-center'>
                {section === 'addMeat' ?
                    <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                        <img src={`/images/sandwich_menu/${item.name}.png`} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                    </div>
                    :
                    <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} alt={item.name} className='object-cover w-12 aspect-square rounded-md mr-2'></img>
                }
                <span className=''>{item.name} {addContext}</span>
            </label>
        </>
    );
};


type EmptyRadioBoxType = {
    section: string,
    addContext: string,
    getState: string,
    setState?: Dispatch<SetStateAction<string>>,
    onChange?: () => void
}
export const EmptyRadioBox = ({ section, addContext, getState, setState, onChange }: EmptyRadioBoxType) => {
    return (
        <>
            <label className=''>
                {onChange &&
                    <input type='radio' id={addContext} name={section} value={addContext} checked={getState === ''} onChange={() => onChange()} className='peer invisible absolute'></input>
                }
                {setState &&
                    <input type='radio' id={addContext} name={section} value={addContext} checked={getState === ''} onChange={() => setState('')} className='peer invisible absolute'></input>
                }
                <FaDotCircle className='relative w-6 h-6 mr-2 text-white border rounded-full peer-checked:text-green-600 peer-checked:border-0'></FaDotCircle>
            </label>
            <label htmlFor={addContext}>{addContext} 없음</label>
        </>
    );
};