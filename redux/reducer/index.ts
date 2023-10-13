
import { combineReducers } from '@reduxjs/toolkit';
import someReducer from './someReducer';

const rootReducer = combineReducers({
  some: someReducer,
  // 다른 리듀서 추가
});

export default rootReducer;