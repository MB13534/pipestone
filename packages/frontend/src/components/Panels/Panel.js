import React from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
} from "@material-ui/core";

import styled from "styled-components/macro";

const Card = styled(MuiCard)`
  // margin-bottom: 12px;
  height: 100%;
`;

const CardContent = styled(MuiCardContent)`
  height: calc(100% - 32px - 24px);
`;

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
  min-height: ${({ minHeight }) => minHeight};
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  overflow-y: ${(props) => props.overflowY};
`;

function Panel({
  children,
  title,
  rightHeader,
  height = "100%",
  minHeight = "0px",
  overflowY = "false",
}) {
  return (
    <Card>
      <CardHeader action={rightHeader} title={title} />
      <CardContent>
        <ChartWrapper
          overflowY={overflowY}
          height={height}
          minHeight={minHeight}
        >
          {children}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default Panel;
