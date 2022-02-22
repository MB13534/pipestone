import React from "react";
import { Renderers } from "../../components/crud/ResultsRenderers";

import { CRUD_FIELD_TYPES } from "../../constants";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { HelpOutline } from "@material-ui/icons";

export const displayName = (row) => {
  return `${row.ffs_desc}`;
};

export function columns(modelName) {
  return [
    {
      field: "",
      headerName: "",
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      filterable: false,
      resizeable: false,
      align: "center",
      renderCell: (params) => {
        return Renderers.ActionsRenderer(params, modelName);
      },
    },
    {
      field: "ffs_desc",
      headerName: "Description",
      width: 350,
    },

    {
      field: "measurement_ndx",
      headerName: "Measurement Point",
      width: 250,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "dropdown_measurements",
      lookupKey: "measurement_ndx",
      lookupValue: "measurement_name",
    },

    {
      field: "ffs_low_stage",
      headerName: "From Stage",
      width: 175,
      renderCell: (params) =>
        params.value === -999 ? "No low limit." : params.value,
    },
    {
      field: "ffs_high_stage",
      headerName: "To Stage",
      width: 175,
      renderCell: (params) =>
        params.value === 999 ? "No high limit." : params.value,
    },
    {
      field: "ffs_calc_type_ndx",
      headerName: "Curve Type",
      width: 200,
      renderCell: Renderers.DropdownValueRenderer,
      lookupModel: "dropdown_ffs_calc_types",
      lookupKey: "ffs_calc_type_ndx",
      lookupValue: "ffs_calc_type_desc",
    },
    {
      field: "ffs_a",
      headerName: "Constant (C)",
      width: 180,
      renderCell: (params) => params.value ?? 1,
    },
    {
      field: "ffs_b",
      headerName: "Power Variable (u)",
      width: 220,
      renderCell: (params) => params.value ?? 1,
    },
    // {
    //   field: "ffs_c",
    //   headerName: "C",
    //   width: 150,
    //   renderCell: (params) => params.value ?? 0,
    // },
    {
      field: "ffs_shift",
      headerName: "Shift",
      width: 150,
      renderCell: (params) => params.value ?? 0,
    },
    {
      field: "ffs_effective_ts",
      headerName: "Start",
      width: 200,
      renderCell: Renderers.DateRenderer,
    },
    // {
    //   field: "ffs_ndx",
    //   headerName: "Index",
    //   width: 150,
    // },
    {
      field: "notes",
      headerName: "Notes",
      width: 400,
    },
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: Renderers.IdRenderer,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: Renderers.DateRenderer,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      renderCell: Renderers.DateRenderer,
    },
  ];
}

export const fields = [
  {
    type: CRUD_FIELD_TYPES.CUSTOM,
    component: () => (
      <Grid item xs={12}>
        <Tooltip
          arrow={false}
          title={
            <ul>
              <li>
                <Typography variant={"subtitle2"}>
                  Use names with date formats YYYY-MM-DD to YYYY-MM-DD so
                  records sort correctly.
                </Typography>
              </li>
              <li>
                <Typography variant={"subtitle2"}>
                  IMPORTANT - Precede rating curve names that are NOT Current
                  with a space. (By doing this, the Current curves will sort to
                  the very top, and the rest will sort in descending order
                  below.)
                </Typography>
              </li>
            </ul>
          }
        >
          <Typography variant={"h4"}>
            <HelpOutline style={{ fill: "#008FBA" }} /> Rating Curve Names
          </Typography>
        </Tooltip>
        <Divider mt={2} />
      </Grid>
    ),
  },
  {
    name: "Rating Curve Description",
    key: "ffs_desc",
    required: true,
    type: CRUD_FIELD_TYPES.TEXT,
    cols: 12,
    isOpen: true,
  },
  {
    name: "Applies to Measurement Point",
    key: "measurement_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "dropdown_measurements_ffs",
      key: "measurement_ndx",
      value: "measurement_name",
      crud: false,
    },
    cols: 8,
    isOpen: true,
  },
  {
    name: "Effective Date/Time",
    key: "ffs_effective_ts",
    required: true,
    type: CRUD_FIELD_TYPES.DATETIME,
    cols: 4,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Applies to Stage Values (FT)",
  },
  {
    name: "Low Stage (use -999 for no low limit)",
    key: "ffs_low_stage",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 5,
      min: -999,
      max: 999,
    },
    cols: 6,
    isOpen: true,
  },
  {
    name: "High Stage (use 999 for no high limit)",
    key: "ffs_high_stage",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 5,
      min: -999,
      max: 999,
    },
    cols: 6,
    isOpen: true,
  },
  {
    type: CRUD_FIELD_TYPES.SECTION_HEADER,
    title: "Curve Factors",
  },
  {
    name: "Curve Type",
    key: "ffs_calc_type_ndx",
    required: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "dropdown_ffs_calc_types",
      key: "ffs_calc_type_ndx",
      value: "notes",
      crud: false,
    },
    cols: 12,
    isOpen: true,
  },
  {
    name: "Shift",
    key: "ffs_shift",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 14,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Constant (C)",
    key: "ffs_a",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 14,
    },
    cols: 4,
    isOpen: true,
  },
  {
    name: "Power Variable (u)",
    key: "ffs_b",
    required: true,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      decimalScale: 14,
    },
    cols: 4,
    isOpen: true,
  },
  // {
  //   name: "C",
  //   key: "ffs_c",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.NUMBER,
  //   typeConfig: {
  //     decimalScale: 14,
  //   },
  //   cols: 3,
  //   isOpen: true,
  // },
  // {
  //   name: "Index",
  //   key: "ffs_ndx",
  //   required: true,
  //   type: CRUD_FIELD_TYPES.TEXT,
  //   cols: 6,
  //   isOpen: true,
  // },
  {
    type: CRUD_FIELD_TYPES.DIVIDER,
  },
  {
    name: "Notes",
    key: "notes",
    required: false,
    type: CRUD_FIELD_TYPES.MULTILINE_TEXT,
    cols: 12,
    isOpen: true,
  },
];

const config = {
  displayName,
  columns,
  fields,
};

export default config;
