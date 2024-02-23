import React, { Dispatch, SetStateAction, forwardRef, useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { StyleTag } from '../RecipesBanner';
import IngredientsSection from './sub/IngredientsSection';
import { useSearchParams } from 'next/navigation';
import { throttle } from '../../utils/publicFunction';

export type propsType = {
    prop: {
        recipeName: string,
        setRecipeName: Dispatch<SetStateAction<string>>,
        tagArray: string[],
        setTagArray: Dispatch<SetStateAction<string[]>>
    },
}

const RecipeNameSection = forwardRef<HTMLDivElement, propsType>(({ prop }, ref) => {
    const [tagInput, setTagInput] = useState<string>('');
    const [tagData, setTagData] = useState<string[]>([]);
    const searchParams = useSearchParams();
    const param = searchParams!.get('param');

    //레시피 이름 입력 이벤트 핸들러
    const handleChange = (e) => {
        const value = e.target.value;
        prop.setRecipeName(value);
    }

    //태그 중복금지 및 빈 문자열 금지
    //인풋을 통한 태그 추가 이벤트 핸들러
    const addInputHandler = () => {
        if (prop.tagArray.every(item => item !== tagInput) && tagInput.replaceAll(' ', '') !== '') {
            prop.setTagArray(prev => [...prev, tagInput])
        }
    }//버튼을통한 태그 추가 이벤트 핸들러
    const addTagHandler = (tag) => {
        if (prop.tagArray.every(item => item !== tag) && tag.replaceAll(' ', '') !== '') {
            prop.setTagArray(prev => [...prev, tag])
        }
    }

    const tagSearch = async ({ tag, param }: { tag: string; param?: never } | { tag?: never; param: string }) => {
        try {
            const result = await fetch(tag ? `/api/recipes/tag?tag=${encodeURIComponent(tag)}`
                : param ? `/api/recipes/tag?param=${encodeURIComponent(param)}` : '', { cache: 'force-cache' })//태그는 중요하지 않으므로 브라우저 캐시를 사용
            if (result.status === 200) {
                const data = await result.json();
                setTagData(data.map(item => item.tag_name));
            } else if (result.status === 204) {
                return setTagData([]);
            } else {
                throw result;
            }
        } catch (err) {
            console.log(err)
        }
    }

    //태그 초기 검색
    useEffect(() => {
        if (param) {
            tagSearch({ param: param })
        }
    }, [param])

    //태그 검색 스로틀링(재렌더링 될때마다 throttle을 할당한 변수가 달라져서 setTimeout이 초기화가 되므로 useRef를 사용하여 throttle을 할당해줌)
    const trottleRef = useRef(throttle((tagInput: string) => {
        if (tagInput.length > 1) {
            tagSearch({ tag: tagInput })
        }
    }, 1000));

    useEffect(() => {
        trottleRef.current(tagInput);
    }, [tagInput])

    return (
        <IngredientsSection ref={ref} id='recipeName'>
            <h3 className='text-xl font-[seoul-metro]'>레시피 이름</h3>
            <div className='p-2'>
                <div className="flex flex-row items-center border rounded-md placeholder:text-gray-400 focus-within:ring-2 ring-green-600 p-1">
                    <input className='w-full outline-none' onChange={handleChange}></input>
                </div>
            </div>
            <h3 className='text-xl font-[seoul-metro]'>태그 추가</h3>
            <div className='p-2'>
                {prop.tagArray.map((item) =>
                    <StyleTag key={item} className='group' onClick={() => prop.setTagArray(prop.tagArray.filter(index => index !== item))}>
                        <span className='group-hover:hidden'>#</span>
                        <span className='hidden group-hover:inline'>-</span>
                        {item}
                    </StyleTag>)}
                <div className='w-full'>
                    <div className="flex flex-row items-center border rounded-md placeholder:text-gray-400 focus-within:ring-2 ring-green-600 p-1">
                        <FiSearch className='text-lg mx-1 text-gray-400' />
                        <input className='w-full outline-none' onChange={(e) => setTagInput(e.target.value)}></input>
                    </div>
                </div>
                <div className='p-2'>
                    추천태그:
                    {!tagData.find(item => item === tagInput) && tagInput.length > 0 && <StyleTag onClick={addInputHandler}>+{tagInput}</StyleTag>}
                    {tagData && tagData.map(item => <StyleTag key={item} onClick={() => addTagHandler(item)}>+{item}</StyleTag>)}
                </div>
            </div>
        </IngredientsSection>
    );
});

RecipeNameSection.displayName = 'RecipeNameSection'
export default RecipeNameSection;