import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import DashboardCard from "../DispayComponents/DashboardCard";
import CardContent from "@mui/material/CardContent";
import "../../styles/home.css";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { CardActionArea } from "@mui/material";
import PerformanceGraph from "../DispayComponents/PerformanceGraph";
import TaskIcon from "@mui/icons-material/Task";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NorthIcon from "@mui/icons-material/North";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";
import Timeline from "../DispayComponents/Timeline";
import ColumnChart from "../DispayComponents/ColumnChart";
import axios from "axios";
import SouthIcon from "@mui/icons-material/South";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  function percentage(completed, total) {
    var percentage = (completed / total) * 100;
    var toGo = 100 - percentage;

    if (toGo > 90) {
      return (
        <p className="countDesc" style={{ color: "red" }}>
          <SouthIcon fontSize="inherit" />
          {percentage.toFixed(0)}%
        </p>
      );
    } else {
      return (
        <p className="countDesc">
          <NorthIcon fontSize="inherit" />
          {toGo.toFixed(0)}% to go
        </p>
      );
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:8070/project/homeData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {/* <p className="homeTitle">Welcome, Shenal!</p>
      <p className="homeSubTitle">Here is your agenda for today</p> */}
      {/* MAIN GRID */}
      {/* ROW 1 */}
      <Grid
        container
        item
        xs={12}
        spacing={3}
        sx={{ height: "fit-content" }}
        className="mt-0"
      >
        <Grid item container xs={5} spacing={3}>
          <Grid item xs={6}>
            <DashboardCard>
              <CardActionArea
                onClick={() => {
                  navigate("/project");
                }}
              >
                <CardContent>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div>
                      <p className="homeTopic">Projects In</p>
                      <p className="homeTopic">Progress</p>
                    </div>
                    <div
                      className="homeIcons"
                      style={{ backgroundColor: "#e9519049" }}
                    >
                      <AccountTreeIcon
                        fontSize="medium"
                        className="homeTopIcon"
                        style={{ color: "#e95190" }}
                      />
                    </div>
                  </div>
                  {loading ? (
                    <div
                      style={{ height: "70px" }}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex align-items-end">
                        <p className="homeCountTop me-1">
                          {data.projectsCompleted}
                        </p>
                        <p className="homeCountTop2"> / {data.totalProjects}</p>
                      </div>
                      {percentage(data.projectsCompleted, data.totalProjects)}
                    </div>
                  )}
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
          <Grid item xs={6}>
            <DashboardCard>
              <CardActionArea
                onClick={() => {
                  navigate("/tasks");
                }}
              >
                <CardContent>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div>
                      <p className="homeTopic">Tasks In</p>
                      <p className="homeTopic">Progress</p>
                    </div>
                    <div
                      className="homeIcons"
                      style={{ backgroundColor: "#ccffcc" }}
                    >
                      <TaskIcon
                        fontSize="medium"
                        className="homeTopIcon"
                        style={{ color: "#008000" }}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div
                      style={{ height: "67px" }}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex align-items-end">
                        <p className="homeCountTop me-1">
                          {data.tasksCompleted}
                        </p>
                        <p className="homeCountTop2"> / {data.totalTasks}</p>
                      </div>
                      {percentage(data.tasksCompleted, data.totalTasks)}
                    </div>
                  )}
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
          <Grid item xs={6}>
            <DashboardCard>
              <CardActionArea
                onClick={() => {
                  navigate("#");
                }}
              >
                <CardContent>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div>
                      <p className="homeTopic">Your</p>
                      <p className="homeTopic">Score</p>
                    </div>
                    <div
                      className="homeIcons"
                      style={{ backgroundColor: "#ccccff" }}
                    >
                      <EmojiEventsIcon
                        fontSize="medium"
                        className="homeTopIcon"
                        style={{ color: "#1818af" }}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-end">
                    <p className="homeCountTop me-1">60%</p>
                  </div>
                  <p className="countDesc">
                    <NorthIcon fontSize="inherit" /> 5%
                  </p>
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
          <Grid item xs={6}>
            <DashboardCard>
              <CardActionArea
                onClick={() => {
                  navigate("/todo");
                }}
              >
                <CardContent>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div>
                      <p className="homeTopic">Personal</p>
                      <p className="homeTopic">To Do</p>
                    </div>
                    <div
                      className="homeIcons"
                      style={{ backgroundColor: "#ffeb99" }}
                    >
                      <TaskAltIcon
                        fontSize="medium"
                        className="homeTopIcon"
                        style={{ color: "#997a00" }}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-end">
                    <p className="homeCountTop me-1">04</p>
                  </div>
                  <p className="countDesc">1 todo today</p>
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <DashboardCard style={{ height: "100%" }}>
            <p className="homeTopic ms-3 mt-3">Your Performance</p>
            <CardContent style={{ height: "280px" }} className="p-0 pe-3 ps-3">
              <PerformanceGraph />
            </CardContent>
          </DashboardCard>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={7}>
            <DashboardCard style={{ height: "100%" }}>
              <p className="homeTopic ms-3 mt-3">Leaderboard</p>
              <CardContent style={{ height: "300px" }}>
                <ColumnChart />
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={5}>
            <DashboardCard>
              <p className="homeTopic ms-3 mt-3">Tasks</p>
              <CardContent>
                <Timeline />
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
