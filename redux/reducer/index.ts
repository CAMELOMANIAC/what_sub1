
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // 다른 리듀서 추가
});

export default rootReducer;