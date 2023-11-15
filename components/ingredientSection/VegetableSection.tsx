import React, { forwardRef } from 'react';
import { vegetableArray, pickleArray } from '../../utils/menuArray';
import IngredientsSection from './template/IngredientsSection';

export type propsType = {
    prop1: {
        array: string[],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    prop2: {
        array: string[],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
}
const VegetableSection = forwardRef<HTMLDivElement,propsType>(({prop1,prop2},ref) => {
    return (
        <IngredientsSection ref={ref} id='vegetable'>
            <h3 className='text-xl font-[seoul-metro]'>신선 채소</h3>
            <ul className='mb-4 p-4'>
                {vegetableArray.map((item) => (
                    <li key={item.name} className='h-12 flex items-center'>
                        <label>
                            <input type='checkBox' onChange={prop1.onChange} checked={prop1.array.includes(item.name)} value={item.name}></input>{item.name}
                        </label>
                    </li>
                ))}
            </ul>
            <h3 className='text-xl font-[seoul-metro]'>절임 채소</h3>
            <ul className='p-4'>
                {pickleArray.map((item) => (
                    <li key={item.name} className='h-12 flex items-center'>
                        <label>
                            <input type='checkBox' onChange={prop2.onChange} checked={prop2.array.includes(item.name)} value={item.name}></input>{item.name}
                        </label>
                    </li>
                ))}
            </ul>
        </IngredientsSection>
    );
});
VegetableSection.displayName = 'VegetableSection'
export default VegetableSection;

/*<IngredientsSection ref={vegetableRef} id='vegetable'>
                            <h3 className='text-xl font-[seoul-metro]'>신선 채소</h3>
                            <ul className='mb-4 p-4'>
                                {vegetableArray.map((item) => (
                                    <li key={item.name} className='flex flex-row items-center'>
                                        <CheckBox item={item} section={'vegetable'} addContext={''} getState={vegetable} onChange={vegetableChagedHandler}></CheckBox>
                                    </li>
                                ))}
                            </ul>
                            <h3 className='text-xl font-[seoul-metro]'>절임 채소</h3>
                            <ul className='p-4'>
                                {pickleArray.map((item) => (
                                    <li key={item.name} className='flex flex-row items-center'>
                                        <CheckBox item={item} section={'pickle'} addContext={''} getState={pickle} onChange={pickleChagedHandler}></CheckBox>
                                    </li>
                                ))}
                            </ul>
                        </IngredientsSection> */