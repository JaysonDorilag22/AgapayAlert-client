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
  
  const initialState = {
    contacts: [],
    currentContact: null,
    nearestContacts: [],
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
  
  export const emergencyContactsReducer = (state = initialState, action) => {
    switch (action.type) {
      // Request cases
      case GET_EMERGENCY_CONTACTS_REQUEST:
      case GET_EMERGENCY_CONTACT_REQUEST:
      case CREATE_EMERGENCY_CONTACT_REQUEST:
      case UPDATE_EMERGENCY_CONTACT_REQUEST:
      case DELETE_EMERGENCY_CONTACT_REQUEST:
      case GET_NEAREST_EMERGENCY_CONTACTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          success: false
        };
  
      // Success cases
      case GET_EMERGENCY_CONTACTS_SUCCESS:
        return {
          ...state,
          loading: false,
          contacts: action.payload,
          error: null
        };
  
      case GET_EMERGENCY_CONTACT_SUCCESS:
        return {
          ...state,
          loading: false,
          currentContact: action.payload,
          error: null
        };
  
      case CREATE_EMERGENCY_CONTACT_SUCCESS:
        return {
          ...state,
          loading: false,
          contacts: [action.payload, ...state.contacts],
          success: true,
          error: null
        };
  
      case UPDATE_EMERGENCY_CONTACT_SUCCESS:
        return {
          ...state,
          loading: false,
          contacts: state.contacts.map(contact => 
            contact._id === action.payload._id ? action.payload : contact
          ),
          currentContact: action.payload,
          success: true,
          error: null
        };
  
      case DELETE_EMERGENCY_CONTACT_SUCCESS:
        return {
          ...state,
          loading: false,
          contacts: state.contacts.filter(contact => contact._id !== action.payload),
          success: true,
          error: null
        };
  
      case GET_NEAREST_EMERGENCY_CONTACTS_SUCCESS:
        return {
          ...state,
          loading: false,
          nearestContacts: action.payload,
          error: null
        };
  
      // Failure cases
      case GET_EMERGENCY_CONTACTS_FAIL:
      case GET_EMERGENCY_CONTACT_FAIL:
      case CREATE_EMERGENCY_CONTACT_FAIL:
      case UPDATE_EMERGENCY_CONTACT_FAIL:
      case DELETE_EMERGENCY_CONTACT_FAIL:
      case GET_NEAREST_EMERGENCY_CONTACTS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
          success: false
        };
  
      default:
        return state;
    }
  };
  
  export default emergencyContactsReducer;