import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import TextField from "@mui/material/TextField";

// Data
import dataTableData from "layouts/dashboards/securityPICArea/data/dataTableData";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import MDButton from "components/MDButton";
import { getAllPICArea } from "api/picAreaAPI";
import tableDataEmployee from "./data/tableDataEmployee";
import { getEmployesNotInPICArea } from "api/picAreaAPI";
import { addPICArea } from "api/picAreaAPI";
import { deletePICArea } from "api/picAreaAPI";
import { updatePICArea } from "api/picAreaAPI";
import { de } from "date-fns/locale";

function SecurityPICArea() {
  const [picAreas, setPICAreas] = useState(dataTableData);
  const [successSB, setSuccesSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [openUpdatePICArea, setOpenUpdatePICArea] = useState(false);
  const [listEmployes, setListEmployes] = useState(tableDataEmployee);
  const [detailPICArea, setDetailPICArea] = useState({
    employee: {
      name: "",
      nrp: "",
    },
    beginEffectiveDate: 0,
    endEffectiveDate: 0,
  });
  const [startedDate, setstartedDate] = useState(new Date().getTime());
  const [completedDate, setCompletedDate] = useState(new Date().getTime());

  const [listPlant, setListPlant] = useState(["P1 Sunter", "P2 Pegangsaan", "P3 Cikarang"]);
  const [searchParam, setSearchParam] = useState({
    plant: "",
    name: "",
    nrp: "",
    jabatan: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    setSearchParam({
      ...searchParam,
      [e.target.name]: e.target.value,
    });
  };

  const handleSeacrhForm = (data) => {
    console.log(data);
  };

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

  const handleCloseAddEmployee = () => {
    setOpenAddEmployee(false);
  };

  const handleCloseUpdatePICArea = () => {
    setOpenUpdatePICArea(false);
  };

  const handleStartedDate = (newValue) => {
    setstartedDate(newValue.getTime());
    setDetailPICArea({ ...detailPICArea, beginEffectiveDate: newValue.getTime() });
  };

  const handleEndDate = (newValue) => {
    setCompletedDate(newValue.getTime());
    setDetailPICArea({ ...detailPICArea, endEffectiveDate: newValue.getTime() });
  };

  const handleSaveUpdatePICArea = async () => {
    await updatePICArea(detailPICArea).then((res) => {
      if (res.data.success) {
        openSuccessSB(`Successfully updating ${detailPICArea.employee.name} in PIC Area`);
        setOpenUpdatePICArea(false);
      } else {
        openErrorSB(res.data.message);
      }
    });
  };

  const handleDeletePICArea = async (id, name) => {
    await deletePICArea(id).then((res) => {
      if (res.data.success) {
        openSuccessSB(`Successfully deleting ${name} from PIC Area`);
      } else {
        openErrorSB(res.data.message);
      }
    });
  };

  const submitAddPICArea = async (id, name) => {
    await addPICArea({ employeeId: id }).then((res) => {
      if (res.data.success) {
        openSuccessSB(`Successfully adding ${name} to PIC Area`);
        setOpenAddEmployee(false);
      } else {
        openErrorSB(res.data.message);
      }
    });
  };

  const handleAddPICArea = async () => {
    await getEmployesNotInPICArea().then((res) => {
      setListEmployes({
        ...listEmployes,
        rows: res.data.employes.map((item) => ({
          ...item,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <MDButton
                variant="text"
                color="success"
                onClick={() => submitAddPICArea(item._id, item.name)}
              >
                <Icon>add_circle</Icon>&nbsp;Add
              </MDButton>
            </MDBox>
          ),
        })),
      });
    });
    setOpenAddEmployee(true);
  };

  const handleUpdatePICArea = (picArea) => {
    setOpenUpdatePICArea(true);
    setDetailPICArea(picArea);
  };

  const getPICArea = () => {
    const role = localStorage.getItem("ROLE");

    if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN" || role === "ROLE_USER") {
      getAllPICArea()
        .then((res) => {
          setPICAreas({
            ...picAreas,
            rows: res.data.PICAreas.map((item) => ({
              ...item.employee,
              actions: (
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mt={{ xs: 2, sm: 0 }}
                  mr={{ xs: -1.5, sm: 0 }}
                >
                  <MDButton
                    variant="text"
                    color="error"
                    onClick={() => handleDeletePICArea(item._id, item.employee.name)}
                  >
                    <Icon>delete</Icon>&nbsp;delete
                  </MDButton>
                  <MDButton variant="text" color="dark" onClick={() => handleUpdatePICArea(item)}>
                    <Icon>edit</Icon>&nbsp;Update
                  </MDButton>
                </MDBox>
              ),
            })),
          });
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  };

  useEffect(() => {
    getPICArea();
    const role = localStorage.getItem("ROLE");
    setRole(role);
  }, []);

  useEffect(() => {
    getPICArea();
    const role = localStorage.getItem("ROLE");
    setRole(role);
  }, [message]);

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

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Failed to create line"
      content={message}
      dateTime="A few secons ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

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
                      Nama Karyawan
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
                    NRP
                  </MDTypography>
                </MDBox>
                <FormField
                  name="nrp"
                  placeholder="ex: 124788"
                  type="number"
                  onChange={handleInputChange}
                />
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
                    Jabatan
                  </MDTypography>
                </MDBox>
                <FormField
                  name="jabatan"
                  placeholder="ex: Kepala Seksi"
                  onChange={handleInputChange}
                />
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
                    No Handphone
                  </MDTypography>
                </MDBox>
                <FormField
                  name="phone"
                  placeholder="ex: 0858881823"
                  type="number"
                  onChange={handleInputChange}
                />
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
                    Email
                  </MDTypography>
                </MDBox>
                <FormField
                  name="email"
                  placeholder="ex: adnoh@astra-honda.com"
                  onChange={handleInputChange}
                />
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
      <MDBox pt={1} pb={3}>
        <Card>
          <MDBox mb={1} ml={2} p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Master Data Security Area
                </MDTypography>
              </Grid>
              {(role === "ROLE_USER" || role === "ROLE_ADMIN") && (
                <MDBox ml="auto" mt={3} display="flex">
                  <MDBox mr={2}>
                    <MDButton
                      variant="gradient"
                      color="dark"
                      size="small"
                      onClick={() => handleAddPICArea()}
                    >
                      Add PIC Area
                    </MDButton>
                  </MDBox>
                  <MDBox>
                    <MDButton variant="gradient" color="dark" size="small">
                      Export to Excel
                    </MDButton>
                  </MDBox>
                </MDBox>
              )}
            </Grid>
          </MDBox>
          <DataTable table={picAreas} canSearch />
        </Card>
      </MDBox>

      {/* Modal for Adding Part */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddEmployee}
        onClose={handleCloseAddEmployee}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddEmployee}>
          <Box sx={style}>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="success"
              mx={1}
              mt={-6}
              p={2}
              mb={4}
              textAlign="center"
            >
              <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
                Add PIC Area
              </MDTypography>
            </MDBox>
            <DataTable
              table={listEmployes}
              L
              canSearch
              entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
            />
            <MDBox mt={3}>
              <Grid container spacing={3}>
                <MDBox mt={3} ml="auto" display="flex">
                  <MDButton
                    mr={5}
                    variant="gradient"
                    color="secondary"
                    size="small"
                    onClick={handleCloseAddEmployee}
                  >
                    Cancel
                  </MDButton>
                </MDBox>
              </Grid>
            </MDBox>
          </Box>
        </Fade>
      </Modal>

      {/* Open Modal Update PIC Area */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openUpdatePICArea}
        onClose={handleCloseUpdatePICArea}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openUpdatePICArea}>
          <Box sx={style}>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="success"
              mx={1}
              mt={-6}
              p={2}
              mb={4}
              textAlign="center"
            >
              <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
                Update PIC Area
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <MDBox display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        textTransform="capitalize"
                      >
                        Nama Karyawan
                      </MDTypography>
                    </MDBox>
                    <FormField
                      name="name"
                      disabled
                      defaultValue={detailPICArea.employee.name || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <MDBox display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        textTransform="capitalize"
                      >
                        NRP
                      </MDTypography>
                    </MDBox>
                    <FormField
                      name="name"
                      disabled
                      defaultValue={detailPICArea.employee.nrp || ""}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Begin Effective Date"
                        value={detailPICArea.beginEffectiveDate || new Date()}
                        onChange={handleStartedDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="End Effective Date"
                        value={detailPICArea.endEffectiveDate || new Date()}
                        onChange={handleEndDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <MDBox mt={3} ml="auto" display="flex">
                  <MDBox mr={1}>
                    <MDButton
                      mr={5}
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={handleSaveUpdatePICArea}
                    >
                      Save
                    </MDButton>
                  </MDBox>
                  <MDButton
                    mr={5}
                    variant="gradient"
                    color="secondary"
                    size="small"
                    onClick={handleCloseUpdatePICArea}
                  >
                    Cancel
                  </MDButton>
                </MDBox>
              </Grid>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
      {renderSuccessSB}
      {renderErrorSB}
      <Footer />
    </DashboardLayout>
  );
}

export default SecurityPICArea;
