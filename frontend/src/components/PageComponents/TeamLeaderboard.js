import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import DashboardCard from "../DispayComponents/DashboardCard";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TeamLeaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeadreboard] = useState([]);

  useEffect(() => {
    function leaderboard() {
      axios
        .get("http://localhost:8070/team/leaderboard2")
        .then((res) => {
          setLeadreboard(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    leaderboard();
  }, []);
  

  return (
    <>
     
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Divider
            variant="middle"
            sx={{
              height: "2px",
              backgroundColor: "var(--blue)",
              marginBottom: "10px",
            }}
          />
        </Grid>

        <Grid container item>
          <h2>Team Leaderboard</h2>
        </Grid>

        <Grid container item spacing={10}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <DashboardCard style={{ backgroundColor: "#e9519049" }}>
              <CardActionArea>
                <CardContent>
                  <p className="cardTopics mb-3"></p>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="cardSubData d-flex">
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                          sx={{ width: 24, height: 24 }}
                        />
                        <p
                          className="ms-2"
                          style={{ marginTop: "2px", fontSize: "0.9rem" }}
                        >
                          Team leader
                        </p>
                      </div>

                      <AvatarGroup
                        className="mt-4"
                        style={{ justifyContent: "start", display: "flex" }}
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                          sx={{ width: 28, height: 28 }}
                        />
                        <Avatar
                          alt="Travis Howard"
                          src="/static/images/avatar/2.jpg"
                          sx={{ width: 28, height: 28 }}
                        />
                        <Avatar
                          alt="Agnes Walker"
                          src="/static/images/avatar/4.jpg"
                          sx={{ width: 28, height: 28 }}
                        />
                        <Avatar
                          alt="Trevor Henderson"
                          src="/static/images/avatar/5.jpg"
                          sx={{ width: 28, height: 28 }}
                        />
                      </AvatarGroup>
                    </div>

                    <div>
                      <EmojiEventsIcon />
                    </div>
                  </div>
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <DashboardCard style={{ backgroundColor: "#ccffcc" }}>
              <CardActionArea>
                <CardContent>
                  <p className="cardTopics mb-3"></p>
                  <div className="cardSubData d-flex">
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 24, height: 24 }}
                    />
                    <p
                      className="ms-2"
                      style={{ marginTop: "2px", fontSize: "0.9rem" }}
                    >
                      Team leader
                    </p>
                  </div>

                  <AvatarGroup
                    className="mt-4"
                    style={{ justifyContent: "start", display: "flex" }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Agnes Walker"
                      src="/static/images/avatar/4.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                  </AvatarGroup>
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <DashboardCard style={{ backgroundColor: "#ffeb99" }}>
              <CardActionArea>
                <CardContent>
                  <p className="cardTopics mb-3"></p>
                  <div className="cardSubData d-flex">
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 24, height: 24 }}
                    />
                    <p
                      className="ms-2"
                      style={{ marginTop: "2px", fontSize: "0.9rem" }}
                    >
                      Team leader
                    </p>
                  </div>

                  <AvatarGroup
                    className="mt-4"
                    style={{ justifyContent: "start", display: "flex" }}
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Agnes Walker"
                      src="/static/images/avatar/4.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                    <Avatar
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                      sx={{ width: 28, height: 28 }}
                    />
                  </AvatarGroup>
                </CardContent>
              </CardActionArea>
            </DashboardCard>
          </Grid>
        </Grid>


        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "var(--dashboard-bg)" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "transparent",
                    borderWidth: "8px",
                    borderColor: "var(--dashboard-bg)",
                  }}
                >
                  <TableCell>
                    <p className="tbHeading">Team Name</p>
                  </TableCell>

                  <TableCell align="center">
                    <p className="tbHeading">Team Leader</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Member Count</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Project Count</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className="tbHeading">Score</p>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {leaderboard.map((row) => (
                  <TableRow
                    //key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "var(--tb-hover)" },
                      cursor: "pointer",
                      backgroundColor: "white",
                      borderWidth: "8px",
                      borderColor: "var(--dashboard-bg)",
                    }}
                    /*onClick={() => {
                    navigate("/teams/viewTeam/" + row.teamId);
                  }}*/
                  >
                    <TableCell component="th" scope="row" className="">
                      <div className="text2">
                        <p className="tableCommon tableData">{row.team}</p>
                        <p className="tableCommon tableSubData"></p>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="text2">
                        <p className="tableCommon tableData ">Leader Name</p>
                        <p className="tableCommon tableSubData "></p>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="text2">
                        <p className="tableCommon tableData ">
                          {row.memberCount}
                        </p>
                        <p className="tableCommon tableSubData "></p>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flag">{row.projectCount}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flag">{row.score}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
    </>
  );
};

export default TeamLeaderboard;
