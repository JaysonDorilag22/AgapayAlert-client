import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATION_REQUEST,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAIL,
  MARK_NOTIFICATION_READ_REQUEST,
  MARK_NOTIFICATION_READ_SUCCESS,
  MARK_NOTIFICATION_READ_FAIL,
  CLEAR_NOTIFICATION_ERROR,
} from "../actiontypes/notificationTypes";

const initialState = {
  notifications: [],
  currentNotification: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases
    case GET_NOTIFICATIONS_REQUEST:
    case GET_NOTIFICATION_REQUEST:
    case MARK_NOTIFICATION_READ_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Success cases
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.isNewSearch
          ? action.payload.notifications
          : [...state.notifications, ...action.payload.notifications],
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        },
      };

    case GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        currentNotification: action.payload,
      };

    case MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((notification) =>
          notification._id === action.payload._id
            ? { ...notification, isRead: true }
            : notification
        ),
      };

    // Failure cases
    case GET_NOTIFICATIONS_FAIL:
    case GET_NOTIFICATION_FAIL:
    case MARK_NOTIFICATION_READ_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Utility cases
    case CLEAR_NOTIFICATION_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
