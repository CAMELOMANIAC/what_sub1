const initialState = {
  // 초기 상태를 정의합니다.
};

const someReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SOME_ACTION':
      return {
        // 새로운 상태를 반환합니다.
      };
    default:
      return state;
  }
};

export default someReducer;