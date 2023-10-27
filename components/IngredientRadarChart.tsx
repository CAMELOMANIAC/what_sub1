import { useEffect, useState } from "react";
import { RadarChart } from "recharts";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar } from "recharts";
import { breadNutrientArray,cheeseNutrientArray,sauceNutrientArray,menuNutrientArray } from "../utils/menuArray"
import { Tooltip } from "recharts";

export const useIsServerSide = () => {
    const [isServerSide, setIsServerSide] = useState(true);
    useEffect(() => {
        setIsServerSide(false);
    }, []);
    return isServerSide;
};

const IngredientsRadarChart = ({ context }) => {
    const isServerSide = useIsServerSide();
    const [calorie, setCalorie] = useState<number>(0);
    const [protein, setProtein] = useState<number>(0);
    const [saturatedFats, setSaturatedFats] = useState<number>(0);
    const [sugars, setSugars] = useState<number>(0);
    const [sodium, setSodium] = useState<number>(0);
    const nutrientsArray = [...breadNutrientArray,...cheeseNutrientArray,...sauceNutrientArray,...menuNutrientArray];

    useEffect(() => {
        setCalorie(0);
        setProtein(0);
        setSaturatedFats(0);
        setSugars(0);
        setSodium(0);
        context.map((contextItem) => {
            let nutrientsItem = nutrientsArray.find(item => (item.name+" 추가") === contextItem || contextItem.includes(item.name));
            if (nutrientsItem) {
                setCalorie((prev) => prev + nutrientsItem!.kcal);
                setProtein((prev) => prev + nutrientsItem!.protein);
                setSaturatedFats((prev) => prev + nutrientsItem!.saturatedFats);
                setSugars((prev) => prev + nutrientsItem!.sugars);
                setSodium((prev) => prev + nutrientsItem!.sodium);
            }
        });
        console.log(calorie, protein, saturatedFats, sugars, sodium);
        console.log(calorie / 2000, protein / 50, saturatedFats / 20, sugars / 50, sodium / 2);
    }, [context])

    const data = [
        {
            "subject": "칼로리",
            "A": calorie / 2000,
            "fullMark": 1
        },
        {
            "subject": "단백질",
            "A": protein / 50,
            "fullMark": 1
        },
        {
            "subject": "포화지방",
            "A": saturatedFats / 20,
            "fullMark": 1
        },
        {
            "subject": "당분",
            "A": sugars / 50,
            "fullMark": 1
        },
        {
            "subject": "염분",
            "A": sodium / 2,
            "fullMark": 1
        },
    ]
    if (isServerSide) return null;
    return (
        <RadarChart outerRadius={90} width={512} height={250} data={data} className="text-sm">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={55} domain={[0, 1]} tickFormatter={(value) => `${value * 100}%`} />
            <Radar name="샌드위치" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip content={CustomTooltip} />
        </RadarChart>
    );
};


export default IngredientsRadarChart;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}:
                    {label === '칼로리' && (payload[0].value * 2000).toFixed(1)+'kcal'+`(${((payload[0].value)*100).toFixed(1)}%)`}
                    {label === '단백질' && (payload[0].value * 50).toFixed(1)+'g'+`(${((payload[0].value)*100).toFixed(1)}%)`}
                    {label === '포화지방' && (payload[0].value * 20).toFixed(1)+'g'+`(${((payload[0].value)*100).toFixed(1)}%)`}
                    {label === '당분' && (payload[0].value * 50).toFixed(1)+'g'+`(${((payload[0].value)*100).toFixed(1)}%)`}
                    {label === '염분' && (payload[0].value * 2).toFixed(1)+'g'+`(${((payload[0].value)*100).toFixed(1)}%)`}
                </p>
            </div>
        );
    }

    return null;
};