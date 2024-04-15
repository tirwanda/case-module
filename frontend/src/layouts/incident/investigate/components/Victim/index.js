import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import dataTableVictim from "../../data/dataTableVictim";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";

import { getVictimByIncidentId } from "api/victimAPI";
import FormField from "../FormField";
import MDInput from "components/MDInput";
import { getAllPICArea } from "api/picAreaAPI";
import { addVictim, deleteVictimById } from "api/victimAPI";
import { set } from "date-fns";

function Victim() {
  const [victims, setVictims] = useState(dataTableVictim);
  const [openModal, setOpenModal] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [picList, setPicList] = useState([]);
  const [typeList, setTypeList] = useState(["Internal AHM", "Eksternal AHM"]);
  const [picNameList, setPicNameList] = useState([]);
  const [victimData, setVictimData] = useState({
    type: "",
    name: "",
    KTP: "",
    victimNrp: "",
    picId: "",
    vendorName: "",
    incidentId: "",
  });
  const { incidentId } = useParams();

  const handleDeleteVictim = async (victimId) => {
    await deleteVictimById(victimId).then((response) => {
      victimInit();
    });
  };

  const handleAddVictim = async () => {
    setOnSave(true);
    await addVictim(victimData).then((response) => {
      setVictims({
        ...victims,
        rows: [
          ...victims.rows,
          {
            type: response.data.victim.type,
            name: response.data.victim.name,
            ktp: response.data.victim.KTP,
            nrpVictim: response.data.victim.victimNrp,
            nrpPic: response.data.victim.pic.nrp,
            picName: response.data.victim.pic.name,
            picDepartment: response.data.victim.pic.department,
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
                  onClick={() => handleDeleteVictim(response.data.victim._id)}
                >
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
            ),
          },
        ],
      });
    });
    setOpenModal(false);
    setVictimData({
      type: "",
      name: "",
      KTP: "",
      victimNrp: "",
      picId: "",
      vendorName: "",
      incidentId,
    });
  };

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

  const victimInit = async () => {
    const tempRows = [];
    await getVictimByIncidentId(incidentId).then((response) => {
      response.data.victims.forEach((victim) => {
        tempRows.push({
          type: victim.type,
          name: victim.name,
          ktp: victim.KTP,
          nrpVictim: victim.victimNrp,
          nrpPic: victim.pic.nrp,
          picName: victim.pic.name,
          picDepartment: victim.pic.department,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <MDButton variant="text" color="error" onClick={() => handleDeleteVictim(victim._id)}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setVictims({ ...victims, rows: tempRows });
  };

  const handleCloseModal = () => {
    setVictimData({
      type: "",
      name: "",
      KTP: "",
      victimNrp: "",
      picId: "",
      vendorName: "",
      incidentId,
    });
    setOpenModal(false);
  };

  const handlePicChange = (name) => {
    picList.forEach((pic) => {
      if (pic.employee.name === name) setVictimData({ ...victimData, picId: pic.employee._id });
    });
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
    victimInit();
    getPICList();
    setVictimData({ ...victimData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Informasi Korban
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
                    Tambahkan Korban
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={victims} />
        </MDBox>
      </Card>

      {/* Open Modal Update Employee */}
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
                Tambahkan Korban
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
                        Type Korban
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        setVictimData({ ...victimData, type: value });
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
                      label="Nama Korban"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setVictimData({ ...victimData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="KTP"
                      label="KTP Korban"
                      type="number"
                      placeholder="ex: 3244612446"
                      onChange={(e) =>
                        setVictimData({ ...victimData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="victimNrp"
                      label="NRP Korban"
                      placeholder="ex: 3244612446"
                      disabled={victimData.type === "Internal AHM" ? false : true}
                      onChange={(e) =>
                        setVictimData({ ...victimData, [e.target.name]: e.target.value })
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
                      disabled={victimData.type === "Internal AHM" ? true : false}
                      onChange={(e) =>
                        setVictimData({ ...victimData, [e.target.name]: e.target.value })
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
                        !(
                          victimData.type &&
                          victimData.name &&
                          victimData.KTP &&
                          victimData.picId
                        ) || onSave
                      }
                      onClick={handleAddVictim}
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

export default Victim;
