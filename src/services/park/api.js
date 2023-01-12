import axios from "axios";
import { getGeoApiFyApiKey } from "../../environments/environment";

const GEOAPIFY_KEY = getGeoApiFyApiKey();
const GEOAPIFY_PATH = "https://api.geoapify.com/v1/geocode/reverse";
const ROOT_PATH = "http://localhost:8080/public/api/rest";

export function createParkApi(park) {
  return axios.post(ROOT_PATH, park);
}

export function getAddressFromCoordinate(latitude, longitude) {
  return axios.get(GEOAPIFY_PATH, {
    params: {
      lat: latitude,
      lon: longitude,
      apiKey: GEOAPIFY_KEY,
    },
  });
}
