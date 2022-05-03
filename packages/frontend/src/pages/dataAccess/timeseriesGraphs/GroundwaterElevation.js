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

import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import PrintGraphButton from "../../../components/graphs/PrintGraphButton";

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

const GroundwaterElevation = () => {
  const { getAccessTokenSilently } = useAuth0();
  const saveRef = useRef(null);

  const [graphAccordionExpanded, setGraphAccordionExpanded] = useState(true);

  //date filter defaults
  const defaultFilterValues = {
    previousDays: 30,
    startDate: null,
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
    { title: "Location Index", field: "location_ndx" },
    { title: "Max Pumping Rate", field: "max_pumping_rate" },
  ];

  const [uniqueLocations, setUniqueLocations] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const { isFetching, error, data } = useQuery(
    ["timeseries-final-elevation-hourly"],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-final-elevation-v-gpm/groundwater-elevation`,
          { headers }
        );
        const groupedDataArray = groupByValue(data, "collect_timestamp");

        setGraphData(groupedDataArray);

        setUniqueLocations(
          [
            ...new Set(
              data.map((item) => {
                return item.location_name;
              })
            ),
          ].sort()
        );

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: false, refetchOnWindowFocus: false }
  );

  // const uniqueLocations = useMemo(() => {
  //   if (data?.length) {
  //     const uniqueItemNames = [
  //       ...new Set(
  //         data.map((item) => {
  //           return item.location_name;
  //         })
  //       ),
  //     ];
  //     return uniqueItemNames.sort();
  //   }
  // }, [data]);

  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);
  //filtered data for graph, it filters selected locations
  //it keeps every date so the graph can still be panned and zoomed
  //it also mutates the data to be consumed by chartsJS
  //filtered data for table. if filters selected locations
  //it also filters by date
  const [filteredTableData, setFilteredTableData] = useState([]);
  useEffect(() => {
    if (data && graphData?.length && uniqueLocations) {
      const tableFilterData =
        //if there is no value in the input, yield every record
        filterValues.checked && filterValues.previousDays === ""
          ? data
          : //if the toggle is checked, yield x days
          filterValues.checked && filterValues.previousDays !== ""
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
        pointRadius: 0,
        pointHoverRadius: 0,
        spanGaps: false,
        yAxisID: "yL",
        borderWidth: 2,
        tension: 0.75,
      };
      const mutatedGraphData = {
        labels: graphData.map((item) => item[0].collect_timestamp),
        units: graphData[0][0]?.units,
        parameter: graphData[0][0]?.parameter,
        datasets: [
          ...uniqueLocations.map((location, i) => {
            return {
              units: graphData[0][0]?.units,
              label: location,
              borderColor: Object.entries(lineColors)[i],
              backgroundColor: Object.entries(lineColors)[i],
              data: graphData.map(
                (item) =>
                  item.filter((arr) => arr.location_name === location)[0]
                    ?.measured_value ?? null
              ),
              ...defaultStyle,
            };
          }),
        ],
      };
      setFilteredMutatedGraphData(mutatedGraphData);
    }
  }, [data, graphData, filterValues, uniqueLocations]); //eslint-disable-line

  return (
    <>
      <Helmet title="Daily Groundwater Elevation" />
      <Typography variant="h3" gutterBottom display="inline">
        Daily Groundwater Elevation
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Daily Groundwater Elevation</Typography>
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
                {uniqueLocations && (
                  <Map locationsToInclude={uniqueLocations} />
                )}
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
          <Accordion
            defaultExpanded
            onChange={(e, expanded) => setGraphAccordionExpanded(expanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="time-series"
              id="time-series"
            >
              <Typography variant="h4" ml={2}>
                {!graphAccordionExpanded && "Graph"}
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
                        maxWidth: "calc(100% - 108px)",
                      }}
                    />
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
                        width: "106px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SaveGraphButton
                        ref={saveRef}
                        title="Daily Groundwater Elevation Timeseries Graph"
                      />
                      <PrintGraphButton
                        ref={saveRef}
                        title="Daily Groundwater Elevation Timeseries Graph"
                      />
                    </Grid>
                  </Grid>
                  <TableWrapper>
                    <TimeseriesLineChart
                      data={filteredMutatedGraphData}
                      error={error}
                      isLoading={isFetching}
                      filterValues={filterValues}
                      yLLabel={`${filteredMutatedGraphData.parameter} (${filteredMutatedGraphData.units})`}
                      ref={saveRef}
                      title="Daily Groundwater Elevation"
                      // tooltipFormat="MM-DD-YYYY"
                      xLabelFormat="MM-DD-YYYY"
                      reverseLegend={false}
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
                    label="Daily Groundwater Elevation Timeseries Table"
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

export default GroundwaterElevation;
