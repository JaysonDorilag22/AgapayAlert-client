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
  GET_REPORT_DETAILS_REQUEST,
  GET_REPORT_DETAILS_SUCCESS,
  GET_REPORT_DETAILS_FAIL,
  SEARCH_REPORTS_REQUEST,
  SEARCH_REPORTS_SUCCESS,
  SEARCH_REPORTS_FAIL,
  CLEAR_REPORTS,
  SEARCH_PUBLIC_REPORTS_REQUEST,
  SEARCH_PUBLIC_REPORTS_SUCCESS,
  SEARCH_PUBLIC_REPORTS_FAIL,
  TRANSFER_REPORT_REQUEST,
  TRANSFER_REPORT_SUCCESS,
  TRANSFER_REPORT_FAIL,
  ARCHIVE_REPORTS_REQUEST,
  ARCHIVE_REPORTS_SUCCESS,
  ARCHIVE_REPORTS_FAIL,
  GET_STORAGE_INFO_REQUEST,
  GET_STORAGE_INFO_SUCCESS,
  GET_STORAGE_INFO_FAIL,
  GET_STORAGE_CAPACITY_REQUEST,
  GET_STORAGE_CAPACITY_SUCCESS,
  GET_STORAGE_CAPACITY_FAIL,
  CLEAR_STORAGE_ERRORS
} from "../actiontypes/reportTypes";

