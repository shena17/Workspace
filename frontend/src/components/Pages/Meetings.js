import React from "react";
import "../../styles/viewComponent.css";
import "../../styles/taskView.css";
import { styled } from '@mui/material/styles';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useNavigate } from "react-router-dom";
import CreateMeeting from "../PageComponents/CreateMeeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getMeeting, deleteMeeting, addMeeting } from '../service/apiMeeting';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from "axios";
import EditMeeting from "../PageComponents/EditMeeting";
import EditIcon from "@mui/icons-material/Edit";
import ButtonWrapper from "../FormsUI/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import MeetingSearch from "../PageComponents/MeetingSearch";


function createData(subject, date, time, organizer, platform) {
  return { subject, date, time, organizer, platform };
}

// const rows = [
//   createData("Team 1 requirement Analysis Meeting", "04/05/2023", "3:30 pm", "Organizer 1", "Zoom"),
//   createData("Team 3 QA Meeting", "02/05/2023", "1:30 pm", "Organizer 2", "MS Teams"),
//   createData("Team 2 Meeting", "30/05/2023", "2:00 pm", "Organizer 3", "Zoom"),
//   createData("Team 4 Meeting", "03/06/2023", "10:30 am", "Organizer 4", "Zoom"),
//   createData("Team 5 Meeting", "07/06/2023", "11:00 am", "Organizer 5", "MS Teams")
// ];

export default function Meetings() {

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();


  const [meeting, setMeeting] = useState([]);
  const [details, setDetails] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8070/meeting", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMeeting(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //delete Meeting
  function deleteMeeting(id) {
    console.log(id)

    //insert the axois here
    axios.delete("http://localhost:8070/meeting/deletemeeting/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        sessionStorage.setItem("meetingDeleted", "1");
        navigate("/meetings");
      })
      .catch((err) => {
        console.log("error")
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
  }

  //Update Meeting
  function updateMeeting(mdata) {
    // navigate("/updateMeeting/" + id);
    setOpenPopup(true);
    setMeetingData(mdata);


  }

  const getAllMeetings = async () => {
    let response = await getMeeting();
    setMeeting(response.data);
  }

  const addMeetingDetails = async () => {
    await addMeeting(meeting);
    navigate('/meetings');
  }

  //DOWNLOAD PDF REPORT --------------------------------------------
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Meeting Details", 20, 10)
    autoTable(doc, { html: '#meetingTable' }, { theme: "grid" })
    doc.save('meetings_report.pdf')
  }
  //END OF DOWNLOAD PDF -----------------------------------------------

  //Redirect to Zoom Page
  const redirectToZoomScheduleMeeting = () => {
    window.open('https://zoom.us/start', '_blank');
  };

  //Redirect to Google Calendar
  const redirectToGoogleCalendar = () => {
    window.open('https://calendar.google.com/calendar/', '_blank');
  };

  return (
    <div>
      
      <div>
        <Button
          startIcon=""
          variant="outlined"
          sx={{
            marginInline: "10px",
            padding: "10px",
            marginBottom: "10px",
            marginLeft: "40%",
            border: "1px solid var(--light-blue)",
            color: "var(--light-blue)",
            "&:last-child td, &:last-child th": { border: 0 },
            "&:hover": {
              color: "red",
              border: "1px solid red",
            },
          }}
          onClick={() => {
            redirectToZoomScheduleMeeting();
          }}
        >
          Start a Zoom Meeting
        </Button>

        <Button
          startIcon=""
          variant="outlined"
          sx={{
            marginInline: "10px",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid var(--light-blue)",
            color: "var(--light-blue)",
            "&:last-child td, &:last-child th": { border: 0 },
            "&:hover": {
              color: "red",
              border: "1px solid red",
            },
          }}
          onClick={() => {
            navigate("/addMeeting");
          }}
        >
          Schedule New Meeting
        </Button>

        <Button
          startIcon=""
          variant="outlined"
          align="end"
          sx={{
            marginInline: "10px",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid var(--light-blue)",
            color: "var(--light-blue)",
            "&:last-child td, &:last-child th": { border: 0 },
            "&:hover": {
              color: "red",
              border: "1px solid red",
            },
          }}
          onClick={() => {
            downloadPdf();
          }}
        >
          Download Meetings Report PDF
        </Button>
      </div>


      <TableContainer component={Paper}>
        <Table id="meetingTable" sx={{ minWidth: 550 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell width="30%">Subject</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Organizer</TableCell>
              <TableCell align="right">Platform</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meeting.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.subject}
                </TableCell>
                <TableCell align="right">{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{row.time}</TableCell>
                <TableCell align="right">{row.organizer}</TableCell>
                <TableCell align="right">{row.platform}</TableCell>
                <TableCell align="right">
                  <ButtonWrapper startIcon={<EditIcon />} onClick={() => { updateMeeting(row); }} className="me-2">Edit</ButtonWrapper>

                  <Button startIcon={<DeleteIcon />}
                    variant="outlined"
                    sx={{
                      borderRadius: "10px",
                      marginInline: "10px",
                      border: "1px solid var(--light-blue)",
                      color: "var(--light-blue)",
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        color: "red",
                        border: "1px solid red",
                      },
                    }}
                    onClick={() => {
                      deleteMeeting(row._id);
                      window.location.reload();
                    }}
                  >Delete</Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        startIcon=""
        variant="outlined"
        align="end"
        sx={{
          marginInline: "10px",
          padding: "10px",
          marginBottom: "10px",
          marginTop: "15px",
          marginLeft: "60%",
          border: "1px solid var(--light-blue)",
          color: "var(--light-blue)",
          "&:last-child td, &:last-child th": { border: 0 },
          "&:hover": {
            color: "red",
            border: "1px solid red",
          },
        }}
        onClick={() => {
          redirectToGoogleCalendar();
        }}
      >
        Add to Google Calendar
      </Button>

      <EditMeeting openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        meetingDetails={meetingData}
      />

    </div>
  );
}