import { useState, useRef, useEffect } from 'react';
import { breadNutrientArray, cheeseNutrientArray, sauceNutrientArray, menuNutrientArray, menuArray, ingredientsArray, vegetableArray, pickleArray } from "../utils/menuArray"
import styled from 'styled-components';
import IngredientsRadarChart from '../components/IngredientRadarChart';
import { TbAlertCircle } from 'react-icons/tb';
import { CheckBox, EmptyCheckBox, RadioBox, EmptyRadioBox } from '../components/CheckBox';


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

const AddRecipe = ({ param }) => {
    const index = menuArray.findIndex((item) => (item.name === param));
    const [recipeName, setRecipeName] = useState<string>('');
    const [bread, setBread] = useState<string>('위트');
    const [isToasting, setisToasting] = useState<boolean>(true);
    const [cheese, setCheese] = useState<string>('아메리칸');
    const [AddCheese, setAddCheese] = useState<string>('');
    const [vegetable, setVegetable] = useState<string[]>(['양상추', '토마토', '오이', '피망', '양파']);
    const [pickle, setPickle] = useState<string[]>(['피클', '올리브', '할라피뇨']);
    const [sauce, setSauce] = useState<string[]>([]);
    const [addIngredient, setAddingredient] = useState<string[]>([]);
    const [addMeat, setAddMeat] = useState<string>('');
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const [isShowAddMeat, setIsShowAddMeat] = useState<boolean>(false);
    const [isShowAddCheese, setIsShowAddCheese] = useState<boolean>(false);
    const [isShowAddIngredient, setIsShowAddIngredient] = useState<boolean>(false);

    const vegetableChagedHandler = (e) => {
        if (e.target.checked) {
            setVegetable([...vegetable, e.target.value]);
        } else {
            setVegetable(vegetable.filter(item => item !== e.target.value));
        }
    }
    const pickleChagedHandler = (e) => {
        if (e.target.checked) {
            setPickle([...pickle, e.target.value]);
        } else {
            setPickle(pickle.filter(item => item !== e.target.value));
        }
    }
    const sauceChagedHandler = (e) => {
        if (e.target.checked && sauce.length < 3) {
            setSauce([...sauce, e.target.value]);
        } else {
            setSauce(sauce.filter(item => item !== e.target.value));
        }
    }

    const addIngredientChagedHandler = (e) => {
        if (e.target.checked) {
            setAddingredient([...addIngredient, e.target.value]);
        } else {
            setAddingredient(addIngredient.filter(item => item !== e.target.value));
        }
    }

    const showAddMeatClickHandler = () => {
        setIsShowAddMeat(false);
        setAddMeat('')
    }
    const showAddCheeseClickHandler = () => {
        setIsShowAddCheese(false);
        setAddCheese('')
    }
    const showAddIngredientClickHandler = () => {
        setIsShowAddIngredient(false);
        setAddingredient([])
    }

    const recipeNameRef = useRef<HTMLDivElement | null>(null);
    const breadeRef = useRef<HTMLDivElement | null>(null);
    const cheeseRef = useRef<HTMLDivElement | null>(null);
    const toastingRef = useRef<HTMLDivElement | null>(null);
    const vegetableRef = useRef<HTMLDivElement | null>(null);
    const sauceRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (e) => {
        if (recipeNameRef.current && e.currentTarget.id === 'recipeNameButton') {
            recipeNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (breadeRef.current && e.currentTarget.id === 'breadButton') {
            breadeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    let observer;

    useEffect(() => {
        observer = new IntersectionObserver((entries) => {

            //가장위에 있는 요소 탐지(IntersectionObserver는 요소를 여러개 감지하면 가장 마지막 요소만 entry.target에 저장하므로 가장위에것을 탐지하게하기 위해서)
            let firstEntry = entries.reduce((first, entry) => {
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

        // 요소들을 관찰합니다
        if (recipeNameRef.current) observer.observe(recipeNameRef.current);
        if (breadeRef.current) observer.observe(breadeRef.current);
        if (cheeseRef.current) observer.observe(cheeseRef.current);
        if (toastingRef.current) observer.observe(toastingRef.current);
        if (vegetableRef.current) observer.observe(vegetableRef.current);
        if (sauceRef.current) observer.observe(sauceRef.current);
        // ... (다른 요소들을 관찰합니다)

        // 옵저버를 정리합니다
        return () => {
            observer.disconnect();
        };
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setRecipeName(value);
        if (value.length > 0) {
            setIsComplete(true);
        } else {
            setIsComplete(false);
        }
    };

    //서버에 작성한 레시피를 제출하거나 거미줄차트에 전달해줄 props상태 배열을 작성
    const [context, setContext] = useState<string[]>([]);
    useEffect(() => {
        createArray();
    }, [recipeName, param, addMeat, bread, cheese, AddCheese, isToasting, vegetable, pickle, sauce, addIngredient])

    const handleSubmit = () => {
        createArray();
    }
    const createArray = () => {
        const arr = [recipeName, param, addMeat, bread, cheese, AddCheese, String(isToasting), ...vegetable, ...pickle, ...sauce, ...addIngredient];
        setContext(arr.filter((item) => item !== ''));
        console.log(JSON.stringify(context));
    }

    const sendRecipe = async () => {
        const response = await fetch('/api/addRecipe', {
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

    const onClickHandler = () =>{
        sendRecipe().then(result => console.log(result))
    }

    return (
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
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={recipeNameRef} id='recipeName'>
                        <h3 className='text-xl font-[seoul-metro]'>레시피 이름</h3>
                        <input className='w-full font-[seoul-namsan]' onChange={handleChange}></input>
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6">
                        <div className='m-2 mb-8'>
                            <h3 className='text-xl font-[seoul-metro]'>주메뉴</h3>
                            <p className='p-2 flex items-center h-12'>{param}</p>
                        </div>
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>미트추가</h3>
                            <div className='p-2'>
                                {isShowAddMeat === false && <button className='w-full' onClick={() => setIsShowAddMeat(true)}>추가하기</button>}
                                <div className={isShowAddMeat ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                                    <div className='flex flex-row items-center h-12'>
                                        <EmptyRadioBox section={'addMeat'} addContext={'미트 추가'} getState={addMeat} onChange={showAddMeatClickHandler}></EmptyRadioBox>
                                    </div>
                                    {menuNutrientArray.filter(item => item.name !== '베지').map((item) => (
                                        <div key={item.name} className='flex flex-row items-center'>
                                            <RadioBox item={item} section={'addMeat'} addContext={'추가'} getState={addMeat} setState={setAddMeat}></RadioBox>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6" ref={breadeRef} id='bread'>
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>빵 선택</h3>
                            <div className='p-2'>
                                {
                                    breadNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row items-center'>
                                            <RadioBox item={item} section={'bread'} addContext={''} getState={bread} setState={setBread}></RadioBox>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6 " ref={cheeseRef} id='cheese'>
                        <div className='m-2 mb-8'>
                            <h3 className='text-xl font-[seoul-metro]'>치즈 선택</h3>
                            <div className='p-2'>
                                {
                                    cheeseNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row items-center'>
                                            <RadioBox item={item} section={'cheese'} addContext={'치즈'} getState={cheese} setState={setCheese}></RadioBox>
                                        </div>
                                    ))
                                }
                                <div className='h-12 flex items-center'>
                                    <EmptyRadioBox section={'cheese'} addContext={'치즈'} getState={cheese} setState={setCheese}></EmptyRadioBox>
                                </div>
                            </div>
                        </div>
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>치즈 추가</h3>
                            <div className='p-2'>
                                {isShowAddCheese === false && <button className='w-full' onClick={() => setIsShowAddCheese(true)}>추가하기</button>}
                                <div className={isShowAddCheese ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                                    <div className='h-12 flex items-center'>
                                        <EmptyRadioBox section='AddCheese' addContext={'치즈 추가'} getState={AddCheese} onChange={showAddCheeseClickHandler}></EmptyRadioBox>
                                    </div>
                                    {
                                        cheeseNutrientArray.map((item) => (
                                            <div key={item.name} className='flex flex-row items-center'>
                                                <RadioBox item={item} section='AddCheese' addContext={'치즈 추가'} getState={AddCheese} setState={setAddCheese}></RadioBox>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>추가재료</h3>
                            <div className='p-2'>
                                {isShowAddIngredient === false && <button className='w-full' onClick={() => setIsShowAddIngredient(true)}>추가하기</button>}
                                <div className={isShowAddIngredient ? 'max-h-[1000px] transition-all duration-500' : 'max-h-0 overflow-hidden transition-all duration-500'}>
                                    <div className='flex flex-row h-12'>
                                        <EmptyCheckBox section={'addIngredient'} addContext={'재료 추가'} onChange={() => showAddIngredientClickHandler()}></EmptyCheckBox>
                                    </div>

                                    {ingredientsArray.map((item) => (
                                        <div key={item.name} className='flex flex-row items-center'>
                                            <CheckBox item={item} section={'addIngredient'} addContext={'추가'} getState={addIngredient} onChange={addIngredientChagedHandler}></CheckBox>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6 h-[200px]" ref={toastingRef} id='toasting'>
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>토스팅 여부</h3>
                            <div className='p-2'>
                                <button onClick={() => setisToasting(true)} className={`${isToasting && 'bg-green-600 text-white'}`}>예</button>
                                <button onClick={() => setisToasting(false)} className={`${isToasting === false && 'bg-green-600 text-white'}`}>아니오</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={vegetableRef} id='vegetable'>
                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>신선 채소 선택</h3>
                            <div className='p-2 mb-8'>
                                {vegetableArray.map((item) => (
                                    <div key={item.name} className='flex flex-row items-center'>
                                        <CheckBox item={item} section={'vegetable'} addContext={''} getState={vegetable} onChange={vegetableChagedHandler}></CheckBox>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='m-2'>
                            <h3 className='text-xl font-[seoul-metro]'>절임 채소 선택</h3>
                            <div className='p-2'>
                                {pickleArray.map((item) => (
                                    <div key={item.name} className='flex flex-row items-center'>
                                        <CheckBox item={item} section={'pickle'} addContext={''} getState={pickle} onChange={pickleChagedHandler}></CheckBox>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={sauceRef} id='sauce'>
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
                    </div>

                    <button className="bg-white rounded-md shadow-sm p-6" onClick={onClickHandler}>
                        <h3 className='text-xl font-[seoul-metro]'>작성완료</h3>
                    </button>

                </div>
            </div>




            <RecipeNav className='p-6 grid grid-cols-7 grid-rows-1'>
                <NavSandwich $activesection={activeSection}>
                    <img src='/images/front_banner.png' className={`w-10`} />
                </NavSandwich>
                <button
                    className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600 ' onClick={(e) => handleClick(e)} id='recipeNameButton'>
                    {activeSection === 0 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>레시피 이름</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600' onClick={(e) => handleClick(e)} id='breadButton'>
                    {activeSection === 1 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>빵 선택</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600' onClick={(e) => handleClick(e)} id='cheeseButton'>
                    {activeSection === 2 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>치즈 선택</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600' onClick={(e) => handleClick(e)} id='toastingButton'>
                    {activeSection === 3 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>토스팅 여부</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600' onClick={(e) => handleClick(e)} id='vegetableButton'>
                    {activeSection === 4 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>채소 선택</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600' onClick={(e) => handleClick(e)} id='sauceButton'>
                    {activeSection === 5 ?
                        <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div> :
                        <div className='bg-white w-[8px] h-[8px] translate-y-[-8px] rounded-full border-[1px] border-green-600'></div>
                    }
                    <div className='col-span-1 text-center absolute mt-1'>소스 선택</div>
                </button>
                <button className='col-span-1 flex justify-center align-middle border-t-[8px] border-green-600 mb-[30%]' disabled={!isComplete} onClick={handleSubmit}>
                    <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-green-600'></div>
                    <div className='bg-white w-[18px] h-[18px] translate-y-[-13px] rounded-full border-[3px] border-yellow-400'></div>
                    <div className={`col-span-1 text-center absolute mt-1 ` + (!isComplete && 'text-gray-300')}>작성완료</div>
                </button>
            </RecipeNav>
        </main>
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