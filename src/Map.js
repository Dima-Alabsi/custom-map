import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Polygon,
  Marker,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "./data";

const jordanCenter = [31.9607, 35.9163]; //  Al Abdali › Coordinates

const MapComponent = () => {
  return (
    <MapContainer
      center={jordanCenter}
      zoom={16}
      style={{
        height: "90vh",
        width: "90vw",
        margin: "auto",
        marginTop: "5vh",
      }}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_KEY}`}
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {statesData.features.map((state, index) => {
        let coordinates;
        if (state.geometry.type === "Polygon") {
          coordinates = state.geometry.coordinates[0].map((item) => [
            item[1],
            item[0],
          ]);
          return (
            <Polygon
              key={index}
              pathOptions={{
                fillColor: "#FD8D3C",
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: "white",
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.bindPopup(`<b>Building ${index + 1}</b>`).openPopup();
                  layer.setStyle({
                    dashArray: "",
                    fillColor: "#BD0026",
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: "white",
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: "3",
                    color: "white",
                    fillColor: "#FD8D3C",
                  });
                },
                click: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillColor: "#808080", 
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: "white",
                  });
                  layer
                    .unbindPopup()
                    .bindPopup(`<b>Building ${index + 1} Reserved</b>`)
                    .openPopup();
                  layer.off("mouseover mouseout");
                },
              }}
            />
          );
        } else if (state.geometry.type === "Point") {
          coordinates = [
            state.geometry.coordinates[1],
            state.geometry.coordinates[0],
          ];
          return <CircleMarker center={coordinates} key={index}  />;
        }
      })}
    </MapContainer>
  );
};

export default MapComponent;
