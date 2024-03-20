import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDEditor from "components/MDEditor";
import MDButton from "components/MDButton";
import { updateIncidentByKaru } from "api/incidentAPI";

function Chronology({ chronologyDetail }) {
  const [chronology, setChronology] = useState(chronologyDetail);
  const [isChanged, setIsChanged] = useState(false);

  const { incidentId } = useParams();

  const handleSubmit = async () => {
    await updateIncidentByKaru(incidentId, { chronology }).then((response) => {
      setChronology(response.data.incident.chronology);
      chronologyDetail = response.data.incident.chronology;
    });
    setIsChanged(false);
  };

  useEffect(() => {}, [chronology, chronologyDetail]);

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox>
        <MDBox p={3}>
          <MDTypography variant="h5">Chronology</MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <MDEditor
                value={chronology}
                onChange={(value) => {
                  setChronology(value);
                  setIsChanged(true);
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <MDBox ml="auto" mt={3} display="flex">
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="dark"
                  disabled={!isChanged}
                  onClick={handleSubmit}
                >
                  Submit
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Chronology;
