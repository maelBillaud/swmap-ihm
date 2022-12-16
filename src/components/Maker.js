import React from "react";
import "../styles/Marker.css";
import {
  IconCloudRain,
  IconUmbrella,
  IconCheck,
  IconX,
  IconChecks,
} from "@tabler/icons";

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

//Fonction qui retourne le text d'un equipment selon sa valeur.
//Ajout d'un attribut id pour ajouter une key au span
function displayEquipmentText(value, singular, plural, id) {
  const item = [];
  switch (value) {
    case 0:
      item.push(
        <span key={`${id}-${singular}`}>
          <IconX size={20} color="red" className="icons" />{" "}
          {value + " " + singular}
        </span>
      );
      break;
    case 1:
      item.push(
        <span key={`${id}-${singular}`}>
          <IconCheck size={20} color="green" className="icons" />{" "}
          {value + " " + singular}
        </span>
      );
      break;
    default:
      item.push(
        <span key={`${id}-${singular}`}>
          <IconChecks size={20} color="green" className="icons" />{" "}
          {value + " " + plural}
        </span>
      );
  }
  return item;
}

//Fonction qui affiche tous les
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

function Marker({ marker }) {
  return (
    <div id="marker-container">
      <h3>Parc de Street-Workout</h3>
      <h4>Informations</h4>
      <p>
        {marker.isCovered ? (
          <>
            <IconUmbrella size={20} color="blue" className="icons" />
            <span>Ce parc est couvert</span>
          </>
        ) : (
          <>
            <IconCloudRain size={20} color="gray" className="icons" />
            <span>Ce parc n'est pas couvert</span>
          </>
        )}
        <br />
        {marker.isVerified ? (
          <>
            <IconCheck size={20} color="green" className="icons" />
            <span>Ce parc est vérifié</span>
          </>
        ) : (
          <>
            <IconX size={20} color="red" className="icons" />
            <span>Ce parc n'est pas vérifié</span>
          </>
        )}
      </p>
      <h4>Équipements</h4>
      <div id="marker-equipment">{displayEquipments(marker.equipment)}</div>
    </div>
  );
}

export default Marker;
