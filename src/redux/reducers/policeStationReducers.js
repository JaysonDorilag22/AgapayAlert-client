import {
    POLICE_STATION_SEARCH_REQUEST,
    POLICE_STATION_SEARCH_SUCCESS,
    POLICE_STATION_SEARCH_FAIL,
    POLICE_STATION_SELECT,
    POLICE_STATION_CLEAR
  } from '../actiontypes/policeStationType';
  
  const initialState = {
    loading: false,
    error: null,
    policeStations: [],
    coordinates: null,
    addressUsed: null,
    searchRadius: null,
    selectedStation: null
  };
  
  export const policeStationReducer = (state = initialState, action) => {
    switch (action.type) {
      case POLICE_STATION_SEARCH_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case POLICE_STATION_SEARCH_SUCCESS:
        return {
          ...state,
          loading: false,
          policeStations: action.payload.policeStations,
          coordinates: action.payload.coordinates,
          addressUsed: action.payload.addressUsed,
          searchRadius: action.payload.searchRadius,
          error: null
        };
  
      case POLICE_STATION_SEARCH_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      case POLICE_STATION_SELECT:
        return {
          ...state,
          selectedStation: action.payload
        };
  
      case POLICE_STATION_CLEAR:
        return initialState;
  
      default:
        return state;
    }
  };