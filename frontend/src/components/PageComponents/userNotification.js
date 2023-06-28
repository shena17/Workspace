import React from 'react'
import React, { useState, useEffect } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import SyncIcon from "@mui/icons-material/Sync";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useFormik, Form, Formik, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import SelectField from "../FormsUI/SelectField";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import Toast from "../FormsUI/Toast";
import { useNavigate } from "react-router-dom";
import Notification from "../DispayComponents/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

export default function userNotification(props) {

    const { openPopup, setOpenPopup } = props;
    
  return (
    <div>
      <Dialog 
        open={openPopup} 
        maxWidth="sm" 
        TransitionComponent={Transition}
    >

<Notification notify={notify} setNotify={setNotify} />

<div className="popup">
    <DialogTitle>
    <div className="d-flex justify-content-between">
        <p className="popupTitle">Notifications</p>
        <ClearIcon
        onClick={() => {
            setOpenPopup(false);
        }}
        sx={{
            cursor: "pointer",
            color: "var(--blue)",
            fontSize: "1.7rem",
            marginTop: "6px",
            marginRight: "10px",
        }}
        />
    </div>

    <Divider
        sx={{
        height: "1px",
        backgroundColor: "var(--dark)",
        marginTop: "10px",
        }}
    />
    </DialogTitle>

    <DialogContent>
        <p>Hello world</p>
    </DialogContent>
    </div>
    </Dialog>
    
    </div>
  )
}
