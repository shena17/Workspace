import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function ConfirmationBox(props) {
  const { confirmDialog, setConfirmDialog } = props;
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={confirmDialog.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
        PaperProps={{
          style: { borderRadius: 10 },
        }}
      >
        <div className="d-flex">
          <div className="justify-content-center align-items-center d-flex">
            <div
              style={{
                marginLeft: "15px",
                borderRadius: "50%",
                padding: "10px",
                border: "2px solid var(--drawer-bg)",
              }}
            >
              {confirmDialog.type === "success" ? (
                <TaskAltIcon
                  style={{
                    color: "#006999",
                    fontSize: "3rem",
                    marginBottom: "3px",
                    marginInline: "2px",
                  }}
                />
              ) : (
                <WarningAmberRoundedIcon
                  style={{
                    color: "#cb3b30",
                    fontSize: "3rem",
                    marginBottom: "3px",
                    marginInline: "2px",
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <DialogTitle id="alert-dialog-title">
              {confirmDialog.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {confirmDialog.subTitle}
              </DialogContentText>
            </DialogContent>
          </div>
        </div>
        <DialogActions className="mb-2 me-2">
          <Button
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
            style={{
              backgroundColor: "#edf2f7",
              borderRadius: "10px",
              padding: "8px 15px",
              fontSize: "0.8rem",
              color: "#36353d",
            }}
          >
            Cancel
          </Button>
          {confirmDialog.type === "success" ? (
            <Button
              onClick={() => {
                confirmDialog.onConfirm();
              }}
              autoFocus
              style={{
                backgroundColor: "#ccccff",
                borderRadius: "10px",
                padding: "8px 15px",
                fontSize: "0.8rem",
                color: "#006999",
              }}
            >
              Confirm
            </Button>
          ) : (
            <Button
              onClick={() => {
                confirmDialog.onConfirm();
              }}
              autoFocus
              style={{
                backgroundColor: "#fed7d7",
                borderRadius: "10px",
                padding: "8px 15px",
                fontSize: "0.8rem",
                color: "#c64057",
              }}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
