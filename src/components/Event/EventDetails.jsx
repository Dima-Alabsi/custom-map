import React from "react";
import { Typography, Box } from "@mui/material";

const EventDetails = ({ event, reservedSeatsCount, unreservedSeatsCount }) => {
  return (
    <Box sx={{ margin: 2, padding: 2, borderRadius: 8, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h5" sx={{ marginBottom: 1, color: "#3f51b5" }}>{event.name}</Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>Date: {event.date}</Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>Details: {event.details}</Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>Organizer: {event.organizer}</Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Box>
          <Typography variant="body1" sx={{ color: "#f50057" }}>Reserved Seats:</Typography>
          <Typography variant="body1">{reservedSeatsCount}</Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={{ color: "#4caf50" }}>Unreserved Seats:</Typography>
          <Typography variant="body1">{unreservedSeatsCount}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetails;
