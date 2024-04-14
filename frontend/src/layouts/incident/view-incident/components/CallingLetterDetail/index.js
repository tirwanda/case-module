import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Link, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { getCallingLetterByIncidentId } from "api/callingLetterAPI";
import dataTableViewCallingLetter from "../../data/dataTableViewCallingLetter";

function CallingLetterDetail() {
  const [callingLetters, setCallingLetters] = useState(dataTableViewCallingLetter);
  const [listCallingLetter, setListCallingLetter] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [callingLetterData, setCallingLetterData] = useState({});
  const [callingLetterId, setCallingLetterId] = useState("");
  const { incidentId } = useParams();

  const handleShowCallingLetter = (callingLetterId) => () => {
    setCallingLetterId(callingLetterId);
  };

  const callingLetterInit = async () => {
    const tempRows = [];
    const arrListCallingLetter = [];
    await getCallingLetterByIncidentId(incidentId).then((response) => {
      response.data.callingLetters.forEach((callingLetter) => {
        arrListCallingLetter.push(callingLetter);
        tempRows.push({
          name: callingLetter.name,
          picName: callingLetter.pic.name,
          picDepartment: callingLetter.pic.department,
          callerName: callingLetter.caller.name,
          invitationDate: new Date(callingLetter.invitationDate).toLocaleDateString(),
          status: callingLetter.status,
          attachment: (
            <Link href={callingLetter.attachment} target="_blank">
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
                onClick={handleShowCallingLetter(callingLetter._id)}
              >
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListCallingLetter(arrListCallingLetter);
    setCallingLetters({ ...callingLetters, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCallingLetterId("");
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
    callingLetterInit();
    setCallingLetterData({ ...callingLetterData, incidentId });
  }, []);

  useEffect(() => {
    if (!callingLetterId) return;
    listCallingLetter?.forEach((callingLetter) => {
      if (callingLetter._id === callingLetterId) {
        setCallingLetterData(callingLetter);
      }
    });
    setOpenModal(true);
  }, [callingLetterId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Surat Panggilan
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={callingLetters} />
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
                Informasi Surat Paggilan
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="location"
                      label="Lokasi Pemanggilan"
                      value={callingLetterData.location || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="invitationDate"
                      label="Waktu Pemanggilan"
                      value={
                        callingLetterData.invitationDate
                          ? formatter.format(new Date(callingLetterData?.invitationDate))
                          : ""
                      }
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="puposes"
                      disabled
                      label="Tujuan Pemangilan"
                      multiline
                      value={callingLetterData.purposes || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="reason"
                      label="Alasan Pemangilan"
                      value={callingLetterData.reason || ""}
                      multiline
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Terpanggil
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type Terpanggil"
                      placeholder="ex: Bang Adnoh"
                      value={callingLetterData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama Terpanggil"
                      placeholder="ex: Bang Adnoh"
                      value={callingLetterData.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP Terpanggil"
                      value={callingLetterData.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="vendorName"
                      label="Nama Vendor"
                      value={callingLetterData.vendorName || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Pemanggil
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="picNae"
                      label="Nama PIC"
                      value={callingLetterData.caller?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={callingLetterData.caller?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={callingLetterData.caller?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={callingLetterData.caller?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={callingLetterData.caller?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP"
                      value={callingLetterData.caller?.nrp || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={callingLetterData.caller?.email || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="phone"
                      label="No Telephone"
                      value={callingLetterData.caller?.phone || ""}
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

export default CallingLetterDetail;
