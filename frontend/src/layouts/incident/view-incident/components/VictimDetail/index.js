import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { getVictimByIncidentId } from "api/victimAPI";
import dataTableVictim from "layouts/incident/investigate/data/dataTableVictim";

function VictimDetail() {
  const [victims, setVictims] = useState(dataTableVictim);
  const [listVictim, setListVictim] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [victimData, setVictimData] = useState({});
  const [victimId, setVictimId] = useState("");
  const { incidentId } = useParams();

  const handleShowVictim = (victimId) => () => {
    setVictimId(victimId);
  };

  const victimInit = async () => {
    const tempRows = [];
    const arrListVictims = [];
    await getVictimByIncidentId(incidentId).then((response) => {
      response.data.victims.forEach((victim) => {
        arrListVictims.push(victim);
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
              <MDButton variant="text" color="dark" onClick={handleShowVictim(victim._id)}>
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListVictim(arrListVictims);
    setVictims({ ...victims, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVictimId("");
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
    victimInit();
    setVictimData({ ...victimData, incidentId });
  }, []);

  useEffect(() => {
    if (!victimId) return;
    listVictim?.forEach((victim) => {
      if (victim._id === victimId) {
        setVictimData(victim);
      }
    });
    setOpenModal(true);
  }, [victimId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Korban
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={victims} />
      </MDBox>

      {/* Open Modal View Victim */}
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
                Detail Korban
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Korban
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type Korban"
                      placeholder="ex: Bang Adnoh"
                      value={victimData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Korban"
                      placeholder="ex: Bang Adnoh"
                      value={victimData.name || ""}
                      disabled
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
                      value={victimData.KTP || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="victimNrp"
                      label="NRP Korban"
                      value={victimData.victimNrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="vendorName"
                      label="Nama Vendor"
                      value={victimData.vendorName || ""}
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
                      value={victimData.pic?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={victimData.pic?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={victimData.pic?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={victimData.pic?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nrp" label="NRP" value={victimData.pic?.nrp || ""} disabled />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nrp" label="NRP" value={victimData.pic?.nrp || ""} disabled />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={victimData.pic?.email || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="phone"
                      label="No Telephone"
                      value={victimData.pic?.phone || ""}
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

export default VictimDetail;
