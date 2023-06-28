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
//yup
const FORM_VALIDATION=Yup.object().shape({
    taskName:Yup.string().required("Required"),
    dueDate:Yup.date().required("Required"),
    priority:Yup.string().required("Required"),
    credits:Yup.number().integer().required("Required"),
    description:Yup.string().required("Required"),
});

export default function EditTask(props) {
    // AUTHENTICATION HEADER
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const { openPopup, setOpenPopup } = props;

    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

//get task details as props
const taskDetails=props.taskDetails;

  return (
    <Dialog 
        open={openPopup} 
        maxWidth="sm" 
        TransitionComponent={Transition}
    >
        {/* NOTIFICATION */}
        <Notification notify={notify} setNotify={setNotify} />

        <div className="popup">
            <DialogTitle>
            <div className="d-flex justify-content-between">
                <p className="popupTitle">Edit Task</p>
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
                    taskName:taskDetails.taskName,
                    dueDate:new Date(taskDetails.dueDate).toLocaleDateString("en-CA"),
                    priority:taskDetails.priority,
                    credits:taskDetails.credits,
                    description:taskDetails.description,
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={async (values) => {
                console.log(values);
                await axios.put("http://localhost:8070/tasks/updateTask/"+taskDetails._id,
                {
                    taskName:values.taskName,
                    dueDate:values.dueDate,
                    priority:values.priority,
                    credits:values.credits,
                    description:values.description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                }
                )
                .then((res)=>{
                    sessionStorage.setItem("TaskUpdated", "1");
                    sessionStorage.setItem("taskId", taskDetails._id);
                    setOpenPopup(false);
                    navigate("/tasks/");
                })
                .catch((err)=>{
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
                        <Grid container sx={{paddingTop:"10px"}} spacing={2}>
                            {/* 1st row */}
                            <Grid item xs={6}>
                                <TextField name="taskName" label="Task Name"/>
                            </Grid>
                            <Grid item xs={6}>
                            <TextField
                                name="dueDate"
                                type="date"
                                fullWidth
                                label="Due Date"
                            />
                            </Grid>
                            {/* 2nd row */}
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
                                <TextField
                                    name="credits"
                                    label="Credit Points"
                                    type="number"
                                    rows
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Task Description"
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
        </div>
        
    </Dialog>
      
  )
}
