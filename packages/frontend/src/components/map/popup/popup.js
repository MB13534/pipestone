import React from "react";
import styled from "styled-components/macro";

const PopupWrap = styled.div`
  // height: 200px;
  overflow-y: scroll;
  width: 300px;
`;

const PopupTable = styled.table`
  border-radius: 5px;
  border-collapse: collapse;
  border: 1px solid #ccc;
  width: 100%;
`;

const PopupRow = styled.tr`
  border-radius: 5px;
  &:nth-child(even) {
    background-color: #eee;
  }
`;

const PopupCell = styled.td`
  padding: 3px 6px;
  margin: 0;
`;

const Popup = ({ feature }) => {
  const popupData = feature?.properties?.popup.split(";");

  return (
    <>
      <h2>{feature?.properties?.description}</h2>
      <PopupWrap>
        <PopupTable>
          <tbody>
            {popupData?.map((item) => {
              return (
                <PopupRow key={item}>
                  <PopupCell>{item}</PopupCell>
                </PopupRow>
              );
            })}
          </tbody>
        </PopupTable>
      </PopupWrap>
    </>
  );
};

export default Popup;
