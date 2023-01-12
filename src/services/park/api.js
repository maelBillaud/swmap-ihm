import axios from "axios";
import { getGeoApiFyApiKey } from "../../environments/environment";

const GEOAPIFY_KEY = getGeoApiFyApiKey();
const GEOAPIFY_PATH = "https://api.geoapify.com/v1/geocode/reverse";
const ROOT_PATH = "http://localhost:8080/public/api/rest/parks";

/**
 * Appel à une API externe qui traduit les coordonnées en adresse
 * @param {*} latitude latitude à traduire
 * @param {*} longitude longitude latitude à traduire
 * @returns l'adresse correspondante aux coordonnées
 */
export function getAddressFromCoordinate(latitude, longitude) {
  return axios.get(GEOAPIFY_PATH, {
    params: {
      lat: latitude,
      lon: longitude,
      apiKey: GEOAPIFY_KEY,
    },
  });
}

/**
 * Appel à l'API d'un projet. Cette méthode créer un parc et l'enregistre en base de données
 * @param {*} park parc à créer
 * @returns le parc créé
 */
export function createParkApi(park) {
  return axios.post(ROOT_PATH, park);
}

/**
 * Appel à l'API d'un projet. Cette méthode retourne la liste de tous les parc stockés en base de données
 * @returns une liste de parc
 */
export function getParksApi() {
  return axios.get(ROOT_PATH);
}

/**
 * Appel à l'API d'un projet. Cette méthode supprime un parc de la base de données
 * @param {*} id identifiant du parc à supprimer
 * @param {*} equipmentId identifiant des équipements du parc à supprimer
 * @returns void
 */
export function deleteParkApi(id, equipmentId) {
  return axios.delete(`${ROOT_PATH}/${id}`, {
    params: {
      equipmentId: equipmentId,
    },
  });
}
