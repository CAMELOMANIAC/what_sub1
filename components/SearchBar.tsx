import React, { useState } from 'react';
import { IoSearchCircleSharp } from 'react-icons/io5';
import { useRouter } from 'next/router';

const SearchBar = (props: { className?: string }) => {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.currentTarget.value);
  };

  const handleSubmit = () => {
    router.push(`/Recipes?query=${search}`);
  }

  return (
    <div className={`group relative flex flex-wrap items-center focus-within:text-yellow-500 text-green-600 w-[50%] mx-auto ${props.className}`}>
      <input type="search" name="serch" placeholder="다른 사람은 무엇을 먹을까요?" onChange={handleSearch} className="bg-white w-full placeholder:italic border-2 border-green-600 rounded-full text-sm py-[10px] pl-9 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500 focus:ring-1 text-black input-no-clear" />
      <button onClick={handleSubmit} type="submit" className="absolute right-0 pr-1">
        <IoSearchCircleSharp className='text-4xl ' />
      </button>
    </div>
  );
};

export default SearchBar;