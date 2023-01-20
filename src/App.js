import React, { useState, useEffect } from "react";
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
  getParkByLocationFilter,
} from "./services/park/parkApi";

function App() {
  //Ici on n'utilise pas de context car les markers sont susceptibles de changer
  //et on veut éviter trop de rechargement des composants fils
  const [markers, setMarkers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [showDeleteMarker, setShowDeleteMarker] = useState(false);

  //Valeurs pour la création d'un parc
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

  /**Distance maximal d'affichage des parcs hors mode voyage
   * (correspond à peu près à la distance à partir de laquelle
   * on peut atteindre chaque point de la France en partant du centre) */
  const MAX_DISTANCE = 500;

  /**
   * Retourne la position courante de l'utilisateur
   * @returns des coordonnées correspondant la position courante de l'utilisateur
   */
  async function getCurrentPosition() {
    let userPosition = {
      latitude: 46.53972,
      longitude: 2.43027,
    };
    navigator.geolocation.getCurrentPosition(
      function (position) {
        userPosition.latitude = position.coords.latitude;
        userPosition.longitude = position.coords.longitude;
      },
      function (error) {
        if (error.code === error.PERMISSION_DENIED) {
          setShowAlert(true);
        }
      }
    );
    return userPosition;
  }

  useEffect(() => {
    const asyncData = async () => {
      const userPosition = await getCurrentPosition();
      const res = await getParkByLocationFilter(
        userPosition.latitude,
        userPosition.longitude,
        MAX_DISTANCE,
        sessionStorage.getItem("token")
      );
      sessionStorage.setItem("parkList", JSON.stringify(res.data));
      setMarkers(res.data);
    };

    asyncData().catch(console.error);
  }, []);

  Emitter.on("ADD_NEW_PARK", (coordinate) => {
    setShowAddMarker(true);
    setParkCoordinate(coordinate);
  });

  Emitter.on("DELETE_PARK", (park) => {
    setShowDeleteMarker(true);
    setParkToDelete(park);
  });

  /**
   * Redéfinis les variables de création d'un parc à leur valeur par défaut
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
   * Ajout d'un park à la liste retournée par l'API stockée dans le sessionStorage
   * @param {*} park park à ajouter
   */
  function addParkToSessionStorage(park) {
    let markersFromApi = [];
    markersFromApi = JSON.parse(sessionStorage.getItem("parkList"));
    markersFromApi.push(park);
    sessionStorage.setItem("parkList", JSON.stringify(markersFromApi));
  }

  /**
   * Supprime un park à la liste retournée par l'API stockée dans le sessionStorage
   * @param {*} park park à supprimer
   */
  function deleteParkToSessionStorage() {
    let markersFromApi = JSON.parse(sessionStorage.getItem("parkList"));
    let index = markersFromApi.findIndex(
      (marker) => marker.parkId === parkToDelete.parkId
    );
    index !== -1 && markersFromApi.splice(index, 1);
    sessionStorage.setItem("parkList", JSON.stringify(markersFromApi));
  }

  /**
   * Créer un park avec deux appels API
   * - Pour la traduction de coordonnées en adresses
   * - Pour le stockage en Base de données du nouveau parc
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
    newPark = await createParkApi(
      parkToCreate,
      sessionStorage.getItem("token")
    );

    Emitter.emit("ADD_NEW_MARKER", [newPark.data]);
    addParkToSessionStorage(newPark.data);
    setShowAddMarker(false);
    resetCreationData();
  }

  /**
   * Supprime un park et met a jour les markers et les filtres
   */
  async function deletePark() {
    await deleteParkApi(
      parkToDelete.parkId,
      parkToDelete.equipment.equipmentId,
      sessionStorage.getItem("token")
    );

    deleteParkToSessionStorage();

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
            Voulez vous vraiment supprimer le parc situé
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
      le composant se place au dessus du dialog. (il n'y est pas intégré) */}
      {showAddMarker && (
        //## Je n'utilises pas de Modal car il rentre en conflict
        //## avec la map qui est en arrière plan et ça créer des bugs de rendu
        <Dialog
          opened={setShowAddMarker}
          withCloseButton
          onClose={() => setShowAddMarker(false)}
          position={{ top: "25%", left: "25%" }}
          radius="lg"
          className="dialog-create"
        >
          <p className="main-title">
            Ajout d'un nouveau parc à partir de la carte
          </p>
          <p className="title">Équipements du parc :</p>
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
          <div className="information-input">
            <Checkbox
              checked={isCovered}
              onChange={(event) => setIsCovered(event.currentTarget.checked)}
              label={
                isCovered ? (
                  <div className="text">
                    <IconUmbrella size={20} color="blue" className="icons" />
                    <span className="overflow-ok">
                      Le parc possède une protection contre les intempéries
                    </span>
                  </div>
                ) : (
                  <div className="text">
                    <IconCloudRain size={20} color="gray" className="icons" />
                    <span className="overflow-ok">
                      Le parc possède une protection contre les intempéries
                    </span>
                  </div>
                )
              }
            />
          </div>
          <div className="button-dialog-validation">
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
          setShowAlert={setShowAlert}
        />
        <Map markers={JSON.parse(sessionStorage.getItem("parkList"))} />
      </div>
    </div>
  );
}

export default App;
