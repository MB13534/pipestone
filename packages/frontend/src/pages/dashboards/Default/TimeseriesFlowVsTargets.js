import React, { useState, useEffect, useRef } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import { Box, Grid, Typography } from "@material-ui/core";

import { findRawRecords } from "../../../services/crudService";
import { lineColors } from "../../../utils";

import Loader from "../../../components/Loader";
import OptionsPicker from "../../../components/Pickers/OptionsPicker";
import SaveGraphButton from "./SaveGraphButton";
import TimeseriesLineChart from "./TimeseriesLineChart";

const TimeseriesTemperature = () => {
  const service = useService({ toast: false });

  const ref = useRef(null);

  const {
    data: timeseriesData,
    isLoading: isTimeseriesLoading,
    error: timeseriesError,
  } = useQuery(
    ["timeseries-flow-vs-targets"],
    async () => {
      try {
        return await service([findRawRecords, ["TimeseriesFlowVsTargets"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationsOptions, setLocationsOptions] = useState([]);
  useEffect(() => {
    if (timeseriesData?.length > 0) {
      const distinctLocationsNames = [
        ...new Set(timeseriesData?.map((item) => item.location_name)),
      ];
      setSelectedLocation(distinctLocationsNames[0] ?? "");
      setLocationsOptions(distinctLocationsNames);
    }
  }, [timeseriesData]);

  const [filteredTimeseriesData, setFilteredTimeseriesData] = useState([]);
  useEffect(() => {
    if (timeseriesData?.length > 0) {
      const filterData = timeseriesData.filter(
        (item) => selectedLocation === item.location_name
      );
      const defaultStyle = {
        fill: false,
        pointStyle: "line",
        pointRadius: 0,
        pointHoverRadius: 0,
      };
      const mutatedData = {
        labels: filterData.map((item) => item.collect_timestamp),
        datasets: [
          {
            label: "Measured Flow",
            borderColor: lineColors.blue,
            backgroundColor: lineColors.blue,
            data: filterData.map((item) => item.flow_cfs),
            popupInfo: filterData.map((item) => item.ft_remark),
            borderWidth: 2,
            ...defaultStyle,
          },
          {
            label: "Stipulated Target Flow",
            borderColor: lineColors.orange,
            backgroundColor: lineColors.orange,
            data: filterData.map((item) => item.ft_rate_cfs),
            borderWidth: 4,
            ...defaultStyle,
          },
        ],
      };
      setFilteredTimeseriesData(mutatedData);
    }
  }, [timeseriesData, selectedLocation]);

  if (timeseriesError)
    return "An error has occurred: " + timeseriesError.message;

  return (
    <>
      {isTimeseriesLoading ? (
        <Loader />
      ) : (
        <>
          <Box pb={6} mt={2}>
            {filteredTimeseriesData?.datasets?.length > 0 &&
              locationsOptions?.length && (
                <>
                  <Grid container>
                    <Grid
                      item
                      style={{ flexGrow: 1, maxWidth: "calc(100% - 54px)" }}
                    >
                      <OptionsPicker
                        selectedOption={selectedLocation}
                        setSelectedOption={setSelectedLocation}
                        options={locationsOptions}
                        label="Locations"
                      />
                    </Grid>
                    <Grid item style={{ width: "53px" }}>
                      <SaveGraphButton
                        ref={ref}
                        title="Flow vs Target Timeseries Graph"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
          </Box>
          <Box height="calc(100% - 24px)">
            {filteredTimeseriesData?.datasets?.length > 0 &&
            locationsOptions?.length ? (
              <TimeseriesLineChart
                yLLabel="Flow CFS"
                reverseLegend={false}
                xLabelUnit="day"
                data={filteredTimeseriesData}
                ref={ref}
              />
            ) : (
              <Typography>No Data Available</Typography>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default TimeseriesTemperature;
