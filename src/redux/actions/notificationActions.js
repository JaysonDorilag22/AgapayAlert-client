import axios from 'axios';
import serverConfig from '@/config/serverConfig';
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

// Get user notifications
export const getUserNotifications = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATIONS });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.isRead !== undefined && { isRead: params.isRead }),
      ...(params.type && { type: params.type })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/notifications/?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_NOTIFICATIONS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATIONS_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Get notification details
export const getNotificationDetails = (notificationId) => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATION_DETAILS });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/notifications/${notificationId}/details`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_NOTIFICATION_DETAILS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATION_DETAILS_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    dispatch({ type: MARK_NOTIFICATION_READ });

    const { data } = await axios.patch(
      `${serverConfig.baseURL}/notifications/read/${notificationId}`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: MARK_NOTIFICATION_READ_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: MARK_NOTIFICATION_READ_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Create broadcast notification
export const createBroadcastNotification = (notificationData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_BROADCAST_NOTIFICATION });

    const { data } = await axios.post(
      `${serverConfig.baseURL}/notifications/broadcast`,
      notificationData,
      { withCredentials: true }
    );

    dispatch({
      type: CREATE_BROADCAST_NOTIFICATION_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: CREATE_BROADCAST_NOTIFICATION_FAIL, 
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Set notification filter
export const setNotificationFilter = (filter) => ({
  type: SET_NOTIFICATION_FILTER,
  payload: filter
});

// Clear notification filter
export const clearNotificationFilter = () => ({
  type: CLEAR_NOTIFICATION_FILTER
});