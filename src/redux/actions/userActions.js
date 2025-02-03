import axios from "axios";
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  GET_USER_LIST_REQUEST,
  GET_USER_LIST_SUCCESS,
  GET_USER_LIST_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_DUTY_REQUEST,
  UPDATE_DUTY_SUCCESS,
  UPDATE_DUTY_FAILURE,
  GET_POLICE_STATION_OFFICERS_REQUEST,
  GET_POLICE_STATION_OFFICERS_SUCCESS,
  GET_POLICE_STATION_OFFICERS_FAILURE,
  CLEAR_USER_MESSAGE,
  CLEAR_USER_ERROR,
} from "../actiontypes/userTypes";
import serverConfig from "../../config/serverConfig";

// Get user details
export const getUserDetails = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await axios.get(`${serverConfig.baseURL}/user/${userId}`, {
      withCredentials: true,
    });
    dispatch({ type: GET_USER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: GET_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Update user details
export const updateUserDetails = (userId, userDetails) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    const { data } = await axios.put(
      `${serverConfig.baseURL}/user/${userId}`,
      userDetails,
      config
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: UPDATE_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Change user password
export const changePassword =
  (userId, passwords) => async (dispatch, getState) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST });
    try {
      const {
        auth: { token },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const { data } = await axios.put(
        `${serverConfig.baseURL}/user/change-password/${userId}`,
        passwords,
        config
      );
      dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
      return { success: true, data };
    } catch (error) {
      const msg = error.response?.data?.msg || error.message;
      dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: { msg } });
      return { success: false, error: msg };
    }
  };

// Delete user
export const deleteUser = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    await axios.delete(`${serverConfig.baseURL}/user/${userId}`, {
      withCredentials: true,
    });
    dispatch({ type: DELETE_USER_SUCCESS });
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: DELETE_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};

// Get user list
// Get user list
// In src/redux/actions/userActions.js
export const getUserList = (params = {}) => async (dispatch) => {
  dispatch({ type: GET_USER_LIST_REQUEST });
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.role && { role: params.role }),
      ...(params.search && { search: params.search })
    }).toString();

    const { data } = await axios.get(
      `${serverConfig.baseURL}/user/list?${queryParams}`, // Changed from /user/users to /user/list
      { withCredentials: true }
    );

    dispatch({
      type: GET_USER_LIST_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({ type: GET_USER_LIST_FAILURE, payload: message });
    return { success: false, error: message };
  }
};

// Create user
export const createUser = (userDetails) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${serverConfig.baseURL}/user`,
      userDetails,
      config
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    dispatch({ type: UPDATE_USER_FAILURE, payload: { msg } });
    return { success: false, error: msg };
  }
};


export const updateDutyStatus = (isOnDuty) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_DUTY_REQUEST });

    const { data } = await axios.put(
      `${serverConfig.baseURL}/user/duty-status/update`,
      { isOnDuty },
      { withCredentials: true }
    );

    dispatch({
      type: UPDATE_DUTY_SUCCESS,
      payload: {
        isOnDuty: data.data.isOnDuty,
        lastDutyChange: data.data.lastDutyChange,
        dutyHistory: data.data.dutyHistory
      }
    });

    return { success: true, data: data.data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_DUTY_FAILURE,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get police station officers
export const getPoliceStationOfficers = (policeStationId) => async (dispatch) => {
  try {
    dispatch({ type: GET_POLICE_STATION_OFFICERS_REQUEST });
    
    const { data } = await axios.get(
      `${serverConfig.baseURL}/user/police-station/${policeStationId}/officers`,
      { withCredentials: true }
    );

    // Add logging after data is received
    console.log('API Response:', data);

    dispatch({
      type: GET_POLICE_STATION_OFFICERS_SUCCESS,
      payload: {
        policeStation: data.data.policeStation,
        officers: data.data.officers,
        summary: data.data.summary
      }
    });

    console.log('Summary:', data.data.summary);
   
    return { success: true, data: data.data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_POLICE_STATION_OFFICERS_FAILURE, 
      payload: message
    });
    return { success: false, error: message };
  }
};

// Clear states
export const clearUserMessage = () => ({ type: CLEAR_USER_MESSAGE });
export const clearUserError = () => ({ type: CLEAR_USER_ERROR });
