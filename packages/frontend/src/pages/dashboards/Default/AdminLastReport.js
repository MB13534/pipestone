import React, { useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import {
  Grid as MuiGrid,
  IconButton,
  Tab,
  Tabs as MuiTabs,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import { dateFormatter, renderStatusChip } from "../../../utils";
import Table from "./Table";
import { spacing } from "@material-ui/system";
import { MoreVertical } from "react-feather";
import Panel from "../../../components/Panels/Panel";

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
const AdminLastReport = ({ tableHeight = "100%" }) => {
  const service = useService({ toast: false });

  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, error } = useQuery(
    ["admin-data-last-report"],
    async () => {
      try {
        return await service([findRawRecords, ["AdminDataLastReports"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  if (error) return "An error has occurred: " + error.message;

  const tabInfo = [
    { label: "Last Report", data: data },
    { label: "Period of Record", data: data },
  ];

  const tabColumns = [
    [
      { title: "Location", field: "location_name", width: "100%" },
      { title: "Parameter", field: "parameter" },
      {
        title: "Last Report",
        field: "last_collected",
        render: (rowData) => {
          return dateFormatter(rowData.last_collected, "YYYY MM DD, h:mm A");
        },
      },
      {
        title: "Last Value",
        field: "last_value",
        type: "numeric",
        render: (rowData) => {
          return rowData.last_value.toFixed(3);
        },
      },
      { title: "Units", field: "unit_desc" },
      {
        title: "Alert Status",
        field: "alert_status",
        render: (rowData) => {
          return renderStatusChip(rowData.alert_status);
        },
      },
    ],
    [
      { title: "Location", field: "location_name", width: "100%" },
      { title: "Parameter", field: "parameter" },
      {
        title: "POR Start",
        field: "por_start",
        render: (rowData) => {
          return dateFormatter(rowData.por_start, "YYYY MM DD");
        },
      },
      {
        title: "POR End",
        field: "por_end",
        render: (rowData) => {
          return dateFormatter(rowData.por_start, "YYYY MM DD");
        },
      },
      {
        title: "Min",
        field: "min_value",
        type: "numeric",
        render: (rowData) => {
          return rowData.min_value.toFixed(3);
        },
      },
      {
        title: "Max",
        field: "max_value",
        type: "numeric",
        render: (rowData) => {
          return rowData.max_value.toFixed(3);
        },
      },
      { title: "Count", field: "recordcount", type: "numeric" },
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
      <Panel
        title="Admin Last Report and Period of Record Review Table"
        rightHeader={
          <IconButton aria-label="settings">
            <MoreVertical />
          </IconButton>
        }
      >
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
                height={tableHeight}
              />
            </TabPanel>
          ))}
        </TableWrapper>
      </Panel>
    </>
  );
};

export default AdminLastReport;
