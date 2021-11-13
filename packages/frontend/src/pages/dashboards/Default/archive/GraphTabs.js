// import React, { useState, useEffect } from "react";
//
// import {
//   Accordion,
//   AccordionDetails,
//   Grid,
//   Tab,
//   Tabs as MuiTabs,
//   Typography as MuiTypography,
// } from "@material-ui/core";
//
// import { add } from "date-fns";
//
// import styled from "styled-components/macro";
//
// import { spacing } from "@material-ui/system";
// import TimeseriesTemperature from "./TimeseriesTemperature";
// import TimeseriesFlow from "./TimeseriesFlow";
// import TimeseriesFlowVsStage from "./TimeseriesFlowVsStage";
// import Panel from "../../../components/Panels/Panel";
// import Map from "./Map";
// import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
// import AccordionSummary from "@material-ui/core/AccordionSummary";
// import TimeseriesFlowVsTargets from "./TimeseriesFlowVsTargets";
// import { TimeseriesFilters } from "./TimeseriesFilters";
// import TimeseriesPumpingDaily from "./TimeseriesPumpingDaily";
// import Table from "./Table";
//
// const TableWrapper = styled.div`
//   overflow-y: auto;
//   max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
//   max-height: calc(100% - 48px);
//   height: 100%;
//   width: 100%;
// `;
//
// const FiltersContainer = styled.div`
//   height: 100%;
//   width: 100%;
// `;
// const MapContainer = styled.div`
//   height: 300px;
//   width: 100%;
// `;
//
// const Typography = styled(MuiTypography)(spacing);
//
// const Tabs = styled(MuiTabs)(spacing);
//
// function a11yProps(index) {
//   return {
//     id: `review-table-${index}`,
//     "aria-controls": `review-table-${index}`,
//   };
// }
//
// const GraphTabs = () => {
//   const defaultFilterValues = {
//     previousDays: 7,
//     startDate: add(new Date(), { days: -7 }),
//     endDate: new Date(),
//     checked: true,
//   };
//
//   const [filterValues, setFilterValues] = useState(defaultFilterValues);
//
//   const changeFilterValues = (name, value) => {
//     setFilterValues((prevState) => {
//       let newFilterValues = { ...prevState };
//
//       newFilterValues[name] = value;
//
//       return newFilterValues;
//     });
//   };
//
//   const [activeTab, setActiveTab] = useState(0);
//
//   useEffect(() => {
//     console.log(tabInfo[activeTab]);
//   }, [activeTab]);
//
//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };
//
//   const tabInfo = [
//     {
//       label: "Streamflow",
//       component: <TimeseriesFlow filterValues={filterValues} />,
//     },
//     {
//       label: "Flow Vs Targets",
//       component: <TimeseriesFlowVsTargets filterValues={filterValues} />,
//     },
//     {
//       label: "Flow Vs Stage",
//       component: <TimeseriesFlowVsStage filterValues={filterValues} />,
//     },
//     {
//       label: "Temperature",
//       component: <TimeseriesTemperature filterValues={filterValues} />,
//     },
//     {
//       label: "Pumping",
//       component: <TimeseriesPumpingDaily filterValues={filterValues} />,
//     },
//   ];
//
//   const TabPanel = ({ children, value, index, ...other }) => {
//     return (
//       <div
//         style={{ height: "calc(100% - 72px)" }}
//         role="tabpanel"
//         hidden={value !== index}
//         id={`graph-tabpanel-${index}`}
//         aria-labelledby={`graph-tab-${index}`}
//         {...other}
//       >
//         {value === index && children}
//       </div>
//     );
//   };
//
//   return (
//     <>
//       <Grid container spacing={6}>
//         <Grid item xs={12} md={12} lg={7}>
//           <Accordion>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="map-content"
//               id="map-header"
//             >
//               <Typography variant="subtitle1" ml={2}>
//                 Map
//               </Typography>
//             </AccordionSummary>
//
//             <AccordionDetails>
//               <MapContainer>
//                 <Map />
//               </MapContainer>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>
//         <Grid item xs={12} md={12} lg={5}>
//           <Accordion>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="filter-controls"
//               id="filter-controls"
//             >
//               <Typography variant="subtitle1" ml={2}>
//                 Date Filters
//               </Typography>
//             </AccordionSummary>
//             <Panel>
//               <AccordionDetails>
//                 <FiltersContainer>
//                   <TimeseriesFilters
//                     filterValues={filterValues}
//                     changeFilterValues={changeFilterValues}
//                   />
//                 </FiltersContainer>
//               </AccordionDetails>
//             </Panel>
//           </Accordion>
//         </Grid>
//       </Grid>
//
//       <Grid container spacing={6}>
//         <Grid item xs={12}>
//           <Panel title="Time Series Graphs" height="600px">
//             <Tabs
//               mr={6}
//               mb={2}
//               indicatorColor="primary"
//               value={activeTab}
//               onChange={handleTabChange}
//               aria-label="Review Tables"
//             >
//               {tabInfo.map((tab, i) => (
//                 <Tab label={tab.label} {...a11yProps(i)} key={tab.label} />
//               ))}
//             </Tabs>
//
//             <TableWrapper>
//               {typeof filterValues?.previousDays !== "undefined" &&
//                 tabInfo.map((tab, i) => (
//                   <TabPanel value={activeTab} index={i} key={tab.label}>
//                     {tab.component}
//                   </TabPanel>
//                 ))}
//             </TableWrapper>
//           </Panel>
//         </Grid>
//       </Grid>
//
//       <Grid container spacing={6}>
//         <Grid item xs={12}>
//           <Accordion>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="table-content"
//               id="table-header"
//             >
//               <Typography variant="subtitle1" ml={2}>
//                 Table
//               </Typography>
//             </AccordionSummary>
//             <Panel>
//               <AccordionDetails>
//                 <TableWrapper>
//                   <Table
//                   // isLoading={isTimeseriesLoading}
//                   // label="This will be the label"
//                   // columns={columns}
//                   // data={tableData}
//                   // height="100%"
//                   />
//                 </TableWrapper>
//               </AccordionDetails>
//             </Panel>
//           </Accordion>
//         </Grid>
//       </Grid>
//     </>
//   );
// };
//
// export default GraphTabs;
