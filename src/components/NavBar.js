import React, { useState } from "react";
import "../styles/NavBar.css";
import HeaderMenu from "./HeaderMenu.js";
import Filter from "./Filter";
import ParkList from "./ParkList";

function NavBar({ markers, setMarkers, markersFromApi, setShowAlert }) {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div id="navbar">
      <div id="menu">
        <HeaderMenu />
        <Filter showFilters={showFilters} setShowFilters={setShowFilters} />
      </div>
      <div>
        {showFilters && (
          <ParkList
            markers={markers}
            setMarkers={setMarkers}
            markersFromApi={markersFromApi}
            setShowAlert={setShowAlert}
          />
        )}
      </div>
    </div>
  );
}

export default NavBar;
