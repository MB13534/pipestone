import React from "react";
import styled from "styled-components/macro";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Link,
  Typography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px - 48px - 48px - 64px - 104px);
  position: relative;
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const PublicFiles = () => {
  return (
    <>
      <Helmet title="Public Files" />
      <Typography variant="h3" gutterBottom display="inline">
        Public Files
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Typography>Public Files</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Container>
        <iframe
          src="https://drive.google.com/embeddedfolderview?id=1jmi7pFmVSeH46-_H2P44BQJMiTdloaSB#grid"
          width="100%"
          height="100%"
          frameBorder="1"
          title="Public Files"
        />
      </Container>
    </>
  );
};

export default PublicFiles;
