import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { statesData } from "./data"; // Assuming this contains seat data
import DynamicModal from "./components/Modal";
import Event from "./components/Event/Event";

const jordanCenter = [31.9584, 35.9168]; // Al Abdali › Coordinates
const generateRandomDetails = () => {
  const randomPrice = Math.floor(Math.random() * 500) + 100;
  const randomDetails =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  return { price: randomPrice, details: randomDetails };
};

const MapComponent = () => {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatDetails, setSeatDetails] = useState(null);
  const [reservedSeats, setReservedSeats] = useState(new Map());
  const [notReservedCount, setNotReservedCount] = useState(statesData.features.length);
  const [reservedCount, setReservedCount] = useState(0);

  const handleSeatClick = (seat) => {
    if (reservedSeats.has(seat.properties.name)) return;

    setSelectedSeat(seat);
    setSeatDetails(generateRandomDetails());
    setOpenInfoModal(true);
  };

  const handleConfirm = (buyerInfo) => {
    const layer = selectedSeat.layer;
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
        `<b>${selectedSeat.properties.name} Reserved</b><br/>Name :${
          buyerInfo.name
        }<br/>Email:${buyerInfo.email}${
          buyerInfo.phone && `<br/>Phone:${buyerInfo.phone}`
        }<br/>Referrer:${buyerInfo.referrer} `
      )
      .openPopup();
    layer.off("mouseover mouseout");
    setReservedSeats((prev) => {
      const newMap = new Map(prev);
      newMap.set(selectedSeat.properties.name, buyerInfo);
      return newMap;
    });

    setReservedCount((prev) => prev + 1);
    setNotReservedCount((prev) => prev - 1);

    setOpenInfoModal(false);
  };

  useEffect(() => {
    setNotReservedCount(statesData.features.length - reservedSeats.size);
  }, [reservedSeats]);

  return (
    <>
      <Event />
      <div style={{ textAlign: "center", margin: "10px" }}>
        <p variant="h6">Reserved Seats: {reservedCount}</p>
        <p variant="h6">Not Reserved Seats: {notReservedCount}</p>
      </div>
      <MapContainer
        scrollWheelZoom={true}
        center={jordanCenter}
        zoom={20}
        style={{
          height: "50vh",
          width: "50vw",
          margin: "auto",
        }}
        minZoom={17}
        maxZoom={23}
      >
        {statesData.features.map((state, index) => {
          let coordinates;
          if (state.geometry.type === "LineString") {
            coordinates = state.geometry.coordinates.map((item) => [
              item[1],
              item[0],
            ]);

            const isReserved = reservedSeats.has(state.properties.name);

            return (
              <Polygon
                key={index}
                pathOptions={{
                  fillColor: isReserved ? "#808080" : state.properties.color,
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 1,
                  dashArray: 3,
                  color: "white",
                }}
                positions={coordinates}
                eventHandlers={{
                  mouseover: (e) => {
                    if (isReserved) return;
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
                    if (isReserved) return;
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
                    if (isReserved) return;
                    const layer = e.target;
                    handleSeatClick({ ...state, layer });
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
      {openInfoModal && selectedSeat && seatDetails && (
        <DynamicModal
          open={openInfoModal}
          handleClose={() => setOpenInfoModal(false)}
          title={selectedSeat.properties.name}
          content={
            <div>
              <p>
                Price:{" "}
                <span style={{ fontWeight: "bolder" }}>
                  ${seatDetails.price.toLocaleString()}
                </span>
              </p>
              {/* <p>{seatDetails.details}</p> */}
            </div>
          }
          handleConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default MapComponent;
