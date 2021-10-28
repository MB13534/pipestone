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
    data: locationsNames,
    isLoading: isLocationsLoading,
    error: locationsError,
  } = useQuery(
    ["dropdown_measurements_temperature"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["DropdownMeasurementsTemperatures"],
        ]);
        return response?.map((item) => item.location_name);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationsOptions, setLocationsOptions] = useState([]);
  useEffect(() => {
    if (locationsNames?.length > 0) {
      setSelectedLocation(locationsNames[0]);
      setLocationsOptions(locationsNames);
    }
  }, [locationsNames]);

  const {
    data: timeseriesData,
    isLoading: isTimeseriesLoading,
    error: timeseriesError,
  } = useQuery(
    ["timeseries-temperatures"],
    async () => {
      try {
        return await service([findRawRecords, ["TimeseriesTemperatures"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  const [filteredTimeseriesData, setFilteredTimeseriesData] = useState({});
  useEffect(() => {
    if (timeseriesData?.length > 0) {
      const filterData = timeseriesData.filter(
        (item) => selectedLocation === item.location_name
      );
      const defaultStyle = {
        fill: false,
      };
      const mutatedData = {
        labels: filterData.map((item) => item.collect_timestamp),
        datasets: [
          {
            label: "Daily Avg",
            backgroundColor: lineColors.yellow,
            borderColor: lineColors.yellow,
            data: filterData.map((item) => item.temp_daily_avg_degf),
            borderDash: [1, 2],
            borderWidth: 2,
            pointStyle: "circle",
            pointHoverRadius: 3,
            ...defaultStyle,
            spanGaps: true,
          },
          {
            label: "Rolling 7-Day Avg",
            borderColor: lineColors.green,
            backgroundColor: lineColors.green,
            data: filterData.map(
              (item) => item.temp_rolling_seven_day_avg_degf
            ),
            pointRadius: 0,
            borderWidth: 2,
            pointStyle: "line",
            pointHoverRadius: 0,
            ...defaultStyle,
            spanGaps: true,
          },
          {
            label: "Rolling 2-HR Avg",
            backgroundColor: lineColors.red,
            borderColor: lineColors.red,
            data: filterData.map((item) => item.temp_rolling_two_hour_avg_degf),
            pointRadius: 0,
            borderDash: [8, 5],
            borderWidth: 2,
            pointStyle: "dash",
            pointHoverRadius: 0,
            ...defaultStyle,
          },
          {
            label: "Measured",
            borderColor: lineColors.blue,
            backgroundColor: lineColors.blue,
            data: filterData.map((item) => item.measured_temp_degf),
            pointRadius: 0,
            borderWidth: 4,
            pointStyle: "line",
            pointHoverRadius: 0,
            ...defaultStyle,
          },
        ],
      };
      setFilteredTimeseriesData(mutatedData);
    }
  }, [timeseriesData, selectedLocation]);

  if (locationsError) return "An error has occurred: " + locationsError.message;

  if (timeseriesError)
    return "An error has occurred: " + timeseriesError.message;

  return (
    <>
      {isLocationsLoading || isTimeseriesLoading ? (
        <Loader />
      ) : (
        <>
          <Box pb={6} mt={2}>
            {filteredTimeseriesData?.datasets?.length > 0 &&
              locationsOptions?.length && (
                <>
                  <Grid container>
                    <Grid item xs={12} style={{ flexGrow: 1 }} lg="auto">
                      <OptionsPicker
                        selectedOption={selectedLocation}
                        setSelectedOption={setSelectedLocation}
                        options={locationsOptions}
                        label="Locations"
                      />
                    </Grid>
                    <Grid item>
                      <SaveGraphButton
                        ref={ref}
                        title="Temperature Timeseries Graph"
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
                yLLabel="Degrees F"
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
