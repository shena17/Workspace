import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/viewComponent.css";
import ButtonWrapper from "../FormsUI/Button";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, CardContent } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationBox from "../DispayComponents/ConfirmationBox";
import DashboardCard from "../DispayComponents/DashboardCard";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SportsScoreRoundedIcon from "@mui/icons-material/SportsScoreRounded";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import EditTeam from "./EditTeam";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Notification from "../DispayComponents/Notification";

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

//VERTICAL TAB FUNCTOINS
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
//VERTICAL TAB END

//Start Export Function
const ViewTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const token = localStorage.getItem("token");
  const [loggedId, setLoggedId] = useState({});

  // const [team, setTeam] = useState([]);
  const [team, setTeam] = useState({});

  const [trackEmp, setTrackEmployee] = useState();

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

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //CONFIRMATION DIALOG BOX
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    title: "",
    subTitle: "",
  });

  //SET TEAM DETAILS
  useEffect(() => {
    axios
      .get("http://localhost:8070/team/teamMembers/" + teamId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTeam(res.data);
        setLoading(true);
        // console.log(res.data.members)
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:8070/team/loggedId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoggedId(res.data.role);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //DELETE TEAM FUNCTION
  function deleteTeam() {
    axios
      .delete("http://localhost:8070/team/delete/" + teamId)
      .then((res) => {
        navigate("/teams");
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

  const changeBgColor = (isStarted) => {
    if (isStarted === true) {
      return "Green";
    } else {
      return "Red";
    }
  };

  //VERTICAL TAB
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
     <Notification notify={notify} setNotify={setNotify} />
      {/* CONFIRM DIALOG */}
      <ConfirmationBox
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex">
          <IconButton
            onClick={() => {
              navigate("/teams");
            }}
            className="iconbtn"
          >
            <KeyboardBackspaceIcon />
          </IconButton>
          <p className="projectTitle">{team.teamName}</p>
        </div>

        {loggedId === "employee" ? null : (
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
        )}

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
              navigate("/teams/editTeam/" + teamId);
            }}
            disableRipple
          >
            <EditIcon />
            Edit Team
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              setConfirmDialog({
                isOpen: true,
                type: "warning",
                title: "Delete Team?",
                subTitle:
                  "Do you really want to delete this Team? This cannot be undone",
                onConfirm: () => {
                  deleteTeam();
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
        </StyledMenu>
      </div>

      <Grid container spacing={8}>
        <Grid container item xs={4} spacing={1}>
          <Grid
            container
            item
            spacing={1}
            xs={12}
            className="justify-content-evenly"
          >
            <Grid item xs={12} sm={12} md={10} lg={6} xl={4}>
              <DashboardCard>
                <CardContent style={{ paddingBottom: "5px" }}>
                  <div className="d-flex justify-content-evenly">
                    <ArticleRoundedIcon
                      fontSize="large"
                      sx={{
                        backgroundColor: "#ffd699",
                        color: "#e68a00",
                        borderRadius: "50%",
                        padding: "10px",
                        marginBottom: "5px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <p className="perfCard2">PROJECT</p>
                      <p className="perfCard2">COUNT</p>
                    </div>
                    <p className="count2">{team.projectCount}</p>
                  </div>
                </CardContent>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} sm={12} md={10} lg={6} xl={4}>
              <DashboardCard>
                <CardContent style={{ paddingBottom: "5px" }}>
                  <div className="d-flex justify-content-evenly">
                    <PeopleAltRoundedIcon
                      fontSize="large"
                      sx={{
                        backgroundColor: "#ccccff",
                        color: "#006999",
                        borderRadius: "50%",
                        padding: "10px",
                        marginBottom: "5px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <p className="perfCard2">MEMBER</p>
                      <p className="perfCard2">COUNT</p>
                    </div>
                    <p className="count2">{team.memberCount}</p>
                  </div>
                </CardContent>
              </DashboardCard>
            </Grid>

            <Grid item xs={12} sm={12} md={10} lg={6} xl={4}>
              <DashboardCard>
                <CardContent style={{ paddingBottom: "5px" }}>
                  <div className="d-flex justify-content-evenly">
                    <SportsScoreRoundedIcon
                      fontSize="large"
                      sx={{
                        backgroundColor: "#aff6de",
                        color: "#008000",
                        borderRadius: "50%",
                        padding: "10px",
                        marginBottom: "5px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <p className="perfCard2">TEAM</p>
                      <p className="perfCard2">SCORE</p>
                    </div>
                    <p className="count2">{team.score}</p>
                  </div>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
            <DashboardCard>
              <p
                style={{
                  height: "4rem",
                  maxWidth: "100rem",
                  overflow: "wrap-content",
                  padding: "10px",
                }}
              >
                {team.description}
              </p>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
            <DashboardCard style={{ minHeight: "25rem" }}>
              <p
                style={{
                  maxWidth: "100rem",
                }}
              >
                {loading && (
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                  >
                    {team.members.map((data) => (
                      <ListItem
                        alignItems="flex-start"
                        style={{ marginLeft: "10px" }}
                      >
                        <ListItemAvatar style={{ marginRight: "20px" }}>
                          <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={data.fullName}
                          secondary={data.designation}
                        />

                        <Divider variant="inset" component="li" />
                      </ListItem>
                    ))}
                  </List>
                )}
              </p>
            </DashboardCard>
          </Grid>
        </Grid>

        <Grid container item xs={8} spacing={2} className="mt-1">
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              borderRadius: "10px",
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 2, borderColor: "divider", minWidth: "18rem" }}
            >
              {team.projects?.map((data) => (
                <Tab label={data.projectName} {...a11yProps(data._id)} />
              ))}
            </Tabs>

            <TabPanel value={value} index={0}>
              Project 1 Details
            </TabPanel>
            <TabPanel value={value} index={1}>
              Project 2 Details
            </TabPanel>
            <TabPanel value={value} index={2}>
              Project 3 Details
            </TabPanel>
            <TabPanel value={value} index={3}>
              Project 4 Details
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewTeam;
