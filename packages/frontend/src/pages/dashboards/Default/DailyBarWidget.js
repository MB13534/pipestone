import React from "react";

import "chartjs-plugin-zoom";
import { dateFormatter, lineColors } from "../../../utils";
import HorizontalBarChart from "../../../components/graphs/HorizontalBarChart";
import styled from "styled-components/macro";

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
`;

const DailyBarWidget = ({ data, measurementType }) => {
  const filterData = data.filter(
    (item) => item.measurement_type_desc === measurementType
  );
  const unformattedCollectionDates = filterData.map(
    (item) => new Date(item.last_collected)
  );
  const unformattedMostRecentDate = Math.max(...unformattedCollectionDates);
  const formattedMostRecentDate = dateFormatter(
    unformattedMostRecentDate,
    "MM/DD/YYYY, h:mm A"
  );

  const mutatedData = {
    labels: filterData.map((item) => item.location_name),
    lastCollected: formattedMostRecentDate,
    units: filterData[0].unit_desc,
    datasets: [
      {
        axis: "y",
        label: filterData[0].measurement_type_desc,
        data: filterData.map((item) => item.last_value),
        alert: filterData.map((item) => item.alert),
        units: filterData[0].unit_desc,
        fill: true,
        // borderColor: filterData.map((item, i) => lineColors[i]),
        borderColor: filterData.map((item) =>
          item.alert === "GOOD"
            ? lineColors.blue
            : item.alert.split(",").includes("STALE")
            ? lineColors.gray
            : item.alert.split(",").includes("HIGHVAL")
            ? lineColors.orange
            : item.alert.split(",").includes("LOWVAL") ||
              item.alert.split(",").includes("BATTERY")
            ? lineColors.olive
            : lineColors.red
        ),
        backgroundColor: "transparent",
        borderRadius: 5,
        borderWidth: 3,
        barThickness: "flex",
        maxBarThickness: 25,
      },
    ],
  };

  return (
    <ChartWrapper
      height={`${
        mutatedData.labels.length > 6
          ? (mutatedData.labels.length - 6) * 17 + 200
          : 200
      }px`}
    >
      <HorizontalBarChart
        lastCollected={mutatedData.lastCollected}
        units={mutatedData.units}
        data={mutatedData}
      />
    </ChartWrapper>
  );
};
export default DailyBarWidget;
