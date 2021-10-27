import React from "react";
import { Card as MuiCard, CardContent, CardHeader } from "@material-ui/core";

import styled from "styled-components/macro";

const Card = styled(MuiCard)`
  margin-bottom: 12px;
`;

const ChartWrapper = styled.div`
  height: ${(props) => props.height || "100%"};
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  overflow-y: ${(props) => props.overflowY};
`;

function Panel({ children, title, rightHeader, height, overflowY = "false" }) {
  return (
    <Card>
      <CardHeader action={rightHeader} title={title} />
      <CardContent>
        <ChartWrapper overflowY={overflowY} height={height}>
          {children}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default Panel;
