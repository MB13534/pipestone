import React from "react";
import { withTheme } from "styled-components/macro";

import { Line, Chart } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import zoomPlugin from "chartjs-plugin-zoom";
import { dateFormatter, lineColors } from "../../utils";
Chart.register(zoomPlugin);

const LineWidget = ({ lastCollected = "N/A", units = "N/A", data, theme }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItems) {
            console.log(tooltipItems);
            return `${tooltipItems.dataset.label}: ${tooltipItems.formattedValue} ${tooltipItems.dataset.units}`;
          },
        },
        displayColors: true,
      },
      title: {
        display: true,
        text: `Recent Data`,
        color: theme.palette.text.secondary,
      },
    },
    scales: {
      x: {
        display: false,
      },

      y: {
        display: true,
        grid: {
          display: false,
          borderColor: theme.palette.text.secondary,
        },
        ticks: {
          maxTicksLimit: 4,
          color: theme.palette.text.secondary,
        },
        title: {
          display: true,
          text: units,
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <>
      <Line data={data} options={options} type="line" />
    </>
  );
};

export default withTheme(LineWidget);
