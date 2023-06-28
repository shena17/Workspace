import React, { useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {Form, Formik } from "formik";
import SyncIcon from "@mui/icons-material/Sync";
import axios from "axios";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import SubmitButton from "../FormsUI/SubmitButton";
import Notification from "../DispayComponents/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  // FORMIK
const INITIAL_FORM_STATE = {
    email: ""
  };

  // YUP
const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string().email("Invalid email format!").required("Required!"),
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .matches(/^\S*$/, 'Password cannot contain spaces')
      .required("Required!")
  });

  //the UpdatePassword function
  export default function UpdatePassword(props){
    const { openPopup3, setOpenPopup3 } = props;
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

      

     return(
        <Dialog
            open={openPopup3}
            maxWidth="sm"
            TransitionComponent={Transition}
            PaperProps={{
                style: { borderRadius: 10 },
            }}
        >
            <div className="popup">
            <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Update Password</p>
            <ClearIcon
              onClick={() => {
                setOpenPopup3(false);
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

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent>
            <Formik
                initialValues={{ ...INITIAL_FORM_STATE }}
                validationSchema={FORM_VALIDATION}
                onSubmit={async (values) => {
                if(values.email != props.employeeDetails2.email) {
                    alert("Email is invalid!")
                }
                else if(values.password != values.confPassword) {
                    alert("Password are not matching!")
                }
                else{
                  await axios
                    .put(
                      "http://localhost:8070/user/updateUser/"+
                      props.employeeDetails2.id,
                      {
                        password: values.password,
                      },
                      
                    )
                    .then((res) => {
                      setOpenPopup3(false);
                      window.location.reload(false);
                    })
                    .catch((err) => {
                        if (
                          err.response &&
                          err.response.data
                        ) {
                          alert("Something went wrong!");
                        }else {
                          alert("Something went wrong!");
                        }
                      });
                    }
                }}
            >

                <Form>
                    <Grid container sx={{ paddingTop: "10px" }} spacing={2}>


                        <Grid item xs={12}>
                        <TextField name="email" label="Email" />
                        </Grid>

                        <Grid item xs={12}>
                        <TextField type="password" name="password" label="New password" />
                        </Grid>

                        <Grid item xs={12}>
                        <TextField type="password" name="confPassword" label="Confirm password" />
                        </Grid>


                        <div className="d-flex addProjectButtons">
                            <SubmitButton startIcon={<SyncIcon />}>Update Password</SubmitButton>
                        </div>
                    </Grid>
                </Form>
            </Formik>
        </DialogContent>
        </div>
        </Dialog>
     );
     
  }