import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { recipeType } from "../interfaces/api/recipes";
import { actionAddRecipeLike, actionRemoveRecipeLike } from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";

//좋아요 추가/제거 커스텀후크
export const useRecipeLike = (recipe:recipeType) => {
    const [likeCount, setLikeCount] = useState<number>(parseInt(recipe.like_count));
    const userName = useSelector((state: RootState) => state.user.userName);
    const dispatch = useDispatch();
    
    const recipeLikeHandler = async () => {

        const insertRecipeLike = async (recipeName: string) => {
            const response = await fetch('/api/recipes/like', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(recipeName)
            })
            return response.json();
        }

        if (userName.length === 0) {
            alert('로그인 후 이용 가능합니다.')
            return
        }
        
        const result = await insertRecipeLike(recipe.recipe_id);
        if (result.message === '좋아요 등록 성공') {
            setLikeCount(prev => prev + 1)
            dispatch(actionAddRecipeLike(recipe.recipe_id))
        }
        else if (result.message === '좋아요 제거 성공') {
            setLikeCount(prev => prev - 1)
            dispatch(actionRemoveRecipeLike(recipe.recipe_id))
        }
    }

    return{
        likeCount,
        recipeLikeHandler
    }
}