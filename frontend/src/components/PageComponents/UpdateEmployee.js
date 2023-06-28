import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useFormik, Form, Formik, validateYupSchema } from "formik";
import axios from "axios";
import * as Yup from "yup";
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
export default function UpdateEmployee(props){
  const fetched = props.employeeDetails;
  const token = localStorage.getItem("token");
  
  const [id, setID] = useState(' ');
  const [fullName, setFullName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [username, setUsername] = useState(' ');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(' ');
  const [dob, setDOB] = useState(' ');
  const [designation, setDesignation] = useState(' ');
  const [nic, setNIC] = useState(' ');
  const [etfNo, setetfNo] = useState(' ');
  const [epfNo, setepfNo] = useState(' ');
  const [address, setAddress] = useState(' ');
  const [contact, setContact] = useState(' ');
  const [leaveDates, setLeaveDates] = useState(' ');
  const [totCP, setTotCP,] = useState(' ');
  const [grade, setGrade] = useState(' ');
  const [baseSalary, setBaseSalary] = useState(' ');

  //current logged in user's role
  const [curRole, setCurRole] = useState(' ');
  useEffect(() => {
    axios
    .get(`http://localhost:8070/user/get`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) =>{
        setCurRole(res.data.role);
    })
    .catch((err) =>{
      console.log(err);
    });
},[])


//select field options
  function handleChange(event) {
    setRole(event.target.value);
  }

  
  function renderOptions() {
    const options = ["Project Manager", "leader", "HR Manager", "Finance Manager", "employee"];
    return options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ));
  }
//select field options(end)

  const navigate = useNavigate();
  const { openPopup2, setOpenPopup2 } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  
  
  useEffect(() => {
    // Update testuser state when fetched changes
    if(fetched){
     if(fetched.etfNo == null){
        setetfNo("");
     }else{
        setetfNo(fetched.etfNo);
     }

     if(fetched.fullName == null){
        setFullName("");
     }else{
        setFullName(fetched.fullName);
     }

     if(fetched.email == null){
        setEmail("");
     }else{
        setEmail(fetched.email);
     }

     if(fetched.username == null){
        setUsername("");
     }else{
        setUsername(fetched.username);
     }

     if(fetched.role == null){
        setRole("t");
     }else{
        setRole(fetched.role);
     }

     if(fetched.dob == null){
        setDOB("");
     }else{
        const date = new Date(fetched.dob);
        const formattedDate = date.toISOString().split('T')[0];
        setDOB(formattedDate);
     }

     if(fetched.designation == null){
        setDesignation("");
     }else{
        setDesignation(fetched.designation);
     }

     if(fetched.nic == null){
        setNIC("");
     }else{
        setNIC(fetched.nic);
     }

     if(fetched.epfNo == null){
        setepfNo("");
     }else{
        setepfNo(fetched.epfNo);
     }

     if(fetched.address == null){
        setAddress("");
     }else{
        setAddress(fetched.address);
     }

     if(fetched.contact == null){
        setContact("");
     }else{
        setContact(fetched.contact);
     }

     if(fetched.leaveDates == null){
        setLeaveDates("");
     }else{
        setLeaveDates(fetched.leaveDates);
     }

     if(fetched.totCP == null){
        setTotCP("");
     }else{
        setTotCP(fetched.totCP);
     }

     if(fetched.grade == null){
        setGrade("");
     }else{
        setGrade(fetched.grade);
     }

     if(fetched.baseSalary == null){
        setBaseSalary("");
     }else{
        setBaseSalary(fetched.baseSalary);
     }

     setID(fetched.id);

    }
  }, [fetched]);

  return(
    <Dialog
      open={openPopup2}
      maxWidth="lg"
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
                    Update Employee
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
                        fullName: fullName,
                        email: email,
                        username: username,
                        role: role,
                        dob: dob, 
                        designation: designation,  
                        nic: nic,
                        etfNo: etfNo,
                        epfNo: epfNo,
                        address: address,
                        contact: contact,
                        totCP:totCP,
                        grade:grade,
                        leaveDates: leaveDates,
                        baseSalary: baseSalary,
                      }}

                      onSubmit={async (values) => {
                        if (
                          values.fullName === fullName &&
                          values.email === email &&
                          values.username === username &&
                          values.role === role &&
                          values.dob === dob &&
                          values.designation === designation &&
                          values.nic === nic &&
                          values.etfNo === etfNo &&
                          values.epfNo === epfNo &&
                          values.address === address &&
                          values.contact === contact &&
                          values.leaveDates === leaveDates &&
                          values.baseSalary === baseSalary
                        ) {
                          setNotify({
                            isOpen: true,
                            message: "No changes made!",
                            type: "warning",
                          });
                        } else {
                          await axios
                            .put(
                              "http://localhost:8070/user/updateUser/" +
                              fetched.id,
                              {
                                fullName: fullName,
                                email: email,
                                username: username,
                                role: role,
                                dob: dob, 
                                designation: designation,  
                                nic: nic,
                                etfNo: etfNo,
                                epfNo: epfNo,
                                address: address,
                                contact: contact,
                                leaveDates: leaveDates,
                                baseSalary: baseSalary,
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
                        }
                      }}
                >
                    <Form>
                        <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    type = "text"
                                    name="fullName"
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="etfNo"
                                    label="etfNo"
                                    value={etfNo}
                                    onChange={(e) => setetfNo(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="epfNo"
                                    label="epfNo"
                                    value={epfNo}
                                    onChange={(e) => setepfNo(e.target.value)}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="username"
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="address"
                                    label="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="password"
                                    type = "password"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="nic"
                                    label="NIC"
                                    value={nic}
                                    onChange={(e) => setNIC(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="contact"
                                    label="Contact"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </Grid>


                            <Grid item xs={6}>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={role}
                                onChange={handleChange}
                                fullWidth
                                disabled={curRole === "employee" || curRole === "Finance Manager" || curRole === "Project Manager" || curRole === "leader"}
                                >
                                {renderOptions()}
                            </Select>
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="leaveDates"
                                    type = "number"
                                    label="Leave Dates"
                                    value={leaveDates}
                                    onChange={(e) => setLeaveDates(e.target.value)}
                                    disabled={curRole === "employee" || curRole === "Finance Manager" || curRole === "Project Manager" || curRole === "leader"}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="dob"
                                    label="Date-of-Birth"
                                    value={dob}
                                    onChange={(e) => setDOB(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="totCP"
                                    type = "number"
                                    label="Credit Points"
                                    value={totCP}
                                    onChange={(e) => setTotCP(e.target.value)}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="grade"
                                    type = "string"
                                    label="Grade"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    disabled
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    name="designation"
                                    label="Designation"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    disabled={curRole === "employee" || curRole === "Finance Manager" || curRole === "Project Manager" || curRole === "leader"}
                                />
                            </Grid>

                            <Grid item xs={6}>
                              {!(curRole === "employee" || curRole === "HR Manager" || curRole === "Project Manager" || curRole === "leader") && (
                                <TextField
                                    name="baseSalary"
                                    type="number"
                                    label="Base Salary"
                                    value={baseSalary}
                                    onChange={(e) => setBaseSalary(e.target.value)}
                                    disabled={curRole === "employee" || curRole === "HR Manager" || curRole === "Project Manager" || curRole === "leader"}
                                />
                              )}
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