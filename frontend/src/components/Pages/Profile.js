import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "../../styles/dashboard.css";
import { Form, Formik } from "formik";
import axios from "axios";
import {
    Avatar,
    Box,
    CardContent,
    Typography
  } from '@mui/material';
import TextField from "../FormsUI/TextField";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UpdateEmployee from "../PageComponents/UpdateEmployee";
import UpdatePassword from "../PageComponents/UpdatePassword";
import ButtonWrapper from "../FormsUI/Button";
import jsPDF from 'jspdf';
import DashboardCard from "../DispayComponents/DashboardCard";



export default function Profile(){
  const token = localStorage.getItem("token");
  //user data array
  const [fetched, setfetched] = useState([]);

  //the popuo2
const [openPopup2, setOpenPopup2] = useState(false);
const [openPopup3, setOpenPopup3] = useState(false);
const [count, setCount] = useState(0)

//current logged in user's role
  const [curRole, setCurRole] = useState(' ');

function pop(){
    setOpenPopup2(true);
    
}

function pop2(){
    setOpenPopup3(true);
    
}


//Getting user details
useEffect(() => {
    axios
    .get(`http://localhost:8070/user/get`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) =>{
        setfetched(res.data);
    })
    .catch((err) =>{
      console.log(err);
    });
},[])




  
  const [id, setID] = useState(' ');
  const [fullName, setFullName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [username, setUsername] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [role, setRole] = useState(' ');
  const [dob, setDOB] = useState(' ');
  const [designation, setDesignation] = useState(' ');
  const [nic, setNIC] = useState(' ');
  const [etfNo, setetfNo] = useState(' ');
  const [epfNo, setepfNo] = useState(' ');
  const [address, setAddress] = useState(' ');
  const [contact, setContact] = useState(' ');
  const [leaveDates, setLeaveDates] = useState(' ');
  const [totCP, setTotCP] = useState(' ');
  const [grade, setGrade] = useState(' ');
  const [baseSalary, setBaseSalary] = useState(' ');

  const navigate = useNavigate();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

;
  
  useEffect(() => {
    // Update testuser state when fetched.username changes
    if(fetched, count < 5){
     if(fetched.etfNo == null){
        setetfNo("null");
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

     if(fetched.password == null){
        setPassword("");
     }else{
        setPassword("");
     }

     if(fetched.role == null){
        setRole("");
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

     setCount(count + 1);

    }
  }, [fetched]);

  //Download the user Details Report
  const downloadSingleLeaveReport = () => {
    const doc = new jsPDF();
    
    // Load logo image
    const logoImg = new Image();
    logoImg.src = require("../../images/logo.png");
  
    doc.setDrawColor(38, 48, 92); // Set border color to red
    doc.line(10, 10, doc.internal.pageSize.width - 10, 10); // Top border
    doc.setLineWidth(2);
    doc.line(10, 10, 200, 10);
    doc.line(10, 10, 10, doc.internal.pageSize.height - 10);
    doc.setLineWidth(2);
    doc.line(10, 10, 200, 10); // Left border
    doc.line(doc.internal.pageSize.width - 10, 10, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10); // Right border
    doc.setLineWidth(2);
    doc.line(10, 10, 200, 10);
    doc.line(10, doc.internal.pageSize.height - 10, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10); // Bottom border
  
    
    logoImg.onload = () => {
      // Set font size and color
      doc.setFontSize(20);
      doc.setTextColor("#26305c");
  
      // Add report title
      doc.text(username + "'s \n Profile details Report on " + formatDate(new Date()), 105, 70, "center");
      
      // Add logo image
      doc.addImage(logoImg, "PNG", 65, 25, 90, 20);
      
      // Add report content
      doc.setTextColor("#000000");
      doc.setFontSize(14);
      doc.text("User ID : " + id, 20, 100);
      doc.text("Full Name : " + fullName, 20, 110);
      doc.text("Email : " + email, 20, 120);
      doc.text("Username : " + username, 20, 130);
      doc.text("Role : " + role, 20, 140);
      doc.text("Date-Of-Birth : " + formatDate(dob), 20, 150);
      doc.text("Designation : " + designation, 20, 160);
      doc.text("NIC : " + nic, 20, 170);
      doc.text("etfNo : " + etfNo, 20, 180);
      doc.text("epfNo : " + epfNo, 20, 190);
      doc.text("Address : " + address, 20, 200);
      doc.text("Contact : " + contact, 20, 210);
      doc.text("Leave dates : " + leaveDates, 20, 220);
      doc.text("Credit Points : " + totCP, 20, 230);
      doc.text("Grade : " + grade, 20, 240);
      doc.text("Base Salary : " + baseSalary, 20, 250);
      
      // Save PDF file
      doc.save("ProfileSummery.pdf");
    };
  };
  
  // Helper function to format dates in YYYY-MM-DD format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  };

  return(
    <>
        <DashboardCard sx={{mb: 2}}>
                <CardContent>
                    <Box
                        sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                        }}
                    >
                        <Avatar
                        alt={fetched.username}
                        src={"/static/images/avatar/1.jpg"}
                        sx={{
                            height: 80,
                            mb: 2,
                            width: 80,
                            fontSize: 60
                        }}
                        />
                        <Typography
                        gutterBottom
                        variant="h5"
                        >
                        {fetched.username}
                        </Typography>

                        <Typography
                        color="text.secondary"
                        variant="body2"
                        >
                        {fetched.email}
                        </Typography>

                        <Typography
                        color="text.secondary"
                        variant="body2"
                        >
                        {fetched.designation}
                        </Typography>

                    </Box>
                </CardContent>
            </DashboardCard>

            <DashboardCard sx={{p:5}}>       
                <Formik
                    initialValues={{
                        fullName: fullName,
                        email: email,
                        username: username,
                        password: password,
                        role: role,
                        dob: dob, 
                        designation: designation,  
                        nic: nic,
                        etfNo: etfNo,
                        epfNo: epfNo,
                        address: address,
                        contact: contact,
                        leaveDates: leaveDates,
                        totCP: totCP,
                        grade: grade,
                        baseSalary: baseSalary,
                      }}  
                >
                    <Form>
                        <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                            {/* 1st row */}
                            <Grid item xs={6}>
                                <TextField
                                    type = "text"
                                    name="fullName"
                                    label="Full Name"
                                    value={fullName}
                                    
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="etfNo"
                                    label="etfNo"
                                    value={etfNo}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="epfNo"
                                    label="epfNo"
                                    value={epfNo}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={email}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="nic"
                                    label="NIC"
                                    value={nic}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="username"
                                    label="Username"
                                    value={username}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="password"
                                    type = "password"
                                    label="Password"
                                    value={password}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="designation"
                                    label="Designation"
                                    value={designation}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="role"
                                    label="Role"
                                    value={role}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="address"
                                    label="Address"
                                    value={address}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="dob"
                                    label="Date-of-Birth"
                                    value={dob}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="contact"
                                    label="Contact"
                                    value={contact}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="leaveDates"
                                    type = "number"
                                    label="Leave Dates"
                                    value={leaveDates}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="totCP"
                                    type = "number"
                                    label="Credit Points"
                                    value={totCP}
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField
                                    name="grade"
                                    type = "string"
                                    label="Grade"
                                    value={grade}
                                />
                            </Grid> 

                            <Grid item xs={6}>
                              {!(curRole === "employee" || curRole === "HR Manager" || curRole === "Project Manager" || curRole === "leader") && (
                                <TextField
                                    name="baseSalary"
                                    label="Base Salary"
                                    value={baseSalary}
                                />
                              )}
                            </Grid>
                            
                        </Grid>
                        <div className="d-flex justify-content-end" style={{ marginTop: "15px" }}>
                                <ButtonWrapper onClick={()=>{pop(true);}} style={{ marginBottom: "1px", marginRight: "10px"}} startIcon={<EditIcon />}>Edit  </ButtonWrapper>
                                <ButtonWrapper onClick={()=>{pop2(true);}} style={{ marginBottom: "1px", marginRight: "10px"}} startIcon={<EditIcon />}>Update Password  </ButtonWrapper>
                                <ButtonWrapper
                                        startIcon={<ArrowDownwardIcon />}
                                        variant="outlined"
                                        sx={{
                                        border: "1px solid var(--light-blue)",
                                        color: "var(--light-blue)",
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        "&:hover": {
                                            backgroundColor: "var(--light-blue)",
                                            color: "var(--white)",
                                            border: "1px solid var(--white)",
                                        },
                                        marginBottom: "25px",
                                        }}
                                        onClick={() => {
                                            downloadSingleLeaveReport();
                                        }}
                                >
                                        Download App/Rej Leaves Report
                                </ButtonWrapper>
                            </div>
                    </Form>

                </Formik>
            </DashboardCard>  
                <UpdateEmployee openPopup2={openPopup2} setOpenPopup2={setOpenPopup2} employeeDetails = {fetched}></UpdateEmployee>
                <UpdatePassword openPopup3={openPopup3} setOpenPopup3={setOpenPopup3} employeeDetails2 = {fetched}></UpdatePassword>

    </>
    
  )
}