import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import randomColor from "randomcolor";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function GanttChart(props) {
  const token = localStorage.getItem("token");
  const projectId = props.projectId;
  const [on, setOn] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const task = [];
    axios
      .get("http://localhost:8070/project/getProjectTasks/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        for (const obj of res.data) {
          let color = randomColor({
            luminosity: "dark",
            format: "rgba",
            alpha: 0.7,
          });
          task.push({
            x: obj.taskName,
            y: [
              new Date(obj.startDate).getTime(),
              new Date(obj.dueDate).getTime(),
            ],
            fillColor: color,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setState({
      options: {
        chart: {
          height: "350",
          type: "rangeBar",
          fontFamily: "var(--font-family-titles)",
          foreColor: "#7e7f81",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: {
              hideOverflowingLabels: false,
            },
          },
        },
        noData: {
          text: "No tasks to show",
          align: "center",
          verticalAlign: "middle",
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "var(--blue)",
            fontSize: "1.2rem",
            fontFamily: "var(--font-family-titles)",
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            var label = opts.w.globals.labels[opts.dataPointIndex];
            var a = moment(val[0]);
            var b = moment(val[1]);
            var diff = b.diff(a, "days");
            return label + ": " + diff + (diff > 1 ? " days" : " day");
          },
          style: {
            colors: ["#f3f4f5", "#fff"],
          },
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          show: false,
        },
        grid: {
          row: {
            colors: ["#f3f4f5", "#fff"],
            opacity: 1,
          },
        },
      },
      series: [
        {
          data: task,
        },
      ],
    });
    setTimeout(() => {
      setOn(true);
    }, 2000);
  }, []);

  return (
    <div id="chart">
      {on ? null : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "300px",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {on && (
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="rangeBar"
          height={350}
        />
      )}
    </div>
  );
}
