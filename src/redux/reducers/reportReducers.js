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
  } from '../actiontypes/reportTypes';
  
  const initialState = {
    reports: [],
    loading: false,
    error: null,
    success: false,
    currentReport: null
  };
  
  export const reportReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_REPORT_REQUEST:
        return { ...state, loading: true };
      case CREATE_REPORT_SUCCESS:
        return {
          ...state,
          loading: false,
          success: true,
          reports: [...state.reports, action.payload.report]
        };
      case CREATE_REPORT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case GET_REPORTS_REQUEST:
        return { ...state, loading: true };
      case GET_REPORTS_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: action.payload
        };
      case GET_REPORTS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case UPDATE_REPORT_REQUEST:
      case UPDATE_STATUS_REQUEST:
        return { ...state, loading: true };
      case UPDATE_REPORT_SUCCESS:
      case UPDATE_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: state.reports.map(report =>
            report._id === action.payload.report._id ? action.payload.report : report
          )
        };
      case UPDATE_REPORT_FAIL:
      case UPDATE_STATUS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case DELETE_REPORT_REQUEST:
        return { ...state, loading: true };
      case DELETE_REPORT_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: state.reports.filter(report => report._id !== action.payload)
        };
      case DELETE_REPORT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case ASSIGN_STATION_REQUEST:
        return { ...state, loading: true };
      case ASSIGN_STATION_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: state.reports.map(report =>
            report._id === action.payload._id ? action.payload : report
          )
        };
      case ASSIGN_STATION_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case ASSIGN_OFFICER_REQUEST:
        return { ...state, loading: true };
      case ASSIGN_OFFICER_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: state.reports.map(report =>
            report._id === action.payload._id ? action.payload : report
          )
        };
      case ASSIGN_OFFICER_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };