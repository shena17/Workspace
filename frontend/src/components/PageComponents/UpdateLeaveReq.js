import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {Form, Formik } from "formik";
import axios from "axios";
import TextField from "../FormsUI/TextField";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import SyncIcon from "@mui/icons-material/Sync";
import Notification from "../DispayComponents/Notification";
import EditIcon from "@mui/icons-material/Edit";
import {MenuItem, Select } from "@mui/material";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });



//Update function
export default function UpdateLeaveReq(props){
  const fetched = props.leaveDetails;

  function dateDiff(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    
    var timeDiff = d2.getTime() - d1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    return diffDays;
  }
  
  const [id, setID] = useState(' ');
  const [leaveType, setLeaveType] = useState(' ');
  const [startDate, setStartDate] = useState(' ');
  const [endDate, setEndDate] = useState(' ');
  const [reason, setReason] = useState(' ');
  const [remainingLeaves, setRemainingLeaves] = useState(' ');
  const [leaveDates, setLeaveDates] = useState(' ');


  //select field options
  function handleChange(event) {
    setLeaveType(event.target.value);
  }

  
  function renderOptions() {
    const options = ["Sick", "Vacation", "Casual", "Other"];
    return options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ));
  }


  const { openPopup2, setOpenPopup2 } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  
  
  useEffect(() => {
    // Update user state when fetched changes
    if(fetched){
     if(fetched.leaveType == null){
        setLeaveType("");
     }else{
        setLeaveType(fetched.leaveType);
     }

     if(fetched.startDate == null){
        setStartDate("");
     }else{
        const date = new Date(fetched.startDate);
        const formattedDate = date.toISOString().split('T')[0];
        setStartDate(formattedDate);
     }

      if(fetched.leaveDates == null){
         setLeaveDates("");
      }else{
         setLeaveDates(fetched.leaveDates);
      }

      if(fetched.remainingLeaves == null){
        setRemainingLeaves("");
     }else{
        setRemainingLeaves(fetched.remainingLeaves);
     }

     if(fetched.endDate == null){
        setEndDate("");
     }else{
        const date = new Date(fetched.endDate);
        const formattedDate = date.toISOString().split('T')[0];
        setEndDate(formattedDate);
     }

     if(fetched.username == null){
        setReason("");
     }else{
        setReason(fetched.reason);
     }

     setID(fetched.id);

    }
  }, [fetched]);

  return(
    <Dialog
      open={openPopup2}
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
                    Update Leave
                    </p>
                    <ClearIcon
                    onClick={() => {
                        setOpenPopup2(false);
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
                    initialValues={{
                        leaveType: leaveType,
                        startDate: startDate,
                        endDate: endDate,
                        reason: reason, 
                      }}
                      
                      onSubmit={async (values) => {
                        if (
                          values.leaveType === leaveType &&
                          values.startDate === startDate &&
                          values.endDate === endDate &&
                          values.reason === reason
                          
                        ) {
                          setNotify({
                            isOpen: true,
                            message: "No changes made!",
                            type: "warning",
                          });
                        } else {
                          await axios
                            .put(
                              "http://localhost:8070/leaves/updateLeave/" +
                              fetched._id,
                              {
                                leaveType: leaveType,
                                startDate: startDate,
                                endDate: endDate,
                                reason: reason,
                                reqDatesNo: dateDiff(startDate,endDate),
                                remainingLeaves: leaveDates - dateDiff(startDate,endDate)
                              },
                            )
                            .then((res) => {
                              sessionStorage.setItem("employeeUpdated", "1");
                              sessionStorage.setItem("employeeId", id);
                              setOpenPopup2(false);
                              window.location.reload(false);
                              
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

                            await axios
                            .put(
                              "http://localhost:8070/user/updateUser/" +
                              fetched.userId,
                              {
                                leaveDates: leaveDates - dateDiff(startDate,endDate),
                              },
                            )
                        }
                      }}
                >
                    <Form>
                        <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                            <Grid item xs={12}>
                            <Select
                                labelId="Leave Type"
                                id="leaveType"
                                value={leaveType}
                                onChange={handleChange}
                                fullWidth
                                >
                                {renderOptions()}
                            </Select>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="startDate"
                                    label="Start date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="endDate"
                                    label="End date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="reason"
                                    label="reason"
                                    multiline minRows={4}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </Grid>



                            <div className="d-flex addProjectButtons">
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