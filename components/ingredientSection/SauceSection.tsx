import React, { forwardRef } from 'react';
import { sauceNutrientArray } from '../../utils/menuArray';
import IngredientsSection from './sub/IngredientsSection';
import CheckBox from './sub/CheckBox';
import EmptyCheckBox from './sub/EmptyCheckBox';

export type propsType = {
    prop: {
        array: string[],
        setArray: React.Dispatch<React.SetStateAction<string[]>>,
        onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const SauceSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='sauce'>
            <h3 className='text-xl font-[seoul-metro]'>소스 선택</h3>
            <span>(최대3개)</span>
            <div className='p-4'>
                {sauceNutrientArray.map((item) => (
                    <CheckBox key={item.name} name={item.name} addContext='' checked={prop.array.includes(item.name)} onChange={prop.onChange}></CheckBox>
                ))}
                <EmptyCheckBox prop={prop} text='소스 없음'></EmptyCheckBox>
            </div>
        </IngredientsSection>
    );
});

SauceSection.displayName = 'SauceSection'
export default SauceSection;