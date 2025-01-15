import {
    GET_NOTIFICATIONS,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,
    GET_NOTIFICATION_DETAILS,
    GET_NOTIFICATION_DETAILS_SUCCESS,
    GET_NOTIFICATION_DETAILS_FAIL,
    MARK_NOTIFICATION_READ,
    MARK_NOTIFICATION_READ_SUCCESS,
    MARK_NOTIFICATION_READ_FAIL,
    CREATE_BROADCAST_NOTIFICATION,
    CREATE_BROADCAST_NOTIFICATION_SUCCESS,
    CREATE_BROADCAST_NOTIFICATION_FAIL,
    SET_NOTIFICATION_FILTER,
    CLEAR_NOTIFICATION_FILTER
  } from '../actiontypes/notificationTypes';

  const initialState = {
    notifications: [],
    currentNotification: null,
    loading: false,
    error: null,
    filter: {
      isRead: undefined,
      type: null
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalNotifications: 0,
      hasMore: false
    }
  };
  
  export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      // Get Notifications List
      case GET_NOTIFICATIONS:
        return {
          ...state,
          loading: true,
          error: null
        };
      case GET_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          loading: false,
          notifications: action.payload.notifications,
          pagination: {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalNotifications: action.payload.totalNotifications,
            hasMore: action.payload.hasMore
          }
        };
      case GET_NOTIFICATIONS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Get Notification Details
      case GET_NOTIFICATION_DETAILS:
        return {
          ...state,
          loading: true,
          error: null
        };
      case GET_NOTIFICATION_DETAILS_SUCCESS:
        return {
          ...state,
          loading: false,
          currentNotification: action.payload
        };
      case GET_NOTIFICATION_DETAILS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Mark as Read
      case MARK_NOTIFICATION_READ:
        return {
          ...state,
          loading: true,
          error: null
        };
      case MARK_NOTIFICATION_READ_SUCCESS:
        return {
          ...state,
          loading: false,
          notifications: state.notifications.map(notification =>
            notification._id === action.payload._id
              ? { ...notification, isRead: true }
              : notification
          )
        };
      case MARK_NOTIFICATION_READ_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Create Broadcast Notification
      case CREATE_BROADCAST_NOTIFICATION:
        return {
          ...state,
          loading: true,
          error: null
        };
      case CREATE_BROADCAST_NOTIFICATION_SUCCESS:
        return {
          ...state,
          loading: false,
          notifications: [action.payload, ...state.notifications]
        };
      case CREATE_BROADCAST_NOTIFICATION_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      // Filter Management
      case SET_NOTIFICATION_FILTER:
        return {
          ...state,
          filter: {
            ...state.filter,
            ...action.payload
          }
        };
      case CLEAR_NOTIFICATION_FILTER:
        return {
          ...state,
          filter: initialState.filter
        };
  
      default:
        return state;
    }
  };