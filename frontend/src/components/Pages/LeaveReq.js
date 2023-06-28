import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import "..//..//images/logo.png";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ButtonWrapper from "../FormsUI/Button";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Divider } from "@mui/material";
import {
  Box,
  CardContent,
  Typography
} from '@mui/material';
import moment from "moment";
import "../../styles/dashboard.css";
import axios from "axios";
import jsPDF from 'jspdf';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DashboardCard from "../DispayComponents/DashboardCard";
import CreateLeave from "../PageComponents/AddLeaveReq";
import UpdateLeaveReq from "../PageComponents/UpdateLeaveReq";
import DeleteLeaveReq from "../PageComponents/DeleteLeaveReq";

export default function LeaveReq() {



  //The popup
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const token = localStorage.getItem("token");

  //user data array
  const [fetched, setfetched] = useState([]);
  const [fetchedLeaves, setFetchedLeaves] = useState([]);
  const [LID, setLID] = useState(null);
  const [onClickFetchedLeaves, setOnClickFetchedLeaves] = useState([]);

  function pop(ID){
    setOpenPopup2(true);
    const Extract = () => {
      setLID(ID);
    }
    Extract();
    console.log(LID);

    
  }

  //Date difference
  function dateDiff(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    
    var timeDiff = d2.getTime() - d1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    return diffDays;
  }

  const getLeaveById = (_id) => {
    return fetchedLeaves.find(leave => leave._id === _id);
  }

//filter exct array for each
useEffect(() => {
    const leave = getLeaveById(LID);
    setOnClickFetchedLeaves(leave);
  
}, [pop]);



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
        console.log(fetched);
    })
    .catch((err) =>{
      console.log(err);
    });
  },[]) 

  //Getting Leave request details
  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8070/leaves/getLeaves",{
          params:{
            username: "Dananjayahbi119"
          }
        })
        .then((res) => {
          setFetchedLeaves(res.data);
          console.log(fetchedLeaves);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }, []);
  
  //Get leave Details for Single leave report
  function getsingleLeaveReportDetails(ID){
    axios
        .get(`http://localhost:8070/leaves/getsingleLeaveReport/${ID}`,{
          
        })
        .then((res) => {
          downloadSingleLeaveReport(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  //fetch leaveID for delete
  const [feLID, setFeLID] = useState(null);

  function leaveIdFetch(UID){
    const leavefetch = () =>{
     setFeLID(UID);
    }
    leavefetch();
    handleClickOpen();
  }
  //POPUP FOR DELETE
  const [openn, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose2 = () => {
    setOpen(false);
  };


  async function handleDelete(ID){
    console.log(fetched.leaveDates);
    let remains = 0;

    await axios
        .get(
          "http://localhost:8070/leaves/getLeavesById/" +
          ID,
          {
           
          },
        )
        .then((res) => {
          console.log(res)
          remains = fetched.leaveDates + dateDiff(res.data.startDate,res.data.endDate)
        })
        .catch((err) => {
          console.log(err);
        });

    
    
    console.log(remains);
    DeleteLeaveReq(ID);

    await axios
      .put(
        "http://localhost:8070/user/updateUser/" +
        fetched.id,
        {
          leaveDates: remains,
        },
      ) 
  }
  

//download the single leave request details report.......
const downloadSingleLeaveReport = (detail) => {
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
    doc.text(detail[0].username + "'s Leave Request \n Report requested on " + formatDate(detail[0].requestedDate), 105, 70, "center");
    
    // Add logo image
    doc.addImage(logoImg, "PNG", 65, 25, 90, 20);
    
    // Add report content
    doc.setTextColor("#000000");
    doc.setFontSize(14);
    doc.text("Leave ID : " + detail[0].leaveID, 20, 100);
    doc.text("Username : " + detail[0].username, 20, 110);
    doc.text("Leave Type : " + detail[0].leaveType, 20, 120);
    doc.text("Requested Date : " + formatDate(detail[0].requestedDate), 20, 130);
    doc.text("Start Date : " + formatDate(detail[0].startDate), 20, 140);
    doc.text("End Date : " + formatDate(detail[0].endDate), 20, 150);
    doc.text("Requested Leaves : " + detail[0].requestedLeaves, 20, 160);
    doc.text("Reason : " + detail[0].reason, 20, 170);
    doc.text("Status : " + detail[0].status, 20, 180);
    doc.text("(Digital signature)",150,205);
    doc.text("........................................",140,210);
    doc.text("Signature",158,220);
    
    // Save PDF file
    doc.save("SingleLeaveReport.pdf");
  };
};

// Helper function to format dates in YYYY-MM-DD format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};
//download the single leave request details report.......(end)
  

  return(
    <>
      <div className="d-flex justify-content-end">
        
        {/*Add Leave button*/}
        {fetched.leaveDates != 0 ?(
          <Button
            startIcon={<AddIcon />}
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
              setOpenPopup(true); // open the popup
            }}
          >
            Apply Leave
          </Button>
        ):(
          <span>All leaves used !</span>
        )}
        
      </div>

      <div></div>

      <Box
        sx={{
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          fontWeight:600,
          fontSize:28
          }}
      >
        <span>Leave request history</span>
      </Box>
      <Box
        sx={{
          alignItems: 'start',
          display: 'flex',
          flexDirection: 'column',
          mb:2,
          fontSize:13
          }}
      >
      <span>
        <FiberManualRecordIcon style={{fill: '#198754'}}/>- Approved 
        <FiberManualRecordIcon style={{fill: '#FFC107'}}/>- Pending 
        <FiberManualRecordIcon style={{fill: '#DC3545'}}/>- Rejected
      </span>
      </Box>
      <Box
        sx={{
          alignItems: 'end',
          display: 'flex',
          flexDirection: 'column',
          fontWeight:600,
          fontSize:16
          }}
      >
        <span>You have {fetched.leaveDates} leaves left</span>
      </Box>

      {/*start loop from here*/}
      {fetchedLeaves.reverse().map((leaveRequest) => (
        <DashboardCard sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                alignItems: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>
                {leaveRequest.status === "approved" ? (
                  <FiberManualRecordIcon style={{ fill: "#198754" }} />
                ):leaveRequest.status === "pending" ?(
                  <FiberManualRecordIcon style={{ fill: "#FFC107" }} />
                ):leaveRequest.status === "rejected" ?(
                  <FiberManualRecordIcon style={{ fill: "#DC3545" }} />
                ):(
                  <span></span>
                )}
                {leaveRequest.username}
              </span>
            </Box>
            <Divider
              sx={{
                height: "1px",
                backgroundColor: "var(--dark)",
                marginTop: "10px",
                mb: 3,
              }}
            />
            <Box
              sx={{
                alignItems: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography mb>
                <b>Requested Date : </b>
                {moment(leaveRequest.reqdDate).format('YYYY-MM-DD')}
              </Typography>
              <Typography mb>
                <b>Leave Type : </b>
                {leaveRequest.leaveType}
              </Typography>
              <Typography mb>
                <b>Start Date : </b>
                {moment(leaveRequest.startDate).format('YYYY-MM-DD')}
              </Typography>
              <Typography mb>
                <b>End Date : </b>
                {moment(leaveRequest.endDate).format('YYYY-MM-DD')}
              </Typography>
              <Typography mb>
                <b>Requested Leaves : </b>
                {dateDiff(leaveRequest.startDate,leaveRequest.endDate)}
              </Typography>
              <Typography mb textAlign={"start"}>
                <b>Reason : </b>
                {leaveRequest.reason}
              </Typography>
              <Typography mb>
                <b>Remaining Leaves : </b>
                {leaveRequest.remainingLeaves}
              </Typography>
              <Typography>
                <b>Status : </b>
                {leaveRequest.status}
              </Typography>
            </Box>
          </CardContent>
          <CardContent>
            <Box></Box>
            <div className="d-flex addLeaveButtons float-end mb-4">
            {leaveRequest.status === "pending" ?(
                <ButtonWrapper
                  onClick={() => {
                    leaveIdFetch(leaveRequest._id);
                  }}
                  style={{ marginBottom: "1px",  marginRight:"10px"}}
                  fullWidth={false}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </ButtonWrapper>
              ) : (
                <span></span>
              )}

              {leaveRequest.status === "pending" ? (
                <ButtonWrapper
                  onClick={() => {
                    pop(leaveRequest._id);
                  }}
                  style={{ marginBottom: "1px", marginRight:"10px" }}
                  fullWidth={false}
                  startIcon={<EditIcon />}
                >
                  Edit
                </ButtonWrapper>
              ) : (
                <span></span>
              )}

              {leaveRequest.status === "approved" || leaveRequest.status === "rejected" ? (
                <ButtonWrapper
                  onClick={() => {
                    getsingleLeaveReportDetails(leaveRequest._id);
                  }}
                  style={{ marginBottom: "1px" }}
                  fullWidth={false}
                  startIcon={<ArrowDownwardIcon />}
                >
                  Download Report
                </ButtonWrapper>
              ) : (
                <span></span>
              )}
            </div>
          </CardContent>
        </DashboardCard>
      ))}

      <Dialog
                          fullScreen={fullScreen}
                          open={openn}
                          onClose={handleClose2}
                          aria-labelledby="responsive-dialog-title"
                        >
                          <DialogTitle id="responsive-dialog-title">
                            {"Do you want to delete the Leave request ?"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              This will cancel and delete the leave request.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <ButtonWrapper autoFocus onClick={()=>{handleClose2();}}>
                              CANCEL
                            </ButtonWrapper>
                            <ButtonWrapper onClick={()=>{handleDelete(feLID);}} autoFocus>
                              DELETE
                            </ButtonWrapper>
                          </DialogActions>
      </Dialog>


      <CreateLeave openPopup={openPopup} setOpenPopup={setOpenPopup} employeeDetails = {fetched}></CreateLeave>
      <UpdateLeaveReq openPopup2={openPopup2} setOpenPopup2={setOpenPopup2} leaveDetails = {onClickFetchedLeaves}></UpdateLeaveReq>

    </>
  )
}
