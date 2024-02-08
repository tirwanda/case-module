import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/dashboards/securityPICArea/data/dataTableData";
import { getEmployes } from "api/employesAPI";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import MDButton from "components/MDButton";
import { getAllPICArea } from "api/picAreaAPI";

function SecurityPICArea() {
  const [picAreas, setPICAreas] = useState(dataTableData);
  const [successSB, setSuccesSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");

  const [listPlant, setListPlant] = useState(["P1 Sunter", "P2 Pegangsaan", "P3 Cikarang"]);
  const [searchParam, setSearchParam] = useState({
    plant: "",
    name: "",
    nrp: "",
    jabatan: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    setSearchParam({
      ...searchParam,
      [e.target.name]: e.target.value,
    });
  };

  const handleSeacrhForm = (data) => {
    console.log(data);
  };

  const openSuccessSB = (data) => {
    setSuccesSB(true);
    setMessage(data);
  };
  const closeSuccessSB = () => setSuccesSB(false);
  const openErrorSB = (data) => {
    setErrorSB(true);
    setMessage(data);
  };
  const closeErrorSB = () => setErrorSB(false);

  const getPICArea = () => {
    const role = localStorage.getItem("ROLE");

    if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN" || role === "ROLE_USER") {
      getAllPICArea()
        .then((res) => {
          setPICAreas({
            ...picAreas,
            rows: res.data.PICAreas.map((item) => ({
              ...item.employee,
            })),
          });
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  };

  useEffect(() => {
    getPICArea();
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Success"
      content={`Successfully deleting asset ${message}`}
      dateTime="A few seconds ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Failed to create line"
      content={message}
      dateTime="A few secons ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={1}>
        <Card id="basic-info" sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <MDTypography variant="h6">Search Options</MDTypography>
          </MDBox>
          <MDBox component="form" pb={3} px={3}>
            <Grid container spacing={3}>
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
                    options={listPlant}
                    onChange={(_, value) => {
                      setSearchParam({ ...searchParam, plant: value });
                    }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
              </Grid>
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
                      Nama Karyawan
                    </MDTypography>
                  </MDBox>
                  <FormField
                    name="name"
                    placeholder="contoh: Bang ADNOH"
                    onChange={handleInputChange}
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
                    NRP
                  </MDTypography>
                </MDBox>
                <FormField
                  name="nrp"
                  placeholder="ex: 124788"
                  type="number"
                  onChange={handleInputChange}
                />
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
                    Jabatan
                  </MDTypography>
                </MDBox>
                <FormField
                  name="jabatan"
                  placeholder="ex: Kepala Seksi"
                  onChange={handleInputChange}
                />
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
                    No Handphone
                  </MDTypography>
                </MDBox>
                <FormField
                  name="phone"
                  placeholder="ex: 0858881823"
                  type="number"
                  onChange={handleInputChange}
                />
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
                    Email
                  </MDTypography>
                </MDBox>
                <FormField
                  name="email"
                  placeholder="ex: adnoh@astra-honda.com"
                  onChange={handleInputChange}
                />
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
      <MDBox pt={1} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Master Data Security Area
            </MDTypography>
          </MDBox>
          <DataTable table={picAreas} canSearch />
        </Card>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SecurityPICArea;
