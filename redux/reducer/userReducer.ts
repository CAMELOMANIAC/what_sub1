const initialState = {
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_ACTION':
      return {
        // 새로운 상태를 반환합니다.
      };
    default:
      return state;
  }
};

export default userReducer;