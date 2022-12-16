import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getMapBoxAccessToken from "../environments/environment.js";
import "../styles/Map.css";
import Marker from "./Maker.js";

var ReactDOMServer = require("react-dom/server");

mapboxgl.accessToken = getMapBoxAccessToken();

function Map({ markers, setMarkers }) {
  const mapContainerRef = useRef(null);

  // Initialisation de la map lors du changement du composant
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // id du container
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-1.552955180984841, 47.216061233335395], // position de départ
      zoom: 12, // zoom de départ
    });

    //Ajout des markers sur la map
    markers.forEach((marker) => {
      console.log("🚀 ~ file: Map.js:35 ~ markers.forEach ~ marker", marker);
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            ReactDOMServer.renderToString(<Marker marker={marker} />)
          )
        )
        .addTo(map);
    });

    map.on("click", (e) => {
      // When the map is clicked, get the geographic coordinate.
      const coordinate = map.unproject(e.point);
      console.log("🚀 ~ file: Map.js:41 ~ map.on ~ coordinate", coordinate);
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([coordinate.lng, coordinate.lat])
        .setPopup(new mapboxgl.Popup().setHTML("<h1>test<h1/>"))
        .addTo(map);
    });

    // new mapboxgl.Marker({ color: "red" })
    //   .setLngLat([-1.552955180984841, 47.216061233335395])
    //   .setPopup(new mapboxgl.Popup().setHTML("<h1>Test</h1>"))
    //   .addTo(map);

    // const firstStreetParc = new mapboxgl.Marker({ color: "red" })
    //   .setLngLat([-1.4939905439296215, 47.301400982695824])
    //   .setPopup(
    //     new mapboxgl.Popup().setHTML(
    //       ReactDOMServer.renderToString(<Marker text={"bliblablou"} />)
    //     )
    //   )
    //   .addTo(map);

    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="map-container" ref={mapContainerRef} />;
}

export default Map;
