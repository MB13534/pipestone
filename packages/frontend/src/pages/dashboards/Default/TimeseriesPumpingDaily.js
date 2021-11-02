import React, { useState, useEffect, useRef } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import { Box, Grid, Typography } from "@material-ui/core";

import { findRawRecords } from "../../../services/crudService";
import { lineColors } from "../../../utils";

import Loader from "../../../components/Loader";
import MultiOptionsPicker from "../../../components/Pickers/MultiOptionsPicker";
import SaveGraphButton from "./SaveGraphButton";
import TimeseriesLineChart from "./TimeseriesLineChart";

const TimeseriesPumpingDaily = () => {
  const service = useService({ toast: false });

  const ref = useRef(null);

  const {
    data: timeseriesData,
    isLoading: isTimeseriesLoading,
    error: timeseriesError,
  } = useQuery(
    ["timeseries-pumping-daily"],
    async () => {
      try {
        return await service([findRawRecords, ["TimeseriesPumpingDailies"]]);
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
      setSelectedLocations([distinctLocationsNames[0]] ?? []);
      setLocationsOptions(distinctLocationsNames);
    }
  }, [timeseriesData]);

  const [filteredTimeseriesData, setFilteredTimeseriesData] = useState([]);
  useEffect(() => {
    if (timeseriesData?.length > 0 && selectedLocations?.length > 0) {
      const filterData = timeseriesData.filter((item) =>
        selectedLocations.includes(item.location_name)
      );
      const mutatedData = {
        labels: filterData
          .filter((row) => row.location_name === selectedLocations[0])
          .map((item) => item.collect_timestamp),
        datasets: [
          selectedLocations.map((location, i) => {
            return {
              label: location,
              type: "bar",
              yAxisID: "yL",
              borderColor: Object.values(lineColors)[i],
              backgroundColor: Object.values(lineColors)[i],
              data: filterData
                .filter((row) => location === row.location_name)
                .map((row) => row.pumping_af),
              borderWidth: 1,
              pointStyle: "rect",
              fill: false,
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
            {filteredTimeseriesData?.datasets?.length > 0 &&
              locationsOptions?.length && (
                <>
                  <Grid container>
                    <Grid
                      item
                      style={{ flexGrow: 1, maxWidth: "calc(100% - 53px)" }}
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
                        ref={ref}
                        title="Pumping Daily Timeseries Graph"
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
                yLLabel="Pumping af"
                data={filteredTimeseriesData}
                xLabelUnit="week"
                reverseLegend={false}
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

export default TimeseriesPumpingDaily;
