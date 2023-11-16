import { useState, useRef, useEffect } from 'react';
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
import { recipeContextType } from '../interfaces/AppRecipe';
import RecipeNav from '../components/RecipeNav';

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

    const sauceOnChange = (e) => {
        if (sauce.array.length < 3) {
            sauce.setArray(prev => [...prev, e.target.value])
        }
        if (sauce.array.includes(e.target.value)) {
            sauce.setArray(prev => prev.filter(item => item !== e.target.value))
        }
    };
    sauce.onChange = sauceOnChange;//sauce는 3개 제한때문에 핸들러함수 만들어서 재 할당

    //RecipeNav에게 전달해줄 관찰대상 상태
    const recipeNameRef = useRef<HTMLDivElement | null>(null);
    const breadRef = useRef<HTMLDivElement | null>(null);
    const cheeseRef = useRef<HTMLDivElement | null>(null);
    const toastingRef = useRef<HTMLDivElement | null>(null);
    const vegetableRef = useRef<HTMLDivElement | null>(null);
    const sauceRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const progressBarButtons: progressBarButtonsType[] = [
        { id: 'recipeNameButton', text: '레시피 이름', ref: recipeNameRef, handleClick: () => { progressBarButtons[0].ref.current && progressBarButtons[0].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
        { id: 'breadButton', text: '빵 선택', ref: breadRef, handleClick: () => { progressBarButtons[1].ref.current && progressBarButtons[1].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
        { id: 'cheeseButton', text: '치즈 선택', ref: cheeseRef, handleClick: () => { progressBarButtons[2].ref.current && progressBarButtons[2].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
        { id: 'toastingButton', text: '토스팅 여부', ref: toastingRef, handleClick: () => { progressBarButtons[3].ref.current && progressBarButtons[3].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
        { id: 'vegetableButton', text: '채소 선택', ref: vegetableRef, handleClick: () => { progressBarButtons[4].ref.current && progressBarButtons[4].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
        { id: 'sauceButton', text: '소스 선택', ref: sauceRef, handleClick: () => { progressBarButtons[5].ref.current && progressBarButtons[5].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } },
    ];
    const createContext = () => {
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
    }
    //서버에 작성한 레시피를 제출하거나 거미줄차트에 전달해줄 props상태 객체를 작성
    const [context, setContext] = useState<recipeContextType>(createContext);
    //완료여부 확인 상태
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        setContext(createContext);
        //필수항목배열 확인후 다 작성되면 사용가능
        const isNotComplete = Object.entries([recipeName, param, bread.state, toasting.state]).some(([_key, value]) => value === '');
        setIsComplete(!isNotComplete);
        console.log(isNotComplete);
    }, [recipeName, param, addMeat.state, bread.state, cheese.state, addCheese.state, toasting.state, vegetable.array, pickledVegetable.array, sauce.array, addIngredient.array])

    //서버에 전달하는 함수
    const sendRecipe = async () => {
        const response = await fetch('/api/recipe?insert=recipe', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(context)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    const router = useRouter();
    const onClickHandler = () => {
        sendRecipe().then(
            result => {
                if (result.redirect) {
                    router.push(result.redirect)
                }
            },
            error => console.log(error)
        )
    }

    return (
        <>
            <Head>
                <title>레시피 추가</title>
                <meta name="description" content="Page description" />
            </Head>
            <main className={'w-full max-w-screen-lg mx-auto mb-[80px] pt-2'}>
                <div className='w-[1024px] grid grid-cols-6'>
                    <div className="col-span-3 h-[300px] mt-[10%] sticky top-[10%]">
                        <h2 className='text-2xl ml-8 '>{param}</h2>
                        <div className='whitespace-pre-line ml-8 text-sm'>{menuArray[index].summary}</div>
                        <img src={`/images/sandwich_menu/${param}.png`} alt={String(param)} className='object-contain object-right h-[350px] drop-shadow-lg'></img>

                        <h3 className='ml-8 text-gray-500 group'>
                            영양성분표시
                            <TbAlertCircle />
                            <div className="absolute bg-gray-200 p-1 rounded text-xs invisible group-hover:visible whitespace-pre-line z-10">
                                {'일일섭취권장량은 2000kcal를 기준으로 작성되었습니다\n샌드위치 재료의 영양성분은 23.10.5 기준 서브웨이 홈페이지 제공 내용입니다.' +
                                    '\n신선채소의 영양성분은 주메뉴에 포함되어 있습니다\n절임채소, 추가재료는 정보가 제공되지 않아 포함되지 않습니다\n후추,소금 정보가 제공되지 않아 포함되지 않습니다' +
                                    '\n메뉴 이름에 치즈가 포함된 재료는 이미 치즈의 영양성분이 포함되어 있으나\n 관련 정보가 제공되지 않아 치즈 영양정보가 중복해서 포함될 수 있습니다'}
                            </div>
                        </h3>
                        <IngredientsRadarChart context={context} />
                    </div>

                    <div className={`col-span-3 pt-[10%] overflow-y-auto`} ref={rootRef}>
                        <RecipeNameSection prop={RecipeNameProp} ref={recipeNameRef} param={param}/>
                        <AddMeatSection prop={addMeat} param={param}/>
                        <BreadSection prop={bread} ref={breadRef}/>
                        <CheeseSection prop1={cheese} prop2={addCheese} ref={cheeseRef}/>
                        <AddIngredientsSection prop={addIngredient}/>
                        <ToastingSection prop={toasting} ref={toastingRef}/>
                        <VegetableSection prop1={vegetable} prop2={pickledVegetable} ref={vegetableRef}/>
                        <SauceSection prop={sauce} ref={sauceRef}/>

                        <button className="bg-white rounded-md shadow-sm p-6" onClick={onClickHandler}>
                            <h3 className='text-xl font-[seoul-metro]'>작성완료</h3>
                        </button>

                    </div>
                </div>

                <RecipeNav progressBarButtons={progressBarButtons} isComplete={isComplete} createContext={createContext}/>
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