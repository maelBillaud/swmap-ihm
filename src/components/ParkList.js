import { Checkbox, Switch, Slider, Button } from "@mantine/core";
import { useState } from "react";
import { getParksApi } from "../services/park/parkApi.js";
import Emitter from "../services/emitter";
import "../styles/ParkList.css";
import Marker from "./Maker.js";

/* markersFromApi sera une constante qui va nous permettre de réinitialiser les filtres */
function ParkList({ markers, setMarkers, setShowAlert }) {
  const [isTravelMode, setTravelMode] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isCovered, setCovered] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [useDistance, setUseDistance] = useState(false);
  const [distance, setDistance] = useState(0);
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  /** Function qui va calculer la distance entre 2 points en kilomètre grace à la formule de Haversine */
  function distanceBetweenPoints(point1, point2) {
    let theta = point1.longitude - point2.longitude;
    let distance =
      60 *
      1.1515 *
      (180 / Math.PI) *
      Math.acos(
        Math.sin(point1.latitude * (Math.PI / 180)) *
          Math.sin(point2.latitude * (Math.PI / 180)) +
          Math.cos(point1.latitude * (Math.PI / 180)) *
            Math.cos(point2.latitude * (Math.PI / 180)) *
            Math.cos(theta * (Math.PI / 180))
      );
    return Math.round(distance * 1.609344, 2);
  }

  /**
   * Fonction qui va vérifier tous les filtres et retourner la liste de markers correspondante
   */
  function checkFilters(marker) {
    if (isCovered) {
      if (!marker.isCovered) {
        return false;
      }
    }

    if (isVerified) {
      if (marker.listVerifier < 5) {
        return false;
      }
    }

    for (let i = 0; i < equipmentList.length; i++) {
      if (marker.equipment[equipmentList[i]] === 0) {
        return false;
      }
    }

    if (useDistance) {
      return distanceBetweenPoints(userPosition, marker) <= distance;
    }

    return true;
  }

  /**
   * Function qui va mettre a jour les markers en fonction des filtres utilisateurs
   */
  async function applyFilters() {
    var markersFromApi = [];
    if (isTravelMode) {
      let res = await getParksApi(sessionStorage.getItem("token"));
      markersFromApi = res.data;
    } else {
      markersFromApi = JSON.parse(sessionStorage.getItem("parkList"));
    }

    let filteredMarker = markersFromApi.filter(checkFilters);
    setMarkers(filteredMarker);
    Emitter.emit("UPDATE_MAPS_MARKERS", filteredMarker);
  }

  return (
    <div id="container">
      <div id="filter">
        <Switch
          checked={isTravelMode}
          onChange={(event) => {
            setTravelMode(event.currentTarget.checked);
          }}
          label="Mode voyage"
          description="Afficher les parcs sur toute la planète"
        />
        <div id="checkbox-group">
          <Checkbox.Group
            value={equipmentList}
            onChange={setEquipmentList}
            label="Équipements disponibles"
            withAsterisk
          >
            <div id="checkbox">
              <Checkbox value="horizontalBar" label="Barre fixe" />
              <Checkbox value="parallelBar" label="Barre parallèle" />
              <Checkbox value="lowParallelBar" label="Barre parallèle basse" />
              <Checkbox value="fixedRings" label="Anneaux fixes" />
              <Checkbox value="espalier" label="Espalier" />
              <Checkbox value="monkeyBridge" label="Pont de singe" />
            </div>
          </Checkbox.Group>
        </div>

        <div id="switch">
          <Switch
            checked={isVerified}
            onChange={(event) => {
              setVerified(event.currentTarget.checked);
            }}
            label="Parc vérifié"
            description="Vérifié par au moins 5 utilisateurs"
          />
          <Switch
            checked={isCovered}
            onChange={(event) => {
              setCovered(event.currentTarget.checked);
            }}
            label="Parc couvert"
          />
          <Switch
            checked={useDistance}
            onChange={(event) => {
              setUseDistance(event.currentTarget.checked);
              if (!useDistance) {
                navigator.geolocation.getCurrentPosition(
                  function (position) {
                    setUserPosition({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                  },
                  function (error) {
                    if (error.code === error.PERMISSION_DENIED) {
                      setShowAlert(true);
                      setUseDistance(false);
                    }
                  }
                );
              }
            }}
            label={useDistance ? `Distance  - ${distance}km` : "Distance"}
            description={useDistance ? `` : `Par rapport à la géolocalisation`}
          />
          {useDistance && (
            <Slider
              value={distance}
              onChange={setDistance}
              size="sm"
              marks={[
                { value: 25, label: "25km" },
                { value: 50, label: "50km" },
                { value: 75, label: "75km" },
              ]}
              id="slider"
              label={null}
            />
          )}
        </div>

        <div id="btn-appliquer">
          <Button radius="xl" compact onClick={applyFilters}>
            Appliquer les filtres
          </Button>
        </div>
      </div>
      <div id="content">
        {markers.map((value, index) => {
          return <Marker key={index} marker={value} />;
        })}
      </div>
    </div>
  );
}

export default ParkList;
