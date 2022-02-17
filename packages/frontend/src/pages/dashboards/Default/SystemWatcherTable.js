import React, { useEffect, useState } from "react";
import useService from "../../../hooks/useService";
import { useQuery } from "react-query";

import {
  Grid as MuiGrid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography as MuiTypography,
} from "@material-ui/core";

import styled from "styled-components/macro";

import { findRawRecords } from "../../../services/crudService";
import { lineColors } from "../../../utils";
import { spacing } from "@material-ui/system";
import Loader from "../../../components/Loader";
import OptionsPicker from "../../../components/pickers/OptionsPicker";
import Paper from "@material-ui/core/Paper";
import * as PropTypes from "prop-types";

const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-head {
    background-color: ${lineColors.medGray};
  }
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(3) {
    background-color: ${lineColors.lightBlue};
    & .MuiTableCell-body {
      font-weight: bold;
    }
  }
  &:nth-of-type(4) {
    background-color: ${lineColors.aqua};
    & .MuiTableCell-body {
      color: white;
      font-weight: bold;
    }
  }
`;

const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

StyledTableCell.propTypes = { children: PropTypes.node };
const SystemWatcherTable = ({ tableHeight = "100%" }) => {
  const service = useService({ toast: false });

  const { data, error } = useQuery(
    ["StorageMitigation02TableForDashes"],
    async () => {
      try {
        const response = await service([
          findRawRecords,
          ["StorageMitigation02TableForDashes"],
        ]);
        return response;
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearsOptions, setYearsOptions] = useState([selectedYear]);
  useEffect(() => {
    if (data) {
      const uniqueYears = [...new Set(data.map((item) => item.d_year))];
      setYearsOptions(uniqueYears);
    }
  }, [data]);

  const monthsOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState(
    monthsOptions[new Date().getMonth()]
  );

  const [filteredData, setFilteredData] = useState(null);
  useEffect(() => {
    if (data && selectedYear && selectedMonth) {
      setFilteredData(
        data.filter(
          (item) =>
            item.d_year === selectedYear && item.month_name === selectedMonth
        )
      );
    }
  }, [data, selectedYear, selectedMonth]);

  if (error) return "An error has occurred: " + error.message;

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {!filteredData ? (
        <Loader />
      ) : (
        <>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <OptionsPicker
                selectedOption={selectedMonth}
                setSelectedOption={setSelectedMonth}
                options={monthsOptions}
                label="Month"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OptionsPicker
                selectedOption={selectedYear}
                setSelectedOption={setSelectedYear}
                options={yearsOptions}
                label="Calendar Year"
              />
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                {!Object.keys(filteredData).length ? (
                  "no data available"
                ) : (
                  <>
                    <Table aria-label="customized table" size="medium">
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>{`Summary through ${selectedMonth} ${selectedYear}`}</StyledTableCell>
                          <StyledTableCell>
                            Total Releases for the Month (AF)
                          </StyledTableCell>
                          <StyledTableCell>{`Total to-date for Accounting Year ${filteredData[0].accounting_year} (June - May) (AF)`}</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {filteredData.map((row, index) => {
                          return (
                            <StyledTableRow key={index}>
                              <StyledTableCell component="th" scope="row">
                                {row.measurement_desc}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.monthly_af}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.cumulative_af}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      mt={2}
                    >
                      <i>
                        Total Cumulative Supply over 200 AF:{" "}
                        <strong>
                          <span
                            style={{
                              color:
                                filteredData[2].cumulative_af > 200
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {filteredData[2].cumulative_af > 200 ? "Yes" : "No"}
                          </span>
                        </strong>
                      </i>
                    </Typography>

                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      mt={2}
                    >
                      <i>
                        Total Cumulative Supply over 300 AF:{" "}
                        <strong>
                          <span
                            style={{
                              color:
                                filteredData[2].cumulative_af > 300
                                  ? "red"
                                  : "black",
                            }}
                          >
                            {filteredData[2].cumulative_af > 300 ? "Yes" : "No"}
                          </span>
                        </strong>
                      </i>
                    </Typography>
                  </>
                )}
              </TableContainer>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default SystemWatcherTable;
