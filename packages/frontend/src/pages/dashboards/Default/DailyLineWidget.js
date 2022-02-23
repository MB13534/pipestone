import React, { useMemo } from "react";

import { dateFormatter, lineColors } from "../../../utils";
import styled from "styled-components/macro";
import LineWidget from "../../../components/graphs/LineWidget";
import { useApp } from "../../../AppProvider";

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
`;

const DailyLineWidget = ({ data }) => {
  const { lookupTableCache } = useApp();

  const unformattedCollectionDates = data.map(
    (item) => new Date(item.collect_timestamp)
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
        labels: data
          .filter((row) => row.measurement_ndx === distinctMeasurementNdx[0])
          .map((item) =>
            dateFormatter(item.collect_timestamp, "MM/DD/YYYY @ h:mm A")
          ),
        units: data[0].unit_desc,
        datasets: [
          distinctMeasurementNdx.map((location, i) => {
            return {
              pointStyle: "points",
              fill: false,
              borderDash: [5, (distinctMeasurementNdx.length - 1) * 5],
              borderDashOffset: i * 5,
              borderWidth: cachedStyles[location]?.border_width || 3,
              pointRadius: cachedStyles[location]?.point_radius || 0,
              pointHoverRadius: cachedStyles[location]?.point_hover_radius || 6,
              label: data.find((item) => item.measurement_ndx === location)
                .location_name,
              borderColor:
                lineColors[cachedStyles[location]?.border_color] ||
                cachedStyles[location]?.border_color ||
                Object.values(lineColors)[i],
              backgroundColor:
                lineColors[cachedStyles[location]?.background_color] ||
                cachedStyles[location]?.background_color ||
                Object.values(lineColors)[i],
              data: data
                .filter((row) => location === row.measurement_ndx)
                .map((row) => row.measured_value),
              tension: cachedStyles[location]?.tension || 0.5,
              units: data[0].unit_desc,
            };
          }),
        ][0],
      };
    }
  }, [cachedStyles, data, distinctMeasurementNdx]);

  return (
    <ChartWrapper height="200px">
      {mutatedData && (
        <LineWidget
          data={mutatedData}
          type="line"
          units={mutatedData.units}
          lastCollected={formattedMostRecentDate}
        />
      )}
    </ChartWrapper>
  );
};
export default DailyLineWidget;
