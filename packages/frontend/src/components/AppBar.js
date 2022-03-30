import React from "react";
import styled, { withTheme } from "styled-components/macro";

import {
  AppBar as MuiAppBar,
  Grid,
  Hidden,
  IconButton as MuiIconButton,
  Toolbar,
} from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

import UserDropdown from "./UserDropdown";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import useTheme from "@material-ui/core/styles/useTheme";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const BrandLogo = styled.img`
  height: 40px;
  margin-left: 12px;
  margin-right: 12px;
`;

const AppBarComponent = ({ onDrawerToggle }) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center">
            <Hidden mdUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              <UserDropdown />
            </Grid>
            <Grid item>
              <Tooltip title="Built by LRE Water">
                <Link
                  href="https://lrewater.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <BrandLogo
                    src={
                      theme.palette.type === "dark"
                        ? "/static/img/lrewater-logo-simple.svg"
                        : "/static/img/lrewater-logo-simple.svg"
                    }
                    alt={"LREWater.com"}
                  />
                </Link>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(AppBarComponent);
