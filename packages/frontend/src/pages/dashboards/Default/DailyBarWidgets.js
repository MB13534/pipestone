import React, { useState } from "react";

import { Chart } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import useService from "../../../hooks/useService";
import zoomPlugin from "chartjs-plugin-zoom";

import { Grid, IconButton } from "@material-ui/core";
import Panel from "../../../components/Panels/Panel";
import { MoreVertical } from "react-feather";
import DailyBarWidget from "./DailyBarWidget";
import styled from "styled-components/macro";
import Loader from "../../../components/Loader";

Chart.register(zoomPlugin);

const PadRight = styled.div`
  padding-right: 6px;
`;

const DailyBarWidgets = () => {
  const service = useService({ toast: false });

  const [distinctMeasurementTypes, setDistinctMeasurementTypes] = useState([]);
  const { data, isLoading, error } = useQuery(
    ["current-conditions-widgets"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["CurrentConditionsWidgets"],
        ]);
        setDistinctMeasurementTypes([
          ...new Set(response.map((item) => item.measurement_type_desc)),
        ]);
        return response;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  if (error) return "An error has occurred: " + error.message;
  return (
    <>
      {isLoading || distinctMeasurementTypes.length === 0 ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Panel
              title="Current Conditions Widgets"
              height="200px"
              overflowY={"auto"}
              rightHeader={
                <IconButton aria-label="settings">
                  <MoreVertical />
                </IconButton>
              }
            >
              <Loader />
            </Panel>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          {distinctMeasurementTypes.map((type) => (
            <Grid item xs={12} md={6} lg={6} xl={4} key={type}>
              <Panel
                title={type}
                height="200px"
                overflowY={"auto"}
                rightHeader={
                  <IconButton aria-label="settings">
                    <MoreVertical />
                  </IconButton>
                }
              >
                <PadRight>
                  <DailyBarWidget data={data} measurementType={type} />
                </PadRight>
              </Panel>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};
export default DailyBarWidgets;
