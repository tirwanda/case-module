import { useEffect, useState } from "react";
import { storage } from "firebase.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Button from "@mui/material/Button";
import DataTable from "examples/Tables/DataTable";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateIncidentByKaru, deleteEvidence } from "api/incidentAPI";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";

import dataTableEvidence from "../../data/dataTableEvidence";
import FormField from "../FormField";
import MDInput from "components/MDInput";
import { set } from "date-fns";
import { getIncident } from "api/incidentAPI";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(100%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Evidence({ incidentInfo }) {
  const [evidences, setEvidences] = useState(dataTableEvidence);
  const [openModal, setOpenModal] = useState(false);
  const [dataFile, setDataFile] = useState(null);
  const [onUpload, setOnUpload] = useState(false);
  const [fileName, setFileName] = useState("");
  // butuh key pada file yang diupload di firebase
  const [evidenceFirebaseId, setEvidenceFirebaseId] = useState("");

  const { incidentId } = useParams();

  const uploadFile = async (data) => {
    if (data === null) {
      return;
    }
    setDataFile(data);

    document.getElementById("fileInput").value = null;
  };

  const handleDeleteEvidence = async (evidenceId, downloadUrl) => {
    await deleteEvidence(incidentId, evidenceId).then(async (response) => {
      const tempRows = [];
      response.data.incident.evidences.forEach((evidence, index) => {
        tempRows.push({
          no: index + 1,
          evidenceName: evidence.evidenceName,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <Link href={evidence.attachment} target="_blank">
                <MDButton variant="text" color="dark">
                  <PageviewOutlinedIcon />
                  &nbsp;view
                </MDButton>
              </Link>
              <MDButton
                variant="text"
                color="error"
                onClick={() => handleDeleteEvidence(evidence._id, evidence.attachment)}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });

      setEvidences({ ...evidences, rows: tempRows });
    });
    await deleteObject(ref(storage, downloadUrl))
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const initEvidenceTable = async () => {
    const tempRows = [];
    await getIncident(incidentId).then((response) => {
      response.data.incident.evidences.forEach((evidence, index) => {
        tempRows.push({
          no: index + 1,
          evidenceName: evidence.evidenceName,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <Link href={evidence.attachment} target="_blank">
                <MDButton variant="text" color="dark">
                  <PageviewOutlinedIcon />
                  &nbsp;view
                </MDButton>
              </Link>
              <MDButton
                variant="text"
                color="error"
                onClick={() => handleDeleteEvidence(evidence._id, evidence.attachment)}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setEvidences({ ...evidences, rows: tempRows });
  };

  const handleSaveEvidence = async () => {
    setOnUpload(true);
    const storageRef = ref(storage, `Evidences/${fileName}`);
    await uploadBytes(storageRef, dataFile).then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then(async (downloadURL) => {
          await updateIncidentByKaru(incidentId, {
            evidences: [{ evidenceName: fileName, attachment: downloadURL }],
          }).then((response) => {
            const tempRows = [];
            console.log("Response: ", response);
            response.data.incident.evidences.forEach((evidence, index) => {
              console.log("Evidence: ", evidence);
              tempRows.push({
                no: index + 1,
                evidenceName: evidence.evidenceName,
                actions: (
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mt={{ xs: 2, sm: 0 }}
                    mr={{ xs: -1.5, sm: 0 }}
                  >
                    <Link href={evidence.attachment} target="_blank">
                      <MDButton variant="text" color="dark">
                        <PageviewOutlinedIcon />
                        &nbsp;view
                      </MDButton>
                    </Link>
                    <MDButton
                      variant="text"
                      color="error"
                      onClick={() => handleDeleteEvidence(evidence._id, evidence.attachment)}
                    >
                      <Icon>delete</Icon>&nbsp;delete
                    </MDButton>
                  </MDBox>
                ),
              });
            });
            setEvidences({ ...evidences, rows: tempRows });
          });
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
      setFileName("");
      setDataFile(null);
      setOpenModal(false);
    });
  };
  const handleCloseModal = () => setOpenModal(false);

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
    initEvidenceTable();
  }, []);

  return (
    <MDBox py={1}>
      <Card sx={{ overflow: "visible" }}>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Evidence
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox mr={2}>
                  <MDButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    color="dark"
                    startIcon={<CloudUploadIcon color="white" />}
                    onClick={() => {
                      setOnUpload(false);
                      setOpenModal(true);
                    }}
                  >
                    Add Evidence
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={evidences} />
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
                Add Evidence
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
                        Nama Evidence
                      </MDTypography>
                    </MDBox>
                    <FormField
                      name="fileName"
                      onChange={(e) => setFileName(e.target.value)}
                      defaultValue={fileName || ""}
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox mt={3} display="flex">
                    {dataFile && (
                      <MDBox mr={2} mt={3}>
                        <MDInput
                          name="dataFile"
                          type="text"
                          variant="standard"
                          fullWidth
                          disabled
                          value={dataFile.name || ""}
                        />
                      </MDBox>
                    )}

                    <MDBox mt={2}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        color="primary"
                        startIcon={<CloudUploadIcon color="white" />}
                      >
                        <p style={{ color: "white" }}>Upload </p>
                        <VisuallyHiddenInput
                          id="fileInput"
                          type="file"
                          onChange={(event) => uploadFile(event.target.files[0])}
                        />
                      </Button>
                    </MDBox>
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
                      disabled={!(dataFile && fileName) || onUpload}
                      onClick={handleSaveEvidence}
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

export default Evidence;
