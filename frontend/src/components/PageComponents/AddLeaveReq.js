import React, { useState, useEffect } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {Form, Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import Notification from "../DispayComponents/Notification";
import SelectField from "../FormsUI/SelectField";
import StartDatePicker from "../FormsUI/StartDatePicker";
import EndDatePicker from "../FormsUI/EndDatePicker";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  // FORMIK
const INITIAL_FORM_STATE = {
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  };

  // YUP
const FORM_VALIDATION = Yup.object().shape({
    leaveType: Yup.string().required("Required!"),
    startDate: Yup.string().required("Required!"),
    endDate: Yup.string().required("Required!"),
    reason: Yup.string().required("Required!"),
  });




  //the Leave function
  export default function CreateLeave(props){

    const fetched = props.employeeDetails;


    const { openPopup, setOpenPopup } = props;
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

    //Date difference
  function dateDiff(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    
    var timeDiff = d2.getTime() - d1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    return diffDays;
  }


    async function updLeaveRemain(diffDays){
      const remains = fetched.leaveDates - diffDays;
      console.log(remains);

      await axios
        .put(
          "http://localhost:8070/user/updateUser/" +
          fetched.id,
          {
            leaveDates: remains,
          },
        ) 
    }
    

      

     return(
        <Dialog
            open={openPopup}
            maxWidth="sm"
            TransitionComponent={Transition}
            PaperProps={{
                style: { borderRadius: 10 },
            }}
        >
            <div className="popup">
            <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Apply for Leave</p>
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

                  await axios
                    .post(
                      "http://localhost:8070/leaves/requestLeave",
                      {
                        leaveType: values.leaveType,
                        username: fetched.username,
                        userId: fetched.id,
                        leaveDates: fetched.leaveDates,
                        reqdDate: Date(),
                        startDate: values.startDate,
                        endDate: values.endDate,
                        remainingLeaves: fetched.leaveDates - dateDiff(values.startDate,values.endDate),
                        reqDatesNo: dateDiff(values.startDate,values.endDate),
                        reason: values.reason,
                        status: "pending"
                      },
                      
                    )
                    .then((res) => {
                      sessionStorage.setItem("leaveCreated", "1");
                      setOpenPopup(false);
                      window.location.reload(false);
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

                      updLeaveRemain(dateDiff(values.startDate,values.endDate));
                }}
            >

                <Form>
                <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                        {/* 1st row */}
                        <Grid item xs={12}>
                          <SelectField
                              name="leaveType"
                              label="Leave Type"
                              options={{
                                Sick: "Sick",
                                Vacation: "Vacation",
                                Casual: "Casual",
                                Other: "Other"
                              }}
                          />
                        </Grid>
                        {/* 2st row */}
                        <Grid item xs={6}>
                            <StartDatePicker name="startDate"/>
                        </Grid>
                        <Grid item xs={6}>
                        <EndDatePicker name="endDate"/>
                        </Grid>
                        {/* 3st row */}
                        <Grid item xs={12}>
                            <TextField name="reason" label="Reason" multiline minRows={4} placeholder="Type here leave reason ..."/>
                        </Grid>
                        <div className="d-flex addProjectButtons">
                          <ButtonWrapper
                            startIcon={<ClearIcon />}
                            style={{ marginRight: "15px" }}
                          >
                            Clear
                          </ButtonWrapper>

                          <SubmitButton>Apply Leave</SubmitButton>
                        </div>
                      </Grid>
                </Form>
            </Formik>
        </DialogContent>
        </div>
        </Dialog>
     );
     
  }