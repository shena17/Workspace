import React, { useState, useEffect } from "react";
import "../../styles/viewComponent.css";
import "../../styles/taskView.css";
import axios from "axios";
import ButtonWrapper from "../FormsUI/Button";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import RestoreIcon from "@mui/icons-material/Restore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventIcon from "@mui/icons-material/Event";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { CardActionArea, CardContent, Grid, colors } from "@mui/material";
import DashboardCard from "../DispayComponents/DashboardCard";
import Graph from "../DispayComponents/Graph";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../DispayComponents/Notification";
import ConfirmationBox from "../DispayComponents/ConfirmationBox";
import EditTask from "./EditTask";

// date difference
const dateDifference = (d1, d2) => {
  // To set two dates to two variables
  var date1 = new Date(d1);
  var date2 = new Date(d2);

  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));

  if(Difference_In_Days>=0){
    return Difference_In_Days + " Days Remaing ";
  }else{
    return Math.abs(Difference_In_Days) + " Days Late ";
  }
  
};



export default function ViewTask() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [details,setDetails]=useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    title: "",
    subTitle: "",
  });
  

  //getting Task details
  useEffect(() => {
    axios
      .get("http://localhost:8070/tasks/viewTask/" + taskId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setDetails(res.data);
        // details.map((e)=>(console.log(e.workLeft)));
        //console.log(details[0].workLeft);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //--------user role start-----------

//Store the logged in user's role
  const [curRole, setCurRole] = useState(' ');

//Getting user role
useEffect(() => {
    axios
    .get(`http://localhost:8070/user/get`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) =>{
        setCurRole(res.data.role);
        console.log(res.data.role);
    })
    .catch((err) =>{
      console.log(err);
    });
},[])

//------------user role end--------------


  //delete Task
  function deleteTask(){
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    //insert the axois here
    axios.delete("http://localhost:8070/tasks/deleteTask/"+taskId,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>{
      sessionStorage.setItem("taskDeleted","1");
      navigate("/tasks");
    })
    .catch((err)=>{
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
    })
  }

  //update the task state and restart date(start/restart task)
  function setTaskStatus(isStarted,restartDate){

    axios.put("http://localhost:8070/tasks/setTaskState/" + taskId,{
      isStarted,
      restartDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
    .then((res)=>{
      setNotify({
        isOpen: true,
        message: "Task Started",
        type: "success",
      });
      setConfirmDialog({
        isOpen: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

  //update the task state and calculate the diff(pause)
  function pauseTask(isStarted,restartDate){
    var today=new Date();
    var resDate= new Date(restartDate);
    var timeDiff= (today.getHours() - resDate.getHours());
    var workLeft= details[0].workLeft - timeDiff; 


    //call axios and send the isStarted and diffInTime its an array

    axios.put("http://localhost:8070/tasks/pauseTask/" + taskId,{
      isStarted,
      workLeft,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    ).then((res)=>{
      setNotify({
        isOpen: true,
        message: "Task Paused",
        type: "success",
      });
      setConfirmDialog({
        isOpen: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

  //complete task

  function completeTask(dueDate,credits,assignee) {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    var stage="Completed";
    var completedDate=new Date().setHours(0,0,0,0);
    var dueDate=dueDate
    var credits=credits
    var userId=assignee
    //axios here
    axios.put("http://localhost:8070/tasks/completeTask/"+taskId,{
      stage,
      completedDate,
      dueDate,
      credits,
      userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    ).then((res) => {
      setNotify({
        isOpen: true,
        message: "Task " + stage,
        type: "success",
      });
      setConfirmDialog({
        isOpen: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

  //Request extention

  function requestExtention(taskName,assignee){
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    //axios here
    var isRequested=true;
    var taskName=taskName;
    var assignee=assignee;
    
    axios.put("http://localhost:8070/tasks/requestExtention/"+taskId,{
      isRequested,
      taskName,
      assignee,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    ).then((res) => {
      setNotify({
        isOpen: true,
        message: "Request Sent",
        type: "success",
      });
      setConfirmDialog({
        isOpen: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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


    const changeFontColor = (priority) => {
        if (priority === "Low") {
          return "#5cb85c";
        } else if (priority === "Medium") {
          return "#f0ad4e";
        } else if (priority === "High") {
          return "#d9534f";
        } else {
          return "transparent";
        }
      };

      
  return (
    <>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

      {/* CONFIRM DIALOG */}
      <ConfirmationBox
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      {details.map((row) => (
        <>
      {/* top bar */}
      <div className="mb-4">
        {/* row 1 */}
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <IconButton
                onClick={() => {
                    navigate(-1);
                }}
                className="iconbtn"
                >
                <KeyboardBackspaceIcon />
                </IconButton>
                <p className="projectTitle">{row.taskName}</p>
            </div>
            <div className="d-flex">
              {
                curRole==='employee'?null:
                <ButtonWrapper startIcon={<EditIcon />} onClick={() => {setOpenPopup(true);}} className="me-2">Edit</ButtonWrapper>
                }
              {
                curRole==='employee'?null:
              
              <Button startIcon={<DeleteIcon />} 
                    variant="outlined"
                    sx={{
                      borderRadius:"10px",
                      marginInline: "10px",
                      border: "1px solid var(--light-blue)",
                      color: "var(--light-blue)",
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        color: "red",
                        border: "1px solid red",
                      },
                    }}
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        type: "warning",
                        title: "Delete Task?",
                        subTitle:
                          "Do you really want to delete this Task? This cannot be undone",
                        onConfirm: () => {
                          deleteTask();
                        },
                      });
                    }}
                    >Delete</Button>
                  }  
            </div>
            
            
        </div>
        {/* row 2 */}
        <div className="d-flex">
          <p className="topDetails " style={{color: changeFontColor(row.priority)}}>
            <KeyboardDoubleArrowUpIcon fontSize="small" className="mb-1"/>
            {row.priority}Priority
          </p>
          
          <p className="topDetails">
            <AccountTreeIcon fontSize="small" />{row.projectId.projectName}
          </p>
          <p className="topDetails">
            <EventIcon fontSize="small" /> Assigned: <b>{new Date(row.createdAt).toLocaleDateString()}</b>
          </p>
        </div>
        {/* row 3 */}
        <div className="d-flex dateDiffBackground">
          {/* insert the date comparition here */}
          <div>
            <DateRangeIcon />
          </div>
          <div className="DateDiffDetails">
            {dateDifference(new Date(),new Date(row.dueDate))}
          </div>
          <div className="DateDiffDetails">
            <TrendingFlatIcon />
          </div>
          <div className="DateDiffDetails">
           {new Date(row.dueDate).toLocaleDateString()}
          </div>
          <div className="DateDiffDetails">
            Due
          </div>
        </div>
      </div>
      {/* bottom content */}
      <Grid container spacing={4}>
        <Grid item md={7} sm={6} xl={8}>
          <DashboardCard style={{ height: "100%" }}>
            <CardContent>
              <p className="cardTopics">Task Burndown</p>
              {/* insert graph here */}
              {/* {console.log(row.hrsWorked)} */}
              <Graph actualWork={row.hrsWorked} totalWork={row.totalWork} startDate={row.startDate} endDate={row.dueDate}/>
            </CardContent>
          </DashboardCard>
        </Grid>
        <Grid
          md={5}
          sm={6}
          xl={4}
          container
          item
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item xs={12}>
            <DashboardCard style={{ minHeight: "280px" }}>
              <CardContent>
                <p className="cardTopics">Task Description</p>
                <p className="taskDesc">
                  {row.description}
                </p>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12}>
            <DashboardCard style={{ height: "100%" }}>
              <CardContent sx={{ paddingBottom: "0px" }}>
                <p className="cardTopics mb-2">Actions</p>
                <Grid container item spacing={2}>
                  <Grid item xs={4}>
                    <DashboardCard>
                      <CardActionArea
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          type: "warning",
                          title: "Request Extention?",
                          subTitle:
                            "Do you really want to request extention for this task? This cannot be undone",
                          onConfirm: () => {
                            requestExtention(row.taskName,row.assignee);
                          },
                        });
                      }}
                      >
                        <CardContent>
                          <div className="d-flex flex-column">
                            <RestoreIcon
                              fontSize="large"
                              sx={{
                                backgroundColor: "#ffd699",
                                color: "#e68a00",
                                borderRadius: "50%",
                                padding: "8%",
                                marginBottom: "5px",
                              }}
                            />
                            <p className="perfCard">REQUEST</p>
                            <p className="perfCard">EXTENTION</p>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </DashboardCard>
                  </Grid>
                  <Grid item xs={4}>
                    <DashboardCard>
                      <CardActionArea 
                      onClick={()=>{
                        if(row.isStarted===false){
                          setTaskStatus(true,new Date());
                        }else{
                          pauseTask(false,row.restartDate);
                          
                        }
                        
                      }}
                      >
                        <CardContent>
                          <div className="d-flex flex-column">
                            <PlayArrowIcon
                              fontSize="large"
                              sx={{
                                backgroundColor: "#ccccff",
                                color: "#006999",
                                borderRadius: "50%",
                                padding: "8%",
                                marginBottom: "5px",
                              }}
                            />
                            <p className="perfCard">{row.isStarted?"PAUSE":"START"}</p>
                            <p className="perfCard">TASK</p>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </DashboardCard>
                  </Grid>
                  <Grid item xs={4}>
                    <DashboardCard>
                      <CardActionArea 
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          type: "success",
                          title: "Complete Task?",
                          subTitle:
                            "Do you really want to complete this Task? This cannot be undone",
                          onConfirm: () => {
                            completeTask(row.dueDate,row.credits,row.assignee);
                          },
                        });
                      }}
                      >
                        <CardContent>
                          <div className="d-flex flex-column">
                            <TaskAltIcon
                              fontSize="large"
                              sx={{
                                backgroundColor: "#ccffcc",
                                color: "#008000",
                                borderRadius: "50%",
                                padding: "8%",
                                marginBottom: "5px",
                              }}
                            />
                            <p className="perfCard">COMPLETE</p>
                            <p className="perfCard">TASK</p>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </DashboardCard>
                  </Grid>
                </Grid>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Grid>
      </>
      ))}
      {details.map((detail)=>(
        <EditTask openPopup={openPopup} 
        setOpenPopup={setOpenPopup}
         taskDetails={detail}/>
      ))}
    </>
  );
}
