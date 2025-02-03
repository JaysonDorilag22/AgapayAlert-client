import axios from 'axios';
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
import serverConfig from '@/config/serverConfig';

// Get Messenger Status
export const getMessengerStatus = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MESSENGER_STATUS_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    const { data } = await axios.get(
      `${serverConfig.messengerURL}/messenger/status`, 
      config
    );


    dispatch({
      type: GET_MESSENGER_STATUS_SUCCESS,
      payload: {
        isLinked: data.isLinked,
        psid: data.psid
      }
    });

    return {
      success: true,
      data: {
        isLinked: data.isLinked,
        psid: data.psid
      }
    };

  } catch (error) {
    console.error('Status check error:', error);
    dispatch({
      type: GET_MESSENGER_STATUS_FAIL, 
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Link Messenger Account  
export const linkMessengerAccount = (psid) => async (dispatch) => {
  try {
    dispatch({ type: LINK_MESSENGER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    const { data } = await axios.post(
      `${serverConfig.messengerURL}/messenger/link`,
      { psid },
      config  
    );

    dispatch({
      type: LINK_MESSENGER_SUCCESS,
      payload: {
        isLinked: true,
        psid
      }
    });

    return { 
      success: true,
      data: {
        isLinked: true,
        psid
      }
    };

  } catch (error) {
    console.error('Link error:', error);
    dispatch({
      type: LINK_MESSENGER_FAIL,
      payload: error.response?.data?.msg || error.message 
    });
    return { success: false, error: error.message };
  }
};

// Unlink Messenger Account
export const unlinkMessengerAccount = () => async (dispatch) => {
  try {
    dispatch({ type: UNLINK_MESSENGER_REQUEST });

    await axios.post(
      `${serverConfig.messengerURL}/messenger/unlink`,
      {},
      { withCredentials: true }
    );

    dispatch({ type: UNLINK_MESSENGER_SUCCESS });
    return { success: true };

  } catch (error) {
    console.error('Unlink error:', error);
    dispatch({
      type: UNLINK_MESSENGER_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

export const clearMessengerErrors = () => ({
  type: CLEAR_MESSENGER_ERRORS
});