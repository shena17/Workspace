import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import drawerLogo from "../images/drawerLogo.png";
import logoIcon from "../images/logo-icon.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import axios from "axios";
import TaskIcon from "@mui/icons-material/Task";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Home from "./Pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  NavLink,
} from "react-router-dom";
import Project from "./Pages/Project";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Tasks from "./Pages/Tasks";
import LeaveReq from "./Pages/LeaveReq";
import Chat from "./Pages/Chat";
import Documents from "./Pages/Documents";
import Teams from "./Pages/Teams";
import Meetings from "./Pages/Meetings";
import ToDo from "./Pages/ToDo";
import LeaveAdminAccRejView from "./Pages/LeaveAdminAccRejView";
import ChatIcon from "@mui/icons-material/Chat";
import GroupsIcon from "@mui/icons-material/Groups";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Finances from "./Pages/Finances";
import Employees from "./Pages/Employees";
import AddTask from "./PageComponents/AddTask";
import AddProject from "./PageComponents/AddProject";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ViewProject from "./PageComponents/ViewProject";
import CreateTeam from "./PageComponents/CreateTeam";
import ViewTask from "./PageComponents/ViewTask";
import Notification from "./DispayComponents/Notification";
import ViewTeam from "./PageComponents/ViewTeam";
import EditTeam from "./PageComponents/EditTeam";
import Profile from "./Pages/Profile";
import { useNavigate } from "react-router-dom";
import { matchPath } from "react-router";
import CreateMeeting from "./PageComponents/CreateMeeting";
import EditMeeting from "./PageComponents/EditMeeting";
import LeavesManage from "./Pages/LeavesManage";
import Search from "./DispayComponents/Search";
import FinancialPage from "./Pages/FinancialPage";
import TodoPanel from "./todo/TodoPanel";
import ViewDocument from "./PageComponents/ViewDocument";
import TeamMoniter from "./PageComponents/TeamMoniter";

const drawerWidth = 240;

