import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import AddTask from "../PageComponents/AddTask";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import "../../styles/addTask.css";
import "../../styles/dashboard.css";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { EmptyIcon } from "../DispayComponents/EmptyIcon";

// date difference
const dateDifference = (d1, d2) => {
  // To set two dates to two variables
  var date1 = new Date(d1);
  var date2 = new Date(d2);

  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days + " days";
};

export default function Tasks(props) {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  //project id is taken as a prop
  var projectId = props.projectId;

  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8070/tasks//projectTask/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setTaskList(res.data);
        setLength(res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, [taskList]);

  const changeBgColor = (status) => {
    if (status === "InProgress") {
      return "#ccffcc";
    } else if (status === "Risk") {
      return "#ffcccc";
    } else if (status === "NotStarted") {
      return "#ffffb3";
    } else if (status === "Completed") {
      return "#ccccff";
    } else {
      return "transparent";
    }
  };

  const changeFontColor = (status) => {
    if (status === "InProgress") {
      return "#008000";
    } else if (status === "Risk") {
      return "#cc0066";
    } else if (status === "NotStarted") {
      return "#808000";
    } else if (status === "Completed") {
      return "#000099";
    } else {
      return "transparent";
    }
  };

  const changeFlag = (priority) => {
    if (priority === "High") {
      return <FlagIcon sx={{ color: "var(--danger)" }} />;
    } else if (priority === "Medium") {
      return <FlagIcon sx={{ color: "var(--warning)" }} />;
    } else {
      return <FlagIcon sx={{ color: "var(--dark)" }} />;
    }
  };

  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      {show ? null : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "200px",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {show &&
        (length === 0 ? (
          <EmptyIcon
            title="No tasks yet"
            subTitle="Project tasks will appear when your leader creates project tasks"
          />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="col-md-5" sx={{ paddingLeft: "40px" }}>
                    <p className="tbHeading">Task</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Asignee</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tbHeading">Due Date</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tbHeading">Stage</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tbHeading">Priority</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taskList.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "var(--tb-hover)" },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate("/tasks/viewTask/" + row._id);
                    }}
                  >
                    <TableCell component="th" scope="row" className="col-md-5">
                      <div className="text2">
                        <p className="tableCommon tableData">{row.taskName}</p>
                        <p className="tableCommon tableSubData">
                          {row.projectId.projectName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell align="left" sx={{ padding: 0 }}>
                      <AvatarGroup sx={{ justifyContent: "center" }}>
                        <Avatar
                          alt={row.assignee.fullName}
                          src="/static/images/avatar/1.jpg"
                          sx={{ width: 24, height: 24 }}
                        />
                      </AvatarGroup>
                    </TableCell>
                    <TableCell align="left">
                      <div className="text2">
                        <p className="tableCommon tableData ">
                          {new Date(row.dueDate).toLocaleDateString()}
                        </p>
                        <p className="tableCommon tableSubData ">
                          {dateDifference(new Date(), new Date(row.dueDate))}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell align="left" sx={{ padding: 0 }}>
                      <div
                        className="statusBadge"
                        style={{
                          backgroundColor: changeBgColor(row.stage),
                          color: changeFontColor(row.stage),
                        }}
                      >
                        {row.stage}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flag">{changeFlag(row.priority)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      <AddTask
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        projectId={projectId}
      ></AddTask>
    </>
  );
}