const initialState = {
  reports: [],
  feed: {
    reports: [],
    currentPage: 1,
    totalPages: 0,
    totalReports: 0,
    hasMore: false,
  },
  loading: false,
  error: null,
  success: false,
  currentReport: null,
  cities: [],
  citiesLoading: false,
  citiesError: null,
  userReports: {
    reports: [],
    currentPage: 1,
    totalPages: 0,
    totalReports: 0,
    hasMore: false,
  },
  draft: null,
  currentReport: null,
  detailsLoading: false,
  detailsError: null,
  searchResults: {
    reports: [],
    currentPage: 1,
    totalPages: 0,
    totalReports: 0,
    hasMore: false,
  },
  searchLoading: false,
  searchError: null,
  transferLoading: false,
  transferError: null,
  archiveLoading: false,
  archiveError: null,
  storage: {
    info: null,
    capacity: null,
    loading: {
      info: false,
      capacity: false
    },
    error: {
      info: null,
      capacity: null
    },
    lastUpdated: {
      info: null,
      capacity: null
    }
  }
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
        reports: [...state.reports, action.payload.report],
      };
    case CREATE_REPORT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case GET_REPORTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        reports: [],
      };

      case GET_REPORTS_SUCCESS:
        return {
          ...state,
          loading: false,
          reports: action.payload.reports,
          pagination: {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalReports: action.payload.totalReports,
            hasMore: action.payload.hasMore,
          },
        };

    case GET_REPORTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_REPORT_REQUEST:
    case UPDATE_STATUS_REQUEST:
      return { ...state, loading: true };
    case UPDATE_REPORT_SUCCESS:
    case UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map((report) =>
          report._id === action.payload.report._id ? action.payload.report : report
        ),
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
        reports: state.reports.filter((report) => report._id !== action.payload),
      };
    case DELETE_REPORT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case ASSIGN_STATION_REQUEST:
      return { ...state, loading: true };
    case ASSIGN_STATION_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map((report) => (report._id === action.payload._id ? action.payload : report)),
      };
    case ASSIGN_STATION_FAIL:
      return { ...state, loading: false, error: action.payload };

    case ASSIGN_OFFICER_REQUEST:
      return { ...state, loading: true };
    case ASSIGN_OFFICER_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map((report) => (report._id === action.payload._id ? action.payload : report)),
      };
    case ASSIGN_OFFICER_FAIL:
      return { ...state, loading: false, error: action.payload };

    case GET_REPORT_FEED_REQUEST:
      return { ...state, loading: true };
    case GET_REPORT_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        feed: {
          ...action.payload,
          reports: action.payload.isNewSearch
            ? action.payload.reports
            : [...state.feed.reports, ...action.payload.reports],
        },
      };
    case GET_REPORT_FEED_FAIL:
      return { ...state, loading: false, error: action.payload };

    case GET_CITIES_REQUEST:
      return { ...state, citiesLoading: true };
    case GET_CITIES_SUCCESS:
      return { ...state, citiesLoading: false, cities: action.payload };
    case GET_CITIES_FAIL:
      return { ...state, citiesLoading: false, citiesError: action.payload };

    case GET_USER_REPORTS_REQUEST:
      return { ...state, loading: true };
    case GET_USER_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        userReports: {
          ...action.payload,
          reports: action.payload.isNewSearch
            ? action.payload.reports
            : [...state.userReports.reports, ...action.payload.reports],
        },
      };
    case GET_USER_REPORTS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case SAVE_REPORT_DRAFT:
      return {
        ...state,
        draft: {
          ...action.payload,
          personInvolved: {
            ...action.payload.personInvolved,
            dateOfBirth: action.payload.personInvolved?.dateOfBirth || null,
            lastSeenDate: action.payload.personInvolved?.lastSeenDate || null,
          },
        },
      };
    case LOAD_REPORT_DRAFT:
      return {
        ...state,
        draft: {
          ...action.payload,
          personInvolved: {
            ...action.payload.personInvolved,
            dateOfBirth: action.payload.personInvolved?.dateOfBirth || null,
            lastSeenDate: action.payload.personInvolved?.lastSeenDate || null,
          },
        },
      };

    case GET_REPORT_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
        currentReport: null,
      };

    case GET_REPORT_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        currentReport: action.payload,
        detailsError: null,
      };

    case GET_REPORT_DETAILS_FAIL:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload,
        currentReport: null,
      };

    case CLEAR_REPORTS:
      return {
        ...state,
        reports: [],
      };

    case SEARCH_REPORTS_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null,
      };

    case SEARCH_REPORTS_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: {
          reports: action.payload.isNewSearch
            ? action.payload.reports
            : [...state.searchResults.reports, ...action.payload.reports],
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalReports: action.payload.totalReports,
          hasMore: action.payload.hasMore,
        },
      };

    case SEARCH_REPORTS_FAIL:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload,
      };

    case SEARCH_PUBLIC_REPORTS_REQUEST:
      return {
        ...state,
        loading: true,
        publicSearchResults: {
          reports: [], // Clear previous results
          currentPage: 1,
          totalPages: 1,
          totalResults: 0,
          hasMore: false,
        },
      };

    case SEARCH_PUBLIC_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        publicSearchResults: {
          reports: action.payload.isNewSearch
            ? action.payload.reports
            : [...(state.publicSearchResults?.reports || []), ...action.payload.reports],
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
          hasMore: action.payload.hasMore,
        },
      };

    case SEARCH_PUBLIC_REPORTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case TRANSFER_REPORT_REQUEST:
      return { 
        ...state, 
        transferLoading: true, 
        transferError: null 
      };

    case TRANSFER_REPORT_SUCCESS:
      return {
        ...state,
        transferLoading: false,
        // Remove the transferred report from the reports list
        reports: state.reports.filter(report => report._id !== action.payload.reportId),
        // Update userReports if it exists
        userReports: {
          ...state.userReports,
          reports: state.userReports.reports.filter(report => report._id !== action.payload.reportId)
        }
      };

    case TRANSFER_REPORT_FAIL:
      return { 
        ...state, 
        transferLoading: false, 
        transferError: action.payload 
      };

    // Archive Reports Cases
    case ARCHIVE_REPORTS_REQUEST:
      return { 
        ...state, 
        archiveLoading: true, 
        archiveError: null 
      };

    case ARCHIVE_REPORTS_SUCCESS:
      return {
        ...state,
        archiveLoading: false,
        // You might want to refresh the reports list after archiving
        // or filter out archived reports depending on your UI needs
      };

    case ARCHIVE_REPORTS_FAIL:
      return { 
        ...state, 
        archiveLoading: false, 
        archiveError: action.payload 
      };

      case GET_STORAGE_INFO_REQUEST:
      return {
        ...state,
        storage: {
          ...state.storage,
          loading: {
            ...state.storage.loading,
            info: true
          },
          error: {
            ...state.storage.error,
            info: null
          }
        }
      };

    case GET_STORAGE_INFO_SUCCESS:
      return {
        ...state,
        storage: {
          ...state.storage,
          info: action.payload,
          loading: {
            ...state.storage.loading,
            info: false
          },
          error: {
            ...state.storage.error,
            info: null
          },
          lastUpdated: {
            ...state.storage.lastUpdated,
            info: new Date().toISOString()
          }
        }
      };

    case GET_STORAGE_INFO_FAIL:
      return {
        ...state,
        storage: {
          ...state.storage,
          loading: {
            ...state.storage.loading,
            info: false
          },
          error: {
            ...state.storage.error,
            info: action.payload
          }
        }
      };

    // Storage Capacity Cases
    case GET_STORAGE_CAPACITY_REQUEST:
      return {
        ...state,
        storage: {
          ...state.storage,
          loading: {
            ...state.storage.loading,
            capacity: true
          },
          error: {
            ...state.storage.error,
            capacity: null
          }
        }
      };

    case GET_STORAGE_CAPACITY_SUCCESS:
      return {
        ...state,
        storage: {
          ...state.storage,
          capacity: action.payload,
          loading: {
            ...state.storage.loading,
            capacity: false
          },
          error: {
            ...state.storage.error,
            capacity: null
          },
          lastUpdated: {
            ...state.storage.lastUpdated,
            capacity: new Date().toISOString()
          }
        }
      };

    case GET_STORAGE_CAPACITY_FAIL:
      return {
        ...state,
        storage: {
          ...state.storage,
          loading: {
            ...state.storage.loading,
            capacity: false
          },
          error: {
            ...state.storage.error,
            capacity: action.payload
          }
        }
      };

    // Clear Storage Errors
    case CLEAR_STORAGE_ERRORS:
      return {
        ...state,
        storage: {
          ...state.storage,
          error: {
            info: null,
            capacity: null
          }
        }
      };


    default:
      return state;
  }
};
