import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import * as React from "react";
import * as Yup from "yup";
import { Button, IconButton, Grid, ListSubheader } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import "../../styles/teams.css";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DialogContent from "@mui/material/DialogContent";
import { Form, Formik } from "formik";
import TextField from "../FormsUI/TextField";
import SubmitButton from "../FormsUI/SubmitButton";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import axios from "axios";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import DashboardCard from "../DispayComponents/DashboardCard";
import Chip from "@mui/material/Chip";

import Notification from "../DispayComponents/Notification";

// TRANSFERLIST FUNCTIONS
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

// SEARCH
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--blue)",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "0ch",
      "&:focus": {
        backgroundColor: "#86868666",
        width: "25ch",
        borderRadius: "10px",
      },
    },
  },
}));
// SEARCH END

//YUP
const FORM_VALIDATION = Yup.object().shape({
  teamName: Yup.string().required("Required!"),
  description: Yup.string().required("Required!"),
});

const EditTeam = () => {
  const { teamId } = useParams();
  const token = localStorage.getItem("token");
  const [teamData, setTeamData] = useState([]);
  const [members, setMemberData] = useState([]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //SET DATA TO RIGH LIST
  useEffect(() => {
    function getAllUsers() {
      axios
        .get("http://localhost:8070/team/get/otherUsers")
        .then((res) => {
          setRight(res.data);
        })
        .catch((err) => {
          //console.log(err);
        });
    }

    getAllUsers();
  }, []);

  const [loading, setLoading] = useState(false);
  //GET TEAM DETAILS
  /*React.useEffect(() => {
    function getTeamDetails() {
      axios
        .get("http://localhost:8070/team/" + teamId)
        .then((res) => {
          setTeamData(res.data);
          setLoading(true);
        })
        .catch((err) => {
          //console.log(err);
        });
    }

    getTeamDetails();
 
  }, []);

  //SET DATA TO LEFT
  React.useEffect(() => {
    function getTeamMembers() {
      axios
        .get("http://localhost:8070/team/teamMembers/" + teamId)
        .then((res) => {
          setLeft(res.data.members);
        })
        .catch((err) => {
          //console.log(err);
        });
    }
    getTeamMembers();
  }, []);*/

  useEffect(()=>{
    axios.get("http://localhost:8070/team/editMembers/"+ teamId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>{
      setTeamData(res.data)
      setLeft(res.data.members)
      setLoading(true)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [])

  //SEARCH
  const [search, setSearch] = useState('')

  //START TRANSFER LIST LOGICS
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  //console.log(left);
  //console.log(right);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  //CUSTOM LIST 1- LEFT LIST
  const customList1 = (title, items) => (
    <List
      sx={{
        width: "22rem",
        maxHeight: "18rem",
        bgcolor: "transparent",
        overflow: "auto",
        padding: "0",
        marginTop: "10px",
      }}
      dense
      component="div"
      role="list"
    >
      <ListSubheader sx={{ padding: "10px" }} className="d-flex space-between">
        <ListItemText primary={`Employee Count : ${items.length}`} />
        <Button
          label={"Remove"}
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
        >
          Remove
        </Button>
      </ListSubheader>

      {items.map((value) => {
        const labelId = `transfer-list-all-item-${value}-label`;

        return (
          <ListItem
            key={value}
            role="listitem"
            button
            onClick={handleToggle(value)}
          >
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>

            <ListItemText id={labelId} primary={`${value.fullName}`} />

            <ListItemIcon>
              <Checkbox
                icon={<CancelOutlinedIcon />}
                checkedIcon={<CancelIcon />}
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": labelId,
                }}
              />
            </ListItemIcon>
          </ListItem>
        );
      })}
    </List>
  );

  //CUSTOM LIST 2 - RIGHT LIST
  const customList2 = (title, items) => (
    <List
      sx={{
        width: "24rem",
        height: "26rem",
        bgcolor: "transparent",
        overflow: "auto",
        paddingTop: "0",
      }}
      dense
      component="div"
      role="list"
    >
      {items.filter((value) => {
          return search.toLowerCase() === ''
            ? value
            : value.fullName.toLowerCase().includes(search);
        }).map((value) => {
        const labelId = `transfer-list-all-item-${value}-label`;

        return (
          <ListItem key={value} role="listitem" button>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>

            <ListItemText id={labelId} primary={`${value.fullName}`} />

            <ListItemIcon>
              <Checkbox
                icon={<CheckCircleOutlineOutlinedIcon />}
                checkedIcon={<CheckCircleIcon />}
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                onClick={handleToggle(value)}
                inputProps={{
                  "aria-labelledby": labelId,
                }}
              />
            </ListItemIcon>
          </ListItem>
        );
      })}
    </List>
  );

  //END TRANSFER LIST

  const navigate = useNavigate();

  return (
    <>
      {/*HEAD COMPONENT*/}
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
          <p className="projectTitle">Edit Team</p>
        </div>
      </div>
      {/*//END HEAD COMPONENT*/}

      {/*//PAGE BODY - MAIN CONTAINER GRID*/}
      <Grid
        container
        item
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        xs={5}
        sm={5}
        md={4}
        lg={4}
        xl={3}
      >
        {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

        {/*//LEFT FORM GRID*/}
        <Grid item xs={4}>
          {loading && (
            <DashboardCard style={{minHeight:"34.7rem"}}>
              <DialogContent>
                <Formik
                  initialValues={{
                    teamName: teamData.teamName,
                    description: teamData.description,
                  }}
                  validationSchema={FORM_VALIDATION}
                  onSubmit={async (values) => {
                    await axios
                      .put(
                        "http://localhost:8070/team/updateTeam/" + teamData._id,
                        {
                          currentTeam : teamData.teamName,
                          teamName: values.teamName,
                          description: values.description,
                          members: left,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      )
                      .then((res) => {
                        sessionStorage.setItem("teamUpdated", "1");
                        navigate("/teams/");
                        
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
                  }}
                >
                  <Form>
                    <Grid container spacing={2}>
                      {/* 1st row */}
                      <Grid item xs={12}>
                        <TextField name="teamName" label="Team Name" />
                      </Grid>

                      {/* 2nd row */}
                      <Grid item xs={12}>
                        <TextField
                          name="description"
                          label="Team Description"
                          multiline
                          minRows={3}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      item
                      xs={10}
                      sx={{ alignItems: "center", marginBottom: "5px" }}
                    >
                      <Grid item name="left">
                        {customList1("Choices", left)}
                      </Grid>
                    </Grid>

                    <div className="d-flex addProjectButtons">
                      <Button
                        startIcon={<ClearIcon />}
                        variant="outlined"
                        sx={{
                          marginInline: "10px",
                          border: "1px solid var(--light-blue)",
                          color: "var(--light-blue)",
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            color: "red",
                            border: "1px solid red",
                          },
                        }}
                      >
                        Clear
                      </Button>

                      <SubmitButton startIcon={<AddIcon />}>
                        Update
                      </SubmitButton>
                    </div>
                  </Form>
                </Formik>
              </DialogContent>
            </DashboardCard>
          )}
        </Grid>
        {/*//END LEFT FROM GRID*/}

        {/*//MIDDLE EMPLOYEE LIST COMPONENT*/}
        <Grid item xs={4}>
          <DashboardCard style={{ padding: "10px" }}>
            {/*//SEARCH*/}
            <Search
              className="mx-auto me-3"
              style={{
                backgroundColor: "var(--dashboard-bg)",
              }}
            >
              <SearchIconWrapper>
                {" "}
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search….."
                inputProps={{ "aria-label": "search" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
            {/*//SEARCH END*/}

            <Button
              label={"Remove"}
              variant="contained"
              size="small"
              color="secondary"
              sx={{ marginTop: "20px" }}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              Add
            </Button>
            <Grid container xs={11} sx={{ marginTop: "20px" }}>
              <Grid
                container
                xs={12}
                sx={{ alignItems: "center", marginBottom: "10px" }}
              >
                <Grid item>{customList2("Chosen", right)}</Grid>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
        {/*//END MIDDLE MEMBER LIST GRID*/}

        {/*//START RIGHT MEMBER PROFILE GRID*/}
        <Grid item xs={4}>
          <DashboardCard style={{ padding: "10px", height: "35rem" }}>
            <div className="d-flex flex-column align-items-center">
              <div className="mt-4">
                <Avatar
                  alt="Group Icon"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 100, height: 100 }}
                />
              </div>

              <DashboardCard className="p-4 mt-5">
                <div className="d-flex flex-column align-items-start">
                  <p className="mb-4">Name : Hashan Perera</p>
                  <p className="mb-4">Designation : Software Engineer</p>
                  <p className="mb-4">Email : hashperera.v@gmail.com</p>
                  <p className="mb-4">Contact : 0775538374</p>
                </div>
              </DashboardCard>
            </div>
          </DashboardCard>
        </Grid>
        {/*//END RIGHT MEMBER PROFILE GRID*/}
      </Grid>
      {/*//END OF MAIN GRID*/}
    </>
  );
};

export default EditTeam;
