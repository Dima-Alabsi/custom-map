import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const EventSelection = ({ events, selectedEvent, onSelectEvent }) => {
  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel id="event-select-label" sx={{ color: "#3f51b5" }}>Select Event</InputLabel>
      <Select
        labelId="event-select-label"
        value={selectedEvent}
        onChange={(e) => onSelectEvent(e.target.value)}
        label="Select Event"
        sx={{ borderColor: "#3f51b5" }}
      >
        {events.map((event, index) => (
          <MenuItem value={index} key={index}>
            {event.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EventSelection;
