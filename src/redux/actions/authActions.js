import axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  VERIFY_ACCOUNT_REQUEST,
  VERIFY_ACCOUNT_SUCCESS,
  VERIFY_ACCOUNT_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from '../actiontypes/authTypes';
import serverConfig from '../../config/serverConfig';

console.log(serverConfig.baseURL);

// Register user
export const register = (formData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Register response:', response.data);
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Register error:', error.response.data);
    dispatch({ type: REGISTER_FAILURE, payload: error.response.data });
  }
};

// Verify account
export const verifyAccount = (verificationData) => async (dispatch) => {
  dispatch({ type: VERIFY_ACCOUNT_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/verify-account`, verificationData);
    console.log('Verify account response:', response.data);
    dispatch({ type: VERIFY_ACCOUNT_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Verify account error:', error.response.data);
    dispatch({ type: VERIFY_ACCOUNT_FAILURE, payload: error.response.data });
  }
};

// Login user
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/login`, credentials);
    console.log('Login response:', response.data);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Login error:', error.response.data);
    dispatch({ type: LOGIN_FAILURE, payload: error.response.data });
  }
};

// Logout user
// Logout user
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/logout`);
    console.log('Logout response:', response.data);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.log('Logout error:', error.response.data);
    dispatch({ type: LOGOUT_FAILURE, payload: error.response.data });
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/forgot-password`, { email });
    console.log('Forgot password response:', response.data);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Forgot password error:', error.response.data);
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error.response.data });
  }
};

// Reset password
export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/reset-password`, resetData);
    console.log('Reset password response:', response.data);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Reset password error:', error.response.data);
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: error.response.data });
  }
};