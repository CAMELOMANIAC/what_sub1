import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { recipeType } from "../interfaces/api/recipes";
import { actionAddRecipeLike, actionRemoveRecipeLike } from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";

//좋아요 추가/제거 커스텀후크
export const useRecipeLike = (recipe: recipeType) => {
    const [likeCount, setLikeCount] = useState<number>(parseInt(recipe.like_count));
    const userName = useSelector((state: RootState) => state.user.userName);
    const userLikeArray = useSelector((state: RootState) => state.user.recipeLikeArray);
    const dispatch = useDispatch();
    const isLike = userLikeArray.includes(recipe.recipe_id);

    const recipeLikeHandler = async () => {
        const insertRecipeLike = async (recipeName: string) => {
            try {
                const response = await fetch(`/api/recipes/like/${recipeName}`, {
                    method: 'POST',
                    credentials: 'include'
                })
                return response
            } catch (error) {
                return error
            }
        }
        const deleteRecipeLike = async (recipeName: string) => {
            try {
                const response = await fetch(`/api/recipes/like/${recipeName}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                return response
            } catch (error) {
                return error
            }
        }

        if (userName.length === 0) {
            alert('로그인 후 이용 가능합니다.')
            return
        }

        if (isLike) {
            const result = await deleteRecipeLike(recipe.recipe_id);
            if (result.status === 200) {
                setLikeCount(prev => prev - 1)
                dispatch(actionRemoveRecipeLike(recipe.recipe_id))
            } else {
                console.error(result)
            }
        } else {
            const result = await insertRecipeLike(recipe.recipe_id);
            if (result.status === 200) {
                setLikeCount(prev => prev + 1)
                dispatch(actionAddRecipeLike(recipe.recipe_id))
            } else {
                console.error(result)
            }
        }
    }

    return {
        likeCount,
        recipeLikeHandler
    }
}

export default useRecipeLike;