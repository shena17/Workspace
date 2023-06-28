import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useFormik, Form, Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import SelectField from "../FormsUI/SelectField";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import SyncIcon from "@mui/icons-material/Sync";
import ButtonWrapper from "../FormsUI/Button";
import Notification from "../DispayComponents/Notification";
import EditIcon from "@mui/icons-material/Edit";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//YUP
const FORM_VALIDATION = Yup.object().shape({
  projectName: Yup.string().required("Required"),
  company: Yup.string().required("Required"),
  credits: Yup.number().integer().required("Required"),
  startDate: Yup.date().required("Required"),
  deadline: Yup.date().required("Required"),
  description: Yup.string().required("Required"),
});

export default function EditProject(props) {
  const navigate = useNavigate();
  const { openPopup, setOpenPopup } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  // PROJECT DETAILS
  const details = props.projectDetails;

  return (
    <Dialog
      open={openPopup}
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        style: { borderRadius: 10 },
      }}
    >
      <Notification notify={notify} setNotify={setNotify} />

      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">
              <EditIcon className="me-3" />
              Edit Project
            </p>
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
        </DialogTitle>
        {details.map((project) => (
          <DialogContent>
            <Formik
              initialValues={{
                projectName: project.projectName,
                company: project.company,
                credits: project.credits,
                startDate: new Date(project.startDate).toLocaleDateString(
                  "en-CA"
                ),
                deadline: new Date(project.deadline).toLocaleDateString(
                  "en-CA"
                ),
                description: project.description,
              }}
              validationSchema={FORM_VALIDATION}
              onSubmit={async (values) => {
                if (
                  values.projectName === project.projectName &&
                  values.company === project.company &&
                  values.credits === project.credits &&
                  new Date(values.startDate).toLocaleDateString("en-CA") ===
                    new Date(project.startDate).toLocaleDateString("en-CA") &&
                  new Date(values.deadline).toLocaleDateString("en-CA") ===
                    new Date(project.deadline).toLocaleDateString("en-CA") &&
                  values.description === project.description
                ) {
                  setNotify({
                    isOpen: true,
                    message: "No changes made!",
                    type: "warning",
                  });
                } else {
                  console.log(values);
                  await axios
                    .put(
                      "http://localhost:8070/project/updateProject/" +
                        project._id,
                      {
                        currentProject: project.projectName,
                        projectName: values.projectName,
                        company: values.company,
                        credits: values.credits,
                        startDate: values.startDate,
                        deadline: values.deadline,
                        description: values.description,
                      }
                    )
                    .then((res) => {
                      sessionStorage.setItem("projectUpdated", "1");
                      sessionStorage.setItem("projectId", project._id);
                      setOpenPopup(false);
                      navigate("/project/");
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
                    });
                }
              }}
            >
              <Form>
                <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                  {/* 1st row */}
                  <Grid item xs={12}>
                    <TextField name="projectName" label="Project Name" />
                  </Grid>

                  {/* 2nd row */}

                  <Grid item xs={6}>
                    <TextField name="company" label="Client" />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      name="credits"
                      label="Credit Points"
                      type="number"
                      rows
                    />
                  </Grid>

                  {/* Dates */}
                  <Grid item xs={6}>
                    <TextField
                      name="startDate"
                      type="date"
                      fullWidth
                      label="Start Date"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      name="deadline"
                      type="date"
                      fullWidth
                      label="Deadline"
                    />
                  </Grid>

                  {/* 3rd row */}

                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Project Description"
                      multiline
                      minRows={4}
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
        ))}
      </div>
    </Dialog>
  );
}
