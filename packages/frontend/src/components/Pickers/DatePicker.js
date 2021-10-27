import React from "react";

import { FormControl as MuiFormControl } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import styled from "styled-components/macro";
import DateFnsUtils from "@date-io/date-fns";

const FormControl = styled(MuiFormControl)`
  width: 100%;
`;

function MultiChipPicker({ selectedDate, setSelectedDate, label }) {
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormControl>
        <KeyboardDatePicker
          inputVariant="outlined"
          autoOk
          disableToolbar
          format="MM/dd/yyyy"
          id="start-date-picker"
          label={label}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </FormControl>
    </MuiPickersUtilsProvider>
  );
}

export default MultiChipPicker;
