import { useState } from "react";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import ParkList from "./components/ParkList";
import "./styles/App.css";

function App() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <div id="nav-filter">
        <NavBar showFilters={showFilters} setShowFilters={setShowFilters} />
        {showFilters && <ParkList />}
      </div>
      <Map />
    </div>
  );
}

export default App;
