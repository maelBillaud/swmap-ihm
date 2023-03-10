import React, { useState } from "react";
import { Alert, Dialog, TextInput, Checkbox, Button } from "@mantine/core";
import { IconAlertCircle, IconCloudRain, IconUmbrella } from "@tabler/icons";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import "./styles/App.css";
import Emitter from "./services/emitter.js";
import {
  getAddressFromCoordinate,
  createParkApi,
  deleteParkApi,
} from "./services/park/api";

const markersFromApi = [
  {
    parkId: 42,
    equipment: {
      equipmentId: 60,
      horizontalBar: 1,
      parallelBar: 1,
      lowParallelBar: 1,
      espalier: 1,
      fixedRings: 1,
      monkeyBridge: 1,
    },
    latitude: 47.22665,
    longitude: -1.54373,
    country: "France",
    city: "Nantes",
    postcode: "44000",
    street: "Rue Dufour",
    houseNumber: null,
    isCovered: false,
    verifierNumber: 0,
  },
  {
    parkId: 43,
    equipment: {
      equipmentId: 61,
      horizontalBar: 0,
      parallelBar: 0,
      lowParallelBar: 0,
      espalier: 0,
      fixedRings: 0,
      monkeyBridge: 0,
    },
    latitude: 47.24416,
    longitude: -1.57545,
    country: "France",
    city: "Nantes",
    postcode: "44300",
    street: "Boulevard Robert Schuman",
    houseNumber: null,
    isCovered: true,
    verifierNumber: 0,
  },
  {
    parkId: 44,
    equipment: {
      equipmentId: 62,
      horizontalBar: 1,
      parallelBar: 1,
      lowParallelBar: 3,
      espalier: 5,
      fixedRings: 4,
      monkeyBridge: 6,
    },
    latitude: 47.15821,
    longitude: -1.66613,
    country: "France",
    city: "Bouaye",
    postcode: "44830",
    street: "Route De La Bergerie Verte",
    houseNumber: null,
    isCovered: true,
    verifierNumber: 0,
  },
  {
    parkId: 45,
    equipment: {
      equipmentId: 63,
      horizontalBar: 1,
      parallelBar: 1,
      lowParallelBar: 1,
      espalier: 2,
      fixedRings: 0,
      monkeyBridge: 2,
    },
    latitude: 47.17845,
    longitude: -1.50216,
    country: "France",
    city: "Vertou",
    postcode: "44120",
    street: "Rue des Grands Ch??taigniers",
    houseNumber: null,
    isCovered: true,
    verifierNumber: 0,
  },
  {
    parkId: 46,
    equipment: {
      equipmentId: 64,
      horizontalBar: 0,
      parallelBar: 0,
      lowParallelBar: 0,
      espalier: 1,
      fixedRings: 0,
      monkeyBridge: 2,
    },
    latitude: 47.2148,
    longitude: -1.63091,
    country: "France",
    city: "Saint-Herblain",
    postcode: "44800",
    street: "Chemin Du Breil",
    houseNumber: null,
    isCovered: false,
    verifierNumber: 0,
  },
  {
    parkId: 47,
    equipment: {
      equipmentId: 65,
      horizontalBar: 1,
      parallelBar: 1,
      lowParallelBar: 1,
      espalier: 1,
      fixedRings: 2,
      monkeyBridge: 0,
    },
    latitude: 46.71857,
    longitude: -1.02078,
    country: "France",
    city: "Saint-Germain-de-Prin??ay",
    postcode: "85110",
    street: "Cit?? Des Boutons D'or",
    houseNumber: null,
    isCovered: true,
    verifierNumber: 0,
  },
];

