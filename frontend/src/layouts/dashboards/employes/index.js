import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/dashboards/employes/data/dataTableData";
import { getEmployes } from "api/employesAPI";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import FormField from "layouts/applications/wizard/components/FormField";
import MDButton from "components/MDButton";
import { addEmployee } from "api/employesAPI";
import { deleteEmployee } from "api/employesAPI";
import { updateEmployee } from "api/employesAPI";
import { ca, de } from "date-fns/locale";
import { searchEmployee } from "api/employesAPI";

function Employes() {
  const [employes, setEmployes] = useState(dataTableData);
  const [successSB, setSuccesSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [openUpdateEmployee, setOpenUpdateEmployee] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState({
    _id: "",
    plant: "",
    name: "",
    nrp: "",
    jabatan: "",
    phone: "",
    department: "",
    division: "",
    email: "",
    status: "Active",
    company: "",
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
  const [searchParam, setSearchParam] = useState({
    plant: "",
    name: "",
    nrp: "",
    jabatan: "",
    phone: "",
    email: "",
    department: "",
    division: "",
    status: "",
    company: "",
  });

  const handleInputChange = (e) => {
    setSearchParam({
      ...searchParam,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputEmployeeChange = (e) => {
    setEmployeeDetail({
      ...employeeDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleSeacrhForm = async (data) => {
    const role = localStorage.getItem("ROLE");
    try {
      await searchEmployee(data).then((response) => {
        setEmployes({
          ...employes,
          rows: response.data.employes.map((employee) => {
            let canUpdate = false; // Initialize canUpdate variable
            if (role === "ROLE_ADMIN" || role === "ROLE_DEPT_HEAD") {
              canUpdate = true; // Update canUpdate based on conditions
            }
            return {
              ...employee,
              actions: canUpdate && (
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
                    onClick={() => handleDelete(employee._id, employee.name)}
                  >
                    <Icon>delete</Icon>&nbsp;delete
                  </MDButton>
                  <MDButton
                    variant="text"
                    color="dark"
                    onClick={() => handleUpdateEmployee(employee)}
                  >
                    <Icon>edit</Icon>&nbsp;Update
                  </MDButton>
                </MDBox>
              ),
            };
          }),
        });
      });
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleAddEmployee = () => {
    setEmployeeDetail({
      _id: "",
      plant: "",
      name: "",
      nrp: "",
      jabatan: "",
      phone: "",
      email: "",
      department: "",
      division: "",
      status: "",
      company: "",
    });
    setOpenAddEmployee(true);
  };

  const handleUpdateEmployee = (data) => {
    setOpenUpdateEmployee(true);
    setEmployeeDetail(data);
  };

  const handleCloseAddEmployee = () => setOpenAddEmployee(false);
  const handleCloseUpdateEmployee = () => setOpenUpdateEmployee(false);

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

  const getEmployesData = () => {
    const role = localStorage.getItem("ROLE");

    getEmployes()
      .then((response) => {
        setEmployes({
          ...employes,
          rows: response.data.employes.map((employee) => {
            let canUpdate = false; // Initialize canUpdate variable
            if (role === "ROLE_ADMIN" || role === "ROLE_DEPT_HEAD") {
              canUpdate = true; // Update canUpdate based on conditions
            }
            return {
              ...employee,
              actions: canUpdate && (
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
                    onClick={() => handleDelete(employee._id, employee.name)}
                  >
                    <Icon>delete</Icon>&nbsp;delete
                  </MDButton>
                  <MDButton
                    variant="text"
                    color="dark"
                    onClick={() => handleUpdateEmployee(employee)}
                  >
                    <Icon>edit</Icon>&nbsp;Update
                  </MDButton>
                </MDBox>
              ),
            };
          }),
        });
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const response = await addEmployee(employeeDetail);
      setOpenAddEmployee(false);
      openSuccessSB(`Success created ${response.data.employee.name}`);
    } catch (error) {
      openErrorSB(error.response.data.message);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await updateEmployee(employeeDetail);
      setOpenUpdateEmployee(false);
      openSuccessSB(`Success updating ${response.data.employee.name}`);
    } catch (error) {
      openErrorSB(error.response.data.message);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteEmployee(id);
      openSuccessSB(`Success deleting employee ${name}`);
    } catch (error) {
      openErrorSB(error.response.data.message);
    }
  };

  useEffect(() => {
    getEmployesData();
    const roleName = localStorage.getItem("ROLE");
    setRole(roleName);
  }, []);

  useEffect(() => {
    getEmployesData();
    const roleName = localStorage.getItem("ROLE");
    setRole(roleName);
  }, [successSB]);

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
                    options={["Active", "Inactive"]}
                    onChange={(_, value) => {
                      setSearchParam({ ...searchParam, status: value });
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
                      Company
                    </MDTypography>
                  </MDBox>
                  <FormField
                    name="company"
                    placeholder="cth: PT Astra Honda Motor"
                    onChange={handleInputChange}
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
                  Employes
                </MDTypography>
              </Grid>
              {(role === "ROLE_DEPT_HEAD" || role === "ROLE_ADMIN") && (
                <MDBox ml="auto" mt={3} display="flex">
                  <MDBox mr={2}>
                    <MDButton
                      variant="gradient"
                      color="dark"
                      size="small"
                      onClick={() => handleAddEmployee()}
                    >
                      Add Employee
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
          <DataTable table={employes} canSearch />
        </Card>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>

      {/* Open Modal Add Employee */}
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
                Add New Employee
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
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
                        Plant
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={listPlant}
                      onChange={(_, value) => {
                        setEmployeeDetail({ ...employeeDetail, plant: value });
                      }}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
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
                        Nama Karyawan
                      </MDTypography>
                    </MDBox>
                    <FormField name="name" onChange={handleInputEmployeeChange} />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="nrp"
                      type="number"
                      label="NRP"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.nrp || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="jabatan"
                      type="text"
                      label="Jabatan"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.jabatan || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="phone"
                      type="number"
                      label="No Handphone"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.phone || 0}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="email"
                      type="text"
                      label="Email"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.email || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
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
                        Status
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={["Active", "Inactive"]}
                      onChange={(_, value) => {
                        setEmployeeDetail({ ...employeeDetail, status: value });
                      }}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
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
                        Perusahaan
                      </MDTypography>
                    </MDBox>
                    <FormField name="company" onChange={handleInputEmployeeChange} />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
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
                        Department
                      </MDTypography>
                    </MDBox>
                    <FormField name="department" onChange={handleInputEmployeeChange} />
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
                        Division
                      </MDTypography>
                    </MDBox>
                    <FormField name="division" onChange={handleInputEmployeeChange} />
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
                      onClick={handleSave}
                    >
                      Save
                    </MDButton>
                  </MDBox>
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

      {/* Open Modal Update Employee */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openUpdateEmployee}
        onClose={handleCloseUpdateEmployee}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openUpdateEmployee}>
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
                Update Employee
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
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
                        Plant
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={listPlant}
                      defaultValue={employeeDetail.plant}
                      onChange={(_, value) => {
                        setEmployeeDetail({ ...employeeDetail, plant: value });
                      }}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
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
                        Nama Karyawan
                      </MDTypography>
                    </MDBox>
                    <FormField
                      name="name"
                      onChange={handleInputEmployeeChange}
                      defaultValue={employeeDetail.name}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="nrp"
                      type="number"
                      label="NRP"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.nrp || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="jabatan"
                      type="text"
                      label="Jabatan"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.jabatan || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="phone"
                      type="number"
                      label="No Handphone"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.phone || 0}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDInput
                      name="email"
                      type="text"
                      label="Email"
                      variant="standard"
                      fullWidth
                      value={employeeDetail.email || ""}
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
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
                        Status
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      options={["Active", "Inactive"]}
                      defaultValue={employeeDetail.status}
                      onChange={(_, value) => {
                        setEmployeeDetail({ ...employeeDetail, status: value });
                      }}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
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
                        Perusahaan
                      </MDTypography>
                    </MDBox>
                    <FormField
                      defaultValue={employeeDetail.company}
                      name="company"
                      onChange={handleInputEmployeeChange}
                    />
                  </MDBox>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
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
                        Department
                      </MDTypography>
                    </MDBox>
                    <FormField
                      defaultValue={employeeDetail.department}
                      name="department"
                      onChange={handleInputEmployeeChange}
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
                        Division
                      </MDTypography>
                    </MDBox>
                    <FormField
                      defaultValue={employeeDetail.division}
                      name="division"
                      onChange={handleInputEmployeeChange}
                    />
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
                      onClick={handleUpdate}
                    >
                      Save
                    </MDButton>
                  </MDBox>
                  <MDButton
                    mr={5}
                    variant="gradient"
                    color="secondary"
                    size="small"
                    onClick={handleCloseUpdateEmployee}
                  >
                    Cancel
                  </MDButton>
                </MDBox>
              </Grid>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default Employes;
