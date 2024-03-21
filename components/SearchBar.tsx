import React, { useState, useEffect, useRef } from 'react';
import { IoSearchCircleSharp } from 'react-icons/io5';
import { useRouter } from 'next/router';

const SearchBar = (props: { className?: string, filterState?: string[] }) => {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.currentTarget.value);
  };

  const handleSubmit = () => {
    //받은 필터를 쿼리스트링으로 변경해서 전달해야함
    router.push(`/Recipes?query=${search}`);
  }

  useEffect(() => {
    //쿼리를 받으면 인풋박스에 검색어를 입력해주는 부분
    const query = router.query.query;
    if (typeof query !== 'undefined') {
      setSearch(String(query))
      if (inputRef.current)
        inputRef.current.value = String(query)
    }
  }, [router.query])

  const searchEnterHandler = (e) => {
    //엔터 누르면 검색 페이지로 이동
    if (e.key === 'Enter') {
      handleSubmit();
    }
}

  return (
    <div className={`group relative flex flex-wrap items-center focus-within:text-yellow-500 text-green-600 w-[70%] md:w-[50%] mx-auto ${props.className}`}>
      <input type="search" name="serch" placeholder="다른 사람은 무엇을 먹을까요?" onChange={handleSearch} ref={inputRef}
        className="bg-white w-full placeholder:italic border-2 border-green-600 rounded-full text-sm py-[10px] pl-9 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500 focus:ring-1 text-black input-no-clear" 
        onKeyDown={searchEnterHandler}
      />
      <button onClick={handleSubmit} type="submit" className="absolute right-0 pr-1" aria-label="search button">
        <IoSearchCircleSharp className='text-4xl ' />
      </button>
    </div>
  );
};

export default SearchBar;