import React, { useEffect, useRef, useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import { Box, Grid, Typography } from "@material-ui/core";

import { findRawRecords } from "../../../services/crudService";
import { filterDataByUser, lineColors } from "../../../utils";

import Loader from "../../../components/Loader";
import SaveGraphButton from "./SaveGraphButton";
import TimeseriesLineChart from "./TimeseriesLineChart";
import MultiOptionsPicker from "../../../components/Pickers/MultiOptionsPicker";
import { useApp } from "../../../AppProvider";

const TimeseriesFlow = ({ inputPickerValue, endDate, startDate, checked }) => {
  const service = useService({ toast: false });

  const { currentUser } = useApp();

  const saveRef = useRef(null);

  const {
    data: timeseriesData,
    isLoading: isTimeseriesLoading,
    error: timeseriesError,
  } = useQuery(
    ["timeseries-flow", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["TimeseriesFlows"]]);

        return filterDataByUser(response, currentUser);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationsOptions, setLocationsOptions] = useState([]);
  useEffect(() => {
    if (timeseriesData?.length > 0) {
      const distinctLocationsNames = [
        ...new Set(timeseriesData?.map((item) => item.location_name)),
      ];
      setSelectedLocations([...distinctLocationsNames] ?? []);
      setLocationsOptions(distinctLocationsNames);
    }
  }, [timeseriesData]);

  const [filteredTimeseriesData, setFilteredTimeseriesData] = useState([]);
  useEffect(() => {
    if (timeseriesData?.length) {
      const filterData = timeseriesData.filter((item) =>
        selectedLocations.includes(item.location_name)
      );
      const defaultStyle = {
        fill: false,
        pointStyle: "line",
        pointRadius: 0,
        pointHoverRadius: 0,
      };
      const mutatedData = {
        labels: filterData
          .filter((row) => row.location_name === selectedLocations[0])
          .map((item) => item.collect_timestamp),
        datasets: [
          selectedLocations.map((location, i) => {
            return {
              label: location,
              yAxisID: "yL",
              borderColor: Object.values(lineColors)[i],
              backgroundColor: Object.values(lineColors)[i],
              data: filterData
                .filter((row) => location === row.location_name)
                .map((row) => row.flow_cfs),
              borderWidth: 2,
              ...defaultStyle,
            };
          }),
        ][0],
      };

      setFilteredTimeseriesData(mutatedData);
    }
  }, [timeseriesData, selectedLocations]);

  if (timeseriesError)
    return "An error has occurred: " + timeseriesError.message;

  return (
    <>
      {isTimeseriesLoading ? (
        <Loader />
      ) : (
        <>
          <Box pb={6} mt={2}>
            {
              <>
                <Grid container>
                  <Grid
                    item
                    style={{ flexGrow: 1, maxWidth: "calc(100% - 54px)" }}
                  >
                    <MultiOptionsPicker
                      selectedOptions={selectedLocations}
                      setSelectedOptions={setSelectedLocations}
                      options={locationsOptions}
                      label="Locations"
                    />
                  </Grid>
                  <Grid item style={{ width: "53px" }}>
                    <SaveGraphButton
                      ref={saveRef}
                      title="Flow vs Stage Timeseries Graph"
                    />
                  </Grid>
                </Grid>
              </>
            }
          </Box>
          <Box height="calc(100% - 24px)">
            {filteredTimeseriesData?.datasets?.length > 0 &&
            locationsOptions?.length ? (
              <TimeseriesLineChart
                yLLabel="Flow CFS"
                xLabelUnit="day"
                data={filteredTimeseriesData}
                ref={saveRef}
                reverseLegend={false}
                previousDays={inputPickerValue}
                endDate={endDate}
                startDate={startDate}
                checked={checked}
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

export default TimeseriesFlow;
