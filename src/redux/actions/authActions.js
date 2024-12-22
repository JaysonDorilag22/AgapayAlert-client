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
  RESEND_VERIFICATION_REQUEST,
  RESEND_VERIFICATION_SUCCESS,
  RESEND_VERIFICATION_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  CLEAR_AUTH_MESSAGE,
  CLEAR_AUTH_ERROR,
} from '../actiontypes/authTypes';
import serverConfig from '../../config/serverConfig';

console.log(serverConfig.baseURL);

// Register user
// Register user
export const register = (formData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post(`${serverConfig.baseURL}/auth/register`, formData, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: data,
    });

    return { error: null, data };
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });

    console.log(error);

    return { error: error.response && error.response.data.message ? error.response.data.message : error.message };
  }
};

// Verify account
export const verifyAccount = (verificationData) => async (dispatch) => {
  dispatch({ type: VERIFY_ACCOUNT_REQUEST });
  try {
    const { data } = await axios.post(`${serverConfig.baseURL}/auth/verify-account`, verificationData);

    dispatch({
      type: VERIFY_ACCOUNT_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    dispatch({
      type: VERIFY_ACCOUNT_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });

    return { success: false, error: error.response && error.response.data.message ? error.response.data.message : error.message };
  }
};

// Login user
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/login`, credentials);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.response.data });
  }
};

// Logout user
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    await axios.post(`${serverConfig.baseURL}/auth/logout`);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAILURE, payload: error.response.data });
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/forgot-password`, { email });
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error.response.data });
  }
};

// Reset password
export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/reset-password`, resetData);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: error.response.data });
  }
};

// Resend verification
export const resendVerification = (email) => async (dispatch) => {
  dispatch({ type: RESEND_VERIFICATION_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/resend-verification`, { email });
    dispatch({ type: RESEND_VERIFICATION_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: RESEND_VERIFICATION_FAILURE, payload: error.response.data });
  }
};

// Resend OTP
export const resendOtp = (email) => async (dispatch) => {
  dispatch({ type: RESEND_OTP_REQUEST });
  try {
    const response = await axios.post(`${serverConfig.baseURL}/auth/resend-otp`, { email });
    dispatch({ type: RESEND_OTP_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: RESEND_OTP_FAILURE, payload: error.response.data });
  }
};

// Clear authentication message
export const clearAuthMessage = () => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_MESSAGE });
};

// Clear authentication error
export const clearAuthError = () => (dispatch) => {
  dispatch({ type: CLEAR_AUTH_ERROR });
};