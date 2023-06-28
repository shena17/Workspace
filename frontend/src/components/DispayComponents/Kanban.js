import React, { useState, useEffect } from "react";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
import "../../styles/kanban.css";
import axios from "axios";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { EmptyIcon } from "./EmptyIcon";

function ControlledBoard(props) {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const projectId = props.projectId;
  const [tasks, setTasks] = useState([]);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const queue = [];
  const progress = [];
  const completed = [];
  const review = [];

  useEffect(() => {
    axios
      .get("http://localhost:8070/project/getProjectTasks/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        for (const obj of res.data) {
          setLength(res.data.length);
          if (obj.stage === "NotStarted") {
            queue.push({
              id: obj._id,
              title: obj.taskName,
              description: obj.description,
            });
          } else if (obj.stage === "Started" || obj.stage === "InProgress") {
            progress.push({
              id: obj._id,
              title: obj.taskName,
              description: obj.description,
            });
          } else if (obj.stage === "Completed") {
            completed.push({
              id: obj._id,
              title: obj.taskName,
              description: obj.description,
            });
          } else if (obj.stage === "Review") {
            review.push({
              id: obj._id,
              title: obj.taskName,
              description: obj.description,
            });
          }
        }
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
  }, [tasks]);

  const board = {
    columns: [
      {
        id: 1,
        title: "QUEUE",
        cards: queue,
      },
      {
        id: 2,
        title: "IN PROGRESS",
        cards: progress,
      },
      {
        id: 3,
        title: "COMPLETED",
        cards: completed,
      },
      {
        id: 4,
        title: "TO REVIEW",
        cards: review,
      },
    ],
  };
  const [controlledBoard, setBoard] = useState(board);

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
    console.log(updatedBoard);
  }

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
            subTitle="Your tasks will appear when your leader assigns you a task"
          />
        ) : (
          <Board onCardDragEnd={handleCardMove} disableColumnDrag>
            {controlledBoard}
          </Board>
        ))}
    </>
  );
}

export { ControlledBoard };
