import {
  CREATE_FEEDBACK_REQUEST,
  CREATE_FEEDBACK_SUCCESS,
  CREATE_FEEDBACK_FAIL,
  GET_FEEDBACKS_REQUEST, 
  GET_FEEDBACKS_SUCCESS,
  GET_FEEDBACKS_FAIL,
  GET_MY_FEEDBACK_REQUEST,
  GET_MY_FEEDBACK_SUCCESS, 
  GET_MY_FEEDBACK_FAIL,
  GET_FEEDBACK_REQUEST,
  GET_FEEDBACK_SUCCESS,
  GET_FEEDBACK_FAIL,
  UPDATE_FEEDBACK_REQUEST,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAIL,
  DELETE_FEEDBACK_REQUEST,
  DELETE_FEEDBACK_SUCCESS,
  DELETE_FEEDBACK_FAIL,
  RESPOND_TO_FEEDBACK_REQUEST,
  RESPOND_TO_FEEDBACK_SUCCESS,
  RESPOND_TO_FEEDBACK_FAIL,
  GET_FEEDBACK_STATS_REQUEST,
  GET_FEEDBACK_STATS_SUCCESS,
  GET_FEEDBACK_STATS_FAIL,
  CLEAR_FEEDBACK_ERROR,
  RESET_FEEDBACK_STATE
} from '@/redux/actiontypes/feedbackTypes';

const initialState = {
  feedbacks: [],
  currentFeedback: null,
  loading: false,
  error: null,
  success: false,
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1, 
    totalFeedbacks: 0,
    hasMore: false
  }
};

export const feedbackReducer = (state = initialState, action) => {
  switch (action.type) {
    // Request cases
    case CREATE_FEEDBACK_REQUEST:
    case GET_FEEDBACKS_REQUEST:
    case GET_MY_FEEDBACK_REQUEST:
    case GET_FEEDBACK_REQUEST:
    case UPDATE_FEEDBACK_REQUEST:
    case DELETE_FEEDBACK_REQUEST:
    case RESPOND_TO_FEEDBACK_REQUEST:
    case GET_FEEDBACK_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    // Success cases
    case CREATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: [action.payload, ...state.feedbacks],
        success: true
      };

    case GET_FEEDBACKS_SUCCESS:
    case GET_MY_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: action.payload.isNewSearch 
          ? action.payload.feedbacks 
          : [...state.feedbacks, ...action.payload.feedbacks],
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalFeedbacks: action.payload.total,
          hasMore: action.payload.currentPage < action.payload.totalPages
        }
      };

    case GET_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentFeedback: action.payload
      };

    case UPDATE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: state.feedbacks.map(feedback =>
          feedback._id === action.payload._id ? action.payload : feedback
        ),
        success: true
      };

    case DELETE_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: state.feedbacks.filter(
          feedback => feedback._id !== action.payload
        ),
        success: true
      };

    case RESPOND_TO_FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        feedbacks: state.feedbacks.map(feedback =>
          feedback._id === action.payload._id ? action.payload : feedback
        ),
        success: true
      };

    case GET_FEEDBACK_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload
      };

    // Failure cases
    case CREATE_FEEDBACK_FAIL:
    case GET_FEEDBACKS_FAIL:
    case GET_MY_FEEDBACK_FAIL:
    case GET_FEEDBACK_FAIL:
    case UPDATE_FEEDBACK_FAIL:
    case DELETE_FEEDBACK_FAIL:
    case RESPOND_TO_FEEDBACK_FAIL:
    case GET_FEEDBACK_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };

    // Utility cases
    case CLEAR_FEEDBACK_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_FEEDBACK_STATE:
      return initialState;

    default:
      return state;
  }
};