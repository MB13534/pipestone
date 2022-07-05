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

import {
  dateFormatter,
  groupByValue,
  lineColors as lineColor,
  lineColors,
} from "../../../utils";

import Panel from "../../../components/panels/Panel";
import Map from "../../../components/map/Map";
import TimeseriesFilters from "../../../components/filters/TimeseriesFilters";
import SaveGraphButton from "../../../components/graphs/SaveGraphButton";
import Table from "../../../components/Table";
import TimeseriesLineChart from "../../../components/graphs/TimeseriesLineChart";
import { Select } from "@lrewater/lre-react";

import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import PrintGraphButton from "../../../components/graphs/PrintGraphButton";

const BoldSelect = styled(Select)`
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

const DailyTotalPumpingVsAvgDailyPumpingRates = () => {
  const { getAccessTokenSilently } = useAuth0();
  const saveRef = useRef(null);

  const [graphAccordionExpanded, setGraphAccordionExpanded] = useState(true);

  //date filter defaults
  const defaultFilterValues = {
    previousDays: 365,
    startDate: null,
    endDate: new Date(),
    checked: true,
    yL: "Total Daily Pumped",
    yR: "Avg Daily Pumping Rate",
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
    { title: "Hours Pumped", field: "hours_pumped" },
  ];

  const locationsOptions = [
    {
      name: "Well No. 1 (222588)",
      ndx: 5,
    },
    {
      name: "Well No. 2 (222589)",
      ndx: 6,
    },
    {
      name: "Well No. 4 (222584)",
      ndx: 7,
    },
    {
      name: "Well No. 5 (222547)",
      ndx: 8,
    },
    {
      name: "Well No. 6 (825015)",
      ndx: 9,
    },
  ];

  //locations in picker that are selected by user
  const [selectedLocation, setSelectedLocation] = useState(
    locationsOptions[0].ndx
  );

  const handleFilter = (event) => {
    setSelectedLocation(event.target.value);
  };

  const [graphData, setGraphData] = useState();
  const { isFetching, error, data } = useQuery(
    ["timeseries-final-elevation-v-gpm", selectedLocation],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-final-totalpumped-v-gpm/${selectedLocation}`,
          { headers }
        );
        const groupedDataArray = groupByValue(data, "parameter");
        const groupedDataObj = {};
        groupedDataArray.forEach(
          (item) => (groupedDataObj[item[0].parameter] = item)
        );
        setGraphData(groupedDataObj);

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: false, refetchOnWindowFocus: false }
  );

  //filtered data for graph, it filters selected locations
  //it keeps every date so the graph can still be panned and zoomed
  //it also mutates the data to be consumed by chartsJS
  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);
  //filtered data for table. if filters selected locations
  //it also filters by date
  const [filteredTableData, setFilteredTableData] = useState([]);
  useEffect(() => {
    if (data && graphData) {
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
        labels: graphData[filterValues["yL"]].map(
          (item) => item.collect_timestamp
        ),
        datasets: [
          {
            label: "Permitted Maximum",
            units: graphData[filterValues["yR"]]
              ? graphData[filterValues["yR"]][0].units
              : null,
            yAxisID: "yR",
            fill: false,
            borderColor: lineColors.maroon,
            backgroundColor: lineColors.maroon,
            data: graphData[filterValues["yR"]]?.map(
              (item) => item.max_pumping_rate
            ),
            borderWidth: 3,
            ...defaultStyle,
          },
          {
            label: filterValues["yR"],
            units: graphData[filterValues["yR"]]
              ? graphData[filterValues["yR"]][0].units
              : null,
            yAxisID: "yR",
            borderColor: lineColor.darkGray,
            backgroundColor: lineColor.darkGray,
            data: graphData[filterValues["yR"]]?.map(
              (item) => item.measured_value
            ),
            borderWidth: 2,
            ...defaultStyle,
          },
          {
            label: filterValues["yL"],
            units: graphData[filterValues["yL"]]
              ? graphData[filterValues["yL"]][0].units
              : null,
            yAxisID: "yL",
            fill: true,
            borderColor: lineColors.lightBlue,
            backgroundColor: lineColors.lightBlue + "4D",
            data: graphData[filterValues["yL"]]?.map(
              (item) => item.measured_value
            ),
            popupInfo: graphData[filterValues["yL"]]?.map(
              (item) => item.hours_pumped || 0
            ),
            borderWidth: 3,
            ...defaultStyle,
          },
        ],
      };
      setFilteredMutatedGraphData(mutatedGraphData);
    }
  }, [data, graphData, filterValues, selectedLocation]);

  return (
    <>
      <Helmet title="Groundwater Level vs Pumping" />
      <Typography variant="h3" gutterBottom display="inline">
        Daily Total Pumping vs Average Daily Pumping Rates
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>
          Daily Total Pumping vs Average Daily Pumping Rates
        </Typography>
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
                <Map
                  locationsToInclude={locationsOptions.map(
                    (location) => location.name
                  )}
                />
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
                  <Grid container pb={6} mt={2}>
                    <Grid
                      item
                      style={{ flexGrow: 1, maxWidth: "calc(100% - 54px)" }}
                    >
                      <BoldSelect
                        name="locations"
                        label="Locations"
                        variant="outlined"
                        outlineColor="primary"
                        labelColor="primary"
                        valueField="ndx"
                        displayField="name"
                        data={locationsOptions}
                        value={selectedLocation}
                        onChange={handleFilter}
                        fullWidth
                      />
                    </Grid>
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
                        title="Groundwater Level vs Pumping Timeseries Graph"
                      />
                      <PrintGraphButton
                        ref={saveRef}
                        title="Groundwater Level vs Pumping Timeseries Graph"
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
                      yLLabel={
                        graphData &&
                        graphData[filterValues["yL"]] &&
                        `${graphData[filterValues["yL"]][0]?.parameter} (${
                          graphData[filterValues["yL"]][0]?.units
                        })`
                      }
                      yRLLabel={
                        graphData &&
                        graphData[filterValues["yR"]] &&
                        `${graphData[filterValues["yR"]][0]?.parameter} (${
                          graphData[filterValues["yR"]][0]?.units
                        })`
                      }
                      ref={saveRef}
                      tooltipFormat="MM-DD-YYYY"
                      footerLabel="Hours Pumped"
                      title={`Groundwater Level vs Pumping for ${
                        locationsOptions.find(
                          (location) => location.ndx === selectedLocation
                        ).name
                      }`}
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
                    label="Groundwater Level vs Pumping Timeseries Table"
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

export default DailyTotalPumpingVsAvgDailyPumpingRates;
