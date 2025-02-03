import {
    LINK_MESSENGER_REQUEST,
    LINK_MESSENGER_SUCCESS,
    LINK_MESSENGER_FAIL,
    UNLINK_MESSENGER_REQUEST,
    UNLINK_MESSENGER_SUCCESS,
    UNLINK_MESSENGER_FAIL,
    GET_MESSENGER_STATUS_REQUEST,
    GET_MESSENGER_STATUS_SUCCESS,
    GET_MESSENGER_STATUS_FAIL,
    CLEAR_MESSENGER_ERRORS
  } from '../actiontypes/messengerTypes';
  
  const initialState = {
    loading: false,
    isLinked: false,
    psid: null,
    error: null,
    success: false
  };
  
  export const messengerReducer = (state = initialState, action) => {
    switch (action.type) {
      // Request cases
      case LINK_MESSENGER_REQUEST:
      case UNLINK_MESSENGER_REQUEST:
      case GET_MESSENGER_STATUS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      // Success cases
      case LINK_MESSENGER_SUCCESS:
        return {
          ...state,
          loading: false,
          isLinked: true,
          psid: action.payload.psid,
          success: true,
          error: null
        };
  
      case UNLINK_MESSENGER_SUCCESS:
        return {
          ...state,
          loading: false,
          isLinked: false,
          psid: null,
          success: true,
          error: null
        };
  
      case GET_MESSENGER_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          isLinked: action.payload.isLinked,
          psid: action.payload.psid,
          error: null
        };
  
      // Failure cases  
      case LINK_MESSENGER_FAIL:
      case UNLINK_MESSENGER_FAIL:
      case GET_MESSENGER_STATUS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          success: false
        };
  
      // Clear errors
      case CLEAR_MESSENGER_ERRORS:
        return {
          ...state,
          error: null,
          success: false
        };
  
      default:
        return state;
    }
  };