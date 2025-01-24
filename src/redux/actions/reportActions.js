import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import serverConfig from "../../config/serverConfig";
import {
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_FAIL,
  GET_REPORTS_REQUEST,
  GET_REPORTS_SUCCESS,
  GET_REPORTS_FAIL,
  UPDATE_REPORT_REQUEST,
  UPDATE_REPORT_SUCCESS,
  UPDATE_REPORT_FAIL,
  DELETE_REPORT_REQUEST,
  DELETE_REPORT_SUCCESS,
  DELETE_REPORT_FAIL,
  ASSIGN_STATION_REQUEST,
  ASSIGN_STATION_SUCCESS,
  ASSIGN_STATION_FAIL,
  UPDATE_STATUS_REQUEST,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAIL,
  ASSIGN_OFFICER_REQUEST,
  ASSIGN_OFFICER_SUCCESS,
  ASSIGN_OFFICER_FAIL,
  GET_REPORT_FEED_REQUEST,
  GET_REPORT_FEED_SUCCESS,
  GET_REPORT_FEED_FAIL,
  GET_CITIES_REQUEST,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAIL,
  GET_USER_REPORTS_REQUEST,
  GET_USER_REPORTS_SUCCESS,
  GET_USER_REPORTS_FAIL,
  SAVE_REPORT_DRAFT,
  LOAD_REPORT_DRAFT,
  DELETE_REPORT_DRAFT,
  GET_REPORT_DETAILS_REQUEST,
  GET_REPORT_DETAILS_SUCCESS,
  GET_REPORT_DETAILS_FAIL,
  SEARCH_REPORTS_REQUEST,
  SEARCH_REPORTS_SUCCESS,
  SEARCH_REPORTS_FAIL
} from "../actiontypes/reportTypes";

