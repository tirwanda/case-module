import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { storage } from "firebase.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import FormField from "../FormField";

import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers";

import { getAllPICArea } from "api/picAreaAPI";
import { addBap, getBapByIncidentId, deleteBapById } from "api/bapAPI";
import dataTableBap from "../../data/dataTableBap";
import { set } from "date-fns";

function Bap() {
  const [baps, setBaps] = useState(dataTableBap);
  const [openModal, setOpenModal] = useState(false);
  const [typeList, setTypeList] = useState(["Internal AHM", "Eksternal AHM"]);
  const [onSave, setOnSave] = useState(false);
  const [picList, setPicList] = useState([]);
  const [checkerList, setCheckerList] = useState([]);
  const [picNameList, setPicNameList] = useState([]);
  const [checkerNameList, setCheckerNameList] = useState([]);
  const [dataFile, setDataFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [bapData, setBapData] = useState({
    type: "",
    name: "",
    nrp: "",
    nik: "",
    placeOfBirth: "",
    dateOfBirth: "",
    religion: "",
    address: "",
    vendorName: "",
    picId: "",
    checkerId: "",
    interviewDate: "",
    location: "",
    purposes: "",
    incidentId: "",
    status: "Created",
    attachmentName: "",
    attachment: "",
  });

  const { incidentId } = useParams();

  const getEmployeeList = async () => {
    const tempArray = [];
    await getAllPICArea().then((response) => {
      setPicList(response.data.PICAreas);
      setCheckerList(response.data.PICAreas);
      response.data.PICAreas.forEach((pic) => {
        tempArray.push(pic.employee.name);
      });
    });
    setPicNameList(tempArray);
    setCheckerNameList(tempArray);
  };

  const handlePicChange = (name) => {
    picList.forEach((pic) => {
      if (pic.employee.name === name) setBapData({ ...bapData, picId: pic.employee._id });
    });
  };

  const handleCheckerChange = (name) => {
    checkerList.forEach((checker) => {
      if (checker.employee.name === name)
        setBapData({ ...bapData, checkerId: checker.employee._id });
    });
  };

  const handleDeleteBap = async (bapId, attachment) => {
    await deleteBapById(bapId).then((response) => {
      bapInit();
    });
    await deleteObject(ref(storage, attachment))
      .then(() => {})
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleAddBap = async () => {
    setOnSave(true);
    const storageRef = ref(storage, `BAP/${fileName}.pdf`);
    await uploadBytes(storageRef, dataFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        await addBap({
          ...bapData,
          attachment: downloadURL,
          attachmentName: fileName,
        }).then((response) => {
          bapInit();
        });
      });
    });
    handleCloseModal();

    setBapData({
      type: "",
      name: "",
      nrp: "",
      nik: "",
      placeOfBirth: "",
      dateOfBirth: "",
      religion: "",
      address: "",
      vendorName: "",
      picId: "",
      checkerId: "",
      interviewDate: "",
      location: "",
      purposes: "",
      incidentId: incidentId,
      status: "Created",
      attachmentName: "",
      attachment: "",
    });
  };

  const handleCloseModal = () => {
    setOnSave(false);
    setOpenModal(false);
  };
  const handleDownloadTemplate = async () => {
    try {
      // Path to the template file in Firebase Storage
      const templatePath = "template/Surat-BAP.docx"; // Change this to the path of your template file

      // Create a reference to the template file
      const storageRef = ref(storage, templatePath);

      // Get the download URL for the template file
      const downloadURL = await getDownloadURL(storageRef);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = downloadURL;

      // Set the download attribute to specify the file name
      link.setAttribute("download", "Surat-BAP.docx"); // Change "template.pdf" to the desired file name

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

  const uploadBap = async (data) => {
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

  const bapInit = async () => {
    const tempArray = [];
    await getBapByIncidentId(incidentId).then((response) => {
      response.data.bap?.forEach((bap) => {
        tempArray.push({
          name: bap.name,
          picName: bap.pic.name,
          picDepartment: bap.pic.department,
          checkerName: bap.checker.name,
          interviewDate: new Date(bap.interviewDate).toLocaleDateString(),
          status: bap.status,
          attachment: (
            <Link href={bap.attachment} target="_blank">
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
                onClick={() => handleDeleteBap(bap._id, bap.attachment)}
              >
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
          ),
        });
      });
    });
    setBaps({ ...baps, rows: tempArray });
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
    bapInit();
    getEmployeeList();
    setBapData({ ...bapData, incidentId });
  }, []);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Berita Acara Investigasi
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
                      setOnSave(false);
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
          <DataTable table={baps} />
        </MDBox>
      </Card>

      {/* Open Modal Add Calling Letter */}
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
                Tambahkan Surat BAP
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
                        setBapData({ ...bapData, type: value });
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
                      label="Nama Terperiksa"
                      placeholder="ex: Bang Adnoh"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                      type="number"
                      label="NRP Terperiksa"
                      placeholder="ex: 34563"
                      disabled={bapData.type === "Eksternal AHM"}
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                      name="nik"
                      label="NIK Terperiksa"
                      type="number"
                      placeholder="ex: 32934939212453"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                      name="placeOfBirth"
                      label="Tempat Lahir"
                      placeholder="ex: Jakarta"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
                          [e.target.name]: e.target.value,
                          attachmentName: fileName,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Tanggal Lahir"
                        value={bapData.dateOfBirth ? new Date(bapData.dateOfBirth) : new Date()}
                        onChange={(newValue) =>
                          setBapData({
                            ...bapData,
                            dateOfBirth: newValue.getTime(),
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
                      name="religion"
                      label="Agama Terperiksa"
                      placeholder="ex: Islam"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                      name="address"
                      label="Alamat Domsili Terperiksa"
                      placeholder="ex: Jakarta"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                        Nama Pemeriksa
                      </MDTypography>
                    </MDBox>
                    <Autocomplete
                      onChange={(event, value) => {
                        handleCheckerChange(value);
                      }}
                      options={checkerNameList}
                      renderInput={(params) => <MDInput {...params} variant="standard" />}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6} mb={1}>
                  <MDBox>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Tanggal Pemeriksaan"
                        value={
                          bapData.invitationDate ? new Date(bapData.invitationDate) : new Date()
                        }
                        onChange={(newValue) =>
                          setBapData({
                            ...bapData,
                            interviewDate: newValue.getTime(),
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
                      label="Lokasi Pemeriksaan"
                      placeholder="ex: Pos Komando - Plant 1"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDBox>
                    <FormField
                      label="Alasan Pemeriksaan"
                      name="purposes"
                      multiline
                      placeholder="ex: Karna yang bersangkutan di sebutkan dalam laporan kejadian"
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                      disabled={bapData.type === "Internal AHM"}
                      onChange={(e) =>
                        setBapData({
                          ...bapData,
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
                        onChange={(event) => uploadBap(event.target.files[0])}
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
                          bapData.type &&
                          bapData.name &&
                          bapData.nik &&
                          bapData.placeOfBirth &&
                          bapData.dateOfBirth &&
                          bapData.religion &&
                          bapData.address &&
                          bapData.picId &&
                          bapData.checkerId &&
                          bapData.location &&
                          bapData.purposes &&
                          dataFile
                        ) || onSave
                      }
                      onClick={handleAddBap}
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

export default Bap;
