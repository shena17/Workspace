import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../styles/dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import AddProject from "../PageComponents/AddProject";
import axios from "axios";
import ButtonWrapper from "../FormsUI/Button";
import SkeletonBars from "../FormsUI/SkeletonBars";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../DispayComponents/ProgressBar";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BoltIcon from "@mui/icons-material/Bolt";
import Skeleton from "@mui/material/Skeleton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { EmptyIcon } from "../DispayComponents/EmptyIcon";
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";

// DATE DIFFERENCE
const dateDifference = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);

  function diff() {
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  if (diff() == 1) {
    return diff() + " day left";
  } else {
    return diff() + " days";
  }
};

export default function Project() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  var [active, setActive] = useState(0);
  var [queued, setQueued] = useState(0);
  var [completed, setCompleted] = useState(0);
  const [role, setRole] = useState("");
  const [tasksData, setTaskData] = useState([]);

  useEffect(() => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      if (
        project.status === "Early" ||
        project.status === "Late" ||
        project.status === "Started" ||
        project.status === "In Progress"
      ) {
        setActive(++active);
      } else if (project.status === "Completed") {
        setCompleted(++completed);
      } else if (project.status === "Not Started") {
        setQueued(++queued);
      }
    });
  }, [projects]);

  const changeBgColor = (status) => {
    if (status === "Early") {
      return "#ccffcc";
    } else if (status === "Late") {
      return "#ffcccc";
    } else if (status === "Started") {
      return "#ffffb3";
    } else if (status === "Completed") {
      return "#ccccff";
    } else if (status === "Not Started") {
      return "#ccccff";
    } else if (status === "In Progress") {
      return "#ffeb99";
    } else {
      return "transparent";
    }
  };

  const changeFontColor = (status) => {
    if (status === "Early") {
      return "#008000";
    } else if (status === "Late") {
      return "#cc0066";
    } else if (status === "Started") {
      return "#808000";
    } else if (status === "Completed") {
      return "#000099";
    } else if (status === "Not Started") {
      return "#000099";
    } else if (status === "In Progress") {
      return "#997a00";
    } else {
      return "transparent";
    }
  };

  const [openPopup, setOpenPopup] = useState(false);

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = "Project Report";
    const headers = [["Project Name", "Client", "Team", "Credits", "Deadline"]];
    const document = projects.map((Document) => [
      Document.projectName,
      Document.company,
      Document.team.teamName,
      Document.credits,
      new Date(Document.deadline).toLocaleDateString(),
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

    doc.save("ProjectData.pdf");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center ">
        <p className="projectTitle" style={{ fontSize: "1.3rem" }}>
          <AccountTreeIcon className="me-2 " style={{ color: "gray" }} /> Your
          Projects
        </p>
        {role === "leader" || role === "admin" ? (
          <div>
            <ButtonWrapper
              startIcon={<PrintIcon />}
              onClick={() => {
                downloadPdf();
              }}
              className="me-3"
            >
              Report
            </ButtonWrapper>
            <ButtonWrapper
              onClick={() => {
                setOpenPopup(true);
              }}
              startIcon={<AddIcon />}
            >
              New project
            </ButtonWrapper>{" "}
          </div>
        ) : null}
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
        <div className="d-flex m-0 ms-4 mb-4 ">
          <p className="topDetails" style={{ color: "#008000" }}>
            <BoltIcon fontSize="small" />
            {active} Active projects
          </p>
          <p className="topDetails" style={{ color: "#808000" }}>
            <WatchLaterOutlinedIcon fontSize="small" /> {queued} Upcoming
            projects
          </p>
          <p className="topDetails" style={{ color: "#000099" }}>
            <CheckCircleOutlineIcon fontSize="small" /> {completed} Completed
            projects
          </p>
        </div>
      )}

      {loading ? (
        <SkeletonBars />
      ) : projects.length === 0 ? (
        <EmptyIcon
          title="No projects yet"
          subTitle="Projects will appear once you are assigned to a project"
        />
      ) : (
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
                <TableCell sx={{ paddingLeft: "30px" }}>
                  <p className="tbHeading">PROJECT</p>
                </TableCell>
                <TableCell align="left">
                  <p className="tbHeading">TEAM</p>
                </TableCell>
                <TableCell align="center">
                  <p className="tbHeading">STATUS</p>
                </TableCell>
                <TableCell align="center">
                  <p className="tbHeading">PROGRESS</p>
                </TableCell>
                <TableCell align="right" sx={{ paddingRight: "30px" }}>
                  <p className="tbHeading">DEADLINE</p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "var(--tb-hover)" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/project/viewProject/" + row._id);
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ paddingLeft: "30px" }}
                  >
                    <p className="tableCommon tableData">{row.projectName}</p>
                    <p className="tableCommon tableSubData">{row.company}</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="tableData">{row.team.teamName}</p>
                  </TableCell>
                  <TableCell align="center">
                    <div
                      className="statusBadge me-auto ms-auto"
                      style={{
                        backgroundColor: changeBgColor(row.status),
                        color: changeFontColor(row.status),
                      }}
                    >
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell align="left" className="col-md-2">
                    <ProgressBar
                      progress={row.progress}
                      status={row.progress}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ paddingRight: "30px" }}>
                    <p className="tableCommon tableData ">
                      {new Date(row.deadline).toLocaleDateString()}
                    </p>
                    <p className="tableCommon tableSubData ">
                      {dateDifference(
                        new Date().toLocaleDateString(),
                        new Date(row.deadline).toLocaleDateString()
                      )}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddProject
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      ></AddProject>
    </>
  );
}
