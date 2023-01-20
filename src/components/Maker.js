import { useState } from "react";
import "../styles/Marker.css";
import {
  IconCloudRain,
  IconUmbrella,
  IconCheck,
  IconX,
  IconChecks,
  IconStar,
} from "@tabler/icons";
import { CloseButton } from "@mantine/core";
import Emitter from "../services/emitter.js";
import {
  addParkVerifierApi,
  removeParkVerifierApi,
} from "../services/park/parkApi.js";

//Constante que contient les nom français des équipements au singulier
const singular = [
  "barre fixe",
  "barre parallèle",
  "barre parallèle basse",
  "espalier",
  "paire d'anneaux",
  "pont de singe",
];

//Constante que contient les nom français des équipements au pluriel
const plural = [
  "barres fixes",
  "barres parallèles",
  "barres parallèles basses",
  "espaliers",
  "paires d'anneaux",
  "ponts de singes",
];

/**
 * Affiche le texte d'un equipment selon sa valeur.
 * @param {*} value valeur de l'equipment
 * @param {*} singular correspondance du nom en français au singulier
 * @param {*} plural correspondance du nom en français au pluriel
 * @param {*} id identifiant pour ajouter une clé à son conteneur
 * @returns le texte d'un equipment wrappé dans un span
 */
function displayEquipmentText(value, singular, plural, id) {
  const item = [];
  switch (value) {
    case 0:
      item.push(
        <span key={`${id}-${singular}`} className="overflow-ok">
          <IconX size={20} color="red" className="icons" />{" "}
          {value + " " + singular}
        </span>
      );
      break;
    case 1:
      item.push(
        <span key={`${id}-${singular}`} className="overflow-ok">
          <IconCheck size={20} color="green" className="icons" />{" "}
          {value + " " + singular}
        </span>
      );
      break;
    default:
      item.push(
        <span key={`${id}-${singular}`} className="overflow-ok">
          <IconChecks size={20} color="green" className="icons" />{" "}
          {value + " " + plural}
        </span>
      );
  }
  return item;
}

/**
 * Affiche tous les equipments d'un parc
 * @param {*} equipment equipment d'un parc
 * @returns les equipments d'un parc wrappés dans une liste
 */
function displayEquipments(equipment) {
  const items = [];
  let i = 0;
  const key = equipment.equipmentId;
  for (const equipmentType in equipment) {
    if (equipmentType !== "equipmentId") {
      items.push(
        <li key={`${key}-${i}`} className="equipments">
          {displayEquipmentText(
            equipment[equipmentType],
            singular[i - 1],
            plural[i - 1],
            equipment.equipmentId
          )}
          <br />
        </li>
      );
    }
    i++;
  }
  return items;
}

/**
 * Affiche l'adresse d'un parc
 * @param {*} marker Marker contenant le parc dont l'adresse est à affichée
 * @returns l'adresse d'un parc wrappée dans un <span>
 */
function displayAddress(marker) {
  const item = [];
  const firstPart =
    marker.houseNumber == null
      ? `${marker.street},`
      : `${marker.houseNumber} ${marker.street},`;
  const secondPart = `${marker.postcode} ${marker.city}, ${marker.country}`;
  item.push(
    <span key={marker.parkId} className="overflow-ok">
      {firstPart}
      <br />
      {secondPart}
    </span>
  );
  return item;
}

