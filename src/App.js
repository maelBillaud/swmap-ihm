import React, { useState } from "react";
import { Alert, Dialog, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import "./styles/App.css";
import Emitter from "./services/emitter";

const markersFromAPI = [
  {
    parkId: 1,
    equipment: {
      equipmentId: 1,
      horizontalBar: 2,
      parallelBar: 1,
      lowParallelBar: 0,
      espalier: 0,
      fixedRings: 1,
      monkeyBridge: 1,
    },
    latitude: 47.301400982695824,
    longitude: -1.4939905439296215,
    isCovered: false,
    isVerified: false,
  },
  {
    parkId: 2,
    equipment: {
      equipmentId: 2,
      horizontalBar: 1,
      parallelBar: 0,
      lowParallelBar: 1,
      espalier: 1,
      fixedRings: 1,
      monkeyBridge: 1,
    },
    latitude: 47.216061233335395,
    longitude: -1.552955180984841,
    isCovered: true,
    isVerified: true,
  },
  {
    parkId: 3,
    equipment: {
      equipmentId: 3,
      horizontalBar: 1,
      parallelBar: 0,
      lowParallelBar: 1,
      espalier: 1,
      fixedRings: 1,
      monkeyBridge: 1,
    },
    latitude: 45.612664596968905,
    longitude: 0.36727238860871675,
    isCovered: true,
    isVerified: true,
  },
];

function App() {
  //Ici on n'utilise pas de context car les markers sont susceptibles de changer
  //et on veut éviter trop de rechargement des composants fils
  const [markers, setMarkers] = useState(markersFromAPI);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddMarker, setShowAddMarker] = useState(false);

  var coordinateNewMarker = [];

  Emitter.on("ADD_NEW_MARKER", (coordinate) => {
    setShowAddMarker(true);
    coordinateNewMarker = coordinate;
  });

  return (
    <div>
      {showAlert && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Géolocalisation désactivée!"
          radius="lg"
          color="red"
          withCloseButton
          variant="filled"
          onClose={() => setShowAlert(false)}
          className="alert"
        >
          Veuillez activer et autoriser la géolocalisation pour utiliser ce
          filtre.
        </Alert>
      )}

      {showAddMarker && (
        <Dialog
          opened={setShowAddMarker}
          withCloseButton
          onClose={() => setShowAddMarker(false)}
          position={{ top: "35%", left: "35%" }}
          radius="lg"
          className="dialog"
        >
          <p className="main-title">
            Ajout d'un nouveau parc à partir d'un point
          </p>
          <p className="title">Équipements du parc :</p>
        </Dialog>
      )}

      <div id="nav-filter">
        <NavBar
          markers={markers}
          setMarkers={setMarkers}
          markersFromAPI={markersFromAPI}
          setShowAlert={setShowAlert}
        />
        <Map
          markers={markers}
          setMarkers={setMarkers}
          setShowAddMarker={setShowAddMarker}
          ShowAddMarker={showAddMarker}
        />
      </div>
    </div>
  );
}

export default App;
