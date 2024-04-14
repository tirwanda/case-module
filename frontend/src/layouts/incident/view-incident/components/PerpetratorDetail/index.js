import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { getPerpetratorsByIncidentId } from "api/perpetratorAPI";
import dataTablePerpetrator from "layouts/incident/investigate/data/dataTablePerpetrator";

function PerpetratorDetail() {
  const [perpetrators, setPerpetrators] = useState(dataTablePerpetrator);
  const [listPerpetrator, setListPerpetrator] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [perpetratorData, setPerpetratorData] = useState({});
  const [perpetratorId, setPerpetratorId] = useState("");
  const { incidentId } = useParams();

  const handleShowPerpetrator = (perpetratorId) => () => {
    setPerpetratorId(perpetratorId);
  };

  const perpetratorInit = async () => {
    const tempRows = [];
    const arrListPerpetrator = [];
    await getPerpetratorsByIncidentId(incidentId).then((response) => {
      response.data.perpetrators.forEach((perpetrator) => {
        arrListPerpetrator.push(perpetrator);
        tempRows.push({
          type: perpetrator.type,
          name: perpetrator.name,
          ktp: perpetrator.KTP,
          nrpPerpetrator: perpetrator.perpetratorNrp,
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
                color="dark"
                onClick={handleShowPerpetrator(perpetrator._id)}
              >
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListPerpetrator(arrListPerpetrator);
    setPerpetrators({ ...perpetrators, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPerpetratorId("");
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
    perpetratorInit();
    setPerpetratorData({ ...perpetratorData, incidentId });
  }, []);

  useEffect(() => {
    if (!perpetratorId) return;
    listPerpetrator?.forEach((perpetrator) => {
      if (perpetrator._id === perpetratorId) {
        setPerpetratorData(perpetrator);
      }
    });
    setOpenModal(true);
  }, [perpetratorId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Pelaku
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={perpetrators} />
      </MDBox>

      {/* Open Modal View Pelaku */}
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
                Detail Pelaku
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Pelaku
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type Pelaku"
                      placeholder="ex: Bang Adnoh"
                      value={perpetratorData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Pelaku"
                      placeholder="ex: Bang Adnoh"
                      value={perpetratorData.name || ""}
                      disabled
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
                      value={perpetratorData.KTP || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="perpetratorNrp"
                      label="NRP Pelaku"
                      value={perpetratorData.perpetratorNrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="vendorName"
                      label="Nama Vendor"
                      value={perpetratorData.vendorName || ""}
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
                      value={perpetratorData.pic?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={perpetratorData.pic?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={perpetratorData.pic?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={perpetratorData.pic?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={perpetratorData.pic?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={perpetratorData.pic?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={perpetratorData.pic?.email || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="phone"
                      label="No Telephone"
                      value={perpetratorData.pic?.phone || ""}
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

export default PerpetratorDetail;
