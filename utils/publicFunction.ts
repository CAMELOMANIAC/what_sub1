//레시피 좋아요 목록을 통신해서 반환하는 함수
export const loadRecipeLike = async () => {
    const response = await fetch('/api/recipe?likeRecipe=true', {
        method: 'GET',
        credentials: 'include',
    });
    return await response.json();
}
//메뉴 좋아요 목록을 통신해서 반환하는 함수
export const loadMenuLike = async () => {
    const response = await fetch('/api/menu?likeMenu=true', {
        method: 'GET',
        credentials: 'include',
    });
    return await response.json();
}

//id쿠키에서 id값 가져오는 함수
export const getCookieValue = (key) => {
    let cookieKey = key + "=";
    let result = "";
    const cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        if (cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
        }

        if (cookieArr[i].indexOf(cookieKey) === 0) {
            result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            return result;
        }
    }
    return result;
}