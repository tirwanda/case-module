import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { storage } from "firebase.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";
import FormField from "../FormField";

import dataTableStatementLetter from "../../data/dataTableStatementLetter";
import { getAllPICArea } from "api/picAreaAPI";
import {
  addStatementLetter,
  getStatementLettersByIncidentId,
  deleteStatementLetterById,
} from "api/statementLetterAPI";
import { set } from "date-fns";

function StatementLetter() {
  const [statementLetters, setStatementLetters] = useState(dataTableStatementLetter);
  const [openModal, setOpenModal] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [typeList, setTypeList] = useState(["Internal AHM", "Eksternal AHM"]);
  const [picNameList, setPicNameList] = useState([]);
  const [picList, setPicList] = useState([]);
  const [dataFile, setDataFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [statementLetterData, setStatementLetterData] = useState({
    type: "",
    name: "",
    nrp: "",
    picId: "",
    incidentId: "",
    vendorName: "",
    incidentId: "",
    attachmentName: "",
    attachment: "",
  });

  const { incidentId } = useParams();

  const handleDownloadTemplate = async () => {
    try {
      // Path to the template file in Firebase Storage
      const templatePath = "template/Surat-Pernyataan.docx"; // Change this to the path of your template file

      // Create a reference to the template file
      const storageRef = ref(storage, templatePath);

      // Get the download URL for the template file
      const downloadURL = await getDownloadURL(storageRef);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = downloadURL;

      // Set the download attribute to specify the file name
      link.setAttribute("download", "Surat-Pernyataan.docx"); // Change "template.pdf" to the desired file name

      // Append the link to the document body
      document.body.appendChild(link);

      // Trigger the click event on the link to start the download
      link.click();

      // Clean up by removing the link from the document body
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  const handlePicChange = (name) => {
    picList.forEach((pic) => {
      if (pic.employee.name === name)
        setStatementLetterData({ ...statementLetterData, picId: pic.employee._id });
    });
  };

  const handleDeleteStatemetLetter = async (statementLetterId, attachment) => {
    await deleteStatementLetterById(statementLetterId).then((response) => {
      statementLetterInit();
    });
    await deleteObject(ref(storage, attachment))
      .then(() => {})
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const statementLetterInit = async () => {
    const tempArray = [];
    await getStatementLettersByIncidentId(incidentId).then((response) => {
      response.data.statementLetters?.forEach((statemetLetter) => {
        tempArray.push({
          name: statemetLetter.name,
          picName: statemetLetter.pic.name,
          picDepartment: statemetLetter.pic.department,
          status: statemetLetter.status,
          nrp: statemetLetter.nrp,
          attachment: (
            <Link href={statemetLetter.attachment} target="_blank">
              <MDButton variant="text" color="dark">
                <PageviewOutlinedIcon />
                &nbsp;view
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
                color="error"
                onClick={() =>
                  handleDeleteStatemetLetter(statemetLetter._id, statemetLetter.attachment)
                }
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setStatementLetters({ ...statementLetters, rows: tempArray });
  };

  const handleAddStatementLetter = async () => {
    setOnSave(true);
    const storageRef = ref(storage, `Statement-Letter/${fileName}.pdf`);
    await uploadBytes(storageRef, dataFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        await addStatementLetter({
          ...statementLetterData,
          attachment: downloadURL,
          incidentId: incidentId,
          attachmentName: fileName,
        }).then((response) => {
          statementLetterInit();
        });
      });
    });
    handleCloseModal();

    setStatementLetterData({
      type: "",
      name: "",
      nrp: "",
      picId: "",
      incidentId: incidentId,
      vendorName: "",
      incidentId: "",
      attachmentName: "",
      attachment: "",
    });
  };

  const getEmployeeList = async () => {
    const tempArray = [];
    await getAllPICArea().then((response) => {
      setPicList(response.data.PICAreas);
      response.data.PICAreas.forEach((pic) => {
        tempArray.push(pic.employee.name);
      });
    });
    setPicNameList(tempArray);
  };

  const uploadStatementLetter = async (data) => {
    if (data === null) {
      return;
    }
    if (data.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setDataFile(data);

    document.getElementById("fileInput").value = null;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

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

  useEffect(() => {
    statementLetterInit();
    getEmployeeList();
    setStatementLetterData({ ...statementLetterData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Surat Pernyataan
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
                      setOpenModal(true);
                      setOnSave(false);
                      document.getElementById("fileInput").value = null;
                      setDataFile(null);
                      setFileName(`${v4()}`);
                    }}
                  >
                    Tambah Surat
                  </MDButton>
                </MDBox>
                <MDBox mr={2}>
                  <MDButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    color="dark"
                    onClick={handleDownloadTemplate}
                  >
                    Download Template
                  </MDButton>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={statementLetters} />
        </MDBox>
      </Card>

      {/* Open Modal Add Statement Letter */}
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
                Tambahkan Surat Pernyataan
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
                        Type Surat
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        setStatementLetterData({ ...statementLetterData, type: value });
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
                      label="Nama Pembuat Surat"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setStatementLetterData({
                          ...statementLetterData,
                          [e.target.name]: e.target.value,
                          attachmentName: fileName,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="nrp"
                      label="NRP Terpanggil"
                      placeholder="ex: 34563"
                      type="number"
                      disabled={statementLetterData.type === "Eksternal AHM"}
                      onChange={(e) =>
                        setStatementLetterData({
                          ...statementLetterData,
                          [e.target.name]: e.target.value,
                          attachmentName: fileName,
                        })
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
                        Nama PIC
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
                      disabled={statementLetterData.type === "Internal AHM"}
                      onChange={(e) =>
                        setStatementLetterData({
                          ...statementLetterData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                  <MDBox>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      color="primary"
                      startIcon={<CloudUploadIcon color="white" />}
                    >
                      <p style={{ color: "white" }}>{dataFile ? "Edit Surat" : "Upload Surat"}</p>
                      <VisuallyHiddenInput
                        id="fileInput"
                        type="file"
                        onChange={(event) => uploadStatementLetter(event.target.files[0])}
                      />
                    </Button>
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
                          statementLetterData.type &&
                          statementLetterData.name &&
                          statementLetterData.picId &&
                          dataFile
                        ) || onSave
                      }
                      onClick={handleAddStatementLetter}
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

export default StatementLetter;