function Marker({ marker }) {
  /**
   * Fonction d'appel de l'évènement de suppression d'un parc
   */
  function deletePark() {
    Emitter.emit("DELETE_PARK", marker);
  }

  /**
   * Retourne true si l'utilisateur courant a vérifié le parc, false sinon
   */
  function isVerifiedByUser() {
    const userId = JSON.parse(sessionStorage.getItem("userInfo")).userId;
    if (marker.listVerifier === null) {
      return false;
    } else {
      let index = marker.listVerifier.findIndex(
        (oneOfUsersId) => oneOfUsersId === userId
      );
      return index !== -1;
    }
  }

  /**
   * Supprime un userId de la listeVerifier du marker
   * @param {*} marker Marker a modifier
   * @param {*} userId userId a supprimer de la liste
   */
  function removeIdFromListVerifier(marker, userId) {
    let index = marker.listVerifier.findIndex(
      (oneOfUsersId) => oneOfUsersId === userId
    );
    index !== -1 && marker.listVerifier.splice(index, 1);
  }

  /**
   * Ajoute un userId de la listeVerifier du marker
   * @param {*} marker Marker a modifier
   * @param {*} userId userId a ajouter à la liste
   */
  function addIdToListVerifier(marker, userId) {
    if (marker.listVerifier === null) {
      marker.listVerifier = [userId];
    } else {
      marker.listVerifier.push(userId);
    }
  }

  /**
   * Suppression d'un verifier d'un park de la sessionStorage
   * @param {*} userId userId du verifier a supprimer
   */
  function removeVerifierFromSessionStorage(userId) {
    let markersFromApi = [];

    markersFromApi = JSON.parse(sessionStorage.getItem("parkList"));
    let index = markersFromApi.findIndex(
      (markerToUpdate) => markerToUpdate.parkId === marker.parkId
    );

    removeIdFromListVerifier(markersFromApi[index], userId);

    sessionStorage.setItem("parkList", JSON.stringify(markersFromApi));
  }

  /**
   * Ajout d'un verifier à un park de la sessionStorage
   * @param {*} userId userId du verifier a ajouter
   */
  function addVerifierToSessionStorage(userId) {
    let markersFromApi = [];

    markersFromApi = JSON.parse(sessionStorage.getItem("parkList"));
    let index = markersFromApi.findIndex(
      (markerToUpdate) => markerToUpdate.parkId === marker.parkId
    );

    addIdToListVerifier(markersFromApi[index], userId);

    sessionStorage.setItem("parkList", JSON.stringify(markersFromApi));
  }

  /**
   * Mise a jour des verifiers du park
   */
  async function updateVerifier() {
    const verifier = {
      parkId: marker.parkId,
      userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
      creationAgent: JSON.parse(sessionStorage.getItem("userInfo")).username,
    };
    if (verifiedByUser) {
      await removeParkVerifierApi(verifier, sessionStorage.getItem("token"));
      removeIdFromListVerifier(marker, verifier.userId);
      setVerifiedByUser(false);
      removeVerifierFromSessionStorage(verifier.userId);
    } else {
      await addParkVerifierApi(verifier, sessionStorage.getItem("token"));
      addIdToListVerifier(marker, verifier.userId);
      setVerifiedByUser(true);
      addVerifierToSessionStorage(verifier.userId);
    }
  }

  const [verifiedByUser, setVerifiedByUser] = useState(isVerifiedByUser);

  return (
    <div id="marker-container">
      <div className="marker-header">
        <p className="title">Informations</p>
        <div className="info-icon">
          <IconStar
            size={30}
            className={
              verifiedByUser ? "verifier-button-filled" : "verifier-button"
            }
            onClick={updateVerifier}
          />
          <span className="verifier-span" onClick={updateVerifier}>
            {marker.listVerifier === null ? "0" : marker.listVerifier.length}
          </span>
          <CloseButton
            size="md"
            className="close-button"
            onClick={deletePark}
          />
        </div>
      </div>
      <div>
        {marker.isCovered ? (
          <>
            <IconUmbrella size={20} color="blue" className="icons" />
            <span className="overflow-ok">Ce parc est couvert</span>
          </>
        ) : (
          <>
            <IconCloudRain size={20} color="gray" className="icons" />
            <span className="overflow-ok">Ce parc n'est pas couvert</span>
          </>
        )}
        <br />
        {marker.isVerified ? (
          <>
            <IconCheck size={20} color="green" className="icons" />
            <span className="overflow-ok">Ce parc est vérifié</span>
          </>
        ) : (
          <>
            <IconX size={20} color="red" className="icons" />
            <span className="overflow-ok">Ce parc n'est pas vérifié</span>
          </>
        )}
      </div>
      <p className="title">Équipements</p>
      <div id="marker-equipment">{displayEquipments(marker.equipment)}</div>
      <p className="title">Adresse</p>
      <div id="marker-address">{displayAddress(marker)}</div>
    </div>
  );
}

export default Marker;
