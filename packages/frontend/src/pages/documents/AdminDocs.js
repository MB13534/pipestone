import React from "react";
import styled from "styled-components/macro";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px - 48px - 48px - 64px);
  position: relative;
`;

const AdminDocs = () => {
  return (
    <Container>
      <iframe
        src="https://drive.google.com/embeddedfolderview?id=1mVRA1DyU769jP-daptP9VsqdWfJdu7By#grid"
        width="100%"
        height="100%"
        frameBorder="1"
        title="Client Docs"
      />
    </Container>
  );
};

export default AdminDocs;
