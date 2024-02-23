import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head'
import { menuArray } from "../utils/menuArray"
import IngredientsRadarChart from '../components/IngredientRadarChart';
import { TbAlertCircle } from 'react-icons/tb';
import { useRouter } from 'next/router';
import BreadSection from '../components/ingredientSection/BreadSection';
import CheeseSection from '../components/ingredientSection/CheeseSection';
import AddIngredientsSection from '../components/ingredientSection/AddIngredientsSection';
import AddMeatSection from '../components/ingredientSection/AddMeatSection';
import VegetableSection from '../components/ingredientSection/VegetableSection';
import SauceSection from '../components/ingredientSection/SauceSection';
import ToastingSection from '../components/ingredientSection/ToastingSection';
import RecipeNameSection from '../components/ingredientSection/RecipeNameSection';
import { recipeContextType } from '../interfaces/AddRecipe';
import RecipeNav from '../components/RecipeNav/RecipeNav';
import { useMutation } from 'react-query';
import Image from 'next/image';

export type progressBarButtonsType = {
    id: string,
    text: string,
    ref: React.RefObject<HTMLDivElement>,
    handleClick: () => void
}

const AddRecipe = ({ param }: { param: string }) => {
    const index = menuArray.findIndex((item) => (item.name === param));
    const [recipeName, setRecipeName] = useState<string>('');
    const [tagArray, setTagArray] = useState<string[]>([]);
    const RecipeNameProp = {
        recipeName: recipeName,
        setRecipeName: setRecipeName,
        tagArray: tagArray,
        setTagArray: setTagArray
    }
    //커스텀 함수로 각 섹션에 맞는 값 정의
    const useCheckInput = () => {
        const [array, setArray] = useState<string[]>([]);
        const onChange = (e) => { e.target.value === '' ? setArray([]) : (array.includes(e.target.value) ? setArray(prev => prev.filter(item => item !== e.target.value)) : setArray(prev => [...prev, e.target.value])) };
        return { onChange, array, setArray };
    };
    const useRadioInput = () => {
        const [state, setState] = useState<string>('');
        const onChange = (e) => { setState(e.target.value) };
        return { onChange, state };
    };
    const addMeat = useRadioInput();
    const bread = useRadioInput();
    const cheese = useRadioInput();
    const addCheese = useRadioInput();
    const addIngredient = useCheckInput();
    const vegetable = useCheckInput();
    const pickledVegetable = useCheckInput();
    const sauce = useCheckInput();
    const [isToasting, setIsToasting] = useState<boolean>(true);
    const toasting = { state: isToasting, setState: setIsToasting };
    //sauce는 3개 제한이라는 특수성이 있어서 핸들러 함수를 만들어서 재 할당
    const sauceOnChange = (e) => {
        if (sauce.array.length < 3) {
            sauce.setArray(prev => [...prev, e.target.value])
        }
        if (sauce.array.includes(e.target.value)) {
            sauce.setArray(prev => prev.filter(item => item !== e.target.value))
        }
    };
    sauce.onChange = sauceOnChange;

    //RecipeNav에게 전달해줄 관찰대상 상태
    const recipeNameRef = useRef<HTMLDivElement | null>(null);
    const breadRef = useRef<HTMLDivElement | null>(null);
    const cheeseRef = useRef<HTMLDivElement | null>(null);
    const toastingRef = useRef<HTMLDivElement | null>(null);
    const vegetableRef = useRef<HTMLDivElement | null>(null);
    const sauceRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const handleClickHander = useCallback((ref) => {//이벤트를 자식에게 전달해주니까 useCallback으로 함수 메모라이즈
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);
    const progressBarButtons: progressBarButtonsType[] = [
        { id: 'recipeNameButton', text: '레시피 이름', ref: recipeNameRef, handleClick: () => handleClickHander(recipeNameRef) },
        { id: 'breadButton', text: '빵 선택', ref: breadRef, handleClick: () => handleClickHander(breadRef) },
        { id: 'cheeseButton', text: '치즈 선택', ref: cheeseRef, handleClick: () => handleClickHander(cheeseRef) },
        { id: 'toastingButton', text: '토스팅 여부', ref: toastingRef, handleClick: () => handleClickHander(toastingRef) },
        { id: 'vegetableButton', text: '채소 선택', ref: vegetableRef, handleClick: () => handleClickHander(vegetableRef) },
        { id: 'sauceButton', text: '소스 선택', ref: sauceRef, handleClick: () => handleClickHander(sauceRef) },
    ];
    const createContext = useCallback(() => {
        const recipeContext: recipeContextType = {
            recipeName: recipeName,
            tagArray: tagArray,
            param: param,
            addMeat: addMeat.state,
            bread: bread.state,
            cheese: cheese.state,
            addCheese: addCheese.state,
            isToasting: String(isToasting),
            vegetable: vegetable.array,
            pickledVegetable: pickledVegetable.array,
            sauce: sauce.array,
            addIngredient: addIngredient.array
        }
        return recipeContext;
    },[addCheese.state, addIngredient.array, addMeat.state, bread.state, cheese.state, isToasting, param, pickledVegetable.array, recipeName, sauce.array, tagArray, vegetable.array])
    //서버에 작성한 레시피를 제출하거나 거미줄차트에 전달해줄 props상태 객체를 작성
    const [context, setContext] = useState<recipeContextType>(createContext);
    //완료여부 확인 상태
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        setContext(createContext);
        //필수항목배열 확인후 다 작성되면 작성완료 할수있게
        const isNotComplete = Object.entries([recipeName, param, bread.state, toasting.state]).some(([_key, value]) => value === '');
        setIsComplete(!isNotComplete);
    }, [recipeName, param, addMeat.state, bread.state, cheese.state, addCheese.state, toasting.state, vegetable.array, pickledVegetable.array, sauce.array, addIngredient.array, createContext])

    //서버에 전달하는 함수
    const RecipeMutation = useMutation(async () => {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(context)
        })
        return response.json();
    }, { onSuccess: () => router.push('/Recipes') });

    const router = useRouter();
    const recipeAddHandler = () => {
        RecipeMutation.mutate();
    }

    return (
        <>
            <Head>
                <title>WhatSub : 레시피 작성</title>
                <meta name="robots" content="noindex" />
                <meta name="description" content="서브웨이 레시피 작성 및 수정해보세요" />
            </Head>
            <main className={'w-full max-w-screen-lg mx-auto mb-[80px] pt-2'}>
                <div className='w-[1024px] grid grid-cols-6'>
                    <div className="col-span-3 h-[300px] mt-[10%] sticky top-[10%]">
                        <h2 className='text-2xl ml-8 '>{param}</h2>
                        <div className='whitespace-pre-line ml-8 text-sm'>{menuArray[index].summary}</div>
                        <Image width={500} height={350} src={`/images/sandwich_menu/${param}.png`} alt={String(param)} className='object-contain object-right h-[350px] drop-shadow-lg'></Image>

                        <h3 className='ml-8 text-gray-500 group'>
                            영양성분표시
                            <TbAlertCircle />
                            <div className="absolute bg-gray-200 p-1 rounded text-xs invisible group-hover:visible whitespace-pre-line z-10">
                                {'일일섭취권장량은 2000kcal를 기준으로 작성되었습니다\n샌드위치 재료의 영양성분은 23.10.5 기준 서브웨이 홈페이지 제공 내용입니다.' +
                                    '\n신선채소의 영양성분은 주메뉴에 포함되어 있습니다\n절임채소, 추가재료는 정보가 제공되지 않아 포함되지 않습니다\n후추,소금 정보가 제공되지 않아 포함되지 않습니다' +
                                    '\n메뉴 이름에 치즈가 포함된 재료는 이미 치즈의 영양성분이 포함되어 있으나\n 관련 정보가 제공되지 않아 치즈 영양정보가 중복해서 포함될 수 있습니다'}
                            </div>
                        </h3>
                        <div className='flex justify-center'>
                            <IngredientsRadarChart context={context} />
                        </div>
                    </div>

                    <div className={`col-span-3 pt-[10%] overflow-y-auto`} ref={rootRef}>
                        <RecipeNameSection prop={RecipeNameProp} ref={recipeNameRef} />
                        <AddMeatSection prop={addMeat} param={param} />
                        <BreadSection prop={bread} ref={breadRef} />
                        <CheeseSection prop1={cheese} prop2={addCheese} ref={cheeseRef} />
                        <AddIngredientsSection prop={addIngredient} />
                        <ToastingSection prop={toasting} ref={toastingRef} />
                        <VegetableSection prop1={vegetable} prop2={pickledVegetable} ref={vegetableRef} />
                        <SauceSection prop={sauce} ref={sauceRef} />

                        <button className="bg-white rounded-md shadow-sm p-6" onClick={recipeAddHandler}>
                            <h3 className='text-xl font-[seoul-metro]'>작성완료</h3>
                        </button>

                    </div>
                </div>

                <RecipeNav progressBarButtons={progressBarButtons} isComplete={isComplete} createContext={createContext} />
            </main>
        </>
    );
};

export default AddRecipe;

export async function getServerSideProps(context) {
    // 서버에서 데이터를 불러올 수 있는 비동기 함수를 사용합니다.
    const param = context.query.param
    return {
        props: {
            param
        },
    };
}