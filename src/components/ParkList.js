import { Checkbox, Switch, Slider, Button } from "@mantine/core";
import { useState } from "react";
import "../styles/ParkList.css";
import Marker from "./Maker.js";

/* markersFromAPI sera une constante qui va nous permettre de réinitialiser les filtres */
function ParkList({ markers, setMarkers, markersFromAPI, setShowAlert }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isCovered, setCovered] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [useDistance, setUseDistance] = useState(false);
  const [distance, setDistance] = useState(0);
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
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
      if (!marker.isVerified) {
        return false;
      }
    }

    // On fait un for et non un while car on aura au maximum 6 éléments dans le tableau
    for (let i = 0; i < equipmentList.length; i++) {
      if (marker.equipment[equipmentList[i]] === 0) {
        return false;
      }
    }

    console.log(userPosition);

    return true;
  }

  /**
   * Function qui va appliquer les filtres utilisateurs
   */
  function applyFilters() {
    setMarkers(markersFromAPI.filter(checkFilters));
  }

  return (
    <div id="container">
      <div id="filters">
        <Checkbox.Group
          value={equipmentList}
          onChange={setEquipmentList}
          label="Équipements disponibles"
          withAsterisk
        >
          <div>
            <Checkbox value="horizontalBar" label="Barre fixe" />
            <Checkbox value="lowParallelBar" label="Barre parallèle basse" />
            <Checkbox value="fixedRings" label="Anneaux fixes" />
          </div>
          <div>
            <Checkbox value="parallelBar" label="Barre parallèle" />
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
      </div>
      <div>
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
      <div id="content">
        {markers.map((value, index) => {
          return <Marker key={index} marker={value} />;
        })}
      </div>
    </div>
  );
}

export default ParkList;
