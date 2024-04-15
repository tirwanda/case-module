import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";
import FormField from "../FormField";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import { getAllPICArea } from "api/picAreaAPI";
import dataTablePerpetrator from "../../data/dataTablePerpetrator";
import {
  deletePerpetratorById,
  addPerpetrator,
  getPerpetratorsByIncidentId,
} from "api/perpetratorAPI";

function Perpetrator() {
  const [perpetrators, setPerpetrators] = useState(dataTablePerpetrator);
  const [openModal, setOpenModal] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [picList, setPicList] = useState([]);
  const [typeList, setTypeList] = useState(["Internal AHM", "Eksternal AHM"]);
  const [picNameList, setPicNameList] = useState([]);
  const [perpetratorData, setPerpetratorData] = useState({
    type: "",
    name: "",
    KTP: "",
    perpetratorNrp: "",
    picId: "",
    picDepartment: "",
    vendorName: "",
    incidentId: "",
  });

  const { incidentId } = useParams();

  const getPICList = async () => {
    const tempArray = [];
    await getAllPICArea().then((response) => {
      setPicList(response.data.PICAreas);
      response.data.PICAreas.forEach((pic) => {
        tempArray.push(pic.employee.name);
      });
    });
    setPicNameList(tempArray);
  };

  const handlePicChange = (name) => {
    picList.forEach((pic) => {
      if (pic.employee.name === name)
        setPerpetratorData({ ...perpetratorData, picId: pic.employee._id });
    });
  };

  const handleDeletePerpetrator = async (perpetratorId) => {
    await deletePerpetratorById(perpetratorId).then((response) => {
      perpetratorInit();
    });
  };

  const handleAddPerpetrator = async () => {
    setOnSave(true);
    await addPerpetrator(perpetratorData).then((response) => {
      perpetratorInit();
    });
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setPerpetratorData({
      type: "",
      name: "",
      KTP: "",
      perpetratorNrp: "",
      picId: "",
      picDepartment: "",
      vendorName: "",
      incidentId,
    });
    setOpenModal(false);
  };

  const perpetratorInit = async () => {
    const tempArray = [];
    await getPerpetratorsByIncidentId(incidentId).then((response) => {
      response.data.perpetrators?.forEach((perpetrator) => {
        tempArray.push({
          type: perpetrator.type,
          name: perpetrator.name,
          ktp: perpetrator.KTP,
          perpetratorNrp: perpetrator.perpetratorNrp,
          nrpPic: perpetrator.pic.nrp,
          picName: perpetrator.pic.name,
          picDepartment: perpetrator.pic.department,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <MDButton
                variant="text"
                color="error"
                onClick={() => handleDeletePerpetrator(perpetrator._id)}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setPerpetrators({ ...perpetrators, rows: tempArray });
  };

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

  useEffect(() => {
    perpetratorInit();
    getPICList();
    setPerpetratorData({ ...perpetratorData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Informasi Pelaku
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox mr={2}>
                  <MDButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    color="dark"
                    onClick={() => {
                      setOnSave(false);
                      setOpenModal(true);
                    }}
                  >
                    Tambahkan Pelaku
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={perpetrators} />
        </MDBox>
      </Card>

      {/* Open Modal Add Perpetrator */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
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
                Tambahkan Pelaku
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} style={{ paddingTop: "8px" }}>
                  <MDBox mb={3}>
                    <MDBox display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        textTransform="capitalize"
                      >
                        Type Pelaku
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        setPerpetratorData({ ...perpetratorData, type: value });
                      }}
                      options={typeList}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Pelaku"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setPerpetratorData({ ...perpetratorData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="KTP"
                      label="KTP Pelaku"
                      type="number"
                      placeholder="ex: 3244612446"
                      onChange={(e) =>
                        setPerpetratorData({ ...perpetratorData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="perpetratorNrp"
                      label="NRP Pelaku"
                      placeholder="ex: 3244612446"
                      disabled={perpetratorData.type === "Eksternal AHM"}
                      onChange={(e) =>
                        setPerpetratorData({ ...perpetratorData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} style={{ paddingTop: "8px" }}>
                  <MDBox mb={3}>
                    <MDBox display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        textTransform="capitalize"
                      >
                        PIC Name
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        handlePicChange(value);
                      }}
                      options={picNameList}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      label="Nama Vendor"
                      name="vendorName"
                      placeholder="ex: ISS"
                      disabled={perpetratorData.type === "Internal AHM"}
                      onChange={(e) =>
                        setPerpetratorData({ ...perpetratorData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <MDBox mt={6} ml="auto" display="flex">
                  <MDBox mr={1}>
                    <MDButton
                      mr={5}
                      variant="gradient"
                      color="info"
                      size="small"
                      disabled={
                        (!perpetratorData.type &&
                          !perpetratorData.name &&
                          !perpetratorData.KTP &&
                          !perpetratorData.picId) ||
                        onSave
                      }
                      onClick={handleAddPerpetrator}
                    >
                      Save
                    </MDButton>
                  </MDBox>
                  <MDButton
                    mr={5}
                    variant="gradient"
                    color="secondary"
                    size="small"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </MDButton>
                </MDBox>
              </Grid>
            </MDBox>
          </Box>
        </Fade>
      </Modal>
    </MDBox>
  );
}

export default Perpetrator;
