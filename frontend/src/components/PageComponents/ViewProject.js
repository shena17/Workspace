import React, { useState, useEffect } from "react";
import "../../styles/viewComponent.css";
import ButtonWrapper from "../FormsUI/Button";
import EditIcon from "@mui/icons-material/Edit";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { CardContent, Grid } from "@mui/material";
import DashboardCard from "../DispayComponents/DashboardCard";
import GraphProject from "../DispayComponents/GraphProject";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useParams } from "react-router-dom";
import ProgressBar from "../DispayComponents/ProgressBar";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AvTimerRoundedIcon from "@mui/icons-material/AvTimerRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import Tasks from "../Pages/Tasks";
import ProjectTask from "../PageComponents/ProjectTask";
import Divider from "@mui/material/Divider";
import EditProject from "./EditProject";
import axios from "axios";
import SkeletonBars from "../FormsUI/SkeletonBars";
import Skeleton from "@mui/material/Skeleton";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SegmentIcon from "@mui/icons-material/Segment";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Notification from "../DispayComponents/Notification";
import ConfirmationBox from "../DispayComponents/ConfirmationBox";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GanttChart from "../DispayComponents/GanttChart";
import TaskViewTabbed from "./TaskViewTabbed";

// OPTIONS MENU START

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    backgroundColor: "var(--dashboard-bg)",
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "var(--gray) 0px 0px 10px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

// OPTIONS MENU END