// NAVIGATION
const commonNav = [
  { name: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { name: "Projects", icon: <AccountTreeIcon />, path: "/project" },
  { name: "Tasks", icon: <TaskIcon />, path: "/tasks" },
  { name: "Teams", icon: <GroupsIcon />, path: "/teams" },
  { name: "Chat", icon: <ChatIcon />, path: "/chats" },
  { name: "Meetings", icon: <VideocamIcon />, path: "/meetings" },
  { name: "Documents", icon: <ArticleIcon />, path: "/documents" },
  { name: "ToDo", icon: <TaskAltIcon />, path: "/todo" },
  { name: "Request leave", icon: <ExitToAppIcon />, path: "/leaveReq" },
];

const roleNav = [
  { name: "Finances", icon: <AttachMoneyIcon />, path: "/finances" },
  { name: "Employees", icon: <EngineeringIcon />, path: "/employees" },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "var(--drawer-bg)",
  paddingLeft: "5px",
  border: 0,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
  width: `calc(${theme.spacing(7)} + 0px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 0px)`,
  },
  backgroundColor: "var(--drawer-bg)",
  paddingLeft: "5px",
  border: 0,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "white",
  color: "black",
  zIndex: 15,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    backgroundColor: "white",
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// FUNCTION
export default function Dashboard() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [windowName, setWindow] = useState("Dashboard");
  const token = localStorage.getItem("token");

  const setWindowName = (name) => {
    sessionStorage.setItem("window", name);
  };

  useEffect(() => {
    setWindow(sessionStorage.getItem("window"));

    if (sessionStorage.getItem("showmsg") == "1") {
      setNotify({
        isOpen: true,
        message: "Sign In Successful!",
        type: "success",
      });
      sessionStorage.removeItem("showmsg");
    }

    if (sessionStorage.getItem("projectCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Project Created",
        type: "success",
      });
      sessionStorage.removeItem("projectCreated");
      navigate("/project");
    }

    if (sessionStorage.getItem("projectUpdated") == "1") {
      const id = sessionStorage.getItem("projectId");
      console.log(id);
      setNotify({
        isOpen: true,
        message: "Project Updated",
        type: "success",
      });
      sessionStorage.removeItem("projectUpdated");
      sessionStorage.removeItem("projectId");
      navigate("/project/viewProject/" + id);
    }

    if (sessionStorage.getItem("projectDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Project Deleted",
        type: "success",
      });
      sessionStorage.removeItem("projectDeleted");
    }

    if (sessionStorage.getItem("teamCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Team Created",
        type: "success",
      });
      sessionStorage.removeItem("teamCreated");
    }

    if (sessionStorage.getItem("employeeUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Employee Updated",
        type: "success",
      });
      sessionStorage.removeItem("employeeUpdated");
    }

    if (sessionStorage.getItem("employeeCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Employee Added",
        type: "success",
      });
      sessionStorage.removeItem("employeeCreated");
    }

    if (sessionStorage.getItem("employeeDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Employee Deleted",
        type: "success",
      });
      sessionStorage.removeItem("employeeDeleted");
    }

    if (sessionStorage.getItem("leaveCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Leave request sent",
        type: "success",
      });
      sessionStorage.removeItem("leaveCreated");
    }

    if (sessionStorage.getItem("teamUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "You Update the Team",
        type: "success",
      });
      sessionStorage.removeItem("teamUpdated");
    }
  });

  //Get Current logged in user's username, ID, creditPoints
  const [curUname, setCurUname] = useState(" ");
  const [cps, setCPS] = useState([]); //credit points
  const [ID, setID] = useState(' '); //current user's ID
  useEffect(() => {
    axios
      .get(`http://localhost:8070/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCurUname(res.data.username);
      setCPS(res.data.creditPoints);
      setID(res.data.id)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //.....................
  //Employee online/offline status
  //Get Current logged in user's ID
  const [curID, setCurID] = useState(" ");
  useEffect(() => {
    axios
      .get(`http://localhost:8070/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCurID(res.data.id);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
//Generate the average credit points - start................

//Asign each CP into an array
const cpArray = cps.map(obj => obj.cp);
console.log(cpArray);

//Get the summation of the cpArray
let sumCP = 0;
for(const cpValue of cpArray){
  sumCP += Number(cpValue);
}
console.log(sumCP);

//Get the average of the CPs
const avgCP = (sumCP/cpArray.length).toFixed(2);
console.log(avgCP)

//Generate the grade according to the avetage CP
let grade = "";
function generateGrade(){
  if(avgCP >= 90){
      grade = 'A'
    }
  else if(avgCP >= 70){
      grade = 'B'
    }
  else if(avgCP >= 50){
      grade = 'C'
    }
  else if(avgCP < 50){
      grade = 'E'
    }
}
generateGrade()
console.log(grade)

//Update the totcp and grade fields in the Database
async function updateTotCP(userId, avgCP) {
  await axios.put("http://localhost:8070/user/updateUser/" + userId,
    { 
      totCP: avgCP,
      grade: grade
    },
  )
 .catch((err) =>{
    console.log(err);
  });
}
updateTotCP(ID, avgCP)

//Generate the average credit points - end..................

//Employee online/offline status - start........

  //Update the isOnline status
  async function updateStatus(userId, empStat) {
    await axios
      .put("http://localhost:8070/user/updateUser/" + userId, {
        isOnline: empStat,
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const isLoggedIn = localStorage.getItem("LoggedIn");
  if (isLoggedIn) {
    console.log("Online");
    updateStatus(ID, isLoggedIn);
  } else {
    console.log("Offline");
    updateStatus(ID, isLoggedIn);
  }
  //Employee online/offline status - end........

  const [role, setRole] = useState("");
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

  const logout = () => {
    window.localStorage.clear();
    window.location.href = "./";
    sessionStorage.setItem("window", "Dashboard");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        className="topbar"
        style={{
          boxShadow: "none",
          backgroundColor: "var(--dashboard-bg)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
            className="iconbtn-waste"
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title={open ? "Collapse" : "Expand"}>
            <IconButton
              onClick={() => {
                setOpen(!open);
              }}
              className="iconbtn"
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <p className="pageTitle">{windowName}</p>

          {/* SEARCH */}
          <Box sx={{ flexGrow: 0 }} className="ms-auto d-flex">
            <Search />

            {/* SEARCH END */}

            {/* PROFILE ICON */}

            <Tooltip title="Notifications">
              <IconButton
                sx={{ color: "var(--blue)" }}
                size="medium"
                color="inherit"
                className="me-4"
              >
                <Badge
                  badgeContent={9}
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white",
                      backgroundColor: "#d10061",
                    },
                  }}
                >
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                sx={{ color: "var(--blue)" }}
                size="medium"
                color="inherit"
                onClick={() => {
                  updateStatus(curID, "false");
                  logout();
                }}
                className="me-4"
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  navigate("/Profile");
                }}
              >
                <Avatar
                  alt={curUname}
                  src={"/static/images/avatar/1.jpg"}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          {/* PROFILE ICON */}
        </Toolbar>
        <Divider
          variant="middle"
          sx={{
            height: "1px",
            backgroundColor: "var(--dark)",
          }}
        />
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <div className="drawer">
          <DrawerHeader sx={{ margin: "10px 0px" }}>
            <NavLink
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
              }}
              onClick={() => setWindowName("Dashboard")}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  height: "40px",
                  marginRight: open ? "10px" : "0px",
                }}
              >
                <img src={logoIcon} alt="Logo" className="logoIcon" />
              </ListItemIcon>
              <ListItemIcon
                primary="Workspace"
                sx={{
                  height: "40px",
                  opacity: open ? 1 : 0,
                  marginRight: open ? "20px" : "10px",
                  display: open ? "flex" : "none",
                }}
              >
                <img src={drawerLogo} alt="Logo" className="logoIcon" />
              </ListItemIcon>
            </NavLink>
          </DrawerHeader>
          <Divider
            variant="middle"
            sx={{
              height: "1.2px",
              backgroundColor: "var(--blue)",
              marginBottom: "10px",
            }}
          />
          <List sx={{ marginTop: "10px" }}>
            {commonNav.map((item, index) => (
              <ListItem key={item.name} disablePadding>
                <NavLink
                  to={item.path}
                  key={item._id}
                  style={{
                    textDecoration: "none",
                  }}
                  onClick={() => setWindowName(item.name)}
                  className={({ isActive }) => {
                    return isActive ? "selectOn drawerBtns" : "drawerBtns";
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <p
                      style={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                      className="drawerIcons"
                    >
                      {item.icon}
                    </p>
                    <p
                      style={{
                        display: open ? "flex" : "none",
                      }}
                      className="drawerItems"
                    >
                      {item.name}
                    </p>
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
          </List>

          <Divider
            variant="middle"
            sx={{
              height: "1.2px",
              backgroundColor: "var(--blue)",
              marginBottom: "10px",
            }}
          />

          {/* Optional List */}

          {role === "admin" || role === "HR Manager" ? (
            <List sx={{ marginTop: "10px" }}>
              {roleNav.map((item, index) => (
                <ListItem key={item.name} disablePadding>
                  <NavLink
                    to={item.path}
                    key={item._id}
                    style={{
                      textDecoration: "none",
                    }}
                    onClick={() => setWindowName(item.name)}
                    className={({ isActive }) => {
                      return isActive ? "selectOn drawerBtns" : "drawerBtns";
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <p
                        style={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                        className="drawerIcons"
                      >
                        {item.icon}
                      </p>
                      <p
                        style={{
                          display: open ? "flex" : "none",
                        }}
                        className="drawerItems"
                      >
                        {item.name}
                      </p>
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              ))}
            </List>
          ) : null}
        </div>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexGrow: 1,
          p: 3,
          backgroundColor: "var(--dashboard-bg)",
          minHeight: "100vh",
          paddingTop: "30px",
          overflowX: "hidden",
        }}
      >
        <DrawerHeader />
        {/* DASHBOARD CONTENT */}

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/project" element={<Project />} />
          <Route exact path="/tasks" element={<Tasks />} />
          <Route exact path="/teams" element={<Teams />} />
          <Route exact path="/chats" element={<Chat />} />
          <Route exact path="/meetings" element={<Meetings />} />
          <Route exact path="/documents" element={<Documents />} />
          <Route exact path="/todo" element={<TodoPanel />} />
          <Route exact path="/leaveReq" element={<LeaveReq />} />
          <Route exact path="/finances" element={<FinancialPage />} />
          <Route exact path="/employees" element={<Employees />} />
          <Route exact path="/addProject" element={<AddProject />} />
          <Route exact path="/AddTask" element={<AddTask />} />
          <Route exact path="/Profile" element={<Profile />} />
          <Route exact path="/addMeeting" element={<CreateMeeting />} />
          <Route
            exact
            path="/updateMeeting/:meetingId"
            element={<EditMeeting />}
          />
          <Route exact path="/requestLeave" element={<LeaveReq />} />
          <Route exact path="/leaveManage" element={<LeavesManage />} />
          <Route
            exact
            path="/LeaveAdminAccRejView"
            element={<LeaveAdminAccRejView />}
          />
          <Route
            exact
            path="/project/viewProject/:projectId"
            element={<ViewProject />}
          />
          <Route exact path="/teams/addTeam" element={<CreateTeam />} />
          <Route exact path="/tasks/viewTask/:taskId" element={<ViewTask />} />
          <Route exact path="/teams/viewTeam/:teamId" element={<ViewTeam />} />
          <Route exact path="/teams/editTeam/:teamId" element={<EditTeam />} />
          <Route exact path="/viewDocument/:docId" element={<ViewDocument />} />
          <Route exact path="/teamMoniter" element={<TeamMoniter />} />
        </Routes>

        {/* DASHBOARD CONTENT END */}
      </Box>
    </Box>
  );
}