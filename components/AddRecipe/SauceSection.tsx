import React, { forwardRef } from 'react';
import { sauceNutrientArray } from '../../utils/menuArray';
import IngredientsSection from './template/IngredientsSection';

export type propsType = {
    prop: {
        array: string[],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const SauceSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    return (
        <IngredientsSection ref={ref} id='sauce'>
            <h3 className='text-xl font-[seoul-metro]'>소스 선택</h3>
            <span>(최대3개)</span>
            <div className='p-4'>
                {sauceNutrientArray.map((item) => (
                    <li key={item.name} className='h-12 flex items-center'>
                        <label>
                            <input type='checkBox' onChange={prop.onChange} checked={prop.array.includes(item.name)} value={item.name}></input>{item.name}
                        </label>
                    </li>
                ))}
                <li className='h-12 flex items-center'>
                    <label>
                        <input type='checkBox' onChange={prop.onChange} checked={prop.array.length === 0} value={''}></input>소스 없음
                    </label>
                </li>
            </div>
        </IngredientsSection>
    );
});

SauceSection.displayName = 'SauceSection'
export default SauceSection;

/*<div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={sauceRef} id='sauce'>
                            <div className='m-2'>
                                <h3 className='text-xl font-[seoul-metro]'>소스 선택</h3>
                                <span>(최대3개)</span>
                                <div className='p-2'>

                                    {sauceNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row items-center'>
                                            <CheckBox item={item} section={'sauce'} addContext={''} getState={sauce} onChange={sauceChagedHandler}></CheckBox>
                                        </div>
                                    ))}
                                    <div className='flex flex-row h-12'>
                                        <EmptyCheckBox section={'sauce'} addContext={'소스'} getState={sauce} setState={() => setSauce([])}></EmptyCheckBox>
                                    </div>
                                </div>
                            </div>
                        </div> */