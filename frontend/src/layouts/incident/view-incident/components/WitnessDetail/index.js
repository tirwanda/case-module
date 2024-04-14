import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { getWitnessByIncidentId } from "api/witnessAPI";
import dataTableWitness from "layouts/incident/investigate/data/dataTableWitness";

function WitnessDetail() {
  const [witnesses, setWitnesses] = useState(dataTableWitness);
  const [listWitness, setListWitness] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [witnessData, setWitnessData] = useState({});
  const [witnessId, setWitnessId] = useState("");
  const { incidentId } = useParams();

  const handleShowWitness = (witnessId) => () => {
    setWitnessId(witnessId);
  };

  const witnessInit = async () => {
    const tempRows = [];
    const arrListWitness = [];
    await getWitnessByIncidentId(incidentId).then((response) => {
      response.data.witnesses.forEach((witness) => {
        arrListWitness.push(witness);
        tempRows.push({
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
              <MDButton variant="text" color="dark" onClick={handleShowWitness(witness._id)}>
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListWitness(arrListWitness);
    setWitnesses({ ...witnesses, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setWitnessId("");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  useEffect(() => {
    witnessInit();
    setWitnessData({ ...witnessData, incidentId });
  }, []);

  useEffect(() => {
    if (!witnessId) return;
    listWitness?.forEach((witness) => {
      if (witness._id === witnessId) {
        setWitnessData(witness);
      }
    });
    setOpenModal(true);
  }, [witnessId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Saksi
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={witnesses} />
      </MDBox>

      {/* Open Modal View Witness */}
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
                Detail Saksi
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Saksi
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type Saksi"
                      placeholder="ex: Bang Adnoh"
                      value={witnessData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Saksi"
                      placeholder="ex: Bang Adnoh"
                      value={witnessData.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="KTP"
                      label="KTP Saksi"
                      type="number"
                      placeholder="ex: 3244612446"
                      value={witnessData.KTP || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="witnessNrp"
                      label="NRP Saksi"
                      value={witnessData.witnessNrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="vendorName"
                      label="Nama Vendor"
                      value={witnessData.vendorName || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi PIC
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="picNae"
                      label="Nama PIC"
                      value={witnessData.pic?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={witnessData.pic?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={witnessData.pic?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={witnessData.pic?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nrp" label="NRP" value={witnessData.pic?.nrp || ""} disabled />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nrp" label="NRP" value={witnessData.pic?.nrp || ""} disabled />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={witnessData.pic?.email || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="phone"
                      label="No Telephone"
                      value={witnessData.pic?.phone || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <MDBox mt={6} ml="auto" display="flex">
                  <MDButton
                    mr={5}
                    variant="gradient"
                    color="secondary"
                    size="small"
                    onClick={handleCloseModal}
                  >
                    Close
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

export default WitnessDetail;
