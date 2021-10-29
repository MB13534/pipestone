import React, { useState } from "react";

import { Tab, Tabs as MuiTabs } from "@material-ui/core";

import styled from "styled-components/macro";

import { spacing } from "@material-ui/system";
import TimeseriesTemperature from "./TimeseriesTemperature";
import TimeseriesFlowVsStage from "./TimeseriesFlowVsStage";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
  height: 100%;
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

  const tabInfo = [{ label: "Temperature" }, { label: "Flow vs Stage" }];

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
          <TimeseriesTemperature />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <TimeseriesFlowVsStage />
        </TabPanel>
      </TableWrapper>
    </>
  );
};

export default GraphTabs;
