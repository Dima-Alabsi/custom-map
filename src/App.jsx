import React, { useState } from "react";
import EventSelection from "./components/Event/EventSelection";
import EventMap from "./components/Event/EventMap";
import EventDetails from "./components/Event/EventDetails";
import { statesData } from "./data";

const events = [
  {
    name: "Gallery Opening",
    date: "8.01.",
    organizer: "Kyiv City Art Gallery",
    details:
      "Discover an enchanting evening celebrating the world of art at our exclusive gallery opening.",
  },
  {
    name: "Empower Your Creativity",
    date: "8.09.",
    organizer: "REFA Kyiv",
    details:
      "Engage in a thought-provoking journey of knowledge and collaboration at our Innovation Summit.",
  },
  {
    name: "Tech Conference",
    date: "8.10.",
    organizer: "Tech Insights",

    details:
      "Ignite your creativity and nurture your storytelling skills in our immersive Creative Writing Workshop.",
  },
  // Add more events as needed
];

const App = () => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [eventStates, setEventStates] = useState(events.map(() => new Map()));

  const handleSeatPurchase = (eventIndex, seatName, buyerInfo) => {
    setEventStates((prevStates) => {
      const newStates = [...prevStates];
      const updatedMap = new Map(newStates[eventIndex]);
      updatedMap.set(seatName, buyerInfo);
      newStates[eventIndex] = updatedMap;
      return newStates;
    });
  };

  const selectedEventSeats = eventStates[selectedEventIndex];
  const reservedSeatsCount = selectedEventSeats.size;
  const totalSeatsCount = statesData.features.length;
  const unreservedSeatsCount = totalSeatsCount - reservedSeatsCount;

  return (
    <div style={{ margin: "3vh" }}>
      <EventSelection
        events={events}
        selectedEvent={selectedEventIndex}
        onSelectEvent={setSelectedEventIndex}
      />

      <EventDetails
        event={events[selectedEventIndex]}
        reservedSeatsCount={reservedSeatsCount}
        unreservedSeatsCount={unreservedSeatsCount}
      />
      <div style={{ marginTop: "5vh" }}>
        {" "}
        <EventMap
          seats={selectedEventSeats}
          onSeatPurchase={(seatName, buyerInfo) =>
            handleSeatPurchase(selectedEventIndex, seatName, buyerInfo)
          }
        />
      </div>
    </div>
  );
};

export default App;


// import logo from "./logo.svg";
// import "./App.css";
// import { Map } from "leaflet";
// import MapComponent from "./Map";

// function App() {
//   return (
//     <div className="App">
//       <MapComponent />
//     </div>
//   );
// }

// export default App;