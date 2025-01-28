import axios from 'axios';
import serverConfig from '@/config/serverConfig';
import {
  CREATE_FEEDBACK_REQUEST,
  CREATE_FEEDBACK_SUCCESS, 
  CREATE_FEEDBACK_FAIL,
  GET_FEEDBACKS_REQUEST,
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAIL,
  GET_MY_FEEDBACK_REQUEST,
  GET_MY_FEEDBACK_SUCCESS,
  GET_MY_FEEDBACK_FAIL,
  GET_FEEDBACK_REQUEST,
  GET_FEEDBACK_SUCCESS,
  GET_FEEDBACK_FAIL,
  UPDATE_FEEDBACK_REQUEST,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAIL,
  DELETE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAIL,
  GET_FEEDBACK_STATS_REQUEST,
  GET_FEEDBACK_STATS_SUCCESS,
  GET_FEEDBACK_STATS_FAIL,
  RESPOND_TO_FEEDBACK_REQUEST,
  RESPOND_TO_FEEDBACK_SUCCESS,
  RESPOND_TO_FEEDBACK_FAIL
} from '@/redux/actiontypes/feedbackTypes';

// Create feedback
export const createFeedback = (feedbackData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_FEEDBACK_REQUEST });

    const { data } = await axios.post(
      `${serverConfig.baseURL}/feedback`,
      feedbackData,
      { withCredentials: true }
    );

    dispatch({
      type: CREATE_FEEDBACK_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: CREATE_FEEDBACK_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get all feedbacks with pagination
export const getFeedbacks = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_FEEDBACKS_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.category && { category: params.category })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/feedback?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_FEEDBACKS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_FEEDBACKS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get user's feedbacks with pagination
export const getMyFeedbacks = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_MY_FEEDBACK_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.category && { category: params.category })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/feedback/my-feedbacks?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_MY_FEEDBACK_SUCCESS,
      payload: {
        ...data.data,
        isNewSearch: params.page === 1
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_MY_FEEDBACK_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get single feedback
export const getFeedback = (feedbackId) => async (dispatch) => {
  try {
    dispatch({ type: GET_FEEDBACK_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/feedback/${feedbackId}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_FEEDBACK_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_FEEDBACK_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Update feedback
export const updateFeedback = (feedbackId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_FEEDBACK_REQUEST });

    const { data } = await axios.patch(
      `${serverConfig.baseURL}/feedback/${feedbackId}`,
      updateData,
      { withCredentials: true }
    );

    dispatch({
      type: UPDATE_FEEDBACK_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_FEEDBACK_FAIL, 
      payload: message
    });
    return { success: false, error: message };
  }
};

// Delete feedback
export const deleteFeedback = (feedbackId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FEEDBACK_REQUEST });

    const { data } = await axios.delete(
      `${serverConfig.baseURL}/feedback/${feedbackId}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_FEEDBACK_SUCCESS,
      payload: feedbackId
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: DELETE_FEEDBACK_FAIL,
      payload: message  
    });
    return { success: false, error: message };
  }
};

// Get feedback stats 
export const getFeedbackStats = () => async (dispatch) => {
  try {
    dispatch({ type: GET_FEEDBACK_STATS_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/feedback/stats`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_FEEDBACK_STATS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_FEEDBACK_STATS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Respond to feedback (admin only)
export const respondToFeedback = (feedbackId, response) => async (dispatch) => {
  try {
    dispatch({ type: RESPOND_TO_FEEDBACK_REQUEST });

    const { data } = await axios.patch(
      `${serverConfig.baseURL}/feedback/${feedbackId}/respond`,
      { response },
      { withCredentials: true }
    );

    dispatch({
      type: RESPOND_TO_FEEDBACK_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: RESPOND_TO_FEEDBACK_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};