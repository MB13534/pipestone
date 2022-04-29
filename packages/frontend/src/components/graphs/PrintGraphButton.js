import React, { forwardRef } from "react";

import { withTheme } from "styled-components/macro";
import { Tooltip as MuiTooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PrintIcon from "@material-ui/icons/Print";
import { spacing } from "@material-ui/system";

import styled from "styled-components/macro";

import { printChartImage } from "../../utils";

const Tooltip = styled(MuiTooltip)(spacing);

const PrintGraphButton = forwardRef(({ theme, title }, ref) => {
  return (
    <Tooltip title="Save PDF" arrow ml={2}>
      <IconButton
        onClick={() => printChartImage(title, ref)}
        style={{
          color:
            theme.palette.type === "dark"
              ? "rgba(255, 255, 255, 0.5)"
              : "rgb(117, 117, 117)",
        }}
        aria-label="download graph"
        component="span"
      >
        <PrintIcon />
      </IconButton>
    </Tooltip>
  );
});
export default withTheme(PrintGraphButton);
