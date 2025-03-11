import axios from 'axios';
import serverConfig from '@/config/serverConfig';
import showToast from '@/utils/toastUtils';
import {
    GET_EMERGENCY_CONTACTS_REQUEST,
    GET_EMERGENCY_CONTACTS_SUCCESS,
    GET_EMERGENCY_CONTACTS_FAIL,
    GET_EMERGENCY_CONTACT_REQUEST,
    GET_EMERGENCY_CONTACT_SUCCESS,
    GET_EMERGENCY_CONTACT_FAIL,
    CREATE_EMERGENCY_CONTACT_REQUEST,
    CREATE_EMERGENCY_CONTACT_SUCCESS,
    CREATE_EMERGENCY_CONTACT_FAIL,
    UPDATE_EMERGENCY_CONTACT_REQUEST,
    UPDATE_EMERGENCY_CONTACT_SUCCESS,
    UPDATE_EMERGENCY_CONTACT_FAIL,
    DELETE_EMERGENCY_CONTACT_REQUEST,
    DELETE_EMERGENCY_CONTACT_SUCCESS,
    DELETE_EMERGENCY_CONTACT_FAIL,
    GET_NEAREST_EMERGENCY_CONTACTS_REQUEST,
    GET_NEAREST_EMERGENCY_CONTACTS_SUCCESS,
    GET_NEAREST_EMERGENCY_CONTACTS_FAIL
  } from '@/redux/actiontypes/emergencyContactsTypes';
  

// Get all emergency contacts
export const getAllEmergencyContacts = () => async (dispatch) => {
    try {
      dispatch({ type: GET_EMERGENCY_CONTACTS_REQUEST });
  
      const { data } = await axios.get(
        `${serverConfig.baseURL}/emergency-contacts`,
        { withCredentials: true }
      );
  
      dispatch({
        type: GET_EMERGENCY_CONTACTS_SUCCESS,
        payload: data.data
      });
  
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: GET_EMERGENCY_CONTACTS_FAIL,
        payload: message
      });
      return { success: false, error: message };
    }
  };
  
  // Get emergency contact by ID
  export const getEmergencyContactById = (contactId) => async (dispatch) => {
    try {
      dispatch({ type: GET_EMERGENCY_CONTACT_REQUEST });
  
      const { data } = await axios.get(
        `${serverConfig.baseURL}/emergency-contacts/${contactId}`,
        { withCredentials: true }
      );
  
      dispatch({
        type: GET_EMERGENCY_CONTACT_SUCCESS,
        payload: data.data
      });
      console.log("hello")
      console.log(data.data)
  
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: GET_EMERGENCY_CONTACT_FAIL,
        payload: message
      });
      return { success: false, error: message };
    }
  };
  
  // Create emergency contact
  export const createEmergencyContact = (contactData) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_EMERGENCY_CONTACT_REQUEST });
  
      const { data } = await axios.post(
        `${serverConfig.baseURL}/emergency-contacts/create`,
        contactData,
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
  
      dispatch({
        type: CREATE_EMERGENCY_CONTACT_SUCCESS,
        payload: data.data
      });
  
      showToast('Emergency contact created successfully');
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: CREATE_EMERGENCY_CONTACT_FAIL,
        payload: message
      });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };
  
  // Update emergency contact
  export const updateEmergencyContact = (contactId, contactData) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_EMERGENCY_CONTACT_REQUEST });
  
      const { data } = await axios.put(
        `${serverConfig.baseURL}/emergency-contacts/${contactId}`,
        contactData,
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
  
      dispatch({
        type: UPDATE_EMERGENCY_CONTACT_SUCCESS,
        payload: data.data
      });
  
      showToast('Emergency contact updated successfully');
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: UPDATE_EMERGENCY_CONTACT_FAIL,
        payload: message
      });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };
  
  // Delete emergency contact
  export const deleteEmergencyContact = (contactId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_EMERGENCY_CONTACT_REQUEST });
  
      await axios.delete(
        `${serverConfig.baseURL}/emergency-contacts/${contactId}`,
        { withCredentials: true }
      );
  
      dispatch({
        type: DELETE_EMERGENCY_CONTACT_SUCCESS,
        payload: contactId
      });
  
      showToast('Emergency contact deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: DELETE_EMERGENCY_CONTACT_FAIL,
        payload: message
      });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };
  
  // Get nearest emergency contacts
  export const getNearestEmergencyContacts = (params) => async (dispatch) => {
    try {
      dispatch({ type: GET_NEAREST_EMERGENCY_CONTACTS_REQUEST });
  
      const queryParams = new URLSearchParams({
        ...(params.latitude && { latitude: params.latitude }),
        ...(params.longitude && { longitude: params.longitude }),
        ...(params.address && { address: params.address }),
        ...(params.type && { type: params.type }),
        ...(params.radius && { radius: params.radius }),
        ...(params.maxResults && { maxResults: params.maxResults })
      }).toString();
  
      const { data } = await axios.get(
        `${serverConfig.baseURL}/emergency-contacts/nearest?${queryParams}`,
        { withCredentials: true }
      );

      console.log(data)
  
      dispatch({
        type: GET_NEAREST_EMERGENCY_CONTACTS_SUCCESS,
        payload: data.data
      });
  
      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      dispatch({
        type: GET_NEAREST_EMERGENCY_CONTACTS_FAIL,
        payload: message
      });
      return { success: false, error: message };
    }
  };