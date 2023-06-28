import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import { Divider } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../styles/addTask.css";
import "../../styles/dashboard.css";
import { EmptyIcon } from "../DispayComponents/EmptyIcon";
import SkeletonBars from "../FormsUI/SkeletonBars";
import axios from "axios";
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";
import ButtonWrapper from "../FormsUI/Button";

// date difference
const dateDifference = (d1, d2) => {
  // To set two dates to two variables
  var date1 = new Date(d1);
  var date2 = new Date(d2);

  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();

  // To calculate the no. of days between two dates
  var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));

  if (Difference_In_Days >= 0) {
    return Difference_In_Days + " Days";
  } else {
    return Math.abs(Difference_In_Days) + " Late ";
  }
};

export default function Tasks() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [tasksData, setTaskData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8070/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTaskList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    function getReport() {
      axios
        .get("http://localhost:8070/tasks/generateReport/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTaskData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getReport();
  }, []);

  const [taskList, setTaskList] = useState([]);

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

  const [openPopup, setOpenPopup] = useState(false);

  console.log(tasksData);

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = "Task Report";
    const headers = [["Project Name", "Tasks", "Task Count"]];
    const document = tasksData.map((Document) => [
      Document.projectName,
      Document.tasks,
      Document.count,
    ]);
    let content = {
      startY: 50,
      theme: "grid",
      head: headers,
      body: document,
    };
    doc.setFontSize(20);
    doc.text(title, marginLeft, 40);
    require("jspdf-autotable");
    doc.autoTable(content);

    doc.save("TaskData.pdf");
  };

  return (
    <>
      {loading ? (
        <SkeletonBars />
      ) : taskList.length === 0 ? (
        <EmptyIcon
          title="No Tasks yet"
          subTitle="Your tasks will appear when your leader assigns you a task"
        />
      ) : (
        <>
          <div className="d-flex justify-content-end">
            <ButtonWrapper
              startIcon={<PrintIcon />}
              style={{ marginBottom: "25px" }}
              onClick={() => {
                downloadPdf();
              }}
            >
              Report
            </ButtonWrapper>
          </div>

          <TableContainer
            sx={{
              borderRadius: "10px",
              boxShadow: "0px 0px 15px lightgray",
            }}
            component={Paper}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="col-md-5">
                    <p className="tbHeading">Task</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Due Date</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Stage</p>
                  </TableCell>
                  <TableCell align="center">
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
                    <TableCell align="center">
                      <div className="text2">
                        <p className="tableCommon tableData ">
                          {new Date(row.dueDate).toLocaleDateString()}
                        </p>
                        <p className="tableCommon tableSubData ">
                          {dateDifference(new Date(), new Date(row.dueDate))}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: 0 }}>
                      <div
                        className="statusBadge ms-auto me-auto"
                        style={{
                          backgroundColor: changeBgColor(row.stage),
                          color: changeFontColor(row.stage),
                        }}
                      >
                        {row.stage}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flag">{changeFlag(row.priority)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {/* <AddTask openPopup={openPopup} setOpenPopup={setOpenPopup} ></AddTask> */}
    </>
  );
}
