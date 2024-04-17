import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Data
import dataTableData from "layouts/incident/incidents/data/dataTableData";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import MDButton from "components/MDButton";
import { getIncidents } from "api/incidentAPI";
import { Padding } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Incidents() {
  const [incidentList, setIncidentList] = useState(dataTableData);

  const getIncidentList = async () => {
    await getIncidents().then((response) => {
      setIncidentList({
        ...incidentList,
        rows: response.data.incidents.map((incident) => ({
          ...incident,
          incidentDate: new Date(incident.incidentDate).toLocaleDateString(),
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <MDButton
                component={Link}
                to={`/pages/investigate/${incident._id}`}
                variant="text"
                color="warning"
                size="small"
                style={{ padding: "10px" }}
              >
                <Icon>search</Icon>&nbsp;Investigate
              </MDButton>
              <MDButton
                component={Link}
                size="small"
                to={`/pages/incident/${incident._id}`}
                variant="text"
                color="dark"
                style={{ padding: "10px" }}
              >
                <Icon>edit</Icon>&nbsp;Update
              </MDButton>
              <MDButton
                component={Link}
                to={`/pages/view-incident/${incident._id}`}
                size="small"
                variant="text"
                color="dark"
                style={{ padding: "10px" }}
              >
                <Icon>info</Icon>&nbsp;Detail
              </MDButton>
            </MDBox>
          ),
        })),
      });
    });
  };

  useEffect(() => {
    getIncidentList();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar showRoutes={false} isMini />
      <MDBox pb={1}>
        <Card id="basic-info" sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <MDTypography variant="h6">Search Options</MDTypography>
          </MDBox>
          <MDBox component="form" pb={3} px={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MDBox>
                  <MDBox display="inline-block">
                    <MDTypography
                      component="label"
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      textTransform="capitalize"
                    >
                      Nama Pelapor
                    </MDTypography>
                  </MDBox>
                  <FormField
                    name="name"
                    placeholder="contoh: Bang ADNOH"
                    // onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox display="inline-block">
                  <MDTypography
                    component="label"
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    textTransform="capitalize"
                  >
                    NRP Pelapor
                  </MDTypography>
                </MDBox>
                <FormField
                  name="nrp"
                  placeholder="ex: 124788"
                  type="number"
                  // onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <MDBox>
                  <MDBox display="inline-block">
                    <MDTypography
                      component="label"
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      textTransform="capitalize"
                    >
                      Plant
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    options={["Plant 1", "Plant 2", "Plant 3", "Plant 4"]}
                    // onChange={(_, value) => {
                    //   setSearchParam({ ...searchParam, plant: value });
                    // }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <MDBox>
                  <MDBox display="inline-block">
                    <MDTypography
                      component="label"
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      textTransform="capitalize"
                    >
                      Category
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    options={["Kehilangan", "Pencurian", "Kecelakaan", "Kebakaran", "Perkelahian"]}
                    // onChange={(_, value) => {
                    //   setSearchParam({ ...searchParam, plant: value });
                    // }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <MDBox>
                  <MDBox display="inline-block">
                    <MDTypography
                      component="label"
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      textTransform="capitalize"
                    >
                      Status
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    options={["Active", "Inactive"]}
                    onChange={(_, value) => {
                      setSearchParam({ ...searchParam, status: value });
                    }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6} mt={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Waktu Kejadian"
                    value={new Date(Date.now())}
                    onChange={(newValue) => {
                      setIncidentDetail({ ...incidentDetail, incidentDate: newValue.getTime() });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </MDBox>
          <Grid container>
            <MDBox ml="auto" mt={2} mb={2} mr={2}>
              <MDButton
                variant="gradient"
                color="dark"
                onClick={() => handleSeacrhForm(searchParam)}
              >
                Search
              </MDButton>
            </MDBox>
          </Grid>
        </Card>
      </MDBox>
      <MDBox mt={3} mb={5}>
        <Card>
          <MDBox mb={1} ml={2} p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  List Incidents
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox>
                  <MDButton variant="gradient" color="dark" size="small">
                    Export to Excel
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={incidentList} canSearch />
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Incidents;
