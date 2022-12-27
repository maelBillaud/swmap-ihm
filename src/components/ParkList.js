import { Checkbox, Switch, Slider, Button } from "@mantine/core";
import { useState } from "react";
import "../styles/ParkList.css";
import Marker from "./Maker.js";

function ParkList({ markers, setMarkers }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isCovered, setCovered] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [useDistance, setUseDistance] = useState(
    "Par rapport à la géo-localisation"
  );
  const [distance, setDistance] = useState(0);

  /**
   * Function qui va appliquer les filtres utilisateurs
   */
  function applyFilters() {}

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
          }}
          label={useDistance ? `Distance  - ${distance}km` : "Distance"}
          description={useDistance ? `` : `Par rapport à la géo-localisation`}
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
