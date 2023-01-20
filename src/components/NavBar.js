import React, { useState } from "react";
import "../styles/NavBar.css";
import HeaderMenu from "./HeaderMenu.js";
import Filter from "./Filter";
import Research from "./Research";
import ParkList from "./ParkList";
import AddPark from "./AddPark";
import Logout from "./Logout";

function NavBar({ markers, setMarkers, setShowAlert }) {
  const [showFilters, setShowFilters] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  return (
    <div id="navbar">
      <div id="menu">
        <HeaderMenu />
        <Filter
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          setShowResearch={setShowResearch}
        />
        <Research
          showResearch={showResearch}
          setShowResearch={setShowResearch}
          setShowFilters={setShowFilters}
        />
        <Logout />
      </div>
      <div>
        {showFilters && (
          <ParkList
            markers={markers}
            setMarkers={setMarkers}
            setShowAlert={setShowAlert}
          />
        )}
        {showResearch && <AddPark setShowResearch={setShowResearch} />}
      </div>
    </div>
  );
}

export default NavBar;
