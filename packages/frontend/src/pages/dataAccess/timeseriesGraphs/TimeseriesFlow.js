import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { add } from "date-fns";

import {
  Accordion,
  AccordionDetails,
  Grid as MuiGrid,
  Typography as MuiTypography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import useService from "../../../hooks/useService";
import { useApp } from "../../../AppProvider";
import { findRawRecords } from "../../../services/crudService";
import { dateFormatter, lineColors, removeDuplicates } from "../../../utils";

import Panel from "../../../components/panels/Panel";
import Map from "../../../components/map/Map";
import TimeseriesFilters from "../../../components/filters/TimeseriesFilters";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";

import Table from "../../../components/Table";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import { MultiSelect } from "@lrewater/lre-react";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  height: calc(100% - 92px);
  width: 100%;
`;
const FiltersContainer = styled.div`
  height: 100%;
  width: 100%;
`;
const MapContainer = styled.div`
  height: 300px;
  width: 100%;
`;
const TimeseriesContainer = styled.div`
  height: 600px;
  overflow-y: auto;
  width: 100%;
`;
const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

const TimeseriesFlow = () => {
  const saveRef = useRef(null);

  //date filter defaults
  const defaultFilterValues = {
    previousDays: 7,
    startDate: add(new Date().getTime(), { days: -7 }),
    endDate: new Date(),
    checked: true,
  };
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const changeFilterValues = (name, value) => {
    setFilterValues((prevState) => {
      let newFilterValues = { ...prevState };
      newFilterValues[name] = value;
      return newFilterValues;
    });
  };

  //columns and fields to render on table
  const tableColumns = [
    { title: "Location", field: "location_name", width: "100%" },
    {
      title: "Last Report",
      field: "collect_timestamp",
      render: (rowData) => {
        return dateFormatter(rowData.collect_timestamp, "MM/DD/YYYY, h:mm A");
      },
    },
    { title: "Flow CFS", field: "flow_cfs" },
    { title: "Calculated", field: "calculated" },
    { title: "Measurement NDX", field: "measurement_ndx" },
    { title: "Location NDX", field: "location_ndx" },
  ];

  const service = useService({ toast: false });
  const { lookupTableCache } = useApp();

  //fetch all graph/table data
  const { data, isLoading, error } = useQuery(
    ["TimeseriesFlows"],
    async () => {
      try {
        //filters out users that should be excluded
        // return filterDataByUser(response, currentUser);
        return await service([findRawRecords, ["TimeseriesFlows"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  //locations to show up in picker
  const [locationsOptions, setLocationsOptions] = useState([]);
  const [distinctOptions, setDistinctOptions] = useState([]);
  //locations in picker that are selected by user
  const [selectedLocations, setSelectedLocations] = useState([]);
  const handleLocationsChange = (event) => {
    setSelectedLocations(event.target.value);
  };
  useEffect(() => {
    if (data?.length > 0) {
      //creates a unique set of locations to be used in picker
      const distinctLocations = removeDuplicates(data, "measurement_ndx");

      setDistinctOptions(distinctLocations);

      setLocationsOptions(
        distinctLocations.map((location) => location.location_name)
      );

      //selects every location by default
      setSelectedLocations(
        distinctLocations.map((location) => location.location_name) ?? []
      );
    }
  }, [data]);

  const assocMeasurementsToStyles = useMemo(() => {
    let converted = {};
    if (Object.keys(lookupTableCache).length && distinctOptions.length) {
      lookupTableCache["assoc_measurements_to_styles"].forEach((d) => {
        if (
          distinctOptions
            .map((location) => location.measurement_ndx)
            .includes(d.measurement_ndx) &&
          d.measurement_type_ndx === 0
        ) {
          converted[d.measurement_ndx] = d.style_ndx;
        }
      });
    }
    return converted;
  }, [lookupTableCache, distinctOptions]);

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

  //filtered data for graph, it filters selected locations
  //it keeps every date so the graph can still be panned and zoomed
  //it also mutates the data to be consumed by chartsJS
  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);
  //filtered data for table. if filters selected locations
  //it also filters by date
  const [filteredTableData, setFilteredTableData] = useState([]);
  useEffect(() => {
    if (locationsOptions?.length > 0) {
      const filteredData = data.filter((item) =>
        selectedLocations.includes(item.location_name)
      );

      const tableFilterData =
        //if there is no value in the input, yield every record
        filterValues.previousDays === ""
          ? filteredData
          : //if the toggle is checked, yield x days
          filterValues.checked
          ? filteredData.filter(
              (item) =>
                new Date(item.collect_timestamp) >=
                  add(new Date().getTime(), {
                    days: -filterValues.previousDays,
                  }) && new Date(item.collect_timestamp) <= new Date()
            )
          : //if the toggle is unchecked, yield date range
            filteredData.filter(
              (item) =>
                new Date(item.collect_timestamp) >= filterValues.startDate &&
                new Date(item.collect_timestamp) <= filterValues.endDate
            );
      setFilteredTableData(tableFilterData);

      //mutate data for chartJS to use
      const graphData = {
        labels: filteredData
          .filter((row) => row.location_name === selectedLocations[0])
          .map((item) => item.collect_timestamp),
        datasets: [
          selectedLocations.map((location, i) => {
            const currentNdx = distinctOptions.filter(
              (option) => option.location_name === location
            )[0].measurement_ndx;

            return {
              pointStyle: "point",
              fill: cachedStyles[currentNdx]?.fill || false,
              borderWidth: cachedStyles[currentNdx]?.border_width || 2,
              pointRadius: cachedStyles[currentNdx]?.point_radius || 0,
              pointHoverRadius:
                cachedStyles[currentNdx]?.point_hover_radius || 4,
              label: location,
              borderColor:
                lineColors[cachedStyles[currentNdx]?.border_color] ||
                cachedStyles[currentNdx]?.border_color ||
                Object.values(lineColors)[i],
              backgroundColor:
                lineColors[cachedStyles[currentNdx]?.background_color] ||
                cachedStyles[currentNdx]?.background_color ||
                Object.values(lineColors)[i],
              data: filteredData
                .filter((row) => currentNdx === row.measurement_ndx)
                .map((row) => row.flow_cfs),
              tension: cachedStyles[currentNdx]?.tension || 0.5,
            };
          }),
        ][0],
      };
      setFilteredMutatedGraphData(graphData);
    }
  }, [
    selectedLocations,
    locationsOptions,
    filterValues,
    data,
    cachedStyles,
    distinctOptions,
  ]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={7}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="map"
              id="map"
            >
              <Typography variant="h4" ml={2}>
                Map
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MapContainer>
                <Map />
              </MapContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} lg={5}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="date-filters"
              id="date-filters"
            >
              <Typography variant="h4" ml={2}>
                Date Filters
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <FiltersContainer>
                  <TimeseriesFilters
                    filterValues={filterValues}
                    changeFilterValues={changeFilterValues}
                  />
                </FiltersContainer>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="time-series"
              id="time-series"
            >
              <Typography variant="h4" ml={2}>
                Graph
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TimeseriesContainer>
                  <Grid container pb={6} mt={2}>
                    <Grid
                      item
                      style={{ flexGrow: 1, maxWidth: "calc(100% - 54px)" }}
                    >
                      <MultiSelect
                        name="locations"
                        label="Locations"
                        variant="outlined"
                        valueField="location_name"
                        displayField="location_name"
                        outlineColor="primary"
                        labelColor="primary"
                        size="medium"
                        margin="normal"
                        data={distinctOptions}
                        value={selectedLocations}
                        onChange={handleLocationsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        width: "53px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SaveGraphButton
                        ref={saveRef}
                        title="Streamflow Timeseries Graph"
                      />
                    </Grid>
                  </Grid>

                  <TableWrapper>
                    <TimeseriesLineChart
                      data={filteredMutatedGraphData}
                      error={error}
                      isLoading={isLoading}
                      filterValues={filterValues}
                      locationsOptions={[
                        ...locationsOptions.map(
                          (location) => location.location_name
                        ),
                      ]}
                      yLLabel="Flow CFS"
                      reverseLegend={false}
                      ref={saveRef}
                      suggestedMin={0}
                    />
                  </TableWrapper>
                </TimeseriesContainer>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="table-content"
              id="table-header"
            >
              <Typography variant="h4" ml={2}>
                Table
              </Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <TableWrapper>
                  <Table
                    isLoading={isLoading}
                    label="Streamflow Timeseries Table"
                    columns={tableColumns}
                    data={filteredTableData}
                    height="600px"
                  />
                </TableWrapper>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
};

export default TimeseriesFlow;
