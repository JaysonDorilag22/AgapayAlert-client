import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducers';
import { userReducer } from './reducers/userReducers';
import { policeStationReducer } from './reducers/policeStationReducers';
import { reportReducer } from './reducers/reportReducers';
import { dashboardReducer } from './reducers/dashBoardReducers';
import { broadcastReducer } from './reducers/broadcastReducers';
import { notificationReducer } from './reducers/notificationReducers';
import { alprReducer } from './reducers/alprReducers';
import { feedbackReducer } from './reducers/feedbackReducers';
import { messengerReducer } from './reducers/messengerReducers';
import { finderReducer } from './reducers/finderReducers'
import { emergencyContactsReducer } from './reducers/emergencyContactsReducers';
import cityReducer from './reducers/cityReducers';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    policeStation: policeStationReducer,
    report: reportReducer,
    dashboard: dashboardReducer,
    broadcast: broadcastReducer,
    notification: notificationReducer,
    alpr: alprReducer,
    feedback: feedbackReducer,
    messenger: messengerReducer,
    finder: finderReducer,
    emergencyContacts: emergencyContactsReducer,
    city: cityReducer
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