import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function Graph(props) {
  const token = localStorage.getItem("token");
  const projectId = props.data;
  var ideal = [];
  var actual = [];
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8070/project/getData/" + projectId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        var details = res.data;
        // console.log(details.actualArr);
        actualArrPush(details.actualArr);
        arr(details);
        setLoading(false);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function arr(details) {
    var totalWork = details.len;
    var date = new Date(details.startDate);
    var endDate = new Date(details.endDate);
    var isFirst = true;

    while (date < endDate) {
      if (isFirst) {
        const data = {
          x: date.setDate(date.getDate()),
          y: totalWork.toFixed(2),
        };
        ideal.push(data);
        totalWork = totalWork - details.velocity;
        isFirst = false;
      } else {
        if (totalWork < 0) {
          break;
        }
        const data = {
          x: date.setDate(date.getDate() + 1),
          y: totalWork.toFixed(2),
        };

        ideal.push(data);
        totalWork = totalWork - details.velocity;
      }
    }
  }

  function actualArrPush(actualArr) {
    actualArr.forEach((element) => {
      actual.push(element);
    });
  }

  console.log(actual);

  const [state, setState] = useState({
    series: [
      {
        name: "Actual Burndown",
        data: actual,
      },
      {
        name: "Expected Burndown",
        data: ideal,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        fontFamily: "var(--font-family-titles)",
        foreColor: "#7e7f81",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      xaxis: {
        type: "datetime",
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
    },
  });

  return (
    <>
      {loading ? (
        <div
          style={{
            height: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        show && (
          <div>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="area"
              height={350}
            />
          </div>
        )
      )}
    </>
  );
}
