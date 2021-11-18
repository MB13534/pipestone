import React from "react";

import { dateFormatter, lineColors } from "../../../utils";
import styled from "styled-components/macro";
import LineWidget from "../../../components/graphs/LineWidget";

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
`;

const DailyLineWidget = ({ data, measurementType }) => {
  const filteredData = data.filter(
    (item) => item.measurement_type_desc === measurementType
  );
  const distinctLocations = [
    ...new Set(filteredData.map((item) => item.location_name)),
  ];
  const mutatedData = {
    labels: filteredData
      .filter((row) => row.location_name === distinctLocations[0])
      .map((item) =>
        dateFormatter(item.collect_timestamp, "MM/DD/YYYY @ h:mm A")
      ),
    units: filteredData[0].unit_desc,
    datasets: [
      distinctLocations.map((location, i) => {
        return {
          pointStyle: "points",
          fill: false,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 6,
          label: location,
          borderColor: Object.values(lineColors)[i],
          backgroundColor: Object.values(lineColors)[i],
          data: filteredData
            .filter((row) => location === row.location_name)
            .map((row) => row.measured_value),
          tension: 0.5,
          units: filteredData[0].unit_desc,
        };
      }),
    ][0],
  };

  return (
    <ChartWrapper height="200px">
      <LineWidget data={mutatedData} type="line" units={mutatedData.units} />
    </ChartWrapper>
  );
};
export default DailyLineWidget;
