import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Divider as MuiDivider,
  Grid,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { useAuth0 } from "@auth0/auth0-react";
import Map from "../../../components/map/Map";
import Panel from "../../../components/panels/Panel";
import DailyBarWidgets from "./DailyBarWidgets";
// import SystemWatcherTable from "./SystemWatcherTable";
import DailyLineWidgets from "./DailyLineWidgets";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default() {
  const { user } = useAuth0();

  return (
    <React.Fragment>
      <Helmet title="Landing Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Current Conditions Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Welcome back, {user?.name}!
          </Typography>
        </Grid>

        <Grid item />
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Panel minHeight="60vh">
            <Map />
          </Panel>
        </Grid>
        {/*<Grid item xs={12} lg={7}>*/}
        {/*  <Panel>*/}
        {/*    <SystemWatcherTable />*/}
        {/*  </Panel>*/}
        {/*</Grid>*/}
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <DailyLineWidgets />
          <DailyBarWidgets />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Default;
