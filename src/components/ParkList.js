import { Checkbox, Switch } from "@mantine/core";
import { useState } from "react";
import "../styles/ParkList.css";
import Marker from "./Maker.js";

function ParkList({ markers, setMarkers }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isCovered, setCovered] = useState(false);
  const [isVerified, setVerified] = useState(false);

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
          checked={isCovered}
          onChange={(event) => setCovered(event.currentTarget.checked)}
          label="Parc couvert"
        />
        <Switch
          checked={isVerified}
          onChange={(event) => setVerified(event.currentTarget.checked)}
          label="Parc vérifié"
          description="Vérifié par au moins 5 utilisateurs"
        />
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
