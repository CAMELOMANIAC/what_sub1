import React, { useState } from 'react';
import MenusSelectorGridItem from '../components/MenusSelectorGridItem';
import { FiSearch } from 'react-icons/fi';
import { menuArray, menuArrayType } from '../utils/menuArray';

type propsType = {
    setSelected : React.Dispatch<React.SetStateAction<menuArrayType>>
}

const MenusGrid = ({ setSelected }: propsType) => {
    const [menuType, setMenuType] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const queryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    const searchResult = menuArray.filter((item: { name: string }) => item.name.includes(searchQuery))

    return (
        <div className="col-span-2 border bg-white h-fit p-2">
            <div className="flex flex-row items-center border placeholder:text-gray-400 focus-within:ring-2 ring-green-600 p-1">
                <FiSearch className='text-lg mx-1 text-gray-400' />
                <input type="text" className='focus-within:outline-none w-full' onChange={queryChange} />
            </div>
            <div className="flex w-full pt-2">
                <button className={`border rounded-l py-2 w-full text-xs ${menuType === 0 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(0)}>all</button>
                <button className={`border-y py-2 w-full text-xs ${menuType === 1 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(1)}>클래식</button>
                <button className={`border-y border-x py-2 w-full text-xs ${menuType === 2 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(2)}>프레쉬</button>
                <button className={`border-y py-2 w-full text-xs ${menuType === 3 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(3)}>프리미엄</button>
                <button className={`border rounded-r py-2 w-full text-xs ${menuType === 4 ? 'bg-green-600 text-white' : ''}`} onClick={() => setMenuType(4)}>신제품</button>
            </div>

            {menuType === 0 &&
                <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                    {searchResult.map((index) => (<MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                </div>
            }{menuType === 1 &&
                <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                    {searchResult.map((index) => (index.type === 1 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                </div>
            }{menuType === 2 &&
                <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                    {searchResult.map((index) => (index.type === 2 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                </div>
            }{menuType === 3 &&
                <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                    {searchResult.map((index) => (index.type === 3 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                </div>
            }{menuType === 4 &&
                <div className='grid grid-cols-5 pt-2  gap-2 relative'>
                    {searchResult.map((index) => (index.type === 4 && <MenusSelectorGridItem menuName={index.name} src={`/images/sandwich_menu/${index.name}.png`} key={index.name} clickHandler={() => setSelected(index)} />))}
                </div>
            }
        </div>
    );
};

export default MenusGrid;