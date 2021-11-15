import React, { useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import { Grid as MuiGrid, Tab, Tabs as MuiTabs } from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import {
  dateFormatter,
  filterDataByUser,
  renderStatusChip,
} from "../../../utils";
import Table from "../../../components/Table";
import { spacing } from "@material-ui/system";
import Loader from "../../../components/Loader";
import { useApp } from "../../../AppProvider";

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

const SystemWatcherTable = ({ tableHeight = "100%" }) => {
  const service = useService({ toast: false });

  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, error } = useQuery(
    ["current-conditions-system-watcher", currentUser],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["CurrentConditionsSystemWatchers"],
        ]);

        return filterDataByUser(response, currentUser);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabInfo = [{ label: "Current Conditions", data: data }];

  const tabColumns = [
    [
      { title: "Location", field: "location_name", width: "100%" },
      {
        title: "Last Report",
        field: "last_collected",
        render: (rowData) => {
          return dateFormatter(rowData.last_collected, "YYYY MM DD, h:mm A");
        },
      },
      {
        title: "Alert Status",
        field: "alert_status",
        width: "100%",
        render: (rowData) => {
          return renderStatusChip(rowData.alert_status);
        },
      },
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

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
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
                {!isLoading && (
                  <Table
                    pageSize={5}
                    isLoading={isLoading}
                    label={tabInfo[i].label}
                    columns={tabColumns[i]}
                    data={data}
                    height={tableHeight}
                  />
                )}
              </TabPanel>
            ))}
          </TableWrapper>
        </>
      )}
    </>
  );
};

export default SystemWatcherTable;
