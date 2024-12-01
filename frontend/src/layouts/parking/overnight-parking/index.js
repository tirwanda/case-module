import { useState } from "react";

import CryptoJS from "crypto-js";
import axios from "axios";

// Case Module Security components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Images
import { Autocomplete, Grid, TextField } from "@mui/material";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Header from "./components/Header";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function OvernightPakring() {
  const [isSubmited, setIsSubmited] = useState(false);

  const [formData, setFormData] = useState({
    nrp: "",
    name: "",
    vehicle_number: "",
    vehicle_type: "",
    vehicle_model: "",
    phone_number: "",
    start_date: new Date(),
    end_date: new Date(),
    parking_area: "",
    plant: "",
    description: "",
  });

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

  const generateTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
  };

  const generateSign = (data) => {
    const timestamp = generateTimestamp();
    const dataString = `${JSON.stringify(data)}${timestamp}`;
    return CryptoJS.SHA512(dataString).toString(CryptoJS.enc.Hex);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async () => {
    setIsSubmited(true);
    const timestamp = generateTimestamp();
    const sign = generateSign(formData);

    try {
      const response = await axios.post(
        "https://setiaahm.com/ams/api/post-overnight-permit",
        {
          ...formData,
          sign: sign,
          timestamp: timestamp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Tambahkan header otentikasi jika diperlukan
            // Authorization: `Bearer ${your_token}`,
          },
        }
      );
      console.log(response.data);
      alert("Form submitted successfully!");
      setFormData({
        nrp: "",
        name: "",
        vehicle_number: "",
        vehicle_type: "",
        vehicle_model: "",
        phone_number: "",
        start_date: new Date(),
        end_date: new Date(),
        parking_area: "",
        plant: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to submit form. Please try again.");
    }
    console.log({ ...formData, sign: sign, timestamp: timestamp });
    setIsSubmited(false);
  };

  const isFormValid =
    formData.nrp &&
    formData.name &&
    formData.vehicle_number &&
    formData.vehicle_type &&
    formData.vehicle_model &&
    formData.phone_number &&
    formData.start_date &&
    formData.end_date &&
    formData.parking_area &&
    formData.plant &&
    formData.description;

  return (
    <PageLayout>
      <Header>
        <MDBox component="form" pt={5} pb={3} px={5}>
          <Grid container spacing={3} xs={12} sm={12}>
            {/* NRP */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="nrp"
                type="number"
                label="NRP Karyawan"
                placeholder="ex: 120327"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Nama Karyawan */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="name"
                label="Nama Karyawan"
                placeholder="ex: Alvin Zulham"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Plat Nomor Kendaraan */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="vehicle_number"
                label="Plat Nomor Kendaraan"
                placeholder="ex: G 2971 ARB"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Tipe Kendaraan */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="vehicle_type"
                label="Tipe Kendaraan"
                placeholder="c untuk motor, a untuk mobil"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Jenis Kendaraan */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="vehicle_model"
                label="Jenis Kendaraan"
                placeholder="ex: Scoopy"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Nomor HP */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone_number"
                type="number"
                label="Nomor HP Karyawan"
                placeholder="ex: 085784297132"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Tanggal Mulai */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Tanggal Mulai"
                  value={formData.start_date}
                  onChange={(newValue) => setFormData({ ...formData, start_date: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Tanggal Akhir */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Tanggal Akhir"
                  value={formData.end_date}
                  onChange={(newValue) => setFormData({ ...formData, end_date: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            {/* Lokasi Parkir */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="parking_area"
                label="Lokasi Parkir"
                placeholder="ex: pool lt 2"
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>

            {/* Plant */}
            <Grid item xs={12} sm={6} style={{ paddingTop: "9px" }}>
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
                  onChange={(event, value) => setFormData({ ...formData, plant: value })}
                  renderInput={(params) => <MDInput {...params} variant="standard" />}
                  options={listPlant}
                  value={formData.plant}
                />
              </MDBox>
            </Grid>

            {/* Keterangan */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Keterangan"
                placeholder="Deskripsi tambahan"
                multiline
                rows={4}
                variant="outlined"
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid container>
            <MDBox ml="auto" mt={3} px={3.5}>
              <MDButton
                variant="gradient"
                color="dark"
                disabled={!isFormValid || isSubmited}
                onClick={handleSubmitForm}
              >
                Submit
              </MDButton>
            </MDBox>
          </Grid>
        </MDBox>
      </Header>
    </PageLayout>
  );
}

export default OvernightPakring;
