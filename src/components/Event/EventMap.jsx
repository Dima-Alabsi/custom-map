import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DynamicModal from "../Modal";
import { generateRandomDetails } from "../../utils/utils"; // Assume this function is defined elsewhere
import { statesData } from "../../data"; // Assume this contains the map data

const EventMap = ({ seats, onSeatPurchase }) => {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatDetails, setSeatDetails] = useState(null);
  const allSeatsReserved = seats.size === statesData.features.length;

  const handleSeatClick = (seat) => {
    const isSeatReserved = seats.has(seat.properties.name);

    if (isSeatReserved) {
      const reservedContent = `
        <b>${seat.properties.name} (Reserved)</b><br/>
        This seat is already reserved.
      `;
      seat.layer.unbindPopup().bindPopup(reservedContent).openPopup();
    } else {
      setSelectedSeat(seat);
      setSeatDetails(generateRandomDetails());
      setOpenInfoModal(true);
    }
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
        `<b>${selectedSeat.properties.name} Reserved</b><br/>Name: ${
          buyerInfo.name
        }<br/>Email: ${buyerInfo.email}${
          buyerInfo.phone ? `<br/>Phone: ${buyerInfo.phone}` : ""
        }`
      )
      .openPopup();
    layer.off("mouseover mouseout");
    onSeatPurchase(selectedSeat.properties.name, buyerInfo);
    setOpenInfoModal(false);
  };

  return (
    <>
      {allSeatsReserved && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "500",
            color: "red",
          }}
        >
          All seats are reserved.
        </p>
      )}
      <MapContainer
        scrollWheelZoom={true}
        center={[31.9584, 35.9168]} // Center of the map
        zoom={19}
        style={{ height: "50vh", width: "60vw", margin: "auto" }}
        minZoom={17}
        maxZoom={23}
      >
        {/* <TileLayer
          url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_KEY}`}
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        /> */}
        {statesData.features.map((feature, index) => {
          let coordinates;
          if (feature.geometry.type === "LineString") {
            coordinates = feature.geometry.coordinates.map((item) => [
              item[1],
              item[0],
            ]);
            const isBought = seats.has(feature.properties.name);

            return (
              <Polygon
                key={index}
                pathOptions={{
                  fillColor: isBought ? "#808080" : feature.properties.color,
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
                      .bindPopup(`<b>${feature.properties.name}</b>`)
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
                      fillColor: feature.properties.color,
                    });
                  },
                  click: (e) => {
                    if (isBought) return;
                    const layer = e.target;
                    handleSeatClick({ ...feature, layer });
                  },
                }}
              />
            );
          } else if (feature.geometry.type === "Point") {
            coordinates = [
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ];
            return <CircleMarker center={coordinates} key={index} />;
          }
        })}
      </MapContainer>
      {!allSeatsReserved && openInfoModal && selectedSeat && seatDetails && (
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

export default EventMap;
