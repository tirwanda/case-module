/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from "react";
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
import MDSnackbar from "components/MDSnackbar";

function DetailIncident() {
  const [isSubmited, setIsSubmited] = useState(false);
  const [successSB, setSuccesSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const [saveCount, setSaveCount] = useState(0);
  const [reportSources, setReportSources] = useState([
    "Security Guard Tour",
    "Laporan User / Karyawan",
    "Laporan Security",
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
    "Kebakaran",
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
    incidentDate: new Date().getTime(),
    phone: "",
    reportSource: "Laporan User / Karyawan",
  });

  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    setIncidentDetail({ ...incidentDetail, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async () => {
    setIsSubmited(true);
    await addIncident(incidentDetail).then((response) => {
      // navigate("/pages/incident/list-incident");
      setIncidentDetail({
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
        phone: "",
        reportSource: "Laporan User / Karyawan",
      });
      openSuccessSB("Berhasil Menambahkan Laporan Kejadian");
      setSaveCount(saveCount + 1);
      setIsSubmited(false);
    });
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Success"
      content={message}
      dateTime="A few seconds ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    setIncidentDetail({
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
      phone: "",
      reportSource: "Laporan User / Karyawan",
    });
    setIsSubmited(false);
  }, [saveCount]);

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
              value={incidentDetail.reporterName}
              label="Nama Pelapor"
              placeholder="ex: Bang Adnoh"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="reporterNRP"
              label="NRP Pelapor"
              value={incidentDetail.reporterNRP}
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
                options={ListCategory}
                value={incidentDetail.category}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="reporterDivision"
              label="Divisi Pelapor"
              placeholder="ex: Bang Adnoh"
              value={incidentDetail.reporterDivision}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="reporterDepartment"
              label="Departement Pelapor"
              placeholder="ex: Bang Adnoh"
              value={incidentDetail.reporterDepartment}
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
                  Sumber Laporan
                </MDTypography>
              </MDBox>
              <Autocomplete
                onChange={(event, value) => {
                  setIncidentDetail({ ...incidentDetail, reportSource: value });
                }}
                options={reportSources}
                value={incidentDetail.reportSource}
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
              placeholder="ex: Gedung H lantai 2"
              value={incidentDetail.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              name="phone"
              type="number"
              label="No Telepon Pelapor"
              value={incidentDetail.phone}
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
      {renderSuccessSB}
    </Card>
  );
}

export default DetailIncident;
