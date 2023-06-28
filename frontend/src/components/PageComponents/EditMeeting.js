
import React, { useState, useEffect } from "react";
import { FormGroup, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, IconButton, Grid, ListSubheader } from "@mui/material";
import TextField from "../FormsUI/TextField";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SubmitButton from "../FormsUI/SubmitButton";
import DatePicker from "../FormsUI/DatePicker";
import SelectField from "../FormsUI/SelectField";
import { addMeeting, updateMeeting, getMeeting } from "../service/apiMeeting";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import ButtonWrapper from "../FormsUI/Button";
import SyncIcon from "@mui/icons-material/Sync";
import Notification from "../DispayComponents/Notification";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

//YUP
const FORM_VALIDATION = Yup.object().shape({
  subject: Yup.string().required("Required!"),
  date: Yup.string().required("Required!"),
  time: Yup.string().required("Required!"),
  organizer: Yup.string().required("Required!"),
  email: Yup.string().required("Required!"),
  platform: Yup.string().required("Required!"),
});

const Container = styled(FormGroup)`
    width: 70%;
    alignItems: center;
    margin: auto;
    & > div {
        margin-top: 20px;
        margin-bottom: 20px;
`;

const EditMeeting = (props) => {
    // AUTHENTICATION HEADER
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const { openPopup, setOpenPopup } = props;

    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });

    //get meeting details as props
    const meetingDetails = props.meetingDetails;

    return (
        <Dialog
            open={openPopup}
            maxWidth="sm"
            TransitionComponent={Transition}
        >
            {/* NOTIFICATION */}
            {/* <Notification notify={notify} setNotify={setNotify} /> */}

            <div className="popup">
                <DialogTitle>
                    <div className="d-flex justify-content-between">
                        <p className="popupTitle">Edit Meeting</p>
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
                    <Formik
                        //take intial values from the prop taken
                        initialValues={{
                            subject: meetingDetails.subject,
                            date: new Date(meetingDetails.date).toLocaleDateString("en-CA"),
                            time: meetingDetails.time,
                            organizer: meetingDetails.organizer,
                            platform: meetingDetails.platform,
                        }}
                        //validationSchema={FORM_VALIDATION}
                        onSubmit={async (values) => {
                            console.log(values);
                            await axios.put("http://localhost:8070/meeting/editmeeting/" + meetingDetails._id,
                                {
                                    subject: values.subject,
                                    date: values.date,
                                    time: values.time,
                                    organizer: values.organizer,
                                    platform: values.platform,
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            )
                                .then((res) => {
                                    sessionStorage.setItem("MeetingUpdated", "1");
                                    sessionStorage.setItem("meetingId", meetingDetails._id);
                                    setOpenPopup(false);
                                    navigate("/meetings/");
                                    window.location.reload();
                                })
                                .catch((err) => {
                                    if (
                                        err.response &&
                                        err.response.data &&
                                        err.response.data.errorMessage
                                    ) {
                                        setNotify({
                                            isOpen: "true",
                                            message: err.response.data.errorMessage,
                                            type: "error",
                                        });
                                    }
                                })
                        }}
                    >
                        <Form>
                            <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                                {/* 1st row */}
                                <Grid item xs={6}>
                                    <TextField name="subject" label="Subject" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="date"
                                        type="date"
                                        fullWidth
                                        label="Date"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="time" label="Time" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="organizer" label="Organizer" />
                                </Grid>
                                {/* 2nd row */}
                                <Grid item xs={6}>
                                    <SelectField
                                        name="platform"
                                        label="Platform"
                                        options={{
                                            Zoom: "Zoom",
                                            Teams: "MS Teams",
                                        }}
                                    />
                                </Grid>

                                <div className="d-flex addProjectButtons">
                                    <ButtonWrapper
                                        startIcon={<ClearIcon />}
                                        style={{ marginRight: "15px" }}
                                    >
                                        Clear
                                    </ButtonWrapper>

                                    <SubmitButton startIcon={<SyncIcon />}>Update</SubmitButton>
                                </div>
                            </Grid>
                        </Form>
                    </Formik>
                </DialogContent>
            </div>

        </Dialog>

    )
}

export default EditMeeting;