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

const initialState = {
  scans: [],
  reports: [],
  scanResults: null,
  currentScan: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0
  }
};

export const alprReducer = (state = initialState, action) => {
  switch (action.type) {
    case SCAN_PLATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case SCAN_PLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        scanResults: action.payload,
        error: null
      };

    case SCAN_PLATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case GET_SCANS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_SCANS_SUCCESS:
      return {
        ...state,
        loading: false,
        scans: action.payload.scans,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.currentPage < action.payload.totalPages
        },
        error: null
      };

    case GET_SCANS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case GET_SCAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_SCAN_SUCCESS:
      return {
        ...state,
        loading: false,
        currentScan: action.payload,
        error: null
      };

    case GET_SCAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case LINK_SCAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case LINK_SCAN_SUCCESS:
      return {
        ...state,
        loading: false,
        scans: state.scans.map(scan => 
          scan._id === action.payload._id ? action.payload : scan
        ),
        error: null
      };

    case LINK_SCAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case DELETE_SCAN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case DELETE_SCAN_SUCCESS:
      return {
        ...state,
        loading: false,
        scans: state.scans.filter(scan => scan._id !== action.payload),
        error: null
      };

    case DELETE_SCAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};