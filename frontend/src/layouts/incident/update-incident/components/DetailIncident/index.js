/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { updateIncident, getIncident } from "api/incidentAPI";

function DetailIncident() {
  const [isSubmited, setIsSubmited] = useState(false);
  const [reportSources, setReportSources] = useState([
    "Security Guard Tour",
    "Laporan User / Karyawan",
    "Laporan Security",
  ]);
  const [listStatus, setListStatus] = useState([
    "Created",
    "Verified",
    "Waiting for Approval",
    "Returned",
    "Approved",
    "Rejected",
    "Investigated",
    "Closed",
    "Freezed",
  ]);
  const [ListCategory, setListCategory] = useState([
    "Vandalisme",
    "Tata Tertib Confidentiality",
    "Tata Tertib Lalulintas",
    "Penemuan Barang",
    "Kehilangan Barang",
    "Perjudian",
    "Ancaman / Paksaan",
    "Berbuat Onar",
    "Fraud",
    "Sabotase",
    "Pencurian Barang Non-Pribadi",
    "Penyebaran Berita Palsu",
    "Membocorkan Rahasia Perusahaan",
    "Pengrusakan",
    "Politik Praktis",
  ]);
  const [listPlant, setListPlant] = useState([
    "P1 Sunter",
    "P2 Pegangsaan",
    "Pulo Gadung",
    "P3 Cikarang",
    "P4 Karawang",
    "P5 Karawang",
    "P6 Deltamas",
    "PQE",
    "SRTC",
  ]);

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
    status: "",
    reportSources: "",
    incidentDate: new Date().getTime(),
    phone: 0,
    reportSource: "Laporan User",
  });

  const navigate = useNavigate();
  const { incidentId } = useParams();

  const handleInputChange = (e) => {
    setIncidentDetail({ ...incidentDetail, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async () => {
    setIsSubmited(true);
    await updateIncident(incidentId, incidentDetail).then((response) => {
      setIncidentDetail({});
      navigate("/pages/incident/list-incident");
      setIsSubmited(false);
    });
  };

  const getIncidentDetail = async () => {
    await getIncident(incidentId).then((response) => {
      setIncidentDetail(response.data.incident);
    });
  };

  useEffect(() => {
    getIncidentDetail();
  }, []);

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      {incidentDetail._id && (
        <MDBox>
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
                  value={incidentDetail.reporterName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  name="reporterNRP"
                  label="NRP Pelapor"
                  type="number"
                  value={incidentDetail.reporterNRP}
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
                    options={listPlant}
                    value={incidentDetail.plant}
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
                    value={incidentDetail.category}
                    options={ListCategory}
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
                    value={incidentDetail.reporterDivision}
                    options={["HR", "GA", "IT", "SI", "Engineering", "System Integration"]}
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
                    value={incidentDetail.reporterDepartment}
                    options={[
                      "Security",
                      "Safety",
                      "Engineering",
                      "Production",
                      "Quality Control",
                      "Business Process Integration",
                    ]}
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
                      Sumber Laporan
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    onChange={(event, value) => {
                      setIncidentDetail({ ...incidentDetail, reportSource: value });
                    }}
                    value={incidentDetail.reportSource}
                    options={reportSources}
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
                      Status
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    onChange={(event, value) => {
                      setIncidentDetail({ ...incidentDetail, status: value });
                    }}
                    value={incidentDetail.status}
                    options={listStatus}
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
                  value={incidentDetail.organizationUnit}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormField
                  name="location"
                  label="Detail Lokasi Kejadian"
                  value={incidentDetail.location}
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
                  value={incidentDetail.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <MDTypography
                    component="label"
                    variant="button"
                    fontWeight="regular"
                    color="text"
                  >
                    Descriptions&nbsp;&nbsp;
                  </MDTypography>
                </MDBox>
                <MDEditor
                  value={incidentDetail.descriptions}
                  onChange={(value) =>
                    setIncidentDetail({ ...incidentDetail, descriptions: value })
                  }
                />
              </Grid>
            </Grid>

            <Grid container>
              <MDBox ml="auto" mt={3} display="flex">
                <MDBox mr={2}>
                  <MDButton
                    variant="gradient"
                    color="light"
                    onClick={() => navigate("/pages/incident/list-incident")}
                  >
                    Cancel
                  </MDButton>
                </MDBox>

                <MDBox>
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
              </MDBox>
            </Grid>
          </MDBox>
        </MDBox>
      )}
    </Card>
  );
}

export default DetailIncident;
