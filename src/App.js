import React, { useState } from "react";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import ParkList from "./components/ParkList";
import "./styles/App.css";

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
      equipmentId: 4,
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
];

function App() {
  const [showFilters, setShowFilters] = useState(false);
  //Ici on n'utilise pas de context car les markers sont susceptibles de changer
  //et on veut éviter trop de rechargement des composants fils
  const [markers, setMarkers] = useState(markersFromAPI);

  return (
    <div>
      <div id="nav-filter">
        <NavBar showFilters={showFilters} setShowFilters={setShowFilters} />
        {showFilters && <ParkList markers={markers} setMarkers={setMarkers} />}
      </div>
      <Map markers={markers} setMarkers={setMarkers} />
    </div>
  );
}

export default App;
