import styled from "styled-components";

type TestObject = {
    name: string;
    value: string;
};
type FrontPopularRecipeProps = {
    array?: Array<TestObject>
}

const FrontPopularRecipe = ({ array }: FrontPopularRecipeProps) => {
    return (
        <div className="w-max mx-auto flex flex-col gap-2 p-4 border-green-600 border-t-4 border-b border-b-gray-200 bg-white">
            <h1 className="text-xl font-bold">Popular Recipes</h1>
            <p className="text-sm">
                The following recipes are the most popular of all time.
            </p>
            <div className="grid grid-flow-col grid-rows-4 gap-4 w-full max-w-screen-lg mx-auto">
                {array?.map((item, index) => (
                    <div className={`relative w-96 h-12 flex justify-center items-center ${index >= 4 ? 'border-l':''}`} key={index}> <p className="absolute left-4">{index}</p>{item.name} + {item.value}</div>
                ))}
            </div>
        </div>
    );
};

export default FrontPopularRecipe;