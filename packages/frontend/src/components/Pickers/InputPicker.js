import React from "react";

import { TextField as MuiTextField } from "@material-ui/core";

import styled from "styled-components/macro";

const TextField = styled(MuiTextField)`
  width: 100%;
`;

function InputPicker({ label, type, value, setter, checked }) {
  const handleChange = (e) => {
    setter(e.target.value);
  };

  return (
    <TextField
      variant="outlined"
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
      disabled={!checked}
    />
  );
}

export default InputPicker;
