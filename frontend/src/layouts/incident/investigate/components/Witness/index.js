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

import dataTableWitness from "../../data/dataTableWitness";
import { getAllPICArea } from "api/picAreaAPI";
import { getWitnessByIncidentId, addWitness, deleteWitnessById } from "api/witnessAPI";

function Witness() {
  const [witnesses, setWitnesses] = useState(dataTableWitness);
  const [openModal, setOpenModal] = useState(false);
  const [picList, setPicList] = useState([]);
  const [picNameList, setPicNameList] = useState([]);
  const [witnessData, setWitnessData] = useState({
    type: "",
    name: "",
    KTP: "",
    witnessNrp: "",
    picId: "",
    picName: "",
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
      if (pic.employee.name === name) setWitnessData({ ...witnessData, picId: pic.employee._id });
    });
  };

  const handleDeleteWitness = async (witnessId) => {
    await deleteWitnessById(witnessId).then((response) => {
      witnessInit();
    });
  };

  const handleAddWitness = async () => {
    await addWitness(witnessData).then((response) => {
      witnessInit();
      handleCloseModal();
    });
  };

  const handleCloseModal = () => setOpenModal(false);

  const witnessInit = async () => {
    const tempArray = [];
    await getWitnessByIncidentId(incidentId).then((response) => {
      response.data.witnesses?.forEach((witness) => {
        tempArray.push({
          type: witness.type,
          name: witness.name,
          ktp: witness.KTP,
          nrpwitness: witness.witnessNrp,
          nrpPic: witness.pic.nrp,
          picName: witness.pic.name,
          picDepartment: witness.pic.department,
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
                onClick={() => handleDeleteWitness(witness._id)}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setWitnesses({ ...witnesses, rows: tempArray });
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
    witnessInit();
    getPICList();
    setWitnessData({ ...witnessData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Informasi Saksi
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox mr={2}>
                  <MDButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    color="dark"
                    onClick={() => setOpenModal(true)}
                  >
                    Tambahkan Saksi
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={witnesses} />
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
                Tambahkan Saksi
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      label="Type Korban"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setWitnessData({ ...witnessData, [e.target.name]: e.target.value })
                      }
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
                        setWitnessData({ ...witnessData, [e.target.name]: e.target.value })
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
                        setWitnessData({ ...witnessData, [e.target.name]: e.target.value })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="witnessNrp"
                      label="NRP Korban"
                      placeholder="ex: 3244612446"
                      onChange={(e) =>
                        setWitnessData({ ...witnessData, [e.target.name]: e.target.value })
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
                      onChange={(e) =>
                        setWitnessData({ ...witnessData, [e.target.name]: e.target.value })
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
                      // disabled={!(victimData.type && victimData.name && victimData.ktp)}
                      onClick={handleAddWitness}
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

export default Witness;
