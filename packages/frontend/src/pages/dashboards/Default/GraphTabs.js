import React, { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  Grid,
  Tab,
  Tabs as MuiTabs,
  Typography,
} from "@material-ui/core";

import { add } from "date-fns";

import styled from "styled-components/macro";

import { spacing } from "@material-ui/system";
import TimeseriesTemperature from "./TimeseriesTemperature";
import TimeseriesFlow from "./TimeseriesFlow";
import Panel from "../../../components/Panels/Panel";
import { useApp } from "../../../AppProvider";
import { EXCLUDED_USERS } from "../../../constants";
import Map from "./Map";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import TimeseriesFlowVsTargets from "./TimeseriesFlowVsTargets";
import { TimeseriesFilters } from "./TimeseriesFilters";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
  height: 100%;
`;

const FiltersContainer = styled.div`
  height: 100%;
  width: 100%;
`;
const MapContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const Tabs = styled(MuiTabs)(spacing);

function a11yProps(index) {
  return {
    id: `review-table-${index}`,
    "aria-controls": `review-table-${index}`,
  };
}

const GraphTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [previousDays, setPreviousDays] = useState(7);
  const [startDate, setStartDate] = useState(add(new Date(), { days: -7 }));
  const [endDate, setEndDate] = useState(new Date());
  const [checked, setChecked] = useState(true);

  const { currentUser } = useApp();

  const tabInfo =
    currentUser?.sub === EXCLUDED_USERS
      ? [{ label: "Flow Vs Targets" }]
      : [
          { label: "Streamflow" },
          { label: "Flow Vs Targets" },
          { label: "Temperature" },
        ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        style={{ height: "calc(100% - 72px)" }}
        role="tabpanel"
        hidden={value !== index}
        id={`graph-tabpanel-${index}`}
        aria-labelledby={`graph-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={7}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="map-content"
              id="map-header"
            >
              <Typography variant="subtitle1">Map</Typography>
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
              aria-controls="filter-controls"
              id="filter-controls"
            >
              <Typography variant="subtitle1">Date Filters</Typography>
            </AccordionSummary>
            <Panel>
              <AccordionDetails>
                <FiltersContainer>
                  <TimeseriesFilters
                    inputPickerValue={previousDays}
                    inputPickerValueSetter={setPreviousDays}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    checked={checked}
                    setChecked={setChecked}
                  />
                </FiltersContainer>
              </AccordionDetails>
            </Panel>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Panel title="Time Series Graphs" height="600px">
            <Tabs
              mr={6}
              mb={2}
              indicatorColor="primary"
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Review Tables"
            >
              {tabInfo.map((tab, i) => (
                <Tab label={tab.label} {...a11yProps(i)} key={tab.label} />
              ))}
            </Tabs>

            <TableWrapper>
              {currentUser?.sub !== EXCLUDED_USERS && (
                <TabPanel value={activeTab} index={0}>
                  <TimeseriesFlow
                    inputPickerValue={previousDays}
                    endDate={endDate}
                    startDate={startDate}
                    checked={checked}
                  />
                </TabPanel>
              )}
              <TabPanel
                value={activeTab}
                index={currentUser?.sub !== EXCLUDED_USERS ? 1 : 0}
              >
                <TimeseriesFlowVsTargets
                  inputPickerValue={previousDays}
                  endDate={endDate}
                  startDate={startDate}
                  checked={checked}
                />
              </TabPanel>
              {currentUser?.sub !== EXCLUDED_USERS && (
                <TabPanel value={activeTab} index={2}>
                  <TimeseriesTemperature
                    inputPickerValue={previousDays}
                    endDate={endDate}
                    startDate={startDate}
                    checked={checked}
                  />
                </TabPanel>
              )}
            </TableWrapper>
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};

export default GraphTabs;
