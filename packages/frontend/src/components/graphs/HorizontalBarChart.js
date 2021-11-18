import React from "react";
import { withTheme } from "styled-components/macro";

import { Bar, Chart } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

const HorizontalBarChart = ({
  lastCollected = "N/A",
  units = "N/A",
  data,
  theme,
}) => {
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "y",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            return tooltipItems[0].dataset.alert[tooltipItems[0].dataIndex]
              .split(",")
              .join(", ");
          },
          label: function (tooltipItems) {
            return `${tooltipItems.dataset.label}: ${tooltipItems.formattedValue} ${tooltipItems.dataset.units}`;
          },
        },
        footerAlign: "center",
        displayColors: false,
        //TODO
        // footerColor: ctx =>
      },
      title: {
        display: true,
        text: `Last Collected: ${lastCollected}`,
        align: "end",
        color: theme.palette.text.secondary,
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxTicksLimit: 4,
        },
        title: {
          display: true,
          text: units,
          color: theme.palette.text.secondary,
        },
      },

      y: {
        position: "left",
        display: true,
        grid: {
          display: false,
          borderColor: theme.palette.text.secondary,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} type="bar" />
    </>
  );
};

export default withTheme(HorizontalBarChart);
