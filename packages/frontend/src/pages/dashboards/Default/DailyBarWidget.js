import React, { useMemo } from "react";

import "chartjs-plugin-zoom";
import { dateFormatter, lineColors } from "../../../utils";
import HorizontalBarChart from "../../../components/graphs/HorizontalBarChart";
import styled from "styled-components/macro";
import { useApp } from "../../../AppProvider";

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
`;

const DailyBarWidget = ({ data }) => {
  const { lookupTableCache } = useApp();

  const unformattedCollectionDates = data.map(
    (item) => new Date(item.last_collected)
  );
  const unformattedMostRecentDate = Math.max(...unformattedCollectionDates);
  const formattedMostRecentDate = dateFormatter(
    unformattedMostRecentDate,
    "MM/DD/YYYY, h:mm A"
  );

  const distinctMeasurementNdx = useMemo(() => {
    return [...new Set(data.map((item) => item.measurement_ndx))];
  }, [data]);

  const assocMeasurementsToStyles = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length) {
      lookupTableCache["assoc_measurements_to_styles"].forEach((d) => {
        if (
          distinctMeasurementNdx.includes(d.measurement_ndx) &&
          d.measurement_type_ndx === data[0].measurement_type_ndx
        ) {
          converted[d.measurement_ndx] = d.style_ndx;
        }
      });
    }
    return converted;
  }, [lookupTableCache, data, distinctMeasurementNdx]);

  const cachedStyles = useMemo(() => {
    let converted = {};
    if (Object.keys(assocMeasurementsToStyles).length) {
      Object.keys(assocMeasurementsToStyles).forEach((key) => {
        converted[key] = lookupTableCache["list_styles"].find(
          (x) => x.style_ndx === assocMeasurementsToStyles[key]
        );
      });
    } else {
      converted = [];
    }
    return converted;
  }, [assocMeasurementsToStyles, lookupTableCache]);

  const mutatedData = useMemo(() => {
    if (Object.keys(cachedStyles).length || Array.isArray(cachedStyles)) {
      return {
        labels: data.map((item) => item.location_name),
        units: data[0].unit_desc,
        datasets: [
          {
            axis: "y",
            label: data[0].measurement_type_desc,
            data: data.map((item) => item.last_value),
            alert: data.map((item) => item.alert),
            units: data[0].unit_desc,
            fill: true,
            // borderColor: filterData.map((item, i) => lineColors[i]),
            borderColor: data.map(
              (item) =>
                lineColors[cachedStyles[item.measurement_ndx]?.border_color] ||
                "black"
            ),
            backgroundColor: data.map((item) =>
              item.alert === "GOOD"
                ? lineColors.blue + "4D"
                : item.alert.split(",").includes("STALE")
                ? lineColors.gray + "4D"
                : item.alert.split(",").includes("HIGHVAL")
                ? lineColors.orange + "4D"
                : item.alert.split(",").includes("LOWVAL") ||
                  item.alert.split(",").includes("BATTERY")
                ? lineColors.olive + "4D"
                : lineColors.red + "4D"
            ),
            borderRadius: data.map(
              (item) => cachedStyles[item.measurement_ndx]?.border_radius || 5
            ),
            borderWidth: data.map(
              (item) => cachedStyles[item.measurement_ndx]?.border_width || 3
            ),
            barThickness: "flex",
            maxBarThickness: 25,
          },
        ],
      };
    }
  }, [cachedStyles, data]);

  return (
    <ChartWrapper
      height={`${
        mutatedData.labels.length > 6
          ? (mutatedData.labels.length - 6) * 17 + 200
          : 200
      }px`}
    >
      <HorizontalBarChart
        lastCollected={formattedMostRecentDate}
        units={mutatedData.units}
        data={mutatedData}
      />
    </ChartWrapper>
  );
};
export default DailyBarWidget;
