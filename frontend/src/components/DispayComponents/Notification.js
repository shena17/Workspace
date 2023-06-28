import React from "react";
import { Alert, Snackbar } from "@mui/material";

export default function Notification(props) {
  const { notify, setNotify } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };

  return (
    <div>
      <Snackbar
        open={notify.isOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert severity={notify.type} onClose={handleClose} variant="filled">
          {notify.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
