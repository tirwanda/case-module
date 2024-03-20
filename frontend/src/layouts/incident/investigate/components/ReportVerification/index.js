import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import FormField from "../FormField";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "components/MDInput";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { updateIncidentByKaru } from "api/incidentAPI";

function ReportVerification({ incidentInfo }) {
  const { incidentId } = useParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [reportVerivications, setReportVerivications] = useState(
    incidentInfo.reportVerivications || {
      responsiblePIC: "",
      path: "",
      securityDevice: "",
      guard: "",
      workActivities: "",
      isPatrolRoute: false,
      lastPatrolDate: 0,
      lastPerson: "",
      sameIncident: "",
      damageAssets: "",
      totalLoss: 0,
      detailCondition: "",
      suspectVehicle: "",
      etc: "",
    }
  );

  const handleSubmit = async () => {
    await updateIncidentByKaru(incidentId, { reportVerivications }).then((response) => {
      alert("Report Verivications Updated");
      setIsUpdate(false);
    });
  };

  const handleOnChange = (e) => {
    setReportVerivications({ ...reportVerivications, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (incidentInfo.reportVerivications !== reportVerivications) {
      setIsUpdate(true);
    }
  }, [reportVerivications]);

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox>
        <MDBox p={3}>
          <MDTypography variant="h5">Hasil Veriviksi Laporan</MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3}>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Siapa PIC yang bertanggungjawab atau bertugas di area tersebut?
                </MDTypography>
              </MDBox>
              <FormField
                name="responsiblePIC"
                value={reportVerivications?.responsiblePIC || ""}
                placeholder="contoh: Bang Adnoh"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Berapa banyak jalur atau akses ke area TKP (Sebutkan Jalur Aksesnya)?
                </MDTypography>
              </MDBox>
              <FormField
                name="path"
                value={reportVerivications?.path || ""}
                placeholder="contoh: Ada 3 Jalur Akses. Jalur Akses 1, Jalur Akses 2, Jalur Akses 3"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Apa saja device security yang berada di area tersebut?
                </MDTypography>
              </MDBox>
              <FormField
                name="securityDevice"
                value={reportVerivications?.securityDevice || ""}
                placeholder="contoh: CCTV, Pagar, Pintu, dll"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Siapa petugas jaga di area tersebut?
                </MDTypography>
              </MDBox>
              <FormField
                name="guard"
                value={reportVerivications?.guard || ""}
                placeholder="contoh: Bambang, Budi, Pacul"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Apa saja kegiatan kerja di area tersebut?
                </MDTypography>
              </MDBox>
              <FormField
                name="workActivities"
                value={reportVerivications?.workActivities || ""}
                placeholder="contoh: Patrol"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Apakah jalur tersebut termasuk dalam jalur patroli ?
                </MDTypography>
              </MDBox>
              <Autocomplete
                onChange={(event, value) => {
                  if (value === "Yes") {
                    setReportVerivications({ ...reportVerivications, isPatrolRoute: true });
                  } else {
                    setReportVerivications({ ...reportVerivications, isPatrolRoute: false });
                  }
                }}
                value={reportVerivications?.isPatrolRoute ? "Yes" : "No"}
                options={["Yes", "No"]}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                  mr={3}
                >
                  Kapan terakhir kali dilakukan patroli di area tersebut?
                </MDTypography>
              </MDBox>
              <LocalizationProvider dateAdapter={AdapterDateFns} style={{ marginLeft: "20px" }}>
                <DateTimePicker
                  value={new Date(reportVerivications?.lastPatrolDate || new Date())}
                  onChange={(newValue) => {
                    setReportVerivications({
                      ...reportVerivications,
                      lastPatrolDate: newValue.getTime(),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Siapa orang terakhir yang mengakses area tersebut ?
                </MDTypography>
              </MDBox>
              <FormField
                name="lastPerson"
                value={reportVerivications?.lastPerson || ""}
                placeholder="contoh: Budi"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Sudah kejadian ke berapa dan kapan saja ?
                </MDTypography>
              </MDBox>
              <FormField
                name="sameIncident"
                value={reportVerivications?.sameIncident || ""}
                placeholder="contoh: 1 kali. 12/12/2021, 13/12/2021"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Asset apa saja yang rusak atau hilang ?
                </MDTypography>
              </MDBox>
              <FormField
                name="damageAssets"
                value={reportVerivications?.damageAssets || ""}
                placeholder="contoh: CCTV, ADL, dll"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Estimasi kerusakan atau kerugian jika bisa di prediksi ?
                </MDTypography>
              </MDBox>
              <FormField
                name="totalLoss"
                type="number"
                value={reportVerivications?.totalLoss || 0}
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Jelaskan detail kondisi yang terdapat di kejadian perkara ?
                </MDTypography>
              </MDBox>
              <FormField
                name="detailCondition"
                value={reportVerivications?.detailCondition || ""}
                placeholder="contoh: Pintu rusak, CCTV mati, dll"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Apakah ada kendaraan yang dicurigai berhenti di TKP atau area terdekat ?
                </MDTypography>
              </MDBox>
              <FormField
                name="suspectVehicle"
                value={reportVerivications?.suspectVehicle || ""}
                placeholder="contoh: Ya Ada, B 1234 JUK"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox mb={2}>
              <MDBox display="inline-block">
                <MDTypography
                  component="label"
                  variant="button"
                  fontWeight="bold"
                  color="text"
                  textTransform="capitalize"
                >
                  Apakah ada informasi lainnya ?
                </MDTypography>
              </MDBox>
              <FormField
                name="etc"
                value={reportVerivications?.etc || ""}
                placeholder="contoh: Pada jam 12.00 ada orang yang mencurigakan di area tersebut"
                onChange={handleOnChange}
              />
            </MDBox>
          </Grid>
          <Grid container>
            <MDBox ml="auto" mt={3} display="flex">
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="dark"
                  disabled={!isUpdate}
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

export default ReportVerification;
