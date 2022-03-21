import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { add } from "date-fns";

import {
  Accordion,
  AccordionDetails,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Link,
  Typography as MuiTypography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import { dateFormatter, groupByValue, lineColors } from "../../../utils";

import Panel from "../../../components/panels/Panel";
import Map from "../../../components/map/Map";
import TimeseriesFilters from "../../../components/filters/TimeseriesFilters";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";
import Table from "../../../components/Table";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import { MultiSelect } from "@lrewater/lre-react";

import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

const BoldMultiSelect = styled(MultiSelect)`
  & .MuiInputBase-root {
    font-weight: 900;
  }
`;
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
  // overflow-y: auto;
  width: 100%;
`;
const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const DailyTotalPumpingVsYearToDatePumping = () => {
  const { getAccessTokenSilently } = useAuth0();
  const saveRef = useRef(null);

  //date filter defaults
  const defaultFilterValues = {
    previousDays: "",
    startDate: null,
    endDate: new Date(),
    checked: true,
    yL: "Total Daily Pumped by Well",
    yR: "Year to Date Pumped All Wells",
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
    {
      title: "Location",
      field: "location_name",
      width: "100%",
      render: (rowData) => {
        return rowData.location_name ? rowData.location_name : "Totals";
      },
    },
    { title: "Parameter", field: "parameter", width: "100%" },
    { title: "Units", field: "units" },
    {
      title: "Last Report",
      field: "collect_timestamp",
      render: (rowData) => {
        return dateFormatter(rowData.collect_timestamp, "MM/DD/YYYY, h:mm A");
      },
    },
    { title: "Measured Value", field: "measured_value" },
    { title: "Measurement Index", field: "measurement_ndx" },
    { title: "Location Index", field: "location_ndx" },
  ];

  const locationsOptions = [
    {
      name: "Well No. 1",
      ndx: 5,
    },
    {
      name: "Well No. 2",
      ndx: 6,
    },
    {
      name: "Well No. 4",
      ndx: 7,
    },
    {
      name: "Well No. 5",
      ndx: 8,
    },
    {
      name: "Well No. 6",
      ndx: 9,
    },
  ];

  //locations in picker that are selected by user
  const [selectedLocations, setSelectedLocations] = useState([
    locationsOptions[0].ndx,
    locationsOptions[1].ndx,
    locationsOptions[2].ndx,
    locationsOptions[3].ndx,
    locationsOptions[4].ndx,
  ]);

  const handleFilter = (event) => {
    setSelectedLocations(event.target.value);
  };

  const [graphData, setGraphData] = useState([]);
  const { isFetching, error, data } = useQuery(
    ["timeseries-final-daily-v-yeartodate-pumped", selectedLocations],
    async () => {
      if (selectedLocations.length) {
        try {
          const token = await getAccessTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          const { data } = await axios.get(
            `${process.env.REACT_APP_ENDPOINT}/api/timeseries-final-daily-v-yeartodate-pumped/${selectedLocations}`,
            { headers }
          );

          const groupedDataArray = groupByValue(data, "location_ndx");

          const sortedGroupedDataArray = groupedDataArray.sort((a, b) => {
            if (a[0].location_ndx > b[0].location_ndx) {
              return -1;
            }
            if (a[0].location_ndx < b[0].location_ndx) {
              return 1;
            }
            return 0;
          });

          setGraphData(sortedGroupedDataArray);

          return data;
        } catch (err) {
          console.error(err);
        }
      } else {
        setFilteredMutatedGraphData(null);
        setFilteredTableData([]);
        setGraphData(null);
        return null;
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);
  //filtered data for graph, it filters selected locations
  //it keeps every date so the graph can still be panned and zoomed
  //it also mutates the data to be consumed by chartsJS
  //filtered data for table. if filters selected locations
  //it also filters by date
  const [filteredTableData, setFilteredTableData] = useState([]);
  useEffect(() => {
    if (data && graphData?.length && selectedLocations.length) {
      const tableFilterData =
        //if there is no value in the input, yield every record
        filterValues.previousDays === ""
          ? data
          : //if the toggle is checked, yield x days
          filterValues.checked
          ? data.filter(
              (item) =>
                new Date(item.collect_timestamp) >=
                  add(new Date().getTime(), {
                    days: -filterValues.previousDays,
                  }) && new Date(item.collect_timestamp) <= new Date()
            )
          : //if the toggle is unchecked, yield date range
            data.filter(
              (item) =>
                new Date(item.collect_timestamp) >= filterValues.startDate &&
                new Date(item.collect_timestamp) <= filterValues.endDate
            );
      setFilteredTableData(tableFilterData);

      //mutate data for chartJS to use
      const defaultStyle = {
        pointStyle: "point",
        pointRadius: 0,
        pointHoverRadius: 4,
      };
      const mutatedGraphData = {
        labels: graphData[0].map((item) => item.collect_timestamp),
        datasets: [
          ...graphData
            .filter((item) => !item[0].location_name)
            .map((location) => {
              return {
                units: location[0].units,
                label: "Permit 1964-1182 (210 MGY)",
                yAxisID: "yR",
                fill: false,
                borderColor: lineColors.maroon,
                backgroundColor: lineColors.maroon,
                data: location.map((item) => item.permitted_max),
                borderWidth: 3,
                ...defaultStyle,
              };
            }),
          ...graphData
            .filter((item) => !item[0].location_name)
            .map((location) => {
              return {
                units: location[0].units,
                label: "Year-to-Date",
                yAxisID: "yR",
                borderColor: lineColors.black,
                backgroundColor: lineColors.black,
                data: location.map((item) => item.measured_value),
                borderWidth: 4,
                spanGaps: true,
                ...defaultStyle,
              };
            }),
          ...graphData
            .filter((item) => item[0].location_name)
            .map((location, i) => {
              return {
                type: "bar",
                units: location[0].units,
                label: location[0].location_name,
                yAxisID: "yL",
                borderColor: Object.values(lineColors)[i],
                backgroundColor: Object.values(lineColors)[i],
                data: location.map((item) => item.measured_value),
                barPercentage: 0.95,
                categoryPercentage: 0.95,
                ...defaultStyle,
              };
            }),
        ],
      };
      setFilteredMutatedGraphData(mutatedGraphData);
    }
  }, [data, graphData, filterValues, selectedLocations]); //eslint-disable-line

  return (
    <>
      <Helmet title="Groundwater Level vs Precipitation & Barometric Pressure" />
      <Typography variant="h3" gutterBottom display="inline">
        Daily Total Pumping vs Year to Date Pumping
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Daily Total Pumping vs Year to Date Pumping</Typography>
      </Breadcrumbs>

      <Divider my={6} />
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
                  <Grid
                    container
                    pb={6}
                    mt={2}
                    style={{ justifyContent: "space-between" }}
                  >
                    <Grid
                      item
                      style={{
                        flexGrow: 1,
                        maxWidth: "calc(100% - 54px)",
                      }}
                    >
                      <BoldMultiSelect
                        name="locations"
                        label="Locations"
                        variant="outlined"
                        outlineColor="primary"
                        labelColor="primary"
                        valueField="ndx"
                        displayField="name"
                        data={locationsOptions}
                        value={selectedLocations}
                        onChange={handleFilter}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "6px",
                      }}
                    />
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
                        title="Groundwater Level vs Precipitation Timeseries Graph"
                      />
                    </Grid>
                  </Grid>
                  <TableWrapper>
                    <TimeseriesLineChart
                      data={filteredMutatedGraphData}
                      error={error}
                      isLoading={isFetching}
                      filterValues={filterValues}
                      locationsOptions={locationsOptions}
                      yLLabel="Total Daily Pumped by Well (KGal)"
                      yRLLabel="Year to Date Pumped All Wells (MGal)"
                      ref={saveRef}
                      tooltipFormat="MM-DD-YYYY"
                      stacked={true}
                      // reverseLegend={false}
                      // interactionMode="nearest"
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
                    // isLoading={isLoading}
                    label="Groundwater Level vs Precipitation Timeseries Table"
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

export default DailyTotalPumpingVsYearToDatePumping;
