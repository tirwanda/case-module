import { useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// ProductPage page components
import IncidentPicture from "layouts/incident/view-incident/components/IncidentPicture";
import IncidentInfo from "layouts/incident/view-incident/components/IncidentInfo";

// Data
import dataTableData from "layouts/incident/view-incident/data/dataTableData";
import { getIncident } from "api/incidentAPI";
import { useEffect, useState } from "react";

function ViewIncident() {
  const [incidentData, setIncidentData] = useState({});
  const { incidentId } = useParams();

  const getDetailIncident = async () => {
    await getIncident(incidentId).then((response) => {
      setIncidentData(response.data.incident);
    });
  };

  useEffect(() => {
    getDetailIncident();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar showRoutes={false} />
      <MDBox py={3}>
        <Card sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <MDBox mb={3}>
              <MDTypography variant="h5" fontWeight="medium">
                Incident Details
              </MDTypography>
            </MDBox>

            <Grid container spacing={1}>
              <Grid item xs={12} lg={5} xl={5}>
                <IncidentPicture />
              </Grid>
              <Grid item xs={12} lg={6} sx={{ mx: "auto" }}>
                <IncidentInfo incident={incidentData} />
              </Grid>
            </Grid>

            <MDBox mt={8} mb={2}>
              <MDBox mb={1} ml={2}>
                <MDTypography variant="h5" fontWeight="medium">
                  Other Products
                </MDTypography>
              </MDBox>
              <DataTable
                table={dataTableData}
                entriesPerPage={false}
                showTotalEntries={false}
                isSorted={false}
              />
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ViewIncident;