// Create Report
export const createReport = (reportData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REPORT_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${serverConfig.baseURL}/report/create`,
      reportData,
      config
    );

    dispatch({
      type: CREATE_REPORT_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: CREATE_REPORT_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// In reportActions.js
export const getReports = ({ page = 1, limit = 10, type = null }) => async (dispatch) => {
  try {
    dispatch({ type: GET_REPORTS_REQUEST });

    // Build query parameters properly
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(type && { type }) // Only add type if it exists
    });

    const url = `${serverConfig.baseURL}/report/getReports?${queryParams}`;
      console.log('url', url);
    const { data } = await axios.get(url, {
      withCredentials: true
    });

    dispatch({
      type: GET_REPORTS_SUCCESS,
      payload: {
        reports: data.data.reports,
        currentPage: parseInt(data.data.currentPage),
        totalPages: parseInt(data.data.totalPages),
        totalReports: parseInt(data.data.totalReports),
        hasMore: data.data.hasMore
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    dispatch({
      type: GET_REPORTS_FAIL,
      payload: error.response?.data?.msg || error.message
    });
    return { success: false, error: error.response?.data?.msg || error.message };
  }
};

// Update Report
export const updateReport = (reportId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_REPORT_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${serverConfig.baseURL}/report/update/${reportId}`,
      updateData,
      config
    );

    dispatch({
      type: UPDATE_REPORT_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_REPORT_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Delete Report
export const deleteReport = (reportId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REPORT_REQUEST });

    const { data } = await axios.delete(
      `${serverConfig.baseURL}/report/${reportId}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_REPORT_SUCCESS,
      payload: reportId,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: DELETE_REPORT_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Assign Police Station
export const assignPoliceStation = (assignmentData) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_STATION_REQUEST });

    const { data } = await axios.post(
      `${serverConfig.baseURL}/report/assign-station`,
      assignmentData,
      { withCredentials: true }
    );

    dispatch({
      type: ASSIGN_STATION_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: ASSIGN_STATION_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Update User Report (for Pending Reports or Consent Updates)
export const updateUserReport = (reportId, updateData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_STATUS_REQUEST });
    console.log('updateData', updateData, reportId);
    const { data } = await axios.put(
      `${serverConfig.baseURL}/report/update-status/${reportId}`,
      updateData,
      { 
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true 
      }
    );

    dispatch({
      type: UPDATE_STATUS_SUCCESS,
      payload: data.data // Access the data property from response
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_STATUS_FAIL,
      payload: message
    });
    console.error('Error updating report:', message);
    return { success: false, error: message };
  }
};

// Assign Officer to Report
export const assignOfficer = (assignmentData) => async (dispatch) => {
  try {
    dispatch({ type: ASSIGN_OFFICER_REQUEST });

    const { data } = await axios.post(
      `${serverConfig.baseURL}/report/assign-officer`,
      assignmentData,
      { withCredentials: true }
    );

    dispatch({
      type: ASSIGN_OFFICER_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: ASSIGN_OFFICER_FAIL,
      payload: message,
    });
    return { success: false, error: message };
  }
};

// Get Report Feed
export const getReportFeed = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_REPORT_FEED_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.city && { city: params.city }),
      ...(params.type && { type: params.type }) // Add type parameter
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/report/public-feed?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_REPORT_FEED_SUCCESS,
      payload: {
        ...data.data,
        isNewSearch: params.page === 1
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_REPORT_FEED_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Get Report Cities
export const getCities = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CITIES_REQUEST });
    const { data } = await axios.get(`${serverConfig.baseURL}/report/cities`);
    dispatch({ type: GET_CITIES_SUCCESS, payload: data.data.cities });
  } catch (error) {
    dispatch({ type: GET_CITIES_FAIL, payload: error.message });
  }
};


// Get my Reports
export const getUserReports = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_REPORTS_REQUEST });

    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.status && { status: params.status }),
      ...(params.type && { type: params.type })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/report/user-reports?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_USER_REPORTS_SUCCESS,
      payload: {
        ...data.data,
        isNewSearch: params.page === 1
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_USER_REPORTS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

//drafts
export const saveReportDraft = (draftData) => async (dispatch) => {
  try {
    // Ensure we have clean data to serialize
    const cleanData = {
      ...draftData,
      personInvolved: {
        ...draftData.personInvolved,
        dateOfBirth: draftData.personInvolved?.dateOfBirth 
          ? typeof draftData.personInvolved.dateOfBirth === 'object'
            ? draftData.personInvolved.dateOfBirth.toISOString()
            : draftData.personInvolved.dateOfBirth
          : null,
        lastSeenDate: draftData.personInvolved?.lastSeenDate
          ? typeof draftData.personInvolved.lastSeenDate === 'object'
            ? draftData.personInvolved.lastSeenDate.toISOString()
            : draftData.personInvolved.lastSeenDate
          : null
      }
    };

    // Remove any non-serializable data
    const serializedData = JSON.parse(JSON.stringify(cleanData));

    await AsyncStorage.setItem('reportDraft', JSON.stringify(serializedData));
    dispatch({ type: SAVE_REPORT_DRAFT, payload: serializedData });
    return { success: true };
  } catch (error) {
    console.error('Error saving draft:', error);
    return { success: false, error: error.message };
  }
};

//load drafts
export const loadReportDraft = () => async (dispatch) => {
  try {
    const draftData = await AsyncStorage.getItem('reportDraft');
    if (draftData) {
      const parsedData = JSON.parse(draftData);
      dispatch({ type: LOAD_REPORT_DRAFT, payload: parsedData });
      return { success: true, data: parsedData };
    }
    return { success: false };
  } catch (error) {
    console.error('Error loading draft:', error);
    return { success: false, error: error.message };
  }
};

// Get Report Details
export const getReportDetails = (reportId) => async (dispatch) => {
  try {
    dispatch({ type: GET_REPORT_DETAILS_REQUEST });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/report/user-report/${reportId}`,
      { withCredentials: true }
    );

    dispatch({
      type: GET_REPORT_DETAILS_SUCCESS,
      payload: data.data
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: GET_REPORT_DETAILS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};

// Search Reports
export const searchReports = (searchParams = {}) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_REPORTS_REQUEST });

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: searchParams.page || 1,
      limit: searchParams.limit || 10,
      ...(searchParams.query && { query: searchParams.query }),
      ...(searchParams.status && { status: searchParams.status }),
      ...(searchParams.type && { type: searchParams.type }),
      ...(searchParams.startDate && { startDate: searchParams.startDate }),
      ...(searchParams.endDate && { endDate: searchParams.endDate })
    });

    const { data } = await axios.get(
      `${serverConfig.baseURL}/report/search?${queryParams}`,
      { withCredentials: true }
    );

    dispatch({
      type: SEARCH_REPORTS_SUCCESS,
      payload: {
        reports: data.data.reports,
        currentPage: data.data.currentPage,
        totalPages: data.data.totalPages,
        totalReports: data.data.totalReports,
        hasMore: data.data.hasMore,
        isNewSearch: searchParams.page === 1
      }
    });

    return { success: true, data: data.data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: SEARCH_REPORTS_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};
