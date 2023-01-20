import axios from "axios";

const ROOT_PATH = "http://localhost:8080/public/api/rest";
const PATH_AUTH = "/auth";
const PATH_USER = "/users";
const PATH_SIGNUP = "/signup";
const PATH_LOGIN = "/login";
const TOKEN_TYPE = "Bearer ";

/**
 * Appel à l'API. Cette méthode créer un compte utilisateur en Base de Données
 * @param {*} userData données nécessaires à la création de l'utilisateur
 * @returns les informations sur l'utilisateur créé
 */
export function signupApi(userData) {
  return axios.post(ROOT_PATH + PATH_AUTH + PATH_SIGNUP, userData);
}

/**
 * Appel à l'API. Cette méthode permet de s'authentifier à un compte utilisateur déjà créé
 * @param {*} userData données nécessaires à l'authentification
 * @returns les informations sur l'utilisateur qui s'authentifie et notamment un token et un role associé.
 */
export function loginApi(userData) {
  return axios.post(ROOT_PATH + PATH_AUTH + PATH_LOGIN, userData);
}

/**
 * Appel à l'API. Cette méthode vas nous retourner les informations relatives à un utilisateur
 * @param {*} username nom d'utilisateur unique
 * @param {*} token identifiant de l'utilisateur
 * @returns les informations liées à l'utilisateur actuel
 */
export function getUserByUsername(username, token) {
  return axios.get(`${ROOT_PATH}${PATH_USER}`, {
    params: {
      username: username,
    },
    headers: {
      Authorization: `${TOKEN_TYPE}${token}`,
    },
  });
}
