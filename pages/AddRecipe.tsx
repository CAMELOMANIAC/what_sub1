import { useState, useRef, useEffect } from 'react';
import { breadNutrientArray, cheeseNutrientArray, sauceNutrientArray, menuNutrientArray, menuArray } from "../utils/menuArray"
import styled from 'styled-components';
import IngredientsRadarChart from '../components/IngredientRadarChart';
import { TbAlertCircle } from 'react-icons/tb';

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
    const [bread, setBread] = useState<string>('하티');
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
            recipeNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        else if (breadeRef.current && e.currentTarget.id === 'breadButton') {
            breadeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else if (cheeseRef.current && e.currentTarget.id === 'cheeseButton') {
            cheeseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else if (toastingRef.current && e.currentTarget.id === 'toastingButton') {
            toastingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else if (vegetableRef.current && e.currentTarget.id === 'vegetableButton') {
            vegetableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else if (sauceRef.current && e.currentTarget.id === 'sauceButton') {
            sauceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const [activeSection, setActiveSection] = useState<number>(0);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {

            //가장위에 있는 요소 탐지(IntersectionObserver는 요소를 여러개 감지하면 가장 마지막 요소만 entry.target에 저장하므로 가장위에것을 탐지하게하기 위해서)
            let firstEntry = entries.reduce((first, entry) => {
                return (entry.boundingClientRect.top < first.boundingClientRect.top) ? entry : first;
            });
            entries.forEach(() => {
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
            });
        }, {
            threshold: 1, root: rootRef.current
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
        console.log(context);
    }

    return (
        <main className={'w-full max-w-screen-lg mx-auto mb-[80px] pt-2'}>
            <div className='w-[1024px] h-[600px] grid grid-cols-6'>
                <div className="col-span-3 h-[300px] mt-[10%]">
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
                <div className={`col-span-3 mt-[10%] h-[120%] mb-[10%] overflow-y-auto`} ref={rootRef}>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={recipeNameRef} id='recipeName'>
                        <h3>레시피 이름</h3>
                        <input className='w-full' onChange={handleChange}></input>
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6">
                        <div className='m-2 mb-8'>
                            <h3 className='text-xl font-bold'>주메뉴</h3>
                            <p className='p-2 flex items-center h-12'>{param}</p>
                        </div>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>미트추가</h3>
                            {isShowAddMeat === false && <button className='w-full' onClick={() => setIsShowAddMeat(true)}>추가하기</button>}
                            {isShowAddMeat &&
                                <div className='p-2'>
                                    <div className='h-12 flex items-center'>
                                        <input type='radio' id='미트 추가 없음' name='addMeat' value='미트 추가 없음' onChange={showAddMeatClickHandler} className='mr-2'></input>
                                        <label htmlFor='미트 추가 없음'>미트 추가 없음</label>
                                    </div>
                                    {menuNutrientArray.filter(item => item.name !== '베지').map((item) => (
                                        <div key={item.name} className='flex flex-row'>
                                            <input type='radio' id={`${item.name} 추가`} name='addMeat' value={`${item.name} 추가`} checked={addMeat === (`${item.name} 추가`)} onChange={(e) => (setAddMeat(e.target.value))} className='mr-2'></input>

                                            <label htmlFor={`${item.name} 추가`} className='my-auto flex items-center'>
                                                <div className='inline-block w-10 overflow-hidden relative rounded-md aspect-square m-auto my-1 mr-2'>
                                                    <img src={`/images/sandwich_menu/${item.name}.png`} alt={item.name} className='relative object-cover scale-[2.7] origin-[85%_40%]'></img>
                                                </div>
                                                <span className=''>{item.name} 추가</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-start bg-white rounded-md shadow-sm mb-2 p-6" ref={breadeRef} id='bread'>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>빵 선택</h3>
                            <div className='p-2'>
                                {
                                    breadNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row'>
                                            <input type='radio' id={`${item.name}`} name='bread' value={`${item.name}`} checked={bread === item.name} onChange={(e) => (setBread(e.target.value))} className='mr-2'></input>
                                            <label htmlFor={`${item.name}`} className='my-auto flex items-center'>
                                                <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={item.name}></img>
                                                <p>{item.name}</p>
                                            </label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6 " ref={cheeseRef} id='cheese'>
                        <div className='m-2 mb-8'>
                            <h3 className='text-xl font-bold'>치즈 선택</h3>
                            <div className='p-2'>
                                {
                                    cheeseNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row'>
                                            <input type='radio' id={`${item.name}`} name='cheese' value={`${item.name}`} checked={cheese === item.name} onChange={(e) => (setCheese(e.target.value))} className='mr-2'></input>
                                            <label htmlFor={`${item.name}`} className='my-auto flex items-center'>
                                                <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={item.name}></img>
                                                <p>
                                                    {item.name} 치즈
                                                </p>
                                            </label>
                                        </div>
                                    ))
                                }
                                <div className='h-12 flex items-center'>
                                    <input type='radio' id='치즈 없음' name='cheese' value='치즈 없음' onChange={(e) => (setCheese(''))} className='mr-2'></input>
                                    <label htmlFor='치즈 없음'>치즈 없음</label>
                                </div>
                            </div>
                        </div>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>치즈 추가</h3>
                            <div className='p-2'>
                                {isShowAddCheese === false && <button className='w-full' onClick={() => setIsShowAddCheese(true)}>추가하기</button>}
                                {isShowAddCheese &&
                                    <>
                                        <div className='h-12 flex items-center'>
                                            <input type='radio' id='치즈 추가 없음' name='AddCheese' value='치즈 추가 없음' onChange={(e) => (showAddCheeseClickHandler())} className='mr-2'></input>
                                            <label htmlFor='치즈 추가 없음'>치즈 추가 없음</label>
                                        </div>
                                        {
                                            cheeseNutrientArray.map((item) => (
                                                <div key={item.name} className='flex flex-row'>
                                                    <input type='radio' id={`${item.name} 추가`} name='AddCheese' value={`${item.name} 추가`} checked={AddCheese === item.name + ' 추가'} onChange={(e) => (setAddCheese(e.target.value))} className='mr-2'></input>
                                                    <label htmlFor={`${item.name} 추가`} className='my-auto flex items-center'>
                                                        <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={item.name}></img>
                                                        <p>{item.name} 치즈 추가</p>
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6">
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>추가재료</h3>
                            {isShowAddIngredient === false && <button className='w-full' onClick={() => setIsShowAddIngredient(true)}>추가하기</button>}
                            {isShowAddIngredient &&
                                <div className='p-2'>
                                    <div className='flex flex-row h-12'>
                                        <input type='checkbox' id='추가재료 없음' name='addIngredient' value='추가재료 없음' onChange={() => showAddIngredientClickHandler()} className='mr-2'></input>
                                        <label htmlFor='추가재료 없음' className='my-auto flex items-center'>
                                            <p>추가재료 없음</p>
                                        </label>
                                    </div>
                                    <div className='flex flex-row'>
                                        <input type='checkbox' id='에그마요 추가' name='addIngredient' value='에그마요 추가' checked={addIngredient.includes('에그마요 추가')} onChange={addIngredientChagedHandler} className='mr-2'></input>
                                        <label htmlFor='에그마요 추가' className='my-auto flex items-center'>
                                            <img src={'/images/sandwich_menu/ingredients/' + '에그마요' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'에그마요'}></img>
                                            <p>에그마요 추가</p>
                                        </label>
                                    </div>
                                    <div className='flex flex-row'>
                                        <input type='checkbox' id='페퍼로니 추가' name='addIngredient' value='페퍼로니 추가' checked={addIngredient.includes('페퍼로니 추가')} onChange={addIngredientChagedHandler} className='mr-2'></input>
                                        <label htmlFor='페퍼로니 추가' className='my-auto flex items-center'>
                                            <img src={'/images/sandwich_menu/ingredients/' + '페퍼로니' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'페퍼로니'}></img>
                                            <p>페퍼로니 추가</p>
                                        </label>
                                    </div>
                                    <div className='flex flex-row'>
                                        <input type='checkbox' id='베이컨 추가' name='addIngredient' value='베이컨 추가' checked={addIngredient.includes('베이컨 추가')} onChange={addIngredientChagedHandler} className='mr-2'></input>
                                        <label htmlFor='베이컨 추가' className='my-auto flex items-center'>
                                            <img src={'/images/sandwich_menu/ingredients/' + '베이컨' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'베이컨'}></img>
                                            <p>베이컨 추가</p>
                                        </label>
                                    </div>
                                    <div className='flex flex-row'>
                                        <input type='checkbox' id='아보카도 추가' name='addIngredient' value='아보카도 추가' checked={addIngredient.includes('아보카도 추가')} onChange={addIngredientChagedHandler} className='mr-2'></input>
                                        <label htmlFor='아보카도 추가' className='my-auto flex items-center'>
                                            <img src={'/images/sandwich_menu/ingredients/' + '아보카도' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'아보카도'}></img>
                                            <p>아보카도 추가</p>
                                        </label>
                                    </div>
                                    <div className='flex flex-row'>
                                        <input type='checkbox' id='오믈렛 추가' name='addIngredient' value='오믈렛 추가' checked={addIngredient.includes('오믈렛 추가')} onChange={addIngredientChagedHandler} className='mr-2'></input>
                                        <label htmlFor='오믈렛 추가' className='my-auto flex items-center'>
                                            <img src={'/images/sandwich_menu/ingredients/' + '오믈렛' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'오믈렛'}></img>
                                            <p>오믈렛 추가</p>
                                        </label>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={toastingRef} id='toasting'>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>토스팅 여부</h3>
                            <div className='p-2'>
                                <button onClick={() => setisToasting(true)} className={`${isToasting && 'bg-green-600 text-white'}`}>예</button>
                                <button onClick={() => setisToasting(false)} className={`${isToasting === false && 'bg-green-600 text-white'}`}>아니오</button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={vegetableRef} id='vegetable'>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>신선 채소 선택</h3>
                            <div className='p-2 mb-8'>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='양상추' name='vegetable' value='양상추' checked={vegetable.includes('양상추')} onChange={vegetableChagedHandler} className='mr-2'></input>
                                    <label htmlFor='양상추' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '양상추' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'양상추'}></img>
                                        <p>양상추</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='토마토' name='vegetable' value='토마토' checked={vegetable.includes('토마토')} onChange={vegetableChagedHandler} className='mr-2'></input>
                                    <label htmlFor='토마토' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '토마토' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'토마토'}></img>
                                        <p>토마토</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='오이' name='vegetable' value='오이' checked={vegetable.includes('오이')} onChange={vegetableChagedHandler} className='mr-2'></input>
                                    <label htmlFor='오이' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '오이' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'오이'}></img>
                                        <p>오이</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='피망' name='vegetable' value='피망' checked={vegetable.includes('피망')} onChange={vegetableChagedHandler} className='mr-2'></input>
                                    <label htmlFor='피망' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '피망' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'피망'}></img>
                                        <p>피망</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='양파' name='vegetable' value='양파' checked={vegetable.includes('양파')} onChange={vegetableChagedHandler} className='mr-2'></input>
                                    <label htmlFor='양파' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '양파' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'양파'}></img>
                                        <p>양파</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='신선 채소 없음' name='vegetable' value='신선 채소 없음' checked={vegetable.length === 0} onChange={() => setVegetable([])} className='mr-2'></input>
                                    <label htmlFor='신선 채소 없음' className='my-auto flex items-center h-12'>
                                        <p>신선 채소 없음</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>절임 채소 선택</h3>
                            <div className='p-2'>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='피클' name='pickle' value='피클' checked={pickle.includes('피클')} onChange={pickleChagedHandler} className='mr-2'></input>
                                    <label htmlFor='피클' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '피클' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'피클'}></img>
                                        <p>피클</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='올리브' name='pickle' value='올리브' checked={pickle.includes('올리브')} onChange={pickleChagedHandler} className='mr-2'></input>
                                    <label htmlFor='올리브' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '올리브' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'올리브'}></img>
                                        <p>올리브</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='할라피뇨' name='pickle' value='할라피뇨' checked={pickle.includes('할라피뇨')} onChange={pickleChagedHandler} className='mr-2'></input>
                                    <label htmlFor='할라피뇨' className='my-auto flex items-center'>
                                        <img src={'/images/sandwich_menu/ingredients/' + '할라피뇨' + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={'할라피뇨'}></img>
                                        <p>할라피뇨</p>
                                    </label>
                                </div>
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='절임 채소 없음' name='pickle' value='절임 채소 없음' checked={pickle.length === 0} onChange={() => setPickle([])} className='mr-2'></input>
                                    <label htmlFor='절임 채소 없음' className='my-auto flex items-center h-12'>
                                        <p>절임 채소 없음</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm mb-2 p-6" ref={sauceRef} id='sauce'>
                        <div className='m-2'>
                            <h3 className='text-xl font-bold'>소스 선택</h3>
                            <span>(최대3개)</span>
                            <div className='p-2'>
                                {
                                    sauceNutrientArray.map((item) => (
                                        <div key={item.name} className='flex flex-row'>
                                            <input type='checkbox' id={item.name} name='sauce' value={item.name} checked={sauce.includes(item.name)} onChange={sauceChagedHandler} className='mr-2'></input>
                                            <label htmlFor={item.name} className='my-auto flex items-center'>
                                                <img src={'/images/sandwich_menu/ingredients/' + item.name + '.jpg'} className='object-cover w-12 aspect-square rounded-md mr-2' alt={item.name}></img>
                                                <p>{item.name}</p>
                                            </label>
                                        </div>
                                    ))
                                }
                                <div className='flex flex-row'>
                                    <input type='checkbox' id='소스 없음' name='sauce' value='소스 없음' checked={sauce.length === 0} onChange={() => setSauce([])} className='mr-2'></input>
                                    <label htmlFor='소스 없음' className='my-auto flex items-center h-12'>
                                        소스 없음
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md shadow-sm p-6">
                        <h3 className='text-xl font-bold'>작성완료</h3>
                    </div>

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