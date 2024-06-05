import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "./data";
import DynamicModal from "./components/Modal";

const jordanCenter = [31.9584, 35.9168]; // Al Abdali › Coordinates
const generateRandomDetails = () => {
  const randomPrice = Math.floor(Math.random() * 500000) + 1000000;
  const randomDetails =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  return { price: randomPrice, details: randomDetails };
};

const MapComponent = () => {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingDetails, setBuildingDetails] = useState(null);
  const [boughtBuildings, setBoughtBuildings] = useState(new Map());

  const handleBuildingClick = (building) => {
    if (boughtBuildings.has(building.properties.name)) return;

    setSelectedBuilding(building);
    setBuildingDetails(generateRandomDetails());
    setOpenInfoModal(true);
  };

  const handleConfirm = (buyerInfo) => {
    const layer = selectedBuilding.layer;
    layer.setStyle({
      fillColor: "#808080",
      fillOpacity: 0.7,
      weight: 2,
      opacity: 1,
      color: "white",
    });
    layer
      .unbindPopup()
      .bindPopup(
        `<b>${selectedBuilding.properties.name} Reserved</b><br/>Name :${
          buyerInfo.name
        }<br/>Email:${buyerInfo.email}${
          buyerInfo.phone && `<br/>Phone:${buyerInfo.phone}`
        } `
      )
      .openPopup();
    layer.off("mouseover mouseout");
    setBoughtBuildings((prev) => {
      const newMap = new Map(prev);
      newMap.set(selectedBuilding.properties.name, buyerInfo);
      return newMap;
    });
    setOpenInfoModal(false);
  };

  return (
    <>
      <MapContainer
        scrollWheelZoom={true}
        center={jordanCenter}
        zoom={20}
        style={{
          height: "100vh",
          width: "100vw",
          margin: "auto",
          // marginTop: "5vh",
        }}
        minZoom={17}
        maxZoom={23}
      >
        {/* <TileLayer
          url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_KEY}`}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />*/}
        {statesData.features.map((state, index) => {
          let coordinates;
          if (state.geometry.type === "LineString") {
            coordinates = state.geometry.coordinates.map((item) => [
              item[1],
              item[0],
            ]);

            const isBought = boughtBuildings.has(state.properties.name);

            return (
              <Polygon
                key={index}
                pathOptions={{
                  fillColor: isBought ? "#808080" : state.properties.color,
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 1,
                  dashArray: 3,
                  color: "white",
                }}
                positions={coordinates}
                eventHandlers={{
                  mouseover: (e) => {
                    if (isBought) return;
                    const layer = e.target;
                    layer
                      .bindPopup(`<b>${state.properties.name}</b>`)
                      .openPopup();
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
                    if (isBought) return;
                    const layer = e.target;
                    layer.setStyle({
                      fillOpacity: 0.7,
                      weight: 2,
                      dashArray: "3",
                      color: "white",
                      fillColor: state.properties.color,
                    });
                  },
                  click: (e) => {
                    if (isBought) return;
                    const layer = e.target;
                    handleBuildingClick({ ...state, layer });
                  },
                }}
              />
            );
          } else if (state.geometry.type === "Point") {
            coordinates = [
              state.geometry.coordinates[1],
              state.geometry.coordinates[0],
            ];
            return <CircleMarker center={coordinates} key={index} />;
          }
        })}
      </MapContainer>
      {openInfoModal && selectedBuilding && buildingDetails && (
        <DynamicModal
          open={openInfoModal}
          handleClose={() => setOpenInfoModal(false)}
          title={selectedBuilding.properties.name}
          content={
            <div>
              <p>
                Price:{" "}
                <span style={{ fontWeight: "bolder" }}>
                  ${buildingDetails.price.toLocaleString()}
                </span>
              </p>
              <p>{buildingDetails.details}</p>
            </div>
          }
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default MapComponent;
