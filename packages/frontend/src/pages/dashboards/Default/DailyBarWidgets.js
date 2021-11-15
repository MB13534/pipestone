import React, { useState } from "react";

import { Chart } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import useService from "../../../hooks/useService";
import zoomPlugin from "chartjs-plugin-zoom";

import { Grid } from "@material-ui/core";
import Panel from "../../../components/panels/Panel";
import DailyBarWidget from "./DailyBarWidget";
import styled from "styled-components/macro";
import Loader from "../../../components/Loader";
import { useApp } from "../../../AppProvider";
import { filterDataByUser } from "../../../utils";

Chart.register(zoomPlugin);

const PadRight = styled.div`
  padding-right: 6px;
`;

const DailyBarWidgets = () => {
  const service = useService({ toast: false });

  const { currentUser } = useApp();

  const [distinctMeasurementTypes, setDistinctMeasurementTypes] = useState([]);
  const { data, isLoading, error } = useQuery(
    ["current-conditions-widgets", currentUser],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["CurrentConditionsWidgets"],
        ]);

        const data = filterDataByUser(response, currentUser);

        setDistinctMeasurementTypes([
          ...new Set(data.map((item) => item.measurement_type_desc)),
        ]);

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  if (error) return "An error has occurred: " + error.message;
  return (
    <>
      {data?.length === 0 ||
      isLoading ||
      distinctMeasurementTypes.length === 0 ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Panel
              title="Current Conditions Widgets"
              height="200px"
              overflowY={"auto"}
            >
              <Loader />
            </Panel>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          {distinctMeasurementTypes.map((type) => (
            <Grid item xs={12} md={12} lg={6} key={type}>
              <Panel title={type} height="200px" overflowY={"auto"}>
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
