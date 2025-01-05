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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['SAVE_REPORT_DRAFT', 'LOAD_REPORT_DRAFT'],
        // Ignore these paths in the state
        ignoredPaths: ['report.draft.personInvolved.dateOfBirth', 'report.draft.personInvolved.lastSeenDate'],
      },
      immutableCheck: {
        // Increase threshold for immutability checks
        warnAfter: 100
      },
    }),
});

export default store;