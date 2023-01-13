import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getMapBoxAccessToken from "../environments/environment.js";
import Emitter from "../services/emitter";
import "../styles/Map.css";
import Marker from "./Maker.js";

var ReactDOMServer = require("react-dom/server");

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
mapboxgl.accessToken = getMapBoxAccessToken();

function Map({ markers }) {
  const mapContainerRef = useRef(null);

  // Initialisation de la map lors du changement du composant
  useEffect(() => {
    //Tableau qui va stockers les markers
    var markersMap = [];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // id du container
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-1.552955180984841, 47.216061233335395], // position de départ
      zoom: 12, // zoom de départ
      doubleClickZoom: false,
    });

    //Ajout des markers sur la map
    addMarkers(markers);

    //Ajout de l'affichage de la position actuelle de l'utilisateur
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // ajout des boutons de zoom
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    /**
     * Fonction qui va ajouter une liste de markers sur la map
     * @param {*} markers markers à ajouter
     */
    function addMarkers(markers) {
      markers.forEach((marker) => {
        markersMap.push(
          new mapboxgl.Marker({ color: "red" })
            .setLngLat([marker.longitude, marker.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                ReactDOMServer.renderToString(<Marker marker={marker} />)
              )
            )
            .addTo(map)
        );
      });
    }

    Emitter.on("ADD_NEW_MARKER", (newMarker) => {
      addMarkers(newMarker);
    });

    Emitter.on("UPDATE_MAPS_MARKERS", (filteredMarker) => {
      markersMap.forEach((markerMap) => {
        markerMap.remove();
      });
      addMarkers(filteredMarker);
    });

    Emitter.on("DELETE_MARKER", (latitude, longitude) => {
      markersMap.forEach((markerMap) => {
        const markerCoordinate = markerMap.getLngLat();
        if (
          markerCoordinate.lat === latitude &&
          markerCoordinate.lgn === longitude
        ) {
          markerMap.remove();
        }
      });
    });

    map.on("dblclick", (e) => {
      // Récupération des coordonnées lorsqu'on clique sur la map
      const coordinate = map.unproject(e.point);

      Emitter.emit("ADD_NEW_PARK", {
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      });
    });

    // destruction de la map lors de la fin du cycle de vie du composent
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
}

export default Map;
