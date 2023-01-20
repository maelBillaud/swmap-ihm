import axios from "axios";
import { getGeoApiFyApiKey } from "../../environments/environment";

const GEOAPIFY_KEY = getGeoApiFyApiKey();
const GEOAPIFY_PATH = "https://api.geoapify.com/v1/geocode";
const GEOAPIFY_SEARCH = "/search";
const GEOAPIFY_REVERSE = "/reverse";
const ROOT_PATH = "http://localhost:8080/public/api/rest/parks";
const PATH_LOCATION_FILTER = "/location-filter";
const PATH_VERIFIER = "/verifier";
const TOKEN_TYPE = "Bearer ";

/**
 * Appel à une API externe qui traduit les coordonnées en adresse
 * @param {*} latitude latitude à traduire
 * @param {*} longitude longitude à traduire
 * @returns l'adresse correspondante aux coordonnées
 */
export function getAddressFromCoordinate(latitude, longitude) {
  return axios.get(GEOAPIFY_PATH + GEOAPIFY_REVERSE, {
    params: {
      lat: latitude,
      lon: longitude,
      apiKey: GEOAPIFY_KEY,
    },
  });
}

/**
 * Appel à une API externe qui traduit les adresse en coordonnées
 * @param {*} text adresse à traduire
 * @returns les coordonnées correspondant à l'adresse
 */
export function getCoordinateFromAddress(
  housenumber,
  street,
  postcode,
  city,
  country
) {
  return axios.get(GEOAPIFY_PATH + GEOAPIFY_SEARCH, {
    params: {
      housenumber: housenumber,
      street: street,
      postcode: postcode,
      city: city,
      country: country,
      lang: "fr",
      limit: 1,
      apiKey: GEOAPIFY_KEY,
    },
  });
}

/**
 * Appel à l'API d'un projet. Cette méthode créer un parc et l'enregistre en base de données
 * @param {*} park parc à créer
 * @param {*} token token pour identifier l'utilisateur à l'origine de l'appel API.
 * @returns le parc créé
 */
export function createParkApi(park, token) {
  return axios.post(ROOT_PATH, park, {
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}

/**
 * Appel à l'API d'un projet. Cette méthode associe un utilisateur à un park
 * @param {*} verifier Object contenant les informations nécessaires a l'ajout d'un verifier
 * @returns le parc vérifié
 */
export function addParkVerifierApi(verifier, token) {
  return axios.put(ROOT_PATH + PATH_VERIFIER, verifier, {
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}
/**
 * Appel à l'API d'un projet. Cette méthode supprime un parc de la base de données
 * @param {*} id identifiant du parc à supprimer
 * @param {*} equipmentId identifiant des équipements du parc à supprimer
 * @param {*} token token pour identifier l'utilisateur à l'origine de l'appel API.
 * @returns void
 */
export function deleteParkApi(id, equipmentId, token) {
  return axios.delete(`${ROOT_PATH}/${id}`, {
    params: {
      equipmentId: equipmentId,
    },
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}

/**
 * Appel à l'API d'un projet. Cette méthode dissocie un utilisateur d'un park
 * @param {*} verifier Object contenant les informations nécessaires a la suppression d'un verifier
 * @returns le parc dissocié
 */
export function removeParkVerifierApi(verifier, token) {
  return axios.delete(`${ROOT_PATH}${PATH_VERIFIER}/${verifier.parkId}`, {
    params: {
      user_id: verifier.userId,
    },
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}

/**
 * Appel à l'API d'un projet. Cette méthode retourne la liste de tous les parc stockés en base de données
 * @param {*} token token pour identifier l'utilisateur à l'origine de l'appel API.
 * @returns une liste de parc
 */
export function getParksApi(token) {
  return axios.get(ROOT_PATH, {
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}

export function getParkByLocationFilter(latitude, longitude, distance, token) {
  return axios.get(ROOT_PATH + PATH_LOCATION_FILTER, {
    params: {
      latitude: latitude,
      longitude: longitude,
      distance: distance,
    },
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}
