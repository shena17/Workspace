import React, { useEffect } from "react";
import { useState } from "react";
import DashboardCard from "../DispayComponents/DashboardCard";
import { Grid, Hidden, colors } from "@mui/material";
import { Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import ButtonWrapper from "../FormsUI/Button";
import { useNavigate, useParams } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import "../../styles/viewComponent.css";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import axios from "axios";
import Divider from "@mui/material/Divider";
import TeamLeaderboard from "../PageComponents/TeamLeaderboard";
import ConfirmationBox from "../DispayComponents/ConfirmationBox";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import PrintIcon from '@mui/icons-material/Print';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';

//=====================================================//
export default function Teams() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    title: "",
    subTitle: "",
  });

  //TEAM DATA LIST
  const [teamList, setTeam] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loggedId, setLoggedId] = useState({})
  const [isEmployee, setIsEmployee] = useState()


  //GET ALL TEAMS
  useEffect(() => {
    //function getRelevantTeams() {
      axios
        .get("http://localhost:8070/team/teams/relevant2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTeam(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    //}
   
    //function getTeamDetailsReport(){
      axios.get("http://localhost:8070/team/getReport2")
      .then((res)=>{
        setTeamData(res.data)
        setLoading(true)
      })
      .catch((err)=>{
        console.log(err)
      })
    //}

    //function getLoggedUser(){
      axios.get("http://localhost:8070/team/loggedId",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res)=>{
        setLoggedId(res.data.role)
      })
      .catch((err)=>{
        console.log(err)
      })
    //}

    //getRelevantTeams();
    //getLoggedUser()
    //getTeamDetailsReport()
  }, []);

 //console.log(teamData)
 //console.log(teamList)
 //console.log(loggedId)

  const downloadPdf = () => {

     // Load logo image
     const logoImg = new Image();
     logoImg.src = require("../../images/logo.png");

    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = "Teams Report";
    const headers = [["Team Name", "Projects","Project Count", "Members", "Member Count"]];
    const document = teamData.map(
      Document =>[
        Document.team,
        Document.projects,
        Document.projects.length,
        Document.members,
        Document.members.length
      ]
    )
    let content = {
      startY: 150,
      theme:"grid",
      head: headers,
      body: document,
    };
     
    logoImg.onload = () => {
    
    // Add logo image
    doc.addImage(logoImg, "PNG", 40, 25, 180, 40);
    doc.setFontSize(20);
    doc.text(title, marginLeft, 100);
    require("jspdf-autotable");
    doc.autoTable(content);

    doc.save("Team.pdf");
    }
  };


  //RETURN
  return (
    <>
      {/* CONFIRM DIALOG */}
      <ConfirmationBox
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Stack
        direction="row"
        spacing={4}
        sx={{ justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={4} justify-Content={"space-between"}>
          <h5>Teams : </h5>
          <TuneIcon />
        </Stack>

        {loggedId === 'employee'?null:
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between" }}
        >
           <ButtonWrapper
            startIcon={<BoltOutlinedIcon />}
            style={{ marginBottom: "25px" }}
            onClick={() => {
              navigate("/teamMoniter");
            }}
          >
            Activity
          </ButtonWrapper>

          <ButtonWrapper
            startIcon={<PrintIcon />}
            style={{ marginBottom: "25px" }}
            onClick={()=> {loading && downloadPdf()}}
          >
            Report
          </ButtonWrapper>

          <ButtonWrapper
            onClick={() => {
              navigate("/teams/addTeam");
            }}
            startIcon={<AddIcon />}
            style={{ marginBottom: "25px" }}
          >
            New Team
          </ButtonWrapper>
        </Stack>
        }
      </Stack>

      <Grid container spacing={4}>
        <Grid container item spacing={4}>
          {teamList.map((row) => (
            <Grid item xs={5} sm={5} md={4} lg={4} xl={3}>
              <DashboardCard
                onClick={() => {
                  navigate("/teams/viewTeam/" + row.teamId);
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <p className="cardTopics mb-3">{row.team}</p>
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
                        {row.leader[0].fullName}
                      </p>
                    </div>

                    <p
                      className="tableCommon tableSubData mt-3"
                      style={{ overflow: "hidden", maxWidth: "300px" }}
                    >
                      {row.description}
                    </p>

                    <p className="teamsSubData mt-3 d-flex">
                      Projects
                      <p className="teamsSubData ms-4">{row.projectCount}</p>
                    </p>

                    <p className="teamsSubData mt-0 d-flex">
                      Members
                      <p className="teamsSubData ms-3">{row.memberDetails.length}</p>
                    </p>
                    <p className="teamsSubData mt-0 d-flex">
                      Scores
                      <p className="teamsSubData ms-4 ps-2">
                        {row.score}
                      </p>
                    </p>

                    <AvatarGroup
                      className="mt-4"
                      style={{ justifyContent: "start", display: "flex" }}
                    >
                      {row.memberDetails.map((mem)=>
                        <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 28, height: 28 }}
                      />
                      )}
                      
                    </AvatarGroup>
                  </CardContent>
                </CardActionArea>
              </DashboardCard>
            </Grid>
          ))}
        </Grid>

        <Grid container item>
          <TeamLeaderboard />
        </Grid>
      </Grid>
    </>
  );
}
