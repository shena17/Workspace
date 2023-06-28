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
import moment from "moment";
import Button from "@mui/material/Button";
import "../../styles/dashboard.css";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import axios from "axios";
import DashboardCard from "../DispayComponents/DashboardCard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function LeavesManage() {
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
                status: "pending"
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

    //fetch leaveID for Accept
    const [feLID, setFeLID] = useState(null);

    async function leaveIdFetch(UID){
        const leavefetch = () =>{
        setFeLID(UID);
        }
        leavefetch();

        await axios
        .put(
            "http://localhost:8070/leaves/updateLeave/" +
            UID,
            {
            status: "approved",
            },
        )
        .then((res) =>{
            //navigate("/leaveManage/");
            window.location.reload(false);
        })
  }


  //fetch leaveID for Reject
  const [feLID2, setFeLID2] = useState(null);

  async function LeaveIdFetch2(UID){
    const leavefetch = () =>{
        setFeLID2(UID);
    }
    leavefetch();

    let x = [];
    //................
    await axios
    .get(
        "http://localhost:8070/leaves/getLeavesById/" +
        UID,
    )
    
    .then((res) =>{
        x = res.data;
        console.log(x);
      })
    
    //.............
    await axios
    .put(
        "http://localhost:8070/leaves/updateLeave/" +
        UID,
        {
          status: "rejected",
        },
    )
    
    .then((res) =>{
        //window.location.reload(false);
    })

    //............. 
    let userID = x.userId;
    console.log(x);
    await axios
      .put(
        "http://localhost:8070/user/updateUser/" +
        x.userId,
        {
          leaveDates: x.remainingLeaves + dateDiff(x.startDate,x.endDate),
        },
    )
    .then((res) =>{
        window.location.reload(false);
    })
  }
    
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
            <FiberManualRecordIcon style={{fill: '#FFC107'}}/>- Pending 
          </span>
          </Box>
          <div className="d-flex justify-content-end">
        
        {/*Add Leave button*/}
          <Button
            startIcon={<ClearAllIcon />}
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
              navigate("/LeaveAdminAccRejView");
            }}
          >
            Approved/Rejected Leaves
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
                {leaveRequest.status === "pending" ? (
                    <ButtonWrapper
                      onClick={() => {
                        leaveIdFetch(leaveRequest._id);
                      }}
                      style={{ marginBottom: "1px",  marginRight:"10px"}}
                      fullWidth={false}
                      startIcon={<OfflinePinIcon />}
                    >
                      Accept
                    </ButtonWrapper>
                  ) : (
                    <span></span>
                  )}
    
                  {leaveRequest.status === "pending" ? (
                    <ButtonWrapper
                      onClick={() => {
                        LeaveIdFetch2(leaveRequest._id);
                      }}
                      style={{ marginBottom: "1px"}}
                      fullWidth={false}
                      startIcon={<NotInterestedIcon />}
                    >
                      Reject
                    </ButtonWrapper>
                  ) : (
                    <span></span>
                  )}
                </div>
              </CardContent>
            </DashboardCard>
          ))}
        </>
      )
}