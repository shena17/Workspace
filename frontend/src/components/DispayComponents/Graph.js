import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export default function Graph(props) {
  var d = props.actualWork;
  var totalWork = props.totalWork;
  var startDate = new Date(props.startDate);
  var endDate = new Date(props.endDate);
  var ideal = [];

  function arr(start, end) {
    var date = new Date(start);

    var isFirst = true;
    while (date < end) {
      if (isFirst) {
        const data = {
          x: date.setDate(date.getDate()),
          y: totalWork,
        };

        ideal.push(data);
        totalWork = totalWork - 7;
        isFirst = false;
      } else {
        const data = {
          x: date.setDate(date.getDate() + 1),
          y: totalWork,
        };

        ideal.push(data);
        totalWork = totalWork - 7;
      }
    }
  }

  arr(startDate, endDate);

  const [state, setState] = useState({
    series: [
      {
        name: "Actual Burndown",
        data: d,
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
    },
  });

  return (
    <>
      <div>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </>
  );
}
