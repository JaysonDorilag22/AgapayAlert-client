import axios from "axios";
import {
  POLICE_STATION_SEARCH_REQUEST,
  POLICE_STATION_SEARCH_SUCCESS,
  POLICE_STATION_SEARCH_FAIL,
  POLICE_STATION_LIST_REQUEST,
  POLICE_STATION_LIST_SUCCESS,
  POLICE_STATION_LIST_FAIL,
} from "../actiontypes/policeStationType";
import serverConfig from "../../config/serverConfig";

// Update the searchPoliceStations action in policeStationActions.js
export const searchPoliceStations = (searchData) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_SEARCH_REQUEST });

    // Validate search data has either coordinates or address
    if (!searchData?.coordinates && !searchData?.address) {
      throw new Error("Missing location data");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    // Make API request with search data
    const { data } = await axios.post(`${serverConfig.baseURL}/police-station/search`, searchData, config);

    // Map the data including both distance fields
    const mappedStations = data.policeStations.map((station) => ({
      ...station,
      estimatedRoadDistance: station.estimatedRoadDistance || null,
      directDistance: station.directDistance || null,
    }));

    // Dispatch success with response data
    dispatch({
      type: POLICE_STATION_SEARCH_SUCCESS,
      payload: {
        policeStations: mappedStations,
        coordinates: data.searchCoordinates,
        addressUsed: data.addressUsed,
        searchRadius: data.searchRadius || 5,
      },
    });

    return {
      success: true,
      data: mappedStations,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_SEARCH_FAIL,
      payload: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

export const getPoliceStations = () => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_LIST_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${serverConfig.baseURL}/police-station`,
      config
    );

    dispatch({
      type: POLICE_STATION_LIST_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const message = error.response?.data?.msg || error.message;
    dispatch({
      type: POLICE_STATION_LIST_FAIL,
      payload: message
    });
    return { success: false, error: message };
  }
};
