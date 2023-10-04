import styled from "styled-components";

type TestObject = {
    name: string;
    value: string;
};
type FrontPopularRecipeProps = {
    array?: Array<TestObject>
}

const StyledGridItem = styled.div`
    border: 1px solid black;
    border-radius: 5px;
    width: 60rem;
`

const FrontPopularRecipe = ({array}: FrontPopularRecipeProps) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <h1 className="text-xl font-bold">Popular Recipes</h1>
            <p className="text-sm">
                The following recipes are the most popular of all time.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-screen-lg mx-auto">
                {array?.map((item, index) => (
                    <div className='border border-solid border-black rounded-2xl w-80 h-12 flex justify-center items-center' key={index}>{item.name} + {item.value}</div>
                ))}
            </div>
        </div>
    );
};

export default FrontPopularRecipe;