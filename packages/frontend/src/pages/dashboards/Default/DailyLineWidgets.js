import React from "react";

import { useQuery } from "react-query";
import { findRawRecords } from "../../../services/crudService";
import useService from "../../../hooks/useService";

import { Grid } from "@material-ui/core";
import Panel from "../../../components/panels/Panel";
import styled from "styled-components/macro";
import Loader from "../../../components/Loader";
import DailyLineWidget from "./DailyLineWidget";
import { groupByValue } from "../../../utils";

const PadRight = styled.div`
  padding-right: 6px;
`;

const DailyLineWidgets = () => {
  const service = useService({ toast: false });

  const {
    data: groupedData,
    isLoading,
    error,
  } = useQuery(
    ["CurrentLastfewWidgets"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["CurrentLastfewWidgets"],
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
                  <DailyLineWidget data={measurementTypeData} />
                </PadRight>
              </Panel>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};
export default DailyLineWidgets;