function App() {
  //Ici on n'utilise pas de context car les markers sont susceptibles de changer
  //et on veut ??viter trop de rechargement des composants fils
  const [markers, setMarkers] = useState(markersFromApi);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [showDeleteMarker, setShowDeleteMarker] = useState(false);

  //Valeurs pour la cr??ation d'un parc
  const [horizontalBar, setHorizontalBar] = useState(0);
  const [parallelBar, setParallelBar] = useState(0);
  const [lowParallelBar, setLowParallelBar] = useState(0);
  const [espalier, setEspalier] = useState(0);
  const [fixedRings, setFixedRings] = useState(0);
  const [monkeyBridge, setMonkeyBridge] = useState(0);
  const [isCovered, setIsCovered] = useState(false);
  const [parkCoordinate, setParkCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [parkToDelete, setParkToDelete] = useState();

  Emitter.on("ADD_NEW_PARK", (coordinate) => {
    setShowAddMarker(true);
    setParkCoordinate(coordinate);
  });

  Emitter.on("DELETE_PARK", (park) => {
    setShowDeleteMarker(true);
    setParkToDelete(park);
  });

  /**
   * Red??finis les variables de cr??ation d'un parc ?? leur valeur par d??faut
   */
  function resetCreationData() {
    setHorizontalBar(0);
    setParallelBar(0);
    setLowParallelBar(0);
    setEspalier(0);
    setFixedRings(0);
    setMonkeyBridge(0);
    setIsCovered(false);
    setParkCoordinate({
      latitude: 0,
      longitude: 0,
    });
  }

  /**
   * Cr??er un park avec deux appels API
   * - Pour la traduction de coordonn??es en adresses
   * - Pour le stockage en Base de donn??es du nouveau parc
   */
  async function createPark() {
    const res = await getAddressFromCoordinate(
      parkCoordinate.latitude,
      parkCoordinate.longitude
    );

    const data = res.data.features[0].properties;

    const parkToCreate = {
      equipment: {
        horizontalBar: horizontalBar,
        parallelBar: parallelBar,
        lowParallelBar: lowParallelBar,
        espalier: espalier,
        fixedRings: fixedRings,
        monkeyBridge: monkeyBridge,
      },
      latitude: parkCoordinate.latitude,
      longitude: parkCoordinate.longitude,
      country: data.country,
      city: data.city,
      postcode: data.postcode,
      street: data.street,
      housenumber: data.housenumber,
      isCovered: isCovered,
      creationAgent: "admin",
    };
    let newPark = [];
    newPark = await createParkApi(parkToCreate);

    Emitter.emit("ADD_NEW_MARKER", [newPark.data]);

    //setMarkers(markers.push(newPark.data));
    markersFromApi.push(newPark.data);

    setShowAddMarker(false);

    resetCreationData();
  }

  Emitter.on("ADD_PARK_FROM_ADDRESS", async (parkToCreate) => {
    let newPark = [];
    newPark = await createParkApi(parkToCreate);

    Emitter.emit("ADD_NEW_MARKER", [newPark.data]);

    //setMarkers(markers.push(newPark.data));
    markersFromApi.push(newPark.data);
  });

  /**
   * Supprime un park et met a jour les markers et les filtres
   */
  async function deletePark() {
    await deleteParkApi(
      parkToDelete.parkId,
      parkToDelete.equipment.equipmentId
    );

    //setMarkers(markers.filter(marker => marker.parkId !== parkToDelete.parkId))
    let index = markersFromApi.findIndex(
      (marker) => marker.parkId === parkToDelete.parkId
    );
    index !== -1 && markersFromApi.splice(index, 1);

    Emitter.emit(
      "DELETE_MARKER",
      parkToDelete.latitude,
      parkToDelete.longitude
    );

    setShowDeleteMarker(false);

    setParkToDelete(null);
  }

  return (
    <div>
      {showAlert && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="G??olocalisation d??sactiv??e!"
          radius="lg"
          color="red"
          withCloseButton
          variant="filled"
          onClose={() => setShowAlert(false)}
          className="alert"
        >
          Veuillez activer et autoriser la g??olocalisation pour utiliser ce
          filtre.
        </Alert>
      )}

      {showDeleteMarker && (
        <Dialog
          opened={showDeleteMarker}
          withCloseButton
          onClose={() => setShowDeleteMarker(false)}
          position={{ top: "25%", left: "30%" }}
          radius="lg"
          className="dialog-delete"
        >
          <p className="main-title">Suppression d'un Parc</p>
          <p className="suppr-text">
            Voulez vous vraiment supprimer le parc situ??
            {parkToDelete.houseNumber == null
              ? " "
              : ` ${parkToDelete.houseNumber} `}
            {`${parkToDelete.street}, ${parkToDelete.postcode} ${parkToDelete.city}, ${parkToDelete.country} ?`}
          </p>
          <div className="button-dialog-validation">
            <Button radius="md" uppercase onClick={deletePark}>
              Supprimer le Parc
            </Button>
            <Button
              color="gray"
              radius="md"
              uppercase
              onClick={() => setShowDeleteMarker(false)}
            >
              Annuler
            </Button>
          </div>
        </Dialog>
      )}

      {/* Le dialog n'est pas dans un composant car avec mantine, 
      le composant se place au dessus du dialog. (il n'y est pas int??gr??) */}
      {showAddMarker && (
        //## Je n'utilises pas de Modal car il rentre en conflict
        //## avec la map qui est en arri??re plan et ??a cr??er des bugs de rendu
        <Dialog
          opened={setShowAddMarker}
          withCloseButton
          onClose={() => setShowAddMarker(false)}
          position={{ top: "25%", left: "25%" }}
          radius="lg"
          className="dialog-create"
        >
          <p className="main-title">
            Ajout d'un nouveau parc ?? partir de la carte
          </p>
          <p className="title">??quipements du parc :</p>
          <div className="app-equipment-input">
            <div>
              <TextInput
                label="Barre fixe"
                placeholder="Nombre de barre fixe"
                variant="filled"
                type="number"
                className="text-input"
                value={horizontalBar}
                onChange={(event) =>
                  setHorizontalBar(event.currentTarget.value)
                }
              />
              <TextInput
                label="Barre parall??le"
                placeholder="Nombre de barre parall??le"
                variant="filled"
                type="number"
                className="text-input"
                value={parallelBar}
                onChange={(event) => setParallelBar(event.currentTarget.value)}
              />
              <TextInput
                label="Barre parall??le basse"
                placeholder="Nombre de barre parall??le basse"
                variant="filled"
                type="number"
                className="text-input"
                value={lowParallelBar}
                onChange={(event) =>
                  setLowParallelBar(event.currentTarget.value)
                }
              />
            </div>
            <div>
              <TextInput
                label="Anneaux fixes"
                placeholder="Nombre d'anneaux fixes"
                variant="filled"
                type="number"
                className="text-input"
                value={fixedRings}
                onChange={(event) => setFixedRings(event.currentTarget.value)}
              />
              <TextInput
                label="Espalier"
                placeholder="Nombre d'espalier"
                variant="filled"
                type="number"
                className="text-input"
                value={espalier}
                onChange={(event) => setEspalier(event.currentTarget.value)}
              />
              <TextInput
                label="Pont de singe"
                placeholder="Nombre de pont de singe"
                variant="filled"
                type="number"
                className="text-input"
                value={monkeyBridge}
                onChange={(event) => setMonkeyBridge(event.currentTarget.value)}
              />
            </div>
          </div>
          <p className="title">Informations :</p>
          <div className="information-input">
            <Checkbox
              checked={isCovered}
              onChange={(event) => setIsCovered(event.currentTarget.checked)}
              label={
                isCovered ? (
                  <div className="text">
                    <IconUmbrella size={20} color="blue" className="icons" />
                    <span className="overflow-ok">
                      Le parc poss??de une protection contre les intemp??ries
                    </span>
                  </div>
                ) : (
                  <div className="text">
                    <IconCloudRain size={20} color="gray" className="icons" />
                    <span className="overflow-ok">
                      Le parc poss??de une protection contre les intemp??ries
                    </span>
                  </div>
                )
              }
            />
          </div>
          <div className="button-dialog-validation">
            <Button radius="md" uppercase onClick={createPark}>
              Cr??er le Parc
            </Button>
            <Button
              color="gray"
              radius="md"
              uppercase
              onClick={() => setShowAddMarker(false)}
            >
              Retour
            </Button>
          </div>
        </Dialog>
      )}

      <div id="nav-filter">
        <NavBar
          markers={markers}
          setMarkers={setMarkers}
          markersFromApi={markersFromApi}
          setShowAlert={setShowAlert}
        />
        <Map markers={markers} />
      </div>
    </div>
  );
}

export default App;
