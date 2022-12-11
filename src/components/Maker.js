import React from "react";
import "../styles/Marker.css";

function Marker({ marker }) {
  return (
    <div id="marker-container">
      <h1>Identifiant du parc {marker.parkId}</h1>
      <h2>Informations</h2>
      <ul>
        <li>
          {marker.isCovered
            ? "Ce parc est couvert ☂"
            : "Ce parc n'est pas couvert 🌧"}
        </li>
        <li>
          {marker.isVerified
            ? "Ce parc est vérifié ✔"
            : "Ce parc n'est pas vérifié ❌"}
        </li>
      </ul>
      <h2>Équipements</h2>
      <ul>
        <li>Nombre de barres fixes : {marker.equipment.horizontalBar}</li>
      </ul>
    </div>
  );
}

export default Marker;
