import React from "react";

import {
  Grid as MuiGrid,
  Typography as MuiTypography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import styled from "styled-components/macro";

import DatePicker from "../../../components/Pickers/DatePicker";
import InputPicker from "../../../components/Pickers/InputPicker";
import TogglePicker from "../../../components/Pickers/TogglePicker";

const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);
const PointerDiv = styled.div`
  cursor: pointer;
`;

export function TimeseriesFilters({
  inputPickerValue,
  inputPickerValueSetter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  checked,
  setChecked,
}) {
  return (
    <>
      <Grid container mb={2} spacing={6} alignItems="center">
        <Grid item xs={12} sm={6}>
          <PointerDiv style={{ color: "#606368" }}>
            <Typography
              align="center"
              color={checked ? "textPrimary" : "inherit"}
              onClick={() => !checked && setChecked(!checked)}
            >
              Show the Most Current Data for the Last:
            </Typography>
          </PointerDiv>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputPicker
            label="Days"
            type="number"
            value={inputPickerValue}
            setter={inputPickerValueSetter}
            checked={checked}
          />
        </Grid>
      </Grid>

      <Typography variant="h2" align="center" mb={5}>
        <TogglePicker
          checked={checked}
          setChecked={setChecked}
          inputPickerValueSetter={inputPickerValueSetter}
        />
      </Typography>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} sm={6}>
          <PointerDiv style={{ color: "#606368" }}>
            <Typography
              align="center"
              color={checked ? "inherit" : "textPrimary"}
              onClick={() => checked && setChecked(!checked)}
            >
              Show the Data for the Time Period Between:
            </Typography>
          </PointerDiv>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <DatePicker
                selectedDate={startDate}
                setSelectedDate={setStartDate}
                label="Select Start Date"
                checked={checked}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                selectedDate={endDate}
                setSelectedDate={setEndDate}
                label="Select End Date"
                checked={checked}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
