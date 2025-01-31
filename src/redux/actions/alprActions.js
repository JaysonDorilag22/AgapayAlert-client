import axios from 'axios';
import {
  SCAN_PLATE_REQUEST,
  SCAN_PLATE_SUCCESS,
  SCAN_PLATE_FAIL,
  GET_SCANS_REQUEST,
  GET_SCANS_SUCCESS,
  GET_SCANS_FAIL,
  GET_SCAN_REQUEST,
  GET_SCAN_SUCCESS,
  GET_SCAN_FAIL,
  LINK_SCAN_REQUEST,
  LINK_SCAN_SUCCESS,
  LINK_SCAN_FAIL,
  DELETE_SCAN_REQUEST,
  DELETE_SCAN_SUCCESS,
  DELETE_SCAN_FAIL
} from '../actiontypes/alprType';
import serverConfig from '@/config/serverConfig';

// In src/redux/actions/alprActions.js
export const scanPlate = (imageData, reportId) => async (dispatch) => {
  try {
    dispatch({ type: SCAN_PLATE_REQUEST });

    const formData = new FormData();
    const imageFile = {
      uri: imageData.uri,
      type: 'image/jpeg',
      name: 'plate.jpg'
    };
    formData.append('image', imageFile);
    if (reportId) {
      formData.append('reportId', reportId);
    }

    // First upload to our backend
    const { data: uploadResult } = await axios.post(
      `${serverConfig.baseURL}/alpr/scan`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );

    dispatch({
      type: SCAN_PLATE_SUCCESS,
      payload: uploadResult.data
    });

    return { success: true, data: uploadResult.data };

  } catch (error) {
    
    const errorMessage = error.response?.data?.msg 
      || error.response?.data?.detail 
      || error.message;
      
    dispatch({
      type: SCAN_PLATE_FAIL,
      payload: errorMessage
    });

    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Get all scans
export const getAllScans = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_SCANS_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.plateNumber && { plateNumber: params.plateNumber })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/alpr/scans?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_SCANS_SUCCESS,
      payload: data.data // Make sure this matches your API response structure
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_SCANS_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Get scan by ID
export const getScanById = (scanId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SCAN_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/alpr/scans/${scanId}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_SCAN_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_SCAN_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Link scan to report
export const linkScanToReport = (scanId, reportId) => async (dispatch) => {
  try {
    dispatch({ type: LINK_SCAN_REQUEST });

    const { data } = await axios.post(
      `${serverConfig.baseURL}/alpr/scans/${scanId}/link/${reportId}`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: LINK_SCAN_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: LINK_SCAN_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};

// Delete scan
export const deleteScan = (scanId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SCAN_REQUEST });

    const { data } = await axios.delete(
      `${serverConfig.baseURL}/alpr/scans/${scanId}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_SCAN_SUCCESS,
      payload: scanId
    });

    return { success: true, data: data };
  } catch (error) {
    dispatch({
      type: DELETE_SCAN_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.message };
  }
};