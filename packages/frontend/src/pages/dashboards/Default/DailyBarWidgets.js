import React, { useEffect, useState } from "react";

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
import MultiOptionsPicker from "../../../components/Pickers/MultiOptionsPicker";
import styled from "styled-components/macro";

Chart.register(zoomPlugin);

const PadRight = styled.div`
  padding-right: 6px;
`;

const DailyBarWidgets = () => {
  const service = useService({ toast: false });

  const { data, isLoading, error } = useQuery(
    ["current-conditions-widgets"],
    async () => {
      try {
        return await service([findRawRecords, ["CurrentConditionsWidgets"]]);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true }
  );

  const [selectedClients, setSelectedClients] = useState([]);
  const [clientsOptions, setClientsOptions] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      const distinctOptions = [...new Set(data.map((item) => item.client))];
      setClientsOptions(distinctOptions);
      setSelectedClients(distinctOptions);
    }
  }, [isLoading]); // eslint-disable-line

  const [filteredData, setFilteredData] = useState([]);
  const [distinctMeasurementTypes, setDistinctMeasurementTypes] = useState([]);
  useEffect(() => {
    if (clientsOptions?.length > 0) {
      const filterData = data.filter((item) =>
        selectedClients.includes(item.client)
      );

      setFilteredData(filterData);
      setDistinctMeasurementTypes([
        ...new Set(filterData.map((item) => item.measurement_type_desc)),
      ]);
    }
  }, [selectedClients]); // eslint-disable-line

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {!isLoading && data.length > 0 && (
        <Grid container spacing={6}>
          <Grid item sm={12}>
            {clientsOptions.length > 0 && (
              <MultiOptionsPicker
                selectedOptions={selectedClients}
                setSelectedOptions={setSelectedClients}
                options={clientsOptions}
                label="Clients"
              />
            )}
          </Grid>
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
                  <DailyBarWidget data={filteredData} measurementType={type} />
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
