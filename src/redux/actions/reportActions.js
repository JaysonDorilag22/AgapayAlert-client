// src/redux/actions/reportActions.js

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

// Get Reports
export const getReports = (filters = {}) => async (dispatch) => {
    try {
      dispatch({ type: GET_REPORTS_REQUEST });

      const { data } = await axios.get(`${serverConfig.baseURL}/report`, {
        params: filters,
        withCredentials: true,
      });

      dispatch({
        type: GET_REPORTS_SUCCESS,
        payload: data,
      });

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: GET_REPORTS_FAIL,
        payload: message,
      });
      return { success: false, error: message };
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

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${serverConfig.baseURL}/report/update-status/${reportId}`,
      updateData,
      config
    );

    dispatch({
      type: UPDATE_STATUS_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: UPDATE_STATUS_FAIL,
      payload: message,
    });
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
