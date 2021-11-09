import React, { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  Grid,
  Tab,
  Tabs as MuiTabs,
  Typography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { spacing } from "@material-ui/system";
import TimeseriesTemperature from "./TimeseriesTemperature";
import TimeseriesFlow from "./TimeseriesFlow";
import TimeseriesFlowVsStage from "./TimeseriesFlowVsStage";
import Panel from "../../../components/Panels/Panel";
import Map from "./Map";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import TimeseriesFlowVsTargets from "./TimeseriesFlowVsTargets";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
  height: 100%;
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

  const tabInfo = [
    { label: "Streamflow" },
    { label: "Flow Vs Targets" },
    { label: "Flow Vs Stage" },
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
        <Grid item xs={12}>
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
              <TabPanel value={activeTab} index={0}>
                <TimeseriesFlow />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <TimeseriesFlowVsTargets />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <TimeseriesFlowVsStage />
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <TimeseriesTemperature />
              </TabPanel>
            </TableWrapper>
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};

export default GraphTabs;
