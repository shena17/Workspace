import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import React, { useState, useEffect } from "react";
import TaskIcon from "@mui/icons-material/Task";
import "../../styles/home.css";
import randomColor from "randomcolor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EmptyIcon } from "./EmptyIcon";

export default function Timeline() {
  // AUTHENTICATION HEADER
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const randColor = () => {
    return randomColor({
      luminosity: "bright",
      format: "rgba",
      alpha: 1,
    });
  };

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

  useEffect(() => {
    axios
      .get("http://localhost:8070/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ overflowY: "auto", height: "300px", overflowX: "hidden" }}>
      {tasks.length === 0 ? (
        <EmptyIcon
          title="No tasks yet"
          subTitle="Your tasks will appear when your leader assigns you a task"
        />
      ) : (
        <VerticalTimeline lineColor="#3e5f7c" layout="1-column-left">
          {tasks.map((task) => (
            <VerticalTimelineElement
              className="m-0"
              contentStyle={{
                background: "transparent",
                boxShadow: "none",
                padding: "0px",
              }}
              iconStyle={{
                background: randColor(),
                color: "#fff",
                height: "35px",
                width: "35px",
                marginLeft: "3px",
              }}
              onTimelineElementClick={() =>
                navigate("/tasks/viewTask/" + task._id)
              }
              iconOnClick={() => navigate("/tasks/viewTask/" + task._id)}
              icon={<TaskIcon />}
              position="right"
            >
              <p
                className="text-start"
                style={{
                  color: "var(--blue)",
                  fontFamily: "var(--font-family-titles)",
                  fontWeight: "400",
                  fontSize: "0.9rem",
                }}
              >
                {task.taskName}
              </p>
              <p
                className="text-start p-0 m-0"
                style={{ color: "gray", fontSize: "0.85rem" }}
              >
                {new Date(task.dueDate).toDateString()}
              </p>
              <div
                className="statusBadge"
                style={{
                  backgroundColor: changeBgColor("Early"),
                  color: changeFontColor("Early"),
                  fontSize: "0.75rem",
                  padding: "2px 10px",
                  width: "fit-content",
                }}
              >
                Early
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      )}
    </div>
  );
}
