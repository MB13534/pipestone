import React, { useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import { Grid as MuiGrid, Tab, Tabs as MuiTabs } from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Panel from "../../../components/panels/Panel";

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  max-height: calc(100% - 48px);
`;

const Tabs = styled(MuiTabs)(spacing);
const Grid = styled(MuiGrid)(spacing);

function a11yProps(index) {
  return {
    id: `review-table-${index}`,
    "aria-controls": `review-table-${index}`,
  };
}
//388px
const DischargeMonitoringReport = ({ tableHeight = "100%" }) => {
  const service = useService({ toast: false });

  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, error } = useQuery(
    ["DischargeMonitoringReports"],
    async () => {
      try {
        return await service([findRawRecords, ["DischargeMonitoringReports"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabInfo = [{ label: "Discharge Monitoring Report", data: data }];

  const tabColumns = [
    [
      { title: "Location", field: "dmr_location", width: "100%" },
      { title: "Year", field: "dmr_year" },
      { title: "Month", field: "month_abbrev" },
      { title: "Daily Max (DM)", field: "daily_maximum" },
      { title: "Max Weekly (MWAT)", field: "max_weekly_average" },
      { title: "Notes", field: "remark" },
    ],
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`pumping-tabpanel-${index}`}
        aria-labelledby={`pumping-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  };

  return (
    <>
      <Panel>
        <Grid container>
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
        </Grid>
        <TableWrapper>
          {tabColumns.map((tab, i) => (
            <TabPanel value={activeTab} index={i} key={i}>
              <Table
                isLoading={isLoading}
                label={tabInfo[i].label}
                columns={tabColumns[i]}
                data={data}
                height="600px"
              />
            </TabPanel>
          ))}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default DischargeMonitoringReport;
