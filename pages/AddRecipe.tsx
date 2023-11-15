import { useState, useRef, useEffect } from 'react';
import Head from 'next/head'
import { menuArray } from "../utils/menuArray"
import styled from 'styled-components';
import IngredientsRadarChart from '../components/IngredientRadarChart';
import { TbAlertCircle } from 'react-icons/tb';
import { useRouter } from 'next/router';
import ProgressBar from '../components/AddRecipe/ProgressBar';
import BreadSection from '../components/AddRecipe/BreadSection';
import CheeseSection from '../components/AddRecipe/CheeseSection';
import AddIngredientsSection from '../components/AddRecipe/AddIngredientsSection';
import AddMeatSection from '../components/AddRecipe/AddMeatSection';
import VegetableSection from '../components/AddRecipe/VegetableSection';
import SauceSection from '../components/AddRecipe/SauceSection';
import ToastingSection from '../components/AddRecipe/ToastingSection';
import RecipeNameSection from '../components/AddRecipe/RecipeNameSection';
import { recipeContextType } from '../interfaces/AppRecipe';

const RecipeNav = styled.div`
    position: fixed;
    bottom:0;
    width:1024px;
    height:80px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px lightgray;
    border-radius: 10px 10px 0px 0px;
`
type NavSandwichProps = {
    $activesection: number;
}
const NavSandwich = styled.div<NavSandwichProps>`
    position: absolute;
    transform: translate(${(props) => props.$activesection * 140 + 40}px, -5px);
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    `

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

    const progressBarButtons = [
        { id: 'recipeNameButton', text: '레시피 이름' },
        { id: 'breadButton', text: '빵 선택' },
        { id: 'cheeseButton', text: '치즈 선택' },
        { id: 'toastingButton', text: '토스팅 여부' },
        { id: 'vegetableButton', text: '채소 선택' },
        { id: 'sauceButton', text: '소스 선택' },
    ];
    const recipeNameRef = useRef<HTMLDivElement | null>(null);
    const breadRef = useRef<HTMLDivElement | null>(null);
    const cheeseRef = useRef<HTMLDivElement | null>(null);
    const toastingRef = useRef<HTMLDivElement | null>(null);
    const vegetableRef = useRef<HTMLDivElement | null>(null);
    const sauceRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (e) => {
        if (recipeNameRef.current && e.currentTarget.id === 'recipeNameButton') {
            recipeNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (breadRef.current && e.currentTarget.id === 'breadButton') {
            breadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (cheeseRef.current && e.currentTarget.id === 'cheeseButton') {
            cheeseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (toastingRef.current && e.currentTarget.id === 'toastingButton') {
            toastingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (vegetableRef.current && e.currentTarget.id === 'vegetableButton') {
            vegetableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (sauceRef.current && e.currentTarget.id === 'sauceButton') {
            sauceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const [activeSection, setActiveSection] = useState<number>(0);
    let observer: IntersectionObserver;

    useEffect(() => {
        observer = new IntersectionObserver((entries) => {

            //가장위에 있는 요소 탐지
            //(IntersectionObserver는 요소를 여러개 감지하면 가장 마지막 요소만 entry.target에 저장하므로 가장위에것을 탐지하게하기 위해서)
            const firstEntry = entries.reduce((first, entry) => {
                return (entry.boundingClientRect.top < first.boundingClientRect.top) ? entry : first;
            });
            console.log(firstEntry.target.id);

            if (firstEntry.isIntersecting) {
                switch (firstEntry.target.id) {
                    case 'recipeName':
                        setActiveSection(0)
                        break;
                    case 'bread':
                        setActiveSection(1);
                        break;
                    case 'cheese':
                        setActiveSection(2);
                        break;
                    case 'toasting':
                        setActiveSection(3);
                        break;
                    case 'vegetable':
                        setActiveSection(4);
                        break;
                    case 'sauce':
                        setActiveSection(5);
                        break;
                    // ... (다른 case들)
                    default:
                        break;
                }
            }
        }, {
            threshold: [0.5, 1, 1]
        });

        // 관찰할 요소
        if (recipeNameRef.current) observer.observe(recipeNameRef.current);
        if (breadRef.current) observer.observe(breadRef.current);
        if (cheeseRef.current) observer.observe(cheeseRef.current);
        if (toastingRef.current) observer.observe(toastingRef.current);
        if (vegetableRef.current) observer.observe(vegetableRef.current);
        if (sauceRef.current) observer.observe(sauceRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

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
        const isNotComplete = Object.entries(context).some(([_key, value]) => value === '');
        setIsComplete(!isNotComplete);
    }, [recipeName, param, addMeat.state, bread.state, cheese.state, addCheese.state, toasting.state, vegetable.array, pickledVegetable.array, sauce.array, addIngredient.array])

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
            error => console.log(error))
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
                        <RecipeNameSection prop={RecipeNameProp} ref={recipeNameRef} param={param}></RecipeNameSection>
                        <AddMeatSection prop={addMeat} param={param}></AddMeatSection>
                        <BreadSection prop={bread} ref={breadRef}></BreadSection>
                        <CheeseSection prop1={cheese} prop2={addCheese} ref={cheeseRef}></CheeseSection>
                        <AddIngredientsSection prop={addIngredient}></AddIngredientsSection>
                        <ToastingSection prop={toasting} ref={toastingRef}></ToastingSection>
                        <VegetableSection prop1={vegetable} prop2={pickledVegetable} ref={vegetableRef}></VegetableSection>
                        <SauceSection prop={sauce} ref={sauceRef}></SauceSection>

                        <button className="bg-white rounded-md shadow-sm p-6" onClick={onClickHandler}>
                            <h3 className='text-xl font-[seoul-metro]'>작성완료</h3>
                        </button>

                    </div>
                </div>

                <RecipeNav className='p-6 grid grid-cols-7 grid-rows-1 font-[seoul-metro]'>
                    <NavSandwich $activesection={activeSection}>
                        <img src='/images/front_banner.png' className={`w-10`} />
                    </NavSandwich>
                    {progressBarButtons.map((button) => (
                        <ProgressBar
                            key={button.id}
                            activeSection={activeSection}
                            handleClick={handleClick}
                            buttonId={button.id}
                            buttonText={button.text}
                        />
                    ))}
                    <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600 mb-[30%]' disabled={!isComplete} onClick={createContext}>
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div>
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-yellow-400'></div>
                        <div className={`col-span-1 text-center absolute mt-1 ` + (!isComplete && 'text-gray-300')}>작성완료</div>
                    </button>
                </RecipeNav>
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