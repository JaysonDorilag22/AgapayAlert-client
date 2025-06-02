import {
  CITY_LOADING,
  CITY_CREATE_LOADING,
  CITY_UPDATE_LOADING,
  CITY_DELETE_LOADING,
  CITY_SUCCESS,
  GET_CITIES_SUCCESS,
  GET_CITY_SUCCESS,
  CREATE_CITY_SUCCESS,
  UPDATE_CITY_SUCCESS,
  DELETE_CITY_SUCCESS,
  CITY_ERROR,
  CLEAR_CITY_ERRORS
} from '../actiontypes/cityTypes';

const initialState = {
  cities: [],
  currentCity: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

export default function cityReducer(state = initialState, action) {
  switch (action.type) {
    case CITY_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CITY_CREATE_LOADING:
      return {
        ...state,
        createLoading: true,
        error: null,
      };

    case CITY_UPDATE_LOADING:
      return {
        ...state,
        updateLoading: true,
        error: null,
      };

    case CITY_DELETE_LOADING:
      return {
        ...state,
        deleteLoading: true,
        error: null,
      };

    case GET_CITIES_SUCCESS:
      return {
        ...state,
        cities: action.payload,
        loading: false,
        error: null,
      };

    case GET_CITY_SUCCESS:
      return {
        ...state,
        currentCity: action.payload,
        loading: false,
        error: null,
      };

    case CREATE_CITY_SUCCESS:
      return {
        ...state,
        cities: [...state.cities, action.payload],
        createLoading: false,
        error: null,
      };

    case UPDATE_CITY_SUCCESS:
      return {
        ...state,
        cities: state.cities.map(city =>
          city._id === action.payload._id ? action.payload : city
        ),
        currentCity: action.payload,
        updateLoading: false,
        error: null,
      };

    case DELETE_CITY_SUCCESS:
      return {
        ...state,
        cities: state.cities.filter(city => city._id !== action.payload),
        deleteLoading: false,
        error: null,
      };

    case CITY_SUCCESS:
      return {
        ...state,
        loading: false,
        createLoading: false,
        updateLoading: false,
        deleteLoading: false,
        error: null,
      };

    case CITY_ERROR:
      return {
        ...state,
        loading: false,
        createLoading: false,
        updateLoading: false,
        deleteLoading: false,
        error: action.payload,
      };

    case CLEAR_CITY_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}