import React, { useMemo } from "react";
import { Navigate, useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonWrapper from "../FormsUI/Button";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Divider, Grid } from "@mui/material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@mui/material';
import "..//..//images/logo.png";
import moment from "moment";
import "../../styles/dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import axios from "axios";
import DashboardCard from "../DispayComponents/DashboardCard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function LeaveAdminAccRejView() {
    const navigate = useNavigate();

    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

    const [fetchedLeaves, setFetchedLeaves] = useState([]);
    const [LID, setLID] = useState(null);
    const [onClickFetchedLeaves, setOnClickFetchedLeaves] = useState([]);

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
        
        }, [onClickFetchedLeaves]);

    //Getting Leave request details
    useEffect(() => {
        setTimeout(() => {
        axios
            .get("http://localhost:8070/leaves/getLeavesByStatus/",{
            params:{
                status: ["approved", "rejected"]
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

    //Approve/Reject leaves details report
    const downAppRejReport = () => {
        const unit = "pt";
        const size = "A3";
        const orientation = "landscape";
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        const title = "Approve/Reject Leaves Report";
        const headers = [
          [
            "Leave ID",
            "Username",
            "Leave Type",
            "Requested Date",
            "Start Date",
            "End Date",
            "Requested Leaves",
            "Reason",
            "Status",
          ],
        ];
        const documents = fetchedLeaves.map((doc) => [
          doc._id,
          doc.username,
          doc.leaveType,
          formatDate(doc.reqdDate),
          formatDate(doc.startDate),
          formatDate(doc.endDate),
          doc.reqDatesNo,
          splitReason(doc.reason),
          doc.status,
        ]);
      
        doc.setFontSize(20);
        doc.text(title, marginLeft, 40);
      
        // Load company logo
        const logoUrl = require("../../images/logo.png");
        let logo;
        fetch(logoUrl)
          .then((response) => response.blob())
          .then((blob) => {
            logo = URL.createObjectURL(blob);
      
            // Draw logo at top right corner with margin
            const imgWidth = 120;
            const imgHeight = 30;
            const imgMargin = doc.internal.pageSize.width - imgWidth - 40;
            doc.addImage(logo, "PNG", imgMargin, 10, imgWidth, imgHeight);

      
            // Set border color and width
            const borderColor = "#26305c";
            const borderWidth = 2;
      
            // Add border around the document
            doc.setLineWidth(borderWidth);
            doc.setDrawColor(borderColor);
            doc.rect(
              marginLeft - borderWidth,
              50 - borderWidth,
              doc.internal.pageSize.width - marginLeft * 2 + borderWidth * 2,
              doc.internal.pageSize.height - 100 + borderWidth * 2
            );
      
            // Add table content
            require("jspdf-autotable");
            doc.autoTable({
              head: headers,
              body: documents,
              startY: 70,
              theme: "grid",
              styles: { cellPadding: 5 },
              columnStyles: {
                Reason: { cellWidth: "auto" },
              },
            });
      
            // Save PDF
            doc.save("AccRejLeavesReport.pdf");
      
            // Revoke object URL created for the logo
            URL.revokeObjectURL(logo);
          });
      
        // Helper function to format date as "YYYY-MM-DD"
        function formatDate(dateString) {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      
        // Helper function to split reason text into lines to fit in the cell
        function splitReason(reasonText) {
          const maxLineLength = 50;
          const words = reasonText.split(" ");
          const lines = [];
          let currentLine = "";
      
          for (const word of words) {
            if (currentLine.length + word.length <= maxLineLength) {
              currentLine += word + " ";
            } else {
              lines.push(currentLine.trim());
              currentLine = word + " ";
            }
          }
      
          lines.push(currentLine.trim());
      
          return lines.join("\n");
        }
      };
      
    
    return(
        <>
          <div className="d-flex justify-content-start">
            
            {/*Add back button*/}
                    <IconButton
                        onClick={() => {
                            navigate(-1);
                        }}
                        className="iconbtn"
                        >
                        <KeyboardBackspaceIcon />
                    </IconButton>
            
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
            <span>Leave Requests</span>
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
            <FiberManualRecordIcon style={{fill: '#DC3545'}}/>- Rejected
          </span>
          </Box>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {/*download report button*/}
                <Button
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
                        downAppRejReport();
                    }}
                >
                    Download App/Rej Leaves Report
                </Button>
                
            </div>
    
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
                    {moment(leaveRequest.startDate).format('YYYY-MM-DD')}
                  </Typography>
                  <Typography mb>
                    <b>Leave Type : </b>
                    {leaveRequest.leaveType}
                  </Typography>
                  <Typography mb>
                    <b>End Date : </b>
                    {moment(leaveRequest.endDate).format('YYYY-MM-DD')}
                  </Typography>
                  <Typography mb textAlign={"start"}>
                    <b>Reason : </b>
                    {leaveRequest.reason}
                  </Typography>
                  <Typography mb>
                    <b>Remaining Leaves : </b>
                    {leaveRequest.remainingLeaves}
                  </Typography>
                  <Typography >
                    <b>Status : </b>
                    {leaveRequest.status}
                  </Typography>
                </Box>
              </CardContent>
              <CardContent>
                <Box></Box>
                <div className="d-flex addLeaveButtons float-end mb-4">

                </div>
              </CardContent>
            </DashboardCard>
          ))}
        </>
      )
}