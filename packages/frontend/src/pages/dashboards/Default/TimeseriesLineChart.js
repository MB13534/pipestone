import React, { forwardRef } from "react";
import { withTheme } from "styled-components/macro";

import { Chart, Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const TimeseriesLineChart = forwardRef(
  (
    {
      xLabelFormat = "MM-DD-YYYY",
      xLabelUnit = "week",
      tooltipFormat = "MM-DD-YYYY, h:mm A",
      reverseLegend = true,
      theme,
      data,
      yLLabel,
      yRLLabel = null,
    },
    ref
  ) => {
    const plugins = [
      {
        id: "chartFillBackground",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.fillStyle = theme.palette.background.paper;
          ctx.fillRect(0, 0, chart.width, chart.height);
        },
      },
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
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        filler: {
          propagate: false,
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItems) => {
              return (
                tooltipItems[0].dataset.popupInfo &&
                tooltipItems[0].dataset.popupInfo[tooltipItems[0].dataIndex]
              );
            },
          },
          footerAlign: "center",
          displayColors: false,
          //TODO
          // footerColor: ctx =>
        },
        legend: {
          display: true,
          reverse: reverseLegend,
          labels: {
            usePointStyle: true,
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            mode: "x",
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
          type: "time",
          time: {
            unit: xLabelUnit,
            displayFormats: {
              [xLabelUnit]: xLabelFormat,
            },
            tooltipFormat: tooltipFormat,
          },
          grid: {
            display: false,
          },
          ticks: {
            color: theme.palette.text.secondary,
            maxTicksLimit: 9,
          },
        },

        yL: {
          position: "left",
          display: true,
          title: {
            display: true,
            text: yLLabel,
            color: theme.palette.text.secondary,
          },
          ticks: {
            color: theme.palette.text.secondary,
          },
          grid: {
            color: theme.palette.text.gridLines,
            borderDash: [5, 5],
            drawBorder: true,
            drawTicks: true,
          },
        },

        yR: {
          position: "right",
          display: !!yRLLabel,
          title: {
            display: true,
            text: yRLLabel,
            color: theme.palette.text.secondary,
          },
          ticks: {
            color: theme.palette.text.secondary,
          },
          grid: {
            display: false,
            drawTicks: true,
            drawBorder: false,
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
        <Line plugins={plugins} ref={ref} data={data} options={options} />
      </>
    );
  }
);
export default withTheme(TimeseriesLineChart);
