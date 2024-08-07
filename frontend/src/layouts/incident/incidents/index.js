import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Icon } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/incident/incidents/data/dataTableData";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import MDButton from "components/MDButton";
import { getIncidents, searchOptionsIncident } from "api/incidentAPI";
import { Link } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function Incidents() {
  const [incidentList, setIncidentList] = useState(dataTableData);
  const [searchParam, setSearchParam] = useState({
    name: "",
    nrp: "",
    plant: "",
    category: "",
    status: "",
  });
  const [excelData, setExcelData] = useState("");
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
    "Pelecehan / Harassment",
    "Sabotase",
    "Pencurian Barang Non-Pribadi",
    "Penyebaran Berita Palsu",
    "Membocorkan Rahasia Perusahaan",
    "Pengrusakan",
    "Politik Praktis",
  ]);
  const [listStatus, setListStatus] = useState([
    "Created",
    "Verified",
    "Waiting for Approval",
    "Returned",
    "Approved",
    "Rejected",
    "Investigating",
    "Closed",
    "Freezed",
  ]);
  const role = localStorage.getItem("ROLE");
  const userId = localStorage.getItem("USER_ID");
  const location = localStorage.getItem("LOCATION");
  const jakartaArea = ["P1 Sunter", "P2 Pegangsaan", "Pulo Gadung"];
  const jabarArea = ["P3 Cikarang", "P4 Karawang", "P5 Karawang", "P6 Deltamas", "PQE", "SRTC"];
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const handleInputChange = (e) => {
    setSearchParam({ ...searchParam, [e.target.name]: e.target.value });
  };

  const getIncidentList = async () => {
    await getIncidents().then((response) => {
      formatDataToExcel(response.data.incidents);
      setIncidentList({
        ...incidentList,
        rows: response.data.incidents.map((incident) => {
          let investigators = incident.investigator;
          let canInvestigate = false; // Initialize canInvestigate variable
          if (
            (role === "ROLE_DEPT_HEAD" &&
              location === "JAKARTA" &&
              jakartaArea.includes(incident.plant)) ||
            (role === "ROLE_DEPT_HEAD" &&
              location === "JABAR" &&
              jabarArea.includes(incident.plant)) ||
            investigators.includes(userId) ||
            role === "ROLE_ADMIN"
          ) {
            canInvestigate = true; // Update canInvestigate based on conditions
          }

          return {
            ...incident,
            incidentDate: new Date(incident.incidentDate).toLocaleDateString(),
            actions: (
              <MDBox
                display="flex"
                justifyContent="center"
                mt={{ xs: 2, sm: 0 }}
                mr={{ xs: -1.5, sm: 0 }}
              >
                {canInvestigate && (
                  <MDButton
                    component={Link}
                    to={`/pages/investigate/${incident._id}`}
                    variant="text"
                    color="warning"
                    size="small"
                    style={{ padding: "10px" }}
                  >
                    <Icon>search</Icon>&nbsp;Investigate
                  </MDButton>
                )}

                {canInvestigate && (
                  <MDButton
                    component={Link}
                    size="small"
                    to={`/pages/incident/${incident._id}`}
                    variant="text"
                    color="dark"
                    style={{ padding: "10px" }}
                  >
                    <Icon>edit</Icon>&nbsp;Update
                  </MDButton>
                )}

                <MDButton
                  component={Link}
                  to={`/pages/view-incident/${incident._id}`}
                  size="small"
                  variant="text"
                  color="dark"
                  style={{ padding: "10px" }}
                >
                  <Icon>info</Icon>&nbsp;Detail
                </MDButton>
              </MDBox>
            ),
          };
        }),
      });
    });
  };

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const removeHTMLTags = (text) => {
    return text.replace(/<[^>]*>?/gm, "");
  };

  const formatDataToExcel = (data) => {
    setExcelData(
      data.map((incident) => ({
        Taggal_Kejadian: new Date(incident.incidentDate).toLocaleDateString(),
        Plant: incident.plant,
        Lokasi: incident.location,
        Category: incident.category,
        Status: incident.status,
        Department_Pelapor: incident.reporterDivision,
        Sumber_Laporan: incident.reportSource,
        Nama_Pelapor: incident.reporterName,
        NRP_Pelapor: incident.reporterNRP,
        Kronologi_Kejadian: `${removeHTMLTags(incident.chronology)}`,
        Description: `${removeHTMLTags(incident.descriptions)}`,
      }))
    );
  };

  const handleSeacrhForm = async (data) => {
    try {
      await searchOptionsIncident(data).then((response) => {
        formatDataToExcel(response.data.incidents);
        setIncidentList({
          ...incidentList,
          rows: response.data.incidents.map((incident) => {
            let investigators = incident.investigator;
            let canInvestigate = false; // Initialize canInvestigate variable
            if (
              (role === "ROLE_DEPT_HEAD" &&
                location === "JAKARTA" &&
                jakartaArea.includes(incident.plant)) ||
              (role === "ROLE_DEPT_HEAD" &&
                location === "JABAR" &&
                jabarArea.includes(incident.plant)) ||
              investigators.includes(userId) ||
              role === "ROLE_ADMIN"
            ) {
              canInvestigate = true; // Update canInvestigate based on conditions
            }

            return {
              ...incident,
              incidentDate: new Date(incident.incidentDate).toLocaleDateString(),
              actions: (
                <MDBox
                  display="flex"
                  justifyContent="center"
                  mt={{ xs: 2, sm: 0 }}
                  mr={{ xs: -1.5, sm: 0 }}
                >
                  {canInvestigate && (
                    <MDButton
                      component={Link}
                      to={`/pages/investigate/${incident._id}`}
                      variant="text"
                      color="warning"
                      size="small"
                      style={{ padding: "10px" }}
                    >
                      <Icon>search</Icon>&nbsp;Investigate
                    </MDButton>
                  )}

                  {canInvestigate && (
                    <MDButton
                      component={Link}
                      size="small"
                      to={`/pages/incident/${incident._id}`}
                      variant="text"
                      color="dark"
                      style={{ padding: "10px" }}
                    >
                      <Icon>edit</Icon>&nbsp;Update
                    </MDButton>
                  )}

                  <MDButton
                    component={Link}
                    to={`/pages/view-incident/${incident._id}`}
                    size="small"
                    variant="text"
                    color="dark"
                    style={{ padding: "10px" }}
                  >
                    <Icon>info</Icon>&nbsp;Detail
                  </MDButton>
                </MDBox>
              ),
            };
          }),
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getIncidentList();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar showRoutes={false} isMini />
      <MDBox pb={1}>
        <Card id="basic-info" sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <MDTypography variant="h6">Search Options</MDTypography>
          </MDBox>
          <MDBox component="form" pb={3} px={3}>
            <Grid container spacing={3}>
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
                      Nama Pelapor
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
                    NRP Pelapor
                  </MDTypography>
                </MDBox>
                <FormField
                  name="nrp"
                  placeholder="ex: 124788"
                  type="number"
                  onChange={handleInputChange}
                />
              </Grid>
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
                      Category
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    options={ListCategory}
                    onChange={(_, value) => {
                      setSearchParam({ ...searchParam, category: value });
                    }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
              </Grid>

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
                      Status
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    options={listStatus}
                    onChange={(_, value) => {
                      setSearchParam({ ...searchParam, status: value });
                    }}
                    renderInput={(params) => <MDInput {...params} variant="standard" />}
                  />
                </MDBox>
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
      <MDBox mt={3} mb={5}>
        <Card>
          <MDBox mb={1} ml={2} p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  List Incidents
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    onClick={() => exportToCSV(excelData, "List Incident")}
                  >
                    Export to Excel
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={incidentList} canSearch />
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Incidents;
