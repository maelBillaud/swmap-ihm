import React from "react";
import "../styles/Marker.css";
import {
  IconCloudRain,
  IconUmbrella,
  IconCheck,
  IconX,
  IconChecks,
} from "@tabler/icons";
import { CloseButton } from "@mantine/core";
import Emitter from "../services/emitter.js";

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
  function deletePark() {
    Emitter.emit("DELETE_PARK", marker);
  }

  return (
    <div id="marker-container">
      <div className="marker-header">
        <p className="title">Informations</p>
        <CloseButton size="md" className="close-button" onClick={deletePark} />
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
