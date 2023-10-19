// 액션 타입 정의
const ACTION_USER_LOGIN = 'ACTION_USER_LOGIN';

// 초기 상태 정의
const initialState = {
  userName: ''
};

// 리듀서 정의
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_USER_LOGIN:
      return {
        ...state,
        userName: action.payload
      };
    default:
      return state;
  }
};

export const actionLoginChangeId = (userID:string) => ({
  type: ACTION_USER_LOGIN,
  payload: userID
})

export default userReducer;