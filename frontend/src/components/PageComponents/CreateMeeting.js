import react, { useState } from 'react';
import { FormGroup, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addMeeting } from '../service/apiMeeting';
import axios from 'axios';
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, IconButton, Grid, ListSubheader } from "@mui/material";
import TextField from "../FormsUI/TextField";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SubmitButton from "../FormsUI/SubmitButton";
import DatePicker from '../FormsUI/DatePicker';
import SelectField from "../FormsUI/SelectField";


// FORMIK
const INITIAL_FORM_STATE = {
  subject: "",
  date: "",
  time: "",
  organizer: "",
  platform: "",
};

//YUP
const FORM_VALIDATION = Yup.object().shape({
  subject: Yup.string().required("Required!"),
  date: Yup.string().required("Required!"),
  time: Yup.string().required("Required!"),
  organizer: Yup.string().required("Required!"),
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

const CreateMeeting = () => {

  const navigate = useNavigate();

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");  

  return (
    <Container>
      <Typography variant="h5">Schedule a Meeting</Typography>
      <br /><br />

      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}

        onSubmit={async (values) => {
          // console.log(values);
          await axios
            .post(
              "http://localhost:8070/meeting/add",
              {
                date: values.date,
                time: values.time,
                platform: values.platform,
                subject: values.subject,
                organizer: values.organizer,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              sessionStorage.setItem("MeetingCreated", "1");
              navigate("/meetings");
            })
            .catch((err) => {
              if (
                err.response &&
                err.response.data &&
                err.response.data.errorMessage
              ) {
                setNotify({
                  isOpen: true,
                  message: err.response.data.errorMessage,
                  type: "error",
                });
              }
            });
        }}

      >
        <Form>
          <Grid container spacing={2}>
            {/* 1st row */}
            <Grid item xs={12}>
              <TextField name="subject" label="Subject" />
            </Grid>

            {/* 2nd row */}
            <Grid item xs={12}>
              <DatePicker name="date" label="Date" />
            </Grid>

            <Grid item xs={12}>
              <TextField name="time" label="Time" />
            </Grid>

            <Grid item xs={12}>
              <TextField name="organizer" label="Organizer" />
            </Grid>

            <Grid item xs={4}>
              <SelectField
                name="platform"
                label="Platform"
                options={{
                  Zoom: "Zoom",
                  Teams: "MS Teams",
                }}
              />
            </Grid>

          </Grid>

          <Grid
            container
            item
            xs={10}
            sx={{ alignItems: "center", marginBottom: "5px" }}
          >

          </Grid>

          <div className="d-flex addMeetingButtons">
            <Button
              type="reset"
              startIcon={<ClearIcon />}
              variant="outlined"
              sx={{
                marginInline: "10px",
                border: "1px solid var(--light-blue)",
                color: "var(--light-blue)",
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": {
                  color: "red",
                  border: "1px solid red",
                },
              }}
            >
              Clear
            </Button>

            <SubmitButton startIcon={<AddIcon />}>Schedule</SubmitButton>
          </div>
        </Form>
      </Formik>
    </Container>
  )
}

export default CreateMeeting;