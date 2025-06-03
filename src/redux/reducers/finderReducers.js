import * as types from '@/redux/actiontypes/finderTypes';

const initialState = {
  reports: [],
  currentReport: null,
  finderReportsByReportId: [],
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false
  }
};

export const finderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases
    case types.CREATE_FINDER_REPORT_REQUEST:
    case types.GET_FINDER_REPORTS_REQUEST:
    case types.GET_FINDER_REPORTS_BY_REPORT_ID_REQUEST:
    case types.GET_FINDER_REPORT_DETAILS_REQUEST:
    case types.UPDATE_FINDER_REPORT_REQUEST:
    case types.VERIFY_FINDER_REPORT_REQUEST:
    case types.DELETE_FINDER_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };

    // Success cases
    case types.CREATE_FINDER_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: [action.payload, ...state.reports],
        success: true,
        error: null
      };

    case types.GET_FINDER_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: action.payload.isNewSearch 
          ? action.payload.reports 
          : [...state.reports, ...action.payload.reports],
        pagination: {
          currentPage: parseInt(action.payload.currentPage),
          totalPages: parseInt(action.payload.totalPages),
          total: parseInt(action.payload.total),
          hasMore: action.payload.hasMore
        },
        error: null
      };

    case types.GET_FINDER_REPORTS_BY_REPORT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        finderReportsByReportId: action.payload.finderReports,
        error: null
      };

    case types.GET_FINDER_REPORT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentReport: action.payload,
        error: null
      };

    case types.UPDATE_FINDER_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map(report => 
          report._id === action.payload._id ? action.payload : report
        ),
        currentReport: state.currentReport?._id === action.payload._id 
          ? action.payload 
          : state.currentReport,
        success: true,
        error: null
      };

    case types.VERIFY_FINDER_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map(report => 
          report._id === action.payload._id ? action.payload : report
        ),
        currentReport: state.currentReport?._id === action.payload._id 
          ? action.payload 
          : state.currentReport,
        success: true,
        error: null
      };

    case types.DELETE_FINDER_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.filter(report => report._id !== action.payload),
        finderReportsByReportId: state.finderReportsByReportId.filter(
          report => report._id !== action.payload
        ),
        currentReport: state.currentReport?._id === action.payload 
          ? null 
          : state.currentReport,
        success: true,
        error: null
      };

    // Failure cases
    case types.CREATE_FINDER_REPORT_FAIL:
    case types.GET_FINDER_REPORTS_FAIL:
    case types.GET_FINDER_REPORTS_BY_REPORT_ID_FAIL:
    case types.GET_FINDER_REPORT_DETAILS_FAIL:
    case types.UPDATE_FINDER_REPORT_FAIL:
    case types.VERIFY_FINDER_REPORT_FAIL:
    case types.DELETE_FINDER_REPORT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };

    // Clear success state
    case 'CLEAR_FINDER_SUCCESS':
      return {
        ...state,
        success: false,
        error: null
      };

    // Clear current report
    case 'CLEAR_CURRENT_FINDER_REPORT':
      return {
        ...state,
        currentReport: null,
        error: null
      };

    default:
      return state;
  }
};

export default finderReducer;