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
  CLEAR_AUTH_MESSAGE,
  CLEAR_AUTH_ERROR,
} from '../actiontypes/authTypes';

const initialState = {
  loading: false,
  user: null,
  error: null,
  message: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case VERIFY_ACCOUNT_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
    case VERIFY_ACCOUNT_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        message: action.payload.msg,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: null,
        message: 'Logged out successfully',
      };
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.msg,
      };
    case REGISTER_FAILURE:
    case VERIFY_ACCOUNT_FAILURE:
    case LOGIN_FAILURE:
    case LOGOUT_FAILURE:
    case FORGOT_PASSWORD_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.msg,
      };
    case CLEAR_AUTH_MESSAGE:
      return {
        ...state,
        message: null,
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};