import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { ReactDOM } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import getMapBoxAccessToken from "../environments/environment.js";
import "../styles/Map.css";
import Marker from "./Maker.js";

var ReactDOMServer = require("react-dom/server");

mapboxgl.accessToken = getMapBoxAccessToken();

function Map() {
  const mapContainerRef = useRef(null);

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-1.552955180984841, 47.216061233335395], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    const marker1 = new mapboxgl.Marker({ color: "red" })
      .setLngLat([-1.552955180984841, 47.216061233335395])
      .setPopup(new mapboxgl.Popup().setHTML("<h1>Test</h1>"))
      .addTo(map);

    const firstStreetParc = new mapboxgl.Marker({ color: "red" })
      .setLngLat([-1.4939905439296215, 47.301400982695824])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          ReactDOMServer.renderToString(<Marker text={"bliblablou"} />)
        )
      )
      .addTo(map);

    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="map-container" ref={mapContainerRef} />;
}

export default Map;
