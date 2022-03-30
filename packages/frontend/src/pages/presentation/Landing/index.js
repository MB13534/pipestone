import React from "react";

import styled from "styled-components/macro";

import AppBar from "./AppBar";
import Introduction from "./Introduction";
//import Features from "./Features";
//import FAQ from "./FAQ";
import JoinUs from "./JoinUs";
import Footer from "../../../components/Footer";

const FillContainer = styled.div`
  height: calc(100vh - 470px - 280px - 60px);
  // min-height: 200px;
`;

function Presentation() {
  return (
    <React.Fragment>
      <AppBar />
      <Introduction />
      {/*<Features />*/}
      {/*<FAQ />*/}
      <JoinUs />
      <FillContainer />
      <Footer />
    </React.Fragment>
  );
}

export default Presentation;
