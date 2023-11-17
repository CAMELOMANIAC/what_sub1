import React, { forwardRef } from 'react';
import IngredientsSection from './sub/IngredientsSection';
import { breadNutrientArray } from '../../utils/menuArray';
import RadioBox from './sub/RadioBox';

export type propsType = {
    prop: {
        state: string,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const BreadSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='bread'>
            <h3 className='text-xl font-[seoul-metro]'>빵 선택</h3>
            <ul className='p-2'>
                {breadNutrientArray.map((item) => (
                    <RadioBox key={item.name} name={item.name} addContext='' checked={prop.state === item.name} onChange={prop.onChange}></RadioBox>
                ))}
            </ul>
        </IngredientsSection>
    );
});

BreadSection.displayName = 'BreadSection';
export default BreadSection;