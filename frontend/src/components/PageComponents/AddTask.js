import React, { useState, useEffect } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
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
import DatePicker from "../FormsUI/DatePicker";
import StartDatePicker from "../FormsUI/StartDatePicker";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import Toast from "../FormsUI/Toast";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Notification from "../DispayComponents/Notification";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  taskName: "",
  startDate:"",
  dueDate: "",
  stage: "",
  priority: "",
  credits: "",
  description: "",
  assignee: "",
  nextAssignee: "",
};

// YUP
const FORM_VALIDATION = Yup.object().shape({
  taskName: Yup.string().required("Required!"),
  startDate: Yup.date().required("Required!"),
  dueDate: Yup.date().required("Required!"),
  stage: Yup.string().required("Required!"),
  priority: Yup.string().required("Required!"),
  credits: Yup.number().integer().required("Required!"),
  description: Yup.string().required("Required!"),
  assignee: Yup.string().required("Required!"),
});

//function to get the date difference for workdone

function dateDiff(date1,date2){
  var d1=new Date(date1);
  var d2=new Date(date2);

  const oneDay = 1000 * 60 * 60 * 24;
  var timeDiff=d2.getTime()-d1.getTime()
  var diff=timeDiff/oneDay;
  diff=diff*7;
  console.log(diff);
  return diff;
}

//function to check date 

function checkDate(due){
  var today=new Date()
  var due=new Date(due)

  if(due<=today){
    return false
  }else{
    return true
  }
}

//navigate back to the project view

export default function AddProject(props) {
  const navigate = useNavigate();
  const { openPopup, setOpenPopup } = props;

  var projectId = props.projectId;

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // // AUTHENTICATION HEADER
  // const token = localStorage.getItem("token");

  //get the project id and request for project team details

  const [projectEmp, setProjectEmp] = useState([]);

  const [users, setUsers] = useState([]);

  // TOAST
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("error");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8070/tasks/getEmp/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setProjectEmp(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <Dialog open={openPopup} maxWidth="sm" TransitionComponent={Transition}>
      {/* ERROR MSG START*/}
      <Toast open={alert} onClose={handleClose} type={type} message={msg} />
      {/* ERROR MSG END*/}

      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Add Task</p>
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
              console.log(values);
              var workLeft=dateDiff(values.startDate,values.dueDate);
              var validDate=checkDate(values.dueDate)
              if(workLeft<0){
                setNotify({
                  isOpen: "true",
                  message: "Due date must be ahead of start date",
                  type: "error",
                });
              }else if (!validDate) {
                setNotify({
                  isOpen: "true",
                  message: "Due date must be a future date",
                  type: "error",
                });
              } else {
                await axios
                .post(
                  "http://localhost:8070/tasks/create",
                  {
                    taskName: values.taskName,
                    startDate:values.startDate,
                    dueDate: values.dueDate,
                    stage: values.stage,
                    priority: values.priority,
                    credits: values.credits,
                    description: values.description,
                    assignee: values.assignee,
                    // nextAssignee: values.nextAssignee,
                    projectId: projectId,
                    workLeft: workLeft,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((res) => {
                  sessionStorage.setItem("taskCreated", "1");
                  setOpenPopup(false);
                  navigate("/project");
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
                  <TextField name="taskName" label="Task Name" />
                </Grid>

                {/* 2nd row */}

                <Grid item xs={6}>
                  <StartDatePicker name="startDate" />
                </Grid>

                <Grid item xs={6}>
                  <DatePicker name="dueDate" />
                </Grid>

                

                {/* 3rd row */}

                <Grid item xs={4}>
                  <SelectField
                    name="stage"
                    label="Status"
                    options={{
                      NotStarted: "Not Started",
                      Started: "Started",
                      InProgress: "In Progress",
                      Completed: "Completed",
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <SelectField
                    name="priority"
                    label="Priority"
                    options={{
                      Low: "Low",
                      Medium: "Medium",
                      High: "High",
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    name="credits"
                    label="Credit Points"
                    type="number"
                    rows
                  />
                </Grid>

                {/* 4th row */}

                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Task Description"
                    multiline
                    minRows={4}
                    placeholder="In this Task you should...."
                  />
                </Grid>

                {/* 5th row */}

                <Grid item xs={12}>
                  <div className="from-group mb-3">
                    <label for="addMembers" className="text">
                      Add Asignee
                    </label>
                    <Field
                      as={RadioGroup}
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="assignee"
                    >
                      {projectEmp.map((user) => (
                        <div className="d-flex">
                          <Avatar
                            alt={user.fullName}
                            src="/static/images/avatar/1.jpg"
                            sx={{
                              width: 24,
                              height: 24,
                              marginRight: 2,
                              marginTop: 1,
                            }}
                          />
                          <FormControlLabel
                            value={user._id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                            control={<Radio />}
                            label={user.fullName}
                            labelPlacement="start"
                          />
                        </div>
                      ))}
                    </Field>
                  </div>
                </Grid>

                {/* 6th row */}

                {/* <Grid item xs={12}>
                  <div className="from-group mb-3">
                    <label for="addMembers" className="text">
                      Add Next Asignee
                    </label>
                    <Field
                      as={RadioGroup}
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="nextAssignee"
                    >
                      {projectEmp.map((user) =>
                        user.designation === "QA" ? (
                          <div className="d-flex">
                            <Avatar
                              alt={user.fullName}
                              src="/static/images/avatar/1.jpg"
                              sx={{
                                width: 24,
                                height: 24,
                                marginRight: 2,
                                marginTop: 1,
                              }}
                            />
                            <FormControlLabel
                              value={user._id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                              control={<Radio />}
                              label={user.fullName}
                              labelPlacement="start"
                            />
                          </div>
                        ) : (
                          ""
                        )
                      )}
                    </Field>
                  </div>
                </Grid> */}

                <div className="d-flex addProjectButtons">
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

                  <SubmitButton startIcon={<AddIcon />}>Create</SubmitButton>
                </div>
              </Grid>
            </Form>
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}
