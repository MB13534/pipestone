import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Divider as MuiDivider,
  Grid,
  IconButton,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Actions from "./Actions";
import { useAuth0 } from "@auth0/auth0-react";
import Map from "./Map";
import Panel from "../../../components/Panels/Panel";
import { MoreVertical } from "react-feather";
import GraphTabs from "./GraphTabs";
import AdminLastReport from "./AdminLastReport";
import DailyBarWidgets from "./DailyBarWidgets";
import SystemWatcherTable from "./SystemWatcherTable";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default() {
  const { user } = useAuth0();

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Welcome back, {user?.nickname}!
          </Typography>
        </Grid>

        <Grid item>
          <Actions />
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <Panel
            title="Map"
            minHeight="551px"
            rightHeader={
              <IconButton aria-label="settings">
                <MoreVertical />
              </IconButton>
            }
          >
            <Map />
          </Panel>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Panel
            title="System Watcher Table"
            rightHeader={
              <IconButton aria-label="settings">
                <MoreVertical />
              </IconButton>
            }
          >
            <SystemWatcherTable tableHeight="388px" />
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <DailyBarWidgets chartHeight={"200px"} />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          <Panel
            title="Admin Last Report and Period of Record Review Table"
            rightHeader={
              <IconButton aria-label="settings">
                <MoreVertical />
              </IconButton>
            }
          >
            <AdminLastReport tableHeight="388px" />
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Panel
            title="Timeseries Graphs"
            height="600px"
            rightHeader={
              <IconButton aria-label="settings">
                <MoreVertical />
              </IconButton>
            }
          >
            <GraphTabs />
          </Panel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Default;
