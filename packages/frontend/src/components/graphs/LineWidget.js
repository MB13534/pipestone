import React from "react";
import { withTheme } from "styled-components/macro";
import { Chart, Line } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const LineWidget = ({ lastCollected = "N/A", units = "N/A", data, theme }) => {
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
    {
      id: "annotatedVerticalLine",
      afterDraw(chart) {
        if (chart.config.type === "line" && chart.tooltip?._active?.length) {
          let x = chart.tooltip._active[0].element.x;
          let yAxis = chart.scales.y;
          let ctx = chart.ctx;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.lineWidth = 9;
          ctx.strokeStyle = "rgba(0, 0, 255, 0.2)";
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(0, 0, 255, 0.4)";
          ctx.stroke();
          ctx.restore();
        }
      },
    },
  ];

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
            enabled: true,
          },
        },
        //TODO line segment styling
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
        offset: true,
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
    onClick(e) {
      const chart = e.chart;
      chart.options.plugins.zoom.zoom.wheel.enabled =
        !chart.options.plugins.zoom.zoom.wheel.enabled;
      chart.update();
    },
  };

  return (
    <>
      <Line plugins={plugins} data={data} options={options} type="line" />
    </>
  );
};

export default withTheme(LineWidget);
