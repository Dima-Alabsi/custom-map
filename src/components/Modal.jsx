import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const DynamicModal = ({ open, handleClose, title, content, handleConfirm }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    if (name && email) {
      setIsConfirmDisabled(false);
    } else {
      setIsConfirmDisabled(true);
    }
  }, [name, email]);

  const handleSubmit = () => {
    handleConfirm({ name, email, phone });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 270 : isLargeScreen ? 400 : "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={handleClose}>X</IconButton>
        </Box>
        <Typography
          id="modal-modal-description"
          sx={{
            mt: 2,
            backgroundColor: "#f2f2f2",
            paddingTop: "1px",
            paddingBottom: "1px",
          }}
          component={"span"}
        >
          {content}
        </Typography>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <PhoneInput
          inputStyle={{ height: "45px", width: "100%" }}
          country={"jo"}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          enableSearch={true}
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isConfirmDisabled}
        >
          Buy
        </Button>
      </Box>
    </Modal>
  );
};

export default DynamicModal;
