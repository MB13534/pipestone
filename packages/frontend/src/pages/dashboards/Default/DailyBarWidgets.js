import React from "react";

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
import { groupByValue } from "../../../utils";

Chart.register(zoomPlugin);

const PadRight = styled.div`
  padding-right: 6px;
`;

const DailyBarWidgets = () => {
  const service = useService({ toast: false });

  const {
    data: groupedData,
    isLoading,
    error,
  } = useQuery(
    ["CurrentConditionsWidgetsViews"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["CurrentConditionsWidgetsViews"],
        ]);

        const data = groupByValue(response, "measurement_type_ndx");

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  if (error) return "An error has occurred: " + error.message;
  return (
    <>
      {isLoading ? (
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
      ) : groupedData?.length === 0 ? null : (
        <Grid container spacing={6}>
          {groupedData.map((measurementTypeData) => (
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              key={measurementTypeData[0].measurement_type_ndx}
            >
              <Panel
                title={measurementTypeData[0].measurement_type_desc}
                height="200px"
                overflowY={"auto"}
              >
                <PadRight>
                  <DailyBarWidget data={measurementTypeData} />
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