export default function ViewProject() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const [details, setDetails] = useState([]);
  const [role, setRole] = useState("");

  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const { projectId } = useParams();
  const [count, setCount] = useState({});

  // DELETE PROJECT
  function deleteProject() {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    axios
      .delete("http://localhost:8070/project/deleteProject/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        sessionStorage.setItem("projectDeleted", "1");
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

  // COMPLETE PROJECT
  function setProjectStatus(status) {
    axios
      .put(
        "http://localhost:8070/project/updateCompletion/" + projectId,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Project " + status,
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

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8070/project/showProject/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setNotify({
          isOpen: true,
          message: err,
          type: "error",
        });
      });

    axios
      .get("http://localhost:8070/user/getRole", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:8070/project/homeData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCount(res.data);
        setLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // OPTIONS MENU START
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // OPTIONS MENU END

  return (
    <>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

      {/* CONFIRM DIALOG */}
      <ConfirmationBox
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <IconButton
              onClick={() => {
                navigate("/project");
              }}
              className="iconbtn"
            >
              <KeyboardBackspaceIcon />
            </IconButton>
            {loading ? (
              <Skeleton
                sx={{ width: "250px", height: "10px", marginTop: "15px" }}
              />
            ) : (
              <p className="projectTitle">
                {details.map((row) => row.projectName)}
              </p>
            )}
          </div>

          {/* OPTIONS MENU START */}
          {role === "leader" || role === "admin" ? (
            <div>
              <ButtonWrapper
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Options
              </ButtonWrapper>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setOpenPopup(true);
                  }}
                  disableRipple
                >
                  <EditIcon />
                  Edit Project
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setConfirmDialog({
                      isOpen: true,
                      type: "warning",
                      title: "Delete Project?",
                      subTitle:
                        "Do you really want to delete this project? This cannot be undone",
                      onConfirm: () => {
                        deleteProject();
                      },
                    });
                  }}
                  disableRipple
                  sx={{ color: "red" }}
                >
                  <DeleteIcon style={{ color: "red" }} />
                  Delete
                </MenuItem>
                <Divider
                  sx={{ my: 0.5 }}
                  variant="middle"
                  style={{
                    height: "1px",
                    backgroundColor: "var(--dark)",
                  }}
                />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setConfirmDialog({
                      isOpen: true,
                      type: "success",
                      title: "Start Project?",
                      subTitle:
                        "Start project instantly? This can be undone by editing the timeline",
                      onConfirm: () => {
                        setProjectStatus("Started");
                      },
                    });
                  }}
                  disableRipple
                >
                  <PlayArrowIcon />
                  Start Project
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setConfirmDialog({
                      isOpen: true,
                      type: "success",
                      title: "Complete Project?",
                      subTitle:
                        "The project status will be set to completed state.",
                      onConfirm: () => {
                        setProjectStatus("Completed");
                      },
                    });
                  }}
                  disableRipple
                >
                  <TaskAltIcon />
                  Finish Project
                </MenuItem>
              </StyledMenu>
            </div>
          ) : null}
          {/* OPTIONS MENU END */}
        </div>

        {loading ? (
          <Skeleton
            sx={{
              width: "400px",
              height: "10px",
              marginTop: "15px",
              marginLeft: "35px",
            }}
            animation="wave"
          />
        ) : (
          <div className="d-flex m-0 ms-4">
            {details.map((row) =>
              row.status === "Completed" ? (
                <p className="topDetails text-primary">
                  <BoltIcon fontSize="small" />
                  Completed project
                </p>
              ) : (
                <p className="topDetails text-success">
                  <BoltIcon fontSize="small" />
                  Active project
                </p>
              )
            )}
            <p className="topDetails">
              <PeopleIcon fontSize="small" className="me-1" />
              {details.map((row) => row.team.members?.length)} members
            </p>
            <p className="topDetails">
              <EventIcon fontSize="small" /> Created:{" "}
              <b>
                {details.map((row) =>
                  new Date(row.createdAt).toLocaleDateString()
                )}
              </b>
            </p>
          </div>
        )}
      </div>

      {/* BODY */}

      <Grid container spacing={4}>
        <Grid item md={7} sm={6} xl={8}>
          {loading ? (
            <SkeletonBars />
          ) : (
            <DashboardCard
              style={{
                height: "100%",
                display: "flex",
                width: "100%",
                alignItems: "center",
                padding: "0px",
              }}
            >
              <div className="w-100">
                {/* <CardContent style={{ width: "100%" }}> */}
                <p className="cardTopics ms-4">Project Burndown</p>
                {/* </CardContent> */}
                <GraphProject data={projectId} />
              </div>
            </DashboardCard>
          )}
        </Grid>
        {/* SIDE */}

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
            {loading ? (
              <SkeletonBars />
            ) : (
              <DashboardCard style={{ minHeight: "280px" }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {/* TIMELINE START */}
                      {details.map((row) => (
                        <div className="timeline d-flex">
                          <IconButton>
                            <DateRangeIcon />
                          </IconButton>
                          <p className="timelineText">
                            <p className="cardSubData">Start date</p>
                            {new Date(row.startDate).toDateString()}
                          </p>
                          <p className="me-3 ms-3">
                            <TrendingFlatIcon
                              className="mt-2"
                              fontSize="large"
                            />
                          </p>
                          <IconButton>
                            <DateRangeIcon />
                          </IconButton>
                          <p className="timelineText">
                            <p className="cardSubData">Due date</p>
                            {new Date(row.deadline).toDateString()}
                          </p>
                        </div>
                      ))}
                      {/* TIMELINE END */}
                    </Grid>

                    {/* OVERVIEW */}
                    {details.map((row) => (
                      <Grid item xs={12} className="pt-3 text-start">
                        <p className="cardSubData">
                          <SegmentIcon className="me-2" />
                          Project Overview
                        </p>
                        <p className="projDesc">{row.description}</p>
                      </Grid>
                    ))}
                    {/* OVERVIEW */}

                    {/* TEAM */}
                    {details.map((row) => (
                      <Grid item xs={12} className="d-flex pt-3">
                        <PeopleIcon className="me-2 cardSubData" />

                        <p className="timelineText">
                          <p className="cardSubData p-0 m-0">
                            {row.team.teamName}
                          </p>
                          <AvatarGroup
                            style={{ justifyContent: "start", display: "flex" }}
                            max={30}
                          >
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                            <Avatar
                              alt="Travis Howard"
                              src="/static/images/avatar/2.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                            <Avatar
                              alt="Agnes Walker"
                              src="/static/images/avatar/4.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                            <Avatar
                              alt="Trevor Henderson"
                              src="/static/images/avatar/5.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                            <Avatar
                              alt="Trevor Henderson"
                              src="/static/images/avatar/5.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                            <Avatar
                              alt="Trevor Henderson"
                              src="/static/images/avatar/5.jpg"
                              sx={{ width: 20, height: 20 }}
                            />
                          </AvatarGroup>
                        </p>
                      </Grid>
                    ))}
                    {/* TEAM */}

                    {details.map((row) => (
                      <Grid item xs={12} className="pt-0 mt-3">
                        <ProgressBar progress={row.progress} status={"Early"} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </DashboardCard>
            )}
          </Grid>

          <Grid item xs={12}>
            {loading ? null : (
              <Grid container item spacing={2}>
                <Grid item xs={4}>
                  <DashboardCard>
                    <CardContent>
                      <div className="d-flex flex-column align-items-start">
                        <CheckRoundedIcon
                          fontSize="large"
                          sx={{
                            backgroundColor: "#aff6de",
                            color: "#008000",
                            borderRadius: "50%",
                            padding: "8px",
                            marginBottom: "5px",
                          }}
                        />
                        <p className="perfCard">TASKS </p>
                        <p className="perfCard">COMPLETED</p>
                        <p className="countView">27</p>
                      </div>
                    </CardContent>
                  </DashboardCard>
                </Grid>
                <Grid item xs={4}>
                  <DashboardCard>
                    <CardContent>
                      <div className="d-flex flex-column align-items-start">
                        <AvTimerRoundedIcon
                          fontSize="large"
                          sx={{
                            backgroundColor: "#ccccff",
                            color: "#006999",
                            borderRadius: "50%",
                            padding: "8px",
                            marginBottom: "5px",
                          }}
                        />
                        <p className="perfCard">TASKS IN </p>
                        <p className="perfCard">PROGRESS</p>
                        <p className="countView">8</p>
                      </div>
                    </CardContent>
                  </DashboardCard>
                </Grid>
                <Grid item xs={4}>
                  <DashboardCard>
                    <CardContent>
                      <div className="d-flex flex-column align-items-start">
                        <HourglassEmptyRoundedIcon
                          fontSize="large"
                          sx={{
                            backgroundColor: "#ffd699",
                            color: "#e68a00",
                            borderRadius: "50%",
                            padding: "8px",
                            marginBottom: "5px",
                          }}
                        />
                        <p className="perfCard">TASKS IN </p>
                        <p className="perfCard">QUEUE</p>
                        <p className="countView">2</p>
                      </div>
                    </CardContent>
                  </DashboardCard>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid xs={12} item className="mt-5 ">
          {loading ? (
            <Skeleton />
          ) : (
            <DashboardCard className="pt-2">
              <TaskViewTabbed projectId={projectId} role={role} />
            </DashboardCard>
          )}
        </Grid>

        <Grid item xs={12} className="mt-5">
          {loading ? (
            <Skeleton />
          ) : (
            <DashboardCard>
              <CardContent>
                <p className="cardTopics projectTopics">Task Overview</p>
                <GanttChart projectId={projectId} />
              </CardContent>
            </DashboardCard>
          )}
        </Grid>
      </Grid>

      {details.map((detail) => (
        <EditProject
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          projectDetails={details}
        />
      ))}
    </>
  );
}
