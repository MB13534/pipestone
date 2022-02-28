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

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const GroundwaterLevelVsPumping = () => {
  const { getAccessTokenSilently } = useAuth0();
  const saveRef = useRef(null);

  //date filter defaults
  const defaultFilterValues = {
    previousDays: "",
    startDate: add(new Date().getTime(), { days: -365 }),
    endDate: new Date(),
    checked: true,
    parameter: "Pumping Rate",
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
    { title: "Client Index", field: "client_ndx" },
    { title: "Exclude Auth0 User Ids", field: "exclude_auth0_user_id" },
    { title: "Measurement Type Index", field: "measurement_type_ndx" },
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
      name: "Well No. 3",
      ndx: 7,
    },
    {
      name: "FWS Monitoring Well",
      ndx: 44,
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
  const [selectedLocation, setSelectedLocation] = useState(
    locationsOptions[0].ndx
  );

  const handleFilter = (event) => {
    setSelectedLocation(event.target.value);
  };

  const { isLoading, error, data } = useQuery(
    ["timeseries-dtw-v-precip-or-baro-or-pumps", selectedLocation],
    async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/timeseries-dtw-v-precip-or-baro-or-pumps/${filterValues.parameter}/${selectedLocation}`,
          { headers }
        );
        return data;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  //filtered data for graph, it filters selected locations
  //it keeps every date so the graph can still be panned and zoomed
  //it also mutates the data to be consumed by chartsJS
  const [filteredMutatedGraphData, setFilteredMutatedGraphData] = useState([]);
  //filtered data for table. if filters selected locations
  //it also filters by date
  const [filteredTableData, setFilteredTableData] = useState([]);
  useEffect(() => {
    if (data) {
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
      const graphData = {
        labels: [...new Set(data.map((item) => item.collect_timestamp))],
        datasets: [
          {
            label: "Pumping",
            yAxisID: "yR",
            borderColor: lineColor.darkGray,
            backgroundColor: lineColor.darkGray,
            data: data
              .filter((item) => item.parameter === "Pumping Rate")
              .map((item) => item.measured_value),
            borderWidth: 4,
            ...defaultStyle,
          },
          {
            label: "Water Level",
            yAxisID: "yL",
            fill: true,
            borderColor: lineColors.lightBlue,
            backgroundColor: lineColors.lightBlue + "4D",
            data: data
              .filter((item) => item.parameter === "Depth to Groundwater")
              .map((item) => item.measured_value),
            borderWidth: 2,
            ...defaultStyle,
          },
        ],
      };
      setFilteredMutatedGraphData(graphData);
    }
  }, [data, filterValues, selectedLocation]);

  return (
    <>
      <Helmet title="Groundwater Level vs Pumping" />
      <Typography variant="h3" gutterBottom display="inline">
        Groundwater Level vs Pumping
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Groundwater Level vs Pumping</Typography>
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
                  <Grid container pb={6} mt={2}>
                    <Grid
                      item
                      style={{ flexGrow: 1, maxWidth: "calc(100% - 54px)" }}
                    >
                      <Select
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
                        width: "53px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SaveGraphButton
                        ref={saveRef}
                        title="Groundwater Level vs Pumping Timeseries Graph"
                      />
                    </Grid>
                  </Grid>

                  <TableWrapper>
                    <TimeseriesLineChart
                      data={filteredMutatedGraphData}
                      error={error}
                      isLoading={isLoading}
                      filterValues={filterValues}
                      locationsOptions={locationsOptions}
                      yLLabel="Water Level (feet above pump)"
                      yRLLabel="Pumping (GPM)"
                      ref={saveRef}
                      min={0}
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

export default GroundwaterLevelVsPumping;
