import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Link, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import dataTableViewBap from "../../data/dataTableViewBap";
import { getBapByIncidentId } from "api/bapAPI";

function BapDetail() {
  const [baps, setBaps] = useState(dataTableViewBap);
  const [listBap, setListBap] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bapData, setBapData] = useState({});
  const [bapId, setBapId] = useState("");
  const { incidentId } = useParams();

  const handleShowCallingLetter = (bapId) => () => {
    setBapId(bapId);
  };

  const bapInit = async () => {
    const tempRows = [];
    const arrListBap = [];
    await getBapByIncidentId(incidentId).then((response) => {
      response.data.bap?.forEach((bap) => {
        arrListBap.push(bap);
        tempRows.push({
          name: bap.name,
          picName: bap.pic.name,
          picDepartment: bap.pic.department,
          checkerName: bap.checker.name,
          interviewDate: new Date(bap.interviewDate).toLocaleDateString(),
          attachment: (
            <Link href={bap.attachment} target="_blank">
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
              <MDButton variant="text" color="dark" onClick={handleShowCallingLetter(bap._id)}>
                <Icon>visibility</Icon>&nbsp;view
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setListBap(arrListBap);
    setBaps({ ...baps, rows: tempRows });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setBapId("");
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
    bapInit();
    setBapData({ ...bapData, incidentId });
  }, []);

  useEffect(() => {
    if (!bapId) return;
    listBap?.forEach((bap) => {
      if (bap._id === bapId) {
        setBapData(bap);
      }
    });
    setOpenModal(true);
  }, [bapId]);

  return (
    <MDBox py={1} mt={8}>
      <MDBox>
        <MDBox mb={1} ml={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={5}>
              <MDTypography variant="h5" fontWeight="medium">
                Informasi Surat BAP
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <DataTable canSearch table={baps} />
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
                Informasi BAP
              </MDTypography>
            </MDBox>
            <MDBox component="form" role="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="location"
                      label="Lokasi Pemeriksaan"
                      value={bapData.location || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="invitationDate"
                      label="Waktu Pemeriksaan"
                      value={
                        bapData.interviewDate
                          ? formatter.format(new Date(bapData?.interviewDate))
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
                      label="Tujuan Pemeriksaan"
                      multiline
                      value={bapData.purposes || ""}
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Terperiksa
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="type"
                      disabled
                      label="Type"
                      placeholder="ex: Bang Adnoh"
                      value={bapData.type || ""}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="name"
                      label="Nama"
                      placeholder="ex: Bang Adnoh"
                      value={bapData.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nik" label="NIK" value={bapData.nik || ""} disabled />
                  </MDBox>
                </Grid>

                {bapData.type === "Internal AHM" && (
                  <Grid item xs={12} sm={6}>
                    <MDBox>
                      <FormField
                        name="nrp"
                        label="NRP Terpanggil"
                        value={bapData.nrp || ""}
                        disabled
                      />
                    </MDBox>
                  </Grid>
                )}

                {bapData.type !== "Internal AHM" && (
                  <Grid item xs={12} sm={6}>
                    <MDBox>
                      <FormField
                        name="vendorName"
                        label="Nama Vendor"
                        value={bapData.vendorName || ""}
                        disabled
                      />
                    </MDBox>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="dateOfBirth"
                      label="Tanggal Lahir"
                      value={
                        bapData.interviewDate
                          ? `${bapData?.placeOfBirth}, ${new Date(
                              bapData?.interviewDate
                            ).toLocaleDateString()}`
                          : ""
                      }
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="address"
                      label="Alamat"
                      value={bapData.address || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <MDTypography variant="h5" fontWeight="medium" color="dark" mt={1}>
                    Informasi Pemeriksa
                  </MDTypography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="picNae"
                      label="Nama PIC"
                      value={bapData.checker?.name || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="division"
                      label="Division"
                      value={bapData.checker?.division || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="department"
                      label="Department"
                      value={bapData.checker?.department || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="jabatan"
                      label="Jabatan"
                      value={bapData.checker?.jabatan || ""}
                      disabled
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField name="nrp" label="NRP" value={bapData.checker?.nrp || ""} disabled />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="email"
                      label="Email"
                      value={bapData.checker?.email || ""}
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

export default BapDetail;
