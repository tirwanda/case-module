import { useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

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
import DOMPurify from "dompurify";
import dataTableEvidence from "../investigate/data/dataTableEvidence";
import { Divider } from "@mui/material";
import VictimDetail from "./components/VictimDetail";
import WitnessDetail from "./components/WitnessDetail";
import PerpetratorDetail from "./components/PerpetratorDetail";
import CallingLetterDetail from "./components/CallingLetterDetail";

function ViewIncident() {
  const [evidences, setEvidences] = useState(dataTableEvidence);
  const [incidentData, setIncidentData] = useState({});
  const [cleanHTML, setCleanHTML] = useState("");
  const { incidentId } = useParams();

  const getDetailIncident = async () => {
    await getIncident(incidentId).then((response) => {
      setCleanHTML(DOMPurify.sanitize(response.data.incident.chronology));
      setIncidentData(response.data.incident);
      setEvidences({
        ...evidences,
        rows: response.data.incident.evidences.map((evidence, index) => ({
          no: index + 1,
          evidenceName: evidence.evidenceName,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <Link href={evidence.attachment} target="_blank">
                <MDButton variant="text" color="dark">
                  <PageviewOutlinedIcon />
                  &nbsp;view
                </MDButton>
              </Link>
            </MDBox>
          ),
        })),
      });
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
            <MDBox mb={3} ml={2}>
              <MDTypography variant="h5" fontWeight="medium">
                Incident Details
              </MDTypography>
            </MDBox>

            {incidentData && (
              <Grid ml={2} container>
                <Grid item xs={12} lg={5} xl={5}>
                  <IncidentPicture image={incidentData.incidentPicture} />
                </Grid>
                <Grid item xs={12} lg={6} sx={{ mx: "auto" }}>
                  <IncidentInfo incident={incidentData} />
                </Grid>
              </Grid>
            )}

            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

            <MDBox mt={8} ml={2}>
              <MDBox mb={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6} xl={5}>
                    <MDTypography variant="h5" fontWeight="medium">
                      Kronologi Kejadian
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDTypography variant="button" fontWeight="regular" color="text">
                <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
              </MDTypography>
            </MDBox>

            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

            <MDBox mt={8}>
              <MDBox mb={1} ml={2}>
                <MDTypography variant="h5" fontWeight="medium">
                  Evidence
                </MDTypography>
              </MDBox>
              <DataTable canSearch table={evidences} />
            </MDBox>
            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />

            <VictimDetail />
            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
            <WitnessDetail />
            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
            <PerpetratorDetail />
            <Divider orientation="horizontal" sx={{ ml: -2, mr: 1 }} />
            <CallingLetterDetail />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ViewIncident;
