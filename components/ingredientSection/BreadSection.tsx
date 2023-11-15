import React, { forwardRef } from 'react';
import IngredientsSection from './template/IngredientsSection';
import { breadNutrientArray } from '../../utils/menuArray';

export type propsType = {
    prop: {
        state: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const BreadSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='bread'>
            <h3 className='text-xl font-[seoul-metro]'>빵 선택</h3>
            <ul className='p-2'>
                {breadNutrientArray.map((item) => (
                    /*<div key={item.name} className='flex flex-row items-center'>
                        <RadioBox item={item} section={'bread'} addContext={''} getState={bread} setState={setBread}></RadioBox>
                    </div>*/
                    <li key={item.name} className='h-12 flex items-center'>
                        <label>
                            <input type='radio' onChange={prop.onChange} checked={prop.state === item.name} value={item.name}></input>{item.name}
                        </label>
                    </li>
                ))}
            </ul>
        </IngredientsSection>
    );
});

BreadSection.displayName = 'BreadSection';
export default BreadSection;