import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Link, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { getStatementLettersByIncidentId } from "api/statementLetterAPI";
import dataTableViewStatementLetter from "../../data/dataTableViewStatementLetter";

function StatementLetterDetail() {
  const [statementLetters, setStatementLetters] = useState(dataTableViewStatementLetter);
  const [listStatementLetter, setListStatementLetter] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [statementLetterData, setStatementLetterData] = useState({});
  const [statementLetterId, setStatementLetterId] = useState("");
  const { incidentId } = useParams();

  const handleShowStatementLetter = (statementLetterId) => () => {
    setStatementLetterId(statementLetterId);
  };

  const statementLetterInit = async () => {
    const tempRows = [];
    const arrListStatementLetter = [];
    await getStatementLettersByIncidentId(incidentId).then((response) => {
      response.data.statementLetters.forEach((statementLetter) => {
        arrListStatementLetter.push(statementLetter);
        tempRows.push({
          name: statementLetter.name,
          picName: statementLetter.pic.name,
          nrp: statementLetter.nrp,
          picDepartment: statementLetter.pic.department,
          attachment: (
            <Link href={statementLetter.attachment} target="_blank">
              <MDButton variant="text" color="dark">
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </Link>
          ),
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
                onClick={handleShowStatementLetter(statementLetter._id)}
              >
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListStatementLetter(arrListStatementLetter);
    setStatementLetters({ ...statementLetters, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStatementLetterId("");
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

  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    statementLetterInit();
    setStatementLetterData({ ...statementLetterData, incidentId });
  }, []);

  useEffect(() => {
    if (!statementLetterId) return;
    listStatementLetter?.forEach((statementLetter) => {
      if (statementLetter._id === statementLetterId) {
        setStatementLetterData(statementLetter);
      }
    });
    setOpenModal(true);
  }, [statementLetterId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Surat Pernnyataan
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={statementLetters} />
      </MDBox>

      {/* Open Modal View Calling Letter */}
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
                Informasi Surat Pernyataan
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Pembuat Surat
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type Pembuat Surat"
                      value={statementLetterData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Pembuat Suarat"
                      placeholder="ex: Bang Adnoh"
                      value={statementLetterData.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP Pembuat Surat"
                      value={statementLetterData.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="vendorName"
                      label="Nama Vendor Pembuat Surat"
                      value={statementLetterData.vendorName || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi PIC Pembuat Surat
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="picNae"
                      label="Nama PIC"
                      value={statementLetterData.pic?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={statementLetterData.pic?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={statementLetterData.pic?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={statementLetterData.pic?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={statementLetterData.pic?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={statementLetterData.pic?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={statementLetterData.pic?.email || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="phone"
                      label="No Telephone"
                      value={statementLetterData.pic?.phone || ""}
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

export default StatementLetterDetail;
