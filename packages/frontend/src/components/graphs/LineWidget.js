import React from "react";
import { withTheme } from "styled-components/macro";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-zoom";

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
            return `${tooltipItems.dataset.label}: ${tooltipItems.formattedValue} ${tooltipItems.dataset.units}`;
          },
        },
        displayColors: true,
      },
      title: {
        display: true,
        // text: `Recent Data`,
        text: `Last Collected: ${lastCollected}`,
        align: "end",
        color: theme.palette.text.secondary,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false,
        },
        // title: {
        //   display: true,
        //   text: "Collection Date",
        //   color: theme.palette.text.secondary,
        // },
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
