import { Checkbox } from "@mantine/core";
import "../styles/ParkList.css";

function ParkList() {
  return (
    <div id="container">
      <div id="filters">
        <Checkbox.Group
          defaultValue={["react"]}
          label="Équipements disponibles"
          withAsterisk
        >
          <div>
            <Checkbox value="react" label="React" />
            <Checkbox value="svelte" label="Svelte" />
          </div>
          <div>
            <Checkbox value="ng" label="Angular" />
            <Checkbox value="vue" label="Vue" />
          </div>
        </Checkbox.Group>
      </div>
      <div id="content"></div>
    </div>
  );
}

export default ParkList;
