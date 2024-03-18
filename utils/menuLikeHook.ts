import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { actionAddMenuLike, actionRemoveMenuLike } from '../redux/reducer/userReducer';

const useMenuLike = (menuName: string) => {
    const userName = useSelector((state: RootState) => state.user.userName);
    const menuLikeArray = useSelector((state: RootState) => state.user.menuLikeArray);
    const [menuLike, setMenuLike] = useState<number>(0);
    const dispatch = useDispatch();
    const isLike = menuLikeArray.includes(menuName);

    useEffect(() => {
        if (!menuName) return;
        if (menuName.length === 0) return;
        
        const getMenuLike = async () => {
            try {
                const response = await fetch(`/api/menus/like/${menuName}`)
                if (response.ok) {
                    const result = await response.json();
                    setMenuLike(result);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getMenuLike();
    }, [menuName])

    const menuLikeHandler = async () => {
        const insertMenuLike = async () => {
            try {
                const response = await fetch(`/api/menus/like/${menuName}`, {
                    method: 'POST',
                    credentials: 'include',
                })
                return response;
            } catch (error) {
                return error
            }
        }
        const deleteMenuLike = async () => {
            try {
                const response = await fetch(`/api/menus/like/${menuName}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })
                return response;
            } catch (error) {
                return error
            }
        }

        if (userName.length === 0) {
            alert('로그인 후 이용 가능합니다.')
            return
        }

        if (isLike) {
            const result = await deleteMenuLike();
            if (result.status === 200) {
                dispatch(actionRemoveMenuLike(menuName))
                setMenuLike(prev => prev - 1)
            } else {
                console.error(result)
            }
        } else {
            const result = await insertMenuLike();
            if (result.status === 200) {
                dispatch(actionAddMenuLike(menuName))
                setMenuLike(prev => prev + 1)
            } else {
                console.error(result)
            }
        }
    }

    if (menuName) {
        return {
            isLike,
            menuLike,
            menuLikeHandler
        }
    } else {
        return {
            isLike: 0,
            menuLike: 0,
            menuLikeHandler
        };
    }
}

export default useMenuLike;