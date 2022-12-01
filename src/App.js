import React, { useState } from 'react';
import './styles/App.css';
import {Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {

  const [lat, setlat] = useState(-1.544130860174887)
  const [lng, setLng] = useState(47.20479163319269);

  return (
    <div className='app'>
      <Map
        mapboxAccessToken='pk.eyJ1IjoibWFlbGIxIiwiYSI6ImNsYjU2aDN3aDAzanczcHF1aWN3Mnh0Y2kifQ.h1dHrk1quc7T4W-nSI5yWQ'
        style={{
          width: "100vw",
          height: "100vh"
        }}
        initialViewState={{
          latitude: lat,
          longitude: lng
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
      {/* <Marker
        latitude={lat}
        longitude={lng}
      />
      <NavigationControl/> */}
      
    </div>
  );
}

export default App;
