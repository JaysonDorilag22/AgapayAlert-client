import axios from 'axios';
import serverConfig from '@/config/serverConfig';
import showToast from '@/utils/toastUtils';
import * as types from '@/redux/actiontypes/finderTypes';

// Create finder report
export const createFinderReport = (reportData) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_FINDER_REPORT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    };

    const { data } = await axios.post(
      `${serverConfig.baseURL}/finder/create`,
      reportData,
      config
    );

    dispatch({
      type: types.CREATE_FINDER_REPORT_SUCCESS,
      payload: data.data
    });

    showToast('Finder report created successfully');
    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.CREATE_FINDER_REPORT_FAIL,
      payload: message
    });
    showToast(message, 'error');
    return { success: false, error: message };
  }
};

// Get all finder reports with pagination and filters 
export const getFinderReports = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_FINDER_REPORTS_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.status && { status: params.status }),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate })
    }).toString();

    const { data } = await axios.get(
      `${serverConfig.baseURL}/finder/reports?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: types.GET_FINDER_REPORTS_SUCCESS,
      payload: {
        reports: data.data.reports,
        currentPage: parseInt(data.data.currentPage),
        totalPages: parseInt(data.data.totalPages),
        total: parseInt(data.data.total),
        hasMore: data.data.hasMore,
        isNewSearch: params.page === 1
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.GET_FINDER_REPORTS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get finder reports for a specific report
export const getFinderReportsByReportId = (reportId) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_FINDER_REPORTS_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/finder/report/${reportId}`,
      { withCredentials: true }
    );

    dispatch({
      type: types.GET_FINDER_REPORTS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.GET_FINDER_REPORTS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get single finder report
export const getFinderReportById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_FINDER_REPORT_DETAILS_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/finder/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: types.GET_FINDER_REPORT_DETAILS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.GET_FINDER_REPORT_DETAILS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Update finder report
export const updateFinderReport = (id, updateData) => async (dispatch) => {
  try {
    dispatch({ type: types.UPDATE_FINDER_REPORT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    };

    const { data } = await axios.put(
      `${serverConfig.baseURL}/finder/${id}`,
      updateData,
      config
    );

    dispatch({
      type: types.UPDATE_FINDER_REPORT_SUCCESS,
      payload: data.data
    });

    showToast('Finder report updated successfully');
    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.UPDATE_FINDER_REPORT_FAIL,
      payload: message
    });
    showToast(message, 'error');
    return { success: false, error: message };
  }
};

// Verify finder report status
export const verifyFinderReport = (id, verificationData) => async (dispatch) => {
  try {
    dispatch({ type: types.VERIFY_FINDER_REPORT_REQUEST });

    const { data } = await axios.patch(
      `${serverConfig.baseURL}/finder/${id}/verify`,
      verificationData,
      { withCredentials: true }
    );

    dispatch({
      type: types.VERIFY_FINDER_REPORT_SUCCESS,
      payload: data.data
    });

    showToast('Finder report verified successfully');
    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.VERIFY_FINDER_REPORT_FAIL,
      payload: message
    });
    showToast(message, 'error');
    return { success: false, error: message };
  }
};

// Delete finder report
export const deleteFinderReport = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_FINDER_REPORT_REQUEST });

    await axios.delete(
      `${serverConfig.baseURL}/finder/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: types.DELETE_FINDER_REPORT_SUCCESS,
      payload: id
    });

    showToast('Finder report deleted successfully');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: types.DELETE_FINDER_REPORT_FAIL,
      payload: message
    });
    showToast(message, 'error');
    return { success: false, error: message };
  }
};