import React from "react";
import styled from "styled-components/macro";

import {
  Button,
  Container,
  Grid,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants";

const Spacer = styled.div(spacing);

const Typography = styled(MuiTypography)(spacing);

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
  position: relative;
  background: ${(props) => props.theme.palette.background.paper};
  color: ${(props) => props.theme.palette.text};
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  opacity: 0.75;D
`;

function JoinUs() {
  return (
    <Wrapper pt={16} pb={16}>
      <Container>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" gutterBottom>
              Access the Water Level Monitoring Dashboard
            </Typography>
            <Subtitle variant="h5" gutterBottom>
              Log in with user profile:
            </Subtitle>
            <Spacer mb={4} />

            <Button
              color="primary"
              variant="contained"
              component={Link}
              to={ROUTES.PAGE_DASHBOARD}
            >
              View Dashboard
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default JoinUs;
