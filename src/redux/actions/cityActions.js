import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CITY_LOADING,
  CITY_SUCCESS,
  CITY_ERROR,
  GET_CITIES_SUCCESS,
  GET_CITY_SUCCESS,
  CREATE_CITY_SUCCESS,
  UPDATE_CITY_SUCCESS,
  DELETE_CITY_SUCCESS,
  CLEAR_CITY_ERRORS,
  CITY_CREATE_LOADING,
  CITY_UPDATE_LOADING,
  CITY_DELETE_LOADING
} from '../actiontypes/cityTypes';
import serverConfig from "../../config/serverConfig";

const API_URL = serverConfig.baseURL;

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to create axios config with auth
const getAuthConfig = async () => {
  const token = await getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Helper function for multipart form data
const getMultipartConfig = async () => {
  const token = await getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
};

// Get all cities
export const getCities = () => async (dispatch) => {
  try {
    dispatch({ type: CITY_LOADING });

    const config = await getAuthConfig();
    const response = await axios.get(`${API_URL}/cities`, config);

    dispatch({
      type: GET_CITIES_SUCCESS,
      payload: response.data.data,
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message || 'Failed to fetch cities';
    
    dispatch({
      type: CITY_ERROR,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

// Get city by ID
export const getCityById = (cityId) => async (dispatch) => {
  try {
    dispatch({ type: CITY_LOADING });

    const config = await getAuthConfig();
    const response = await axios.get(`${API_URL}/cities/${cityId}`, config);

    dispatch({
      type: GET_CITY_SUCCESS,
      payload: response.data,
    });

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message || 'Failed to fetch city';
    
    dispatch({
      type: CITY_ERROR,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

// Create new city
export const createCity = (formData) => async (dispatch) => {
  try {
    dispatch({ type: CITY_CREATE_LOADING });

    const config = await getMultipartConfig();
    const response = await axios.post(`${API_URL}/cities`, formData, config);

    dispatch({
      type: CREATE_CITY_SUCCESS,
      payload: response.data,
    });

    // Refresh cities list
    dispatch(getCities());

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message || 'Failed to create city';
    
    dispatch({
      type: CITY_ERROR,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

// Update city
export const updateCity = (cityId, formData) => async (dispatch) => {
  try {
    dispatch({ type: CITY_UPDATE_LOADING });

    const config = await getMultipartConfig();
    const response = await axios.put(`${API_URL}/cities/${cityId}`, formData, config);

    dispatch({
      type: UPDATE_CITY_SUCCESS,
      payload: response.data,
    });

    // Refresh cities list
    dispatch(getCities());

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message || 'Failed to update city';
    
    dispatch({
      type: CITY_ERROR,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

// Delete city
export const deleteCity = (cityId) => async (dispatch) => {
  try {
    dispatch({ type: CITY_DELETE_LOADING });

    const config = await getAuthConfig();
    const response = await axios.delete(`${API_URL}/cities/${cityId}`, config);

    dispatch({
      type: DELETE_CITY_SUCCESS,
      payload: cityId,
    });

    // Refresh cities list
    dispatch(getCities());

    return { success: true, message: response.data.msg };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message || 'Failed to delete city';
    
    dispatch({
      type: CITY_ERROR,
      payload: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

// Clear city errors
export const clearCityErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_CITY_ERRORS });
};

// Clear city loading states
export const clearCityLoading = () => (dispatch) => {
  dispatch({ 
    type: CITY_SUCCESS,
    payload: null 
  });
};