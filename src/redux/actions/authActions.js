import axios from "axios";
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
  CHECK_AUTH_STATUS_REQUEST,
  CHECK_AUTH_STATUS_SUCCESS,
  CHECK_AUTH_STATUS_FAILURE
} from "../actiontypes/authTypes";
import serverConfig from "../../config/serverConfig";
import { socket, initializeSocket, disconnectSocket } from '@/services/socketService';
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.defaults.withCredentials = true;


// Add this function to check for stored authentication
export const checkAuthStatus = () => async (dispatch) => {
  dispatch({ type: CHECK_AUTH_STATUS_REQUEST });
  
  try {
    // Check for token and user data in AsyncStorage
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    
    if (!token || !userData) {
      dispatch({ type: CHECK_AUTH_STATUS_FAILURE });
      return { success: false };
    }
    
    // Parse the stored user data
    const user = JSON.parse(userData);
    
    // Reconnect socket if needed
    await initializeSocket();
    
    dispatch({
      type: CHECK_AUTH_STATUS_SUCCESS,
      payload: { user, token }
    });
    
    return { success: true, data: { user } };
  } catch (error) {
    console.error('Auth check error:', error);
    dispatch({ type: CHECK_AUTH_STATUS_FAILURE });
    return { success: false };
  }
};
// Register user
export const register = (formData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/register`,
      formData,
      config
    );
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: REGISTER_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Verify account
export const verifyAccount = (verificationData) => async (dispatch) => {
  dispatch({ type: VERIFY_ACCOUNT_REQUEST });
  try {
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/verify-account`,
      verificationData
    );
    dispatch({ type: VERIFY_ACCOUNT_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: VERIFY_ACCOUNT_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(
      `${serverConfig.baseURL}/auth/login`,
      credentials
    );

    const cookieHeader = response.headers['set-cookie']?.[0];
    await initializeSocket(cookieHeader);

        
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));


    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data
    });

    return { success: true, data: response.data };
  } catch (error) {
    // Only log if not a validation error
    if (!error.response || error.response.status !== 400) {
      console.error('Login error:', error);
    }
    
    // Get error message from response
    const errorMessage = error.response?.data?.msg || 'Failed to login';
    
    dispatch({ 
      type: LOGIN_FAILURE, 
      payload: errorMessage
    });

    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Logout user
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    await axios.post(`${serverConfig.baseURL}/auth/logout`);

    // // Clean up socket connection
    // if (socket) {
    //   socket.disconnect();
    //   socket = null;
    // }
    
    // // Clear token
    // await AsyncStorage.removeItem('token');
        // Clear storage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    
    disconnectSocket();

    dispatch({ type: LOGOUT_SUCCESS });
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: LOGOUT_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });

  try {
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/forgot-password`,
      { email }
    );

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: {
        msg: data.msg,
        email,
      },
    });

    return {
      success: true,
      data: {
        msg: data.msg,
        email,
      },
    };
  } catch (error) {
    // Extract error message from backend response
    const msg = error.response?.data?.msg || "Failed to send OTP";
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: { msg },
    });

    return {
      success: false,
      error: msg,
    };
  }
};

// Reset password
export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/reset-password`,
      resetData
    );
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Resend verification
export const resendVerification = (email) => async (dispatch) => {
  dispatch({ type: RESEND_VERIFICATION_REQUEST });
  try {
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/resend-verification`,
      { email }
    );
    dispatch({ type: RESEND_VERIFICATION_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESEND_VERIFICATION_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Resend OTP
export const resendOtp = (email) => async (dispatch) => {
  dispatch({ type: RESEND_OTP_REQUEST });
  try {
    const { data } = await axios.post(
      `${serverConfig.baseURL}/auth/resend-otp`,
      { email }
    );
    dispatch({ type: RESEND_OTP_SUCCESS, payload: data });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: RESEND_OTP_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Google Auth
export const googleAuth = ({ userInfo, deviceToken }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { email, givenName, familyName, photo } = userInfo?.data?.user || {};
    const { data } = await axios.post(`${serverConfig.baseURL}/auth/google`, {
      email,
      firstName: givenName,
      lastName: familyName,
      avatar: photo,
      deviceToken
    });

     const cookieHeader = response.headers['set-cookie']?.[0];
    await initializeSocket(cookieHeader);

        
    // Store auth data in AsyncStorage
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));



    const actionType = data.exists ? LOGIN_SUCCESS : REGISTER_SUCCESS;
    dispatch({
      type: actionType,
      payload: {
        user: data.user || data,
        msg: data.exists
          ? "Logged in successfully"
          : "User registered successfully",
      },
    });
    return { success: true, data };
  } catch (error) {
    const msg = error.response?.data?.msg || error.msg;
    dispatch({ type: LOGIN_FAILURE, payload: { msg: msg } });
    return { success: false, error: msg };
  }
};

// Clear states
export const clearAuthMessage = () => ({ type: CLEAR_AUTH_MESSAGE });
export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });
