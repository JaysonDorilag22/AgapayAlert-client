import axios from 'axios';
import {
  POLICE_STATION_SEARCH_REQUEST,
  POLICE_STATION_SEARCH_SUCCESS,
  POLICE_STATION_SEARCH_FAIL,
} from '../actiontypes/policeStationType';
import serverConfig from "../../config/serverConfig";

export const searchPoliceStations = (addressData) => async (dispatch) => {
  try {
    dispatch({ type: POLICE_STATION_SEARCH_REQUEST });

    // Validate required fields
    if (!addressData?.address?.streetAddress) {
      throw new Error('Missing street address');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Format request payload
    const { data } = await axios.post(
      `${serverConfig.baseURL}/police-station/search`,
      addressData, // Send full addressData object as received
      config
    );

    dispatch({
      type: POLICE_STATION_SEARCH_SUCCESS,
      payload: {
        policeStations: data.policeStations,
        coordinates: data.coordinates,
        addressUsed: data.addressUsed,
        searchRadius: data.searchRadius,
      },
    });

    return { success: true, data };
  } catch (error) {
    dispatch({
      type: POLICE_STATION_SEARCH_FAIL,
      payload: error.response?.data?.msg || error.message,
    });
    return { success: false, error: error.response?.data?.msg || error.message };
  }
};