import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "../../styles/search.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import TaskIcon from "@mui/icons-material/Task";
import GroupsIcon from "@mui/icons-material/Groups";
import EmptySearch from "../../images/emptySearch.png";
import "../../styles/dashboard.css";

export default function Search() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Projects
    axios
      .get("http://localhost:8070/project/getProjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // Tasks
    axios
      .get("http://localhost:8070/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //   Teams
    axios
      .get("http://localhost:8070/team/teams/relevant", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTeams(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setOpen]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Project filter
  const [filteredProjects, setfilteredProjects] = useState([]);
  const [showProj, setShowProj] = useState(false);

  const filterProjects = (data) => {
    const filtData = projects.filter((item) => {
      return item.projectName.toLowerCase().includes(data.toLowerCase());
    });

    if (filtData.length !== 0) {
      setShowProj(true);
    } else {
      setShowProj(false);
    }
    setfilteredProjects(filtData);
  };

  // Tasks filter
  const [filteredTasks, setfilteredTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);

  const filterTasks = (data) => {
    const filtData = tasks.filter((item) => {
      return item.taskName.toLowerCase().includes(data.toLowerCase());
    });
    if (filtData.length !== 0) {
      setShowTasks(true);
    } else {
      setShowTasks(false);
    }
    setfilteredTasks(filtData);
  };

  // Teams filter
  const [filteredTeams, setfilteredTeams] = useState([]);
  const [showTeams, setShowTeams] = useState(false);

  const filterTeams = (data) => {
    const filtData = teams.filter((item) => {
      return item.teamName.toLowerCase().includes(data.toLowerCase());
    });
    if (filtData.length !== 0) {
      setShowTeams(true);
    } else {
      setShowTeams(false);
    }
    setfilteredTeams(filtData);
  };

  return (
    <div>
      <Tooltip title="Search">
        <IconButton
          sx={{ color: "var(--blue)" }}
          size="medium"
          color="inherit"
          className="me-3"
          onClick={handleClickOpen}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ backdropFilter: "blur(2px)" }}
        PaperProps={{
          style: { borderRadius: 10, height: "75vh" },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <SearchIcon sx={{ color: "#008ffb" }} />
          <input
            type="text"
            placeholder="Search..."
            className="searchbar"
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
              filterProjects(e.target.value);
              filterTasks(e.target.value);
              filterTeams(e.target.value);
            }}
          />
          <IconButton
            onClick={() => {
              handleClose();
            }}
          >
            <FullscreenExitIcon sx={{ color: "red" }} />
          </IconButton>
        </DialogTitle>
        <Divider
          sx={{
            backgroundColor: "var(--dark)",
          }}
        />
        <DialogContent className="p-0">
          <DialogContentText id="alert-dialog-description">
            {/* PROJECTS */}
            {showProj && search !== "" && (
              <div>
                <p className="searchTopic mt-3">Projects</p>
                <MenuList className="p-3">
                  {filteredProjects.map((project) => (
                    <div>
                      <MenuItem
                        key={project._id}
                        className="listItem"
                        sx={{
                          position: "relative",
                          border: "1px solid white",
                          "&:hover": {
                            border: "1px solid #008ffb",
                            backgroundColor: "#f0f7ff",
                            color: "#008ffb",
                            borderRadius: "10px",
                          },
                        }}
                        onClick={() => {
                          handleClose();
                          navigate("/project/viewProject/" + project._id);
                        }}
                      >
                        <ListItemIcon>
                          <AccountTreeIcon
                            fontSize="small"
                            sx={{ color: "#9b9b9b" }}
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <p className="listText">{project.projectName}</p>
                          <p className="listSubText">{project.company}</p>
                        </ListItemText>
                        <Typography variant="body2" color="text.secondary">
                          <KeyboardArrowRightIcon />
                        </Typography>
                      </MenuItem>
                      <Divider
                        variant="middle"
                        sx={{
                          backgroundColor: "var(--gray)",
                        }}
                      />
                    </div>
                  ))}
                </MenuList>
              </div>
            )}

            {/* TASKS */}
            {showTasks && search !== "" && (
              <div>
                <p className="searchTopic">Tasks</p>
                <MenuList className="p-3">
                  {filteredTasks.map((task) => (
                    <div>
                      <MenuItem
                        className="listItem"
                        sx={{
                          border: "1px solid white",
                          "&:hover": {
                            border: "1px solid #008ffb",
                            backgroundColor: "#f0f7ff",
                            color: "#008ffb",
                            borderRadius: "10px",
                          },
                        }}
                        key={task._id}
                        onClick={() => {
                          handleClose();
                          navigate("/tasks/viewTask/" + task._id);
                        }}
                      >
                        <ListItemIcon>
                          <TaskIcon
                            fontSize="small"
                            sx={{ color: "#9b9b9b" }}
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <p className="listText">{task.taskName}</p>
                          <p className="listSubText">
                            {task.projectId.projectName}
                          </p>
                        </ListItemText>
                        <Typography variant="body2" color="text.secondary">
                          <KeyboardArrowRightIcon />
                        </Typography>
                      </MenuItem>
                      <Divider
                        variant="middle"
                        sx={{
                          backgroundColor: "var(--gray)",
                        }}
                      />
                    </div>
                  ))}
                </MenuList>
              </div>
            )}

            {/* Teams */}
            {showTeams && search !== "" && (
              <div>
                <p className="searchTopic">Teams</p>
                <MenuList className="p-3">
                  {filteredTeams.map((team) => (
                    <div>
                      <MenuItem
                        className="listItem"
                        sx={{
                          border: "1px solid white",
                          "&:hover": {
                            border: "1px solid #008ffb",
                            backgroundColor: "#f0f7ff",
                            color: "#008ffb",
                            borderRadius: "10px",
                          },
                        }}
                        key={team._id}
                        onClick={() => {
                          handleClose();
                          navigate("/teams/viewTeam/" + team._id);
                        }}
                      >
                        <ListItemIcon>
                          <GroupsIcon
                            fontSize="small"
                            sx={{ color: "#9b9b9b" }}
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <p className="listText">{team.teamName}</p>
                          <p className="listSubText">
                            {team.members?.length} members
                          </p>
                        </ListItemText>
                        <Typography variant="body2" color="text.secondary">
                          <KeyboardArrowRightIcon />
                        </Typography>
                      </MenuItem>
                      <Divider
                        variant="middle"
                        sx={{
                          backgroundColor: "var(--gray)",
                        }}
                      />
                    </div>
                  ))}
                </MenuList>
              </div>
            )}

            {showTeams && showProj && showTasks && search === "" && (
              <div
                style={{
                  height: "60vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p className="noProjMain m-0" style={{ fontSize: "1.2rem" }}>
                  <SearchIcon fontSize="large" /> Search your workspace.....
                </p>
              </div>
            )}

            {/* Empty Search */}
            {!showTeams && !showProj && !showTasks && search !== "" && (
              <div
                style={{
                  height: "60vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src={EmptySearch}
                    style={{ height: "150px" }}
                    alt="No Search"
                    className="noProjIcon"
                  />
                  <p className="noProjMain" style={{ fontSize: "1.2rem" }}>
                    No Results Found
                  </p>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
