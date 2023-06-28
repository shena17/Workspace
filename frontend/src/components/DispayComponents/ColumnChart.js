import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export default function ColumnChart() {
  const [state, setState] = useState({
    series: [
      {
        data: [21, 22, 10, 28, 16, 21, 13, 30],
      },
    ],
    options: {
      chart: {
        height: "500px",
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
        fontFamily: "var(--font-family-titles)",
        foreColor: "#7e7f81",
        toolbar: {
          show: false,
        },
      },
      colors: ["#80c7fd", "#008FFB", "#80f1cb", "#00E396"],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.2,
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.7,
          stops: [0, 100],
        },
      },
      xaxis: {
        categories: [
          ["John", "Doe"],
          ["Joe", "Smith"],
          ["Jake", "Williams"],
          "Amber",
          ["Peter", "Brown"],
          ["Mary", "Evans"],
          ["David", "Wilson"],
          ["Lily", "Roberts"],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
  });

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height="300px"
      />
    </div>
  );
}
