import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./LineGraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
const buildChartData = (data, caseType = "cases") => {
  const chartData = [];
  let lastDPoint;
  for (const [date, value] of Object.entries(data[caseType])) {
    if (lastDPoint) {
      const newDPoint = {
        x: date,
        y: data[caseType][date] - lastDPoint,
      };
      chartData.push(newDPoint);
    }
    lastDPoint = data[caseType][date];
  }
  return chartData;
};
function LineGraph({ caseType = "cases" }) {
  //   "https://disease.sh/v3/covid-19/historical/all?lastdays=30";
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const s = buildChartData(data, caseType);
          console.log(s);
          setData(s);
        });
    };

    fetchData();
  }, [caseType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "rgba(204,16,52,0.5",
                borderColor: "#CC1034",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
