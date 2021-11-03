import React from "react";
import { withTheme } from "styled-components/macro";

import { Bar, Chart } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

const DailyBarWidget = ({
  lastCollected = "N/A",
  units = "N/A",
  data,
  theme,
}) => {
  const plugins = [
    {
      id: "chartAreaBorder",
      beforeDraw(chart) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;
        if (chart.options.plugins.zoom.zoom.wheel.enabled) {
          ctx.save();
          ctx.strokeStyle = "#800000";
          ctx.lineWidth = 3;
          ctx.strokeRect(left, top, width, height);
          ctx.restore();
        }
      },
    },
  ];

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
          label: function (tooltipItems, data) {
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
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "y",
        },
        zoom: {
          mode: "y",
          wheel: {
            enabled: false,
          },
          pinch: {
            enabled: false,
          },
        },
        //TODO line segment styling
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.text.gridLines,
          borderDash: [5, 5],
          drawBorder: true,
          drawTicks: true,
        },
        ticks: {
          color: theme.palette.text.secondary,
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
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          display: false,
        },
      },
    },
    onClick(e) {
      const chart = e.chart;
      chart.options.plugins.zoom.zoom.wheel.enabled =
        !chart.options.plugins.zoom.zoom.wheel.enabled;
      chart.options.plugins.zoom.zoom.pinch.enabled =
        !chart.options.plugins.zoom.zoom.pinch.enabled;
      chart.update();
    },
  };

  return (
    <>
      <Bar plugins={plugins} data={data} options={options} />
    </>
  );
};

export default withTheme(DailyBarWidget);
