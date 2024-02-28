/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @material-ui core components
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Settings page components
import FormField from "layouts/incident/create-incident/components/FormField";
import MDEditor from "components/MDEditor";

// API
import { addIncident } from "api/incidentAPI";

function DetailIncident() {
  const [isSubmited, setIsSubmited] = useState(false);

  const [incidentDetail, setIncidentDetail] = useState({
    reporterName: "",
    reporterDivision: "",
    reporterDepartment: "",
    organizationUnit: "",
    reporterNRP: "",
    descriptions: "",
    category: "",
    plant: "",
    location: "",
    incidentDate: new Date().getTime(),
    phone: 0,
    reportSource: "Laporan User",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setIncidentDetail({ ...incidentDetail, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async () => {
    setIsSubmited(true);
    await addIncident(incidentDetail).then((response) => {
      navigate("/pages/incident/list-incident");
      setIsSubmited(false);
    });
  };

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">Incident Info</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              name="reporterName"
              label="Nama Pelapor"
              placeholder="ex: Bang Adnoh"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="reporterNRP"
              label="NRP Pelapor"
              type="number"
              placeholder="ex: Bang Adnoh"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDBox mb={3}>
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
                onChange={(event, value) => {
                  setIncidentDetail({ ...incidentDetail, plant: value });
                }}
                options={["Plant 1", "Plant 2", "Plant 3", "Plant 4"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDBox mb={3}>
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
                onChange={(event, value) => {
                  setIncidentDetail({ ...incidentDetail, category: value });
                }}
                options={["Kehilangan", "Pencurian", "Kecelakaan", "Kebakaran", "Perkelahian"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDBox mb={3}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  textTransform="capitalize"
                >
                  Divisi Pelapor
                </MDTypography>
              </MDBox>
              <Autocomplete
                onChange={(event, value) => {
                  setIncidentDetail({ ...incidentDetail, reporterDivision: value });
                }}
                options={["HR", "GA", "IT", "SI", "Engineering"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDBox mb={3}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  textTransform="capitalize"
                >
                  Departement Pelapor
                </MDTypography>
              </MDBox>
              <Autocomplete
                onChange={(event, value) => {
                  setIncidentDetail({ ...incidentDetail, reporterDepartment: value });
                }}
                options={["Security", "Safety", "Engineering", "Production", "Quality Control"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Waktu Kejadian"
                value={incidentDetail.incidentDate}
                onChange={(newValue) => {
                  setIncidentDetail({ ...incidentDetail, incidentDate: newValue.getTime() });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormField
              name="organizationUnit"
              label="Seksi / Unit Kerja Pelapor"
              placeholder="ex: Security Operational Sunter"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="location"
              label="Detail Lokasi Kejadian"
              placeholder="ex: Gedung H lantai 2"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="phone"
              type="number"
              label="No Telepon Pelapor"
              placeholder="ex: 08572348923"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <MDTypography component="label" variant="button" fontWeight="regular" color="text">
                Descriptions&nbsp;&nbsp;
              </MDTypography>
            </MDBox>
            <MDEditor
              value={incidentDetail.descriptions}
              onChange={(value) => setIncidentDetail({ ...incidentDetail, descriptions: value })}
            />
          </Grid>
        </Grid>

        <Grid container>
          <MDBox ml="auto" mt={3}>
            <MDButton
              variant="gradient"
              color="dark"
              onClick={handleSubmitForm}
              disabled={
                !(
                  incidentDetail.reporterName &&
                  incidentDetail.reporterNRP &&
                  incidentDetail.plant &&
                  incidentDetail.category &&
                  incidentDetail.location &&
                  incidentDetail.descriptions
                ) || isSubmited
              }
            >
              Submit
            </MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default DetailIncident;
