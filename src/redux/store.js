import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducers';
import { userReducer } from './reducers/userReducers';
import { policeStationReducer } from './reducers/policeStationReducers';
import { reportReducer } from './reducers/reportReducers';
import { dashboardReducer } from './reducers/dashBoardReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    policeStation: policeStationReducer,
    report: reportReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'SAVE_REPORT_DRAFT',
          'LOAD_REPORT_DRAFT',
          'dashboard/SET_REPORTS',
          'report/SET_REPORTS'
        ],
        ignoredPaths: [
          'report.draft.personInvolved.dateOfBirth',
          'report.draft.personInvolved.lastSeenDate',
          'dashboard.reports',
          'report.reports'
        ],
        warnAfter: 200
      },
      immutableCheck: {
        warnAfter: 300
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;