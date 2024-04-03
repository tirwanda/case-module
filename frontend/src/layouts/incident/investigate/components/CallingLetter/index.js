import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { storage } from "firebase.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";
import FormField from "../FormField";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Autocomplete from "@mui/material/Autocomplete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";

import { getAllPICArea } from "api/picAreaAPI";
import dataTableCallingLetter from "../../data/dataTableCallingLetter";
import {
  deleteCallingLetterById,
  addCallingLetter,
  getCallingLetterByIncidentId,
} from "api/callingLetterAPI";

function CallingLetter() {
  const [callingLetters, setCallingLetters] = useState(dataTableCallingLetter);
  const [openModal, setOpenModal] = useState(false);
  const [typeList, setTypeList] = useState(["Internal AHM", "Eksternal AHM"]);
  const [picList, setPicList] = useState([]);
  const [callerList, setCallerList] = useState([]);
  const [picNameList, setPicNameList] = useState([]);
  const [callerNameList, setCallerNameList] = useState([]);
  const [dataFile, setDataFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [callingLetterData, setCallingLetterData] = useState({
    type: "",
    name: "",
    nrp: "",
    picId: "",
    callerId: "",
    invitationDate: "",
    location: "",
    reason: "",
    purposes: "",
    incidentId: "",
    vendorName: "",
    incidentId: "",
    attachmentName: "",
    attachment: "",
  });

  const { incidentId } = useParams();

  const getEmployeeList = async () => {
    const tempArray = [];
    await getAllPICArea().then((response) => {
      setPicList(response.data.PICAreas);
      setCallerList(response.data.PICAreas);
      response.data.PICAreas.forEach((pic) => {
        tempArray.push(pic.employee.name);
      });
    });
    setPicNameList(tempArray);
    setCallerNameList(tempArray);
  };

  const handlePicChange = (name) => {
    picList.forEach((pic) => {
      if (pic.employee.name === name)
        setCallingLetterData({ ...callingLetterData, picId: pic.employee._id });
    });
  };

  const handleCallerChange = (name) => {
    callerList.forEach((caller) => {
      if (caller.employee.name === name)
        setCallingLetterData({ ...callingLetterData, callerId: caller.employee._id });
    });
  };

  const handleDeleteCallingLetter = async (callingLetterId, attachment) => {
    await deleteCallingLetterById(callingLetterId).then((response) => {
      callinLetterInit();
    });
    await deleteObject(ref(storage, attachment))
      .then(() => {})
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleAddCallingLetter = async () => {
    const storageRef = ref(storage, `Calling-Letter/${fileName}.pdf`);
    await uploadBytes(storageRef, dataFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        await addCallingLetter({
          ...callingLetterData,
          attachment: downloadURL,
          attachmentName: fileName,
        }).then((response) => {
          callinLetterInit();
          handleCloseModal();
        });
      });
    });

    setCallingLetterData({
      type: "",
      name: "",
      nrp: "",
      picId: "",
      callerId: "",
      invitationDate: "",
      location: "",
      reason: "",
      purposes: "",
      incidentId: "",
      vendorName: "",
      incidentId: incidentId,
      attachment: "",
      attachmentName: "",
    });
  };

  const handleCloseModal = () => setOpenModal(false);
  const handleDownloadTemplate = async () => {
    try {
      // Path to the template file in Firebase Storage
      const templatePath = "template/Surat-Pemanggilan.docx"; // Change this to the path of your template file

      // Create a reference to the template file
      const storageRef = ref(storage, templatePath);

      // Get the download URL for the template file
      const downloadURL = await getDownloadURL(storageRef);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = downloadURL;

      // Set the download attribute to specify the file name
      link.setAttribute("download", "Surat-Pemanggilan.docx"); // Change "template.pdf" to the desired file name

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

  const uploadCallingLetter = async (data) => {
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

  const callinLetterInit = async () => {
    const tempArray = [];
    await getCallingLetterByIncidentId(incidentId).then((response) => {
      response.data.callingLetters?.forEach((callingLetter) => {
        tempArray.push({
          name: callingLetter.name,
          picName: callingLetter.pic.name,
          picDepartment: callingLetter.pic.department,
          callerName: callingLetter.caller.name,
          invitationDate: new Date(callingLetter.invitationDate).toLocaleDateString(),
          status: callingLetter.status,
          attachment: (
            <Link href={callingLetter.attachment} target="_blank">
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
                  handleDeleteCallingLetter(callingLetter._id, callingLetter.attachment)
                }
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setCallingLetters({ ...callingLetters, rows: tempArray });
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
    callinLetterInit();
    getEmployeeList();
    setCallingLetterData({ ...callingLetterData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Surat Pemanggilan
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
          <DataTable table={callingLetters} />
        </MDBox>
      </Card>

      {/* Open Modal Add Perpetrator */}
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
                Tambahkan Surat Pemanggilan
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
                        setCallingLetterData({ ...callingLetterData, type: value });
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
                      label="Nama Terpanggil"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
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
                      disabled={callingLetterData.type === "Eksternal AHM"}
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
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
                        Nama Pemanggil
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        handleCallerChange(value);
                      }}
                      options={callerNameList}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Tanggal Pemanggilan"
                        value={
                          callingLetterData.invitationDate
                            ? new Date(callingLetterData.invitationDate)
                            : new Date()
                        }
                        onChange={(newValue) =>
                          setCallingLetterData({
                            ...callingLetterData,
                            invitationDate: newValue.getTime(),
                          })
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      name="location"
                      label="Lokasi Pemanggilan"
                      placeholder="ex: Pos Komando - Plant 1"
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      label="Alasan Pemanggilan"
                      name="reason"
                      multiline
                      placeholder="ex: Karna yang bersangkutan di sebutkan dalam laporan kejadian"
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      label="Keperluaan Pemanggilan"
                      name="purposes"
                      multiline
                      placeholder="ex: Diminta untuk memberikan keterangan terkait kejadian yang terjadi"
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      label="Nama Vendor"
                      name="vendorName"
                      placeholder="ex: ISS"
                      disabled={callingLetterData.type === "Internal AHM"}
                      onChange={(e) =>
                        setCallingLetterData({
                          ...callingLetterData,
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
                      <p style={{ color: "white" }}>Upload Surat </p>
                      <VisuallyHiddenInput
                        id="fileInput"
                        type="file"
                        onChange={(event) => uploadCallingLetter(event.target.files[0])}
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
                          callingLetterData.type &&
                          callingLetterData.name &&
                          callingLetterData.picId &&
                          callingLetterData.callerId &&
                          callingLetterData.location &&
                          callingLetterData.reason &&
                          callingLetterData.purposes &&
                          dataFile
                        )
                      }
                      onClick={handleAddCallingLetter}
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

export default CallingLetter;
