import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { CardContent, Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import "../../styles/viewComponent.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import axios from "axios";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import SelectField from "../FormsUI/SelectField";
import DatePicker from "../FormsUI/DatePicker";
import StartDatePicker from "../FormsUI/StartDatePicker";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import ButtonWrapper from "../FormsUI/Button";
import Notification from "../DispayComponents/Notification";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DashboardCard from "../DispayComponents/DashboardCard";
import Avatar from "@mui/material/Avatar";
import PeopleIcon from "@mui/icons-material/People";
import AvatarGroup from "@mui/material/AvatarGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { CardActionArea } from "@mui/material";
import { Field } from "formik";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const steps = ["Enter details", "Assign a team"];

//function to check date

function checkDate(due, start) {
  var start = new Date(start);
  var due = new Date(due);

  if (due <= start) {
    return false;
  } else {
    return true;
  }
}

export default function AddProject(props) {
  const navigate = useNavigate();
  const { openPopup, setOpenPopup } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [activeStep, setActiveStep] = React.useState(0);

  const [data, setData] = useState({
    projectName: "",
    company: "",
    credits: "",
    team: "",
    deadline: "",
    startDate: "",
    description: "",
  });

  const handleNext = (formData) => {
    setData((prevActiveStep) => ({ ...prevActiveStep, ...formData }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (formData) => {
    setData((prevActiveStep) => ({ ...prevActiveStep, ...formData }));
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Dialog
      open={openPopup}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        style: { borderRadius: 10 },
      }}
    >
      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Create a Project</p>
            <ClearIcon
              onClick={() => {
                setOpenPopup(false);
                setActiveStep(0);
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
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} className="mt-2 mb-4 ps-5 pe-5 ">
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <React.Fragment>
            {activeStep === 0 ? (
              <StepOne next={handleNext} fields={data} />
            ) : (
              <StepTwo
                next={handleNext}
                prev={handleBack}
                close={handleClose}
                data={data}
              />
            )}
          </React.Fragment>
        </DialogContent>
      </div>
    </Dialog>
  );
}

const StepOne = (props) => {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // FORMIK
  const INITIAL_FORM_STATE = { ...props.fields };

  //YUP
  const FORM_VALIDATION = Yup.object().shape({
    projectName: Yup.string().required("Required!"),
    company: Yup.string().required("Required!"),
    credits: Yup.number().integer().required("Required!"),
    startDate: Yup.date().required("Required!"),
    deadline: Yup.date().required("Required!"),
    description: Yup.string().required("Required!"),
  });

  return (
    <>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={async (values) => {
          var validDate = checkDate(values.deadline, values.startDate);
          if (!validDate) {
            setNotify({
              isOpen: "true",
              message: "Due date must be a future date",
              type: "error",
            });
          } else {
            await axios
              .post(
                "http://localhost:8070/project/checkProject",
                {
                  projectName: values.projectName,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                props.next(values);
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

            {/* 3rd row */}

            <Grid item xs={6}>
              <StartDatePicker name="startDate" />
            </Grid>

            <Grid item xs={6}>
              <DatePicker name="deadline" />
            </Grid>

            {/* 4th row */}

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Project Description"
                multiline
                minRows={4}
                placeholder="In this project we should...."
              />
            </Grid>
            <div className="d-flex addProjectButtons">
              <SubmitButton endIcon={<NavigateNextIcon />}>Next</SubmitButton>
            </div>
          </Grid>
        </Form>
      </Formik>
    </>
  );
};

// Second Tab
const StepTwo = (props) => {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // FORMIK
  const INITIAL_FORM_STATE = {
    projectName: "",
    company: "",
    credits: "",
    deadline: "",
    startDate: "",
    description: "",
    team: "",
  };

  //YUP
  const FORM_VALIDATION = Yup.object().shape({
    projectName: Yup.string().required("Required!"),
    company: Yup.string().required("Required!"),
    credits: Yup.number().integer().required("Required!"),
    startDate: Yup.date().required("Required!"),
    deadline: Yup.date().required("Required!"),
    description: Yup.string().required("Required!"),
    // team: Yup.boolean().required("Required!"),
  });

  const [clicked, setClicked] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get("http://localhost:8070/team/teams/relevant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTeams(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }, []);

  return (
    <>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />
      <Formik
        initialValues={{ ...props.data }}
        validationSchema={FORM_VALIDATION}
        onSubmit={async (values) => {
          await axios
            .post(
              "http://localhost:8070/project/create",
              {
                projectName: values.projectName,
                company: values.company,
                credits: values.credits,
                team: clicked,
                deadline: values.deadline,
                startDate: values.startDate,
                description: values.description,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              props.close();
              sessionStorage.setItem("projectCreated", "1");
              navigate("/project/viewProject");
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
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "335px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <div className="teamView" style={{ height: "335px" }}>
              <Field
                as={RadioGroup}
                aria-labelledby="demo-radio-buttons-group-label"
                name="team"
              >
                <Grid
                  container
                  xs={12}
                  spacing={3}
                  sx={{ paddingLeft: "15px" }}
                >
                  {teams.map((team) => (
                    <Grid item xs={6}>
                      <DashboardCard
                        style={
                          clicked === team._id
                            ? { border: "2px solid var(--light-blue)" }
                            : null
                        }
                      >
                        <CardActionArea
                          onClick={() => {
                            setClicked(team._id);
                          }}
                        >
                          <CardContent>
                            <div className="d-flex justify-content-between ">
                              <p className="radioTitle">{team.teamName}</p>
                              <FormControlLabel
                                value={team._id}
                                control={<Radio />}
                                labelPlacement="start"
                                checked={clicked === team._id}
                              />
                            </div>
                            <div className="d-flex mt-2">
                              <PeopleIcon
                                className="me-2 radioBody"
                                fontSize="small"
                              />
                              <p className="timelineText">
                                <p className="radioBody">{team.TeamName}</p>
                                <AvatarGroup
                                  style={{
                                    justifyContent: "start",
                                    display: "flex",
                                  }}
                                  max={30}
                                >
                                  <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                  <Avatar
                                    alt="Travis Howard"
                                    src="/static/images/avatar/2.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                  <Avatar
                                    alt="Agnes Walker"
                                    src="/static/images/avatar/4.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                  <Avatar
                                    alt="Trevor Henderson"
                                    src="/static/images/avatar/5.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                  <Avatar
                                    alt="Trevor Henderson"
                                    src="/static/images/avatar/5.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                  <Avatar
                                    alt="Trevor Henderson"
                                    src="/static/images/avatar/5.jpg"
                                    sx={{ width: 18, height: 18 }}
                                  />
                                </AvatarGroup>
                              </p>
                            </div>
                          </CardContent>
                        </CardActionArea>
                      </DashboardCard>
                    </Grid>
                  ))}
                </Grid>
              </Field>
            </div>
          )}
          <div className="d-flex justify-content-between addProjectButtons  mt-3">
            <ButtonWrapper
              startIcon={<NavigateBeforeIcon />}
              onClick={() => {
                props.prev();
              }}
            >
              Back
            </ButtonWrapper>

            <SubmitButton startIcon={<AddIcon />}>Create</SubmitButton>
          </div>
        </Form>
      </Formik>
    </>
  );
};
