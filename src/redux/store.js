import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducers';
import { userReducer } from './reducers/userReducers';
import { policeStationReducer } from './reducers/policeStationReducers';
import { reportReducer } from './reducers/reportReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    policeStation: policeStationReducer,
    report: reportReducer,
  },
});

export default store;