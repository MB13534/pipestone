import React from "react";
import styled from "styled-components/macro";

import { Box, Typography as MuiTypography } from "@material-ui/core";

import { rgba } from "polished";

import { spacing } from "@material-ui/system";

const Typography = styled(MuiTypography)(spacing);

const Percentage = styled(MuiTypography)`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const Stats = ({ amount, percentageText, percentagecolor }) => {
  return (
    <>
      <Typography variant="h3" mb={3}>
        <Box fontWeight="fontWeightRegular">{amount}</Box>
      </Typography>
      <Percentage
        variant="subtitle2"
        mb={4}
        color="textSecondary"
        percentagecolor={percentagecolor}
      >
        <span>{percentageText}</span> Since last week
      </Percentage>
    </>
  );
};

export default Stats;
