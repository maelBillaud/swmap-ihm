import React, { useState } from "react";
import { Alert, Dialog, TextInput, Checkbox, Button } from "@mantine/core";
import { IconAlertCircle, IconCloudRain, IconUmbrella } from "@tabler/icons";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import "./styles/App.css";
import Emitter from "./services/emitter.js";
import { Equipment, Park } from "./services/park/type";
import { getAddressFromCoordinate, createParkApi } from "./services/park/api";
import axios from "axios";

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

  //Valeurs pour la création d'un park
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

  Emitter.on("ADD_NEW_MARKER", (coordinate) => {
    setShowAddMarker(true);
    console.log(coordinate);
    setParkCoordinate(coordinate);
  });

  async function createPark() {
    const equipmentToCreate = new Equipment(
      null,
      horizontalBar,
      parallelBar,
      lowParallelBar,
      espalier,
      fixedRings,
      monkeyBridge
    );

    const res = await getAddressFromCoordinate(
      parkCoordinate.latitude,
      parkCoordinate.longitude
    );

    const data = res.data.features[0].properties;

    // const parkToCreate = new Park(
    //   null,
    //   equipmentToCreate,
    //   parkCoordinate.latitude,
    //   parkCoordinate.longitude,
    //   data.country,
    //   data.city,
    //   data.postcode,
    //   data.street,
    //   data.housenumber,
    //   isCovered,
    //   null,
    //   null,
    //   null,
    //   null,
    //   null
    // );

    const parkToCreate = {
      equipment: equipmentToCreate,
      latitude: parkCoordinate.latitude,
      longitude: parkCoordinate.longitude,
      country: data.country,
      city: data.city,
      postcode: data.postcode,
      street: data.street,
      housenumber: data.housenumber,
      isCovered: isCovered,
    };

    const test = {
      equipment: {
        horizontalBar: 0,
        parallelBar: 1,
        lowParallelBar: 2,
        espalier: 3,
        fixedRings: 4,
        monkeyBridge: 3,
      },
      latitude: "37.40256",
      longitude: "37.42155",
      country: "France",
      city: "Haute-Goulaine",
      postcode: "44115",
      street: "Rue de la Chaume",
      houseNumber: 10,
      isCovered: true,
      creationAgent: "dev-Mael",
    };

    fetch("http://localhost:8080/public/api/rest", {
      method: "POST",
      body: JSON.stringify(test),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    // axios
    //   .post("http://localhost:8080/public/api/rest", data)
    //   .then((response) => console.log(response.data))
    //   .catch((error) => console.log(error));

    //await createParkApi(parkToCreate);

    setShowAddMarker(false);
  }

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

      {/* Le dialog n'est pas dans un composant car avec mantine, 
      le composant se place au dessus du dialog. (il n'y est pas intégré) */}
      {showAddMarker && (
        <Dialog
          opened={setShowAddMarker}
          withCloseButton
          onClose={() => setShowAddMarker(false)}
          position={{ top: "25%", left: "25%" }}
          radius="lg"
          className="dialog"
        >
          <p className="main-title">
            Ajout d'un nouveau parc à partir de la carte
          </p>
          <p className="title">Équipements du parc :</p>
          <div id="equipment-input">
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
                label="Barre parallèle"
                placeholder="Nombre de barre parallèle"
                variant="filled"
                type="number"
                className="text-input"
                value={parallelBar}
                onChange={(event) => setParallelBar(event.currentTarget.value)}
              />
              <TextInput
                label="Barre parallèle basse"
                placeholder="Nombre de barre parallèle basse"
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
          <div id="information-input">
            <Checkbox
              checked={isCovered}
              onChange={(event) => setIsCovered(event.currentTarget.checked)}
              label={
                isCovered ? (
                  <div className="text">
                    <span>
                      Le parc possède une protection contre les intempéries
                    </span>
                    <IconUmbrella size={20} color="blue" className="icons" />
                  </div>
                ) : (
                  <div className="text">
                    <span>
                      Le parc possède une protection contre les intempéries
                    </span>
                    <IconCloudRain size={20} color="gray" className="icons" />
                  </div>
                )
              }
            />
          </div>
          <div className="button-create">
            <Button radius="md" uppercase onClick={createPark}>
              Créer le Parc
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
          markersFromAPI={markersFromAPI}
          setShowAlert={setShowAlert}
        />
        <Map markers={markers} />
      </div>
    </div>
  );
}

export default App;
