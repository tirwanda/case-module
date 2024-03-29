import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

import Header from "layouts/incident/investigate/components/Header";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DetailIncident from "./components/DetailIncident";
import IncidentPictures from "./components/IncidentPictures";
import Chronology from "./components/Chronology";
import ReportVerification from "./components/ReportVerification";

// API
import { getIncident } from "api/incidentAPI";
import Evidence from "./components/Evidence";
import Victim from "./components/Victim";
import Witness from "./components/Witness";

function Investigate() {
  const [incidentDetail, setIncidentDetail] = useState({});

  const { incidentId } = useParams();

  const getIncidentDetail = async () => {
    await getIncident(incidentId).then((response) => {
      setIncidentDetail(response.data.incident);
    });
  };

  useEffect(() => {
    getIncidentDetail();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar showRoutes={false} />
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <MDBox mb={3}>
              {incidentDetail && incidentDetail._id && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Header />
                  </Grid>
                  <Grid item xs={12}>
                    <DetailIncident incidentInfo={incidentDetail} />
                  </Grid>
                  <Grid item xs={12}>
                    <Chronology chronologyDetail={incidentDetail.chronology} />
                  </Grid>
                  <Grid item xs={12}>
                    <IncidentPictures incidentInfo={incidentDetail} />
                  </Grid>
                  <Grid item xs={12}>
                    <Evidence incidentInfo={incidentDetail} />
                  </Grid>
                  <Grid item xs={12}>
                    <Victim />
                  </Grid>
                  <Grid item xs={12}>
                    <Witness />
                  </Grid>
                  <Grid item xs={12}>
                    <ReportVerification incidentInfo={incidentDetail} />
                  </Grid>
                </Grid>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Investigate;
