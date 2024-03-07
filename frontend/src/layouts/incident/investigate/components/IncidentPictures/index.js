import { useEffect, useState } from "react";
import { storage } from "firebase.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import dataTableData from "../../data/dataTableData";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Button from "@mui/material/Button";
import DataTable from "examples/Tables/DataTable";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateIncidentByKaru, deleteIncidentPicture } from "api/incidentAPI";
import { set } from "date-fns";

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

function IncidentPictures({ incidentInfo }) {
  const [pictures, setPictures] = useState(dataTableData);
  const { incidentId } = useParams();

  const handleDeletePicture = async (pictureName, pictureId) => {
    try {
      const storageRef = ref(storage, `Incident-Pictures/${pictureName}`);
      await deleteIncidentPicture(incidentId, pictureId)
        .then((response) => {
          const tempRows = [];
          response.data.incidentPicture?.forEach((picture, index) => {
            tempRows.push({
              no: index + 1,
              name: `Foto TKP - ${index + 1}`,
              id: picture.name,
              actions: (
                <MDBox display="flex" justifyContent="space-between">
                  <MDButton
                    variant="gradient"
                    color="error"
                    onClick={() => handleDeletePicture(picture.name, picture._id)}
                  >
                    Delete
                  </MDButton>
                </MDBox>
              ),
            });
          });
          setPictures({ ...pictures, rows: tempRows });
        })
        .then(() => {
          deleteObject(storageRef);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const picturesInit = () => {
    const tempRows = [];
    incidentInfo.incidentPicture.forEach((picture, index) => {
      tempRows.push({
        no: index + 1,
        name: `Foto TKP - ${index + 1}`,
        id: picture.name,
        actions: (
          <MDBox display="flex" justifyContent="space-between">
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => handleDeletePicture(picture.name, picture._id)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      });
    });

    setPictures({ ...pictures, rows: tempRows });
  };

  const uploadImage = async (data) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (data === null) {
      return;
    }
    if (!allowedTypes.includes(data.type)) {
      alert("File type not supported");
    } else {
      const pictureName = `${incidentInfo._id}-${v4()}`;
      const storageRef = ref(storage, `Incident-Pictures/${pictureName}`);
      await uploadBytes(storageRef, data).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then(async (downloadURL) => {
            await updateIncidentByKaru(incidentId, {
              incidentPicture: [{ url: downloadURL, name: pictureName }],
            }).then((response) => {
              const tempRows = [];
              response.data.incident.incidentPicture.forEach((picture, index) => {
                tempRows.push({
                  no: index + 1,
                  name: `Foto TKP - ${index + 1}`,
                  id: picture.name,
                  actions: (
                    <MDBox display="flex" justifyContent="space-between">
                      <MDButton
                        variant="gradient"
                        color="error"
                        onClick={() => handleDeletePicture(picture.name, picture._id)}
                      >
                        Delete
                      </MDButton>
                    </MDBox>
                  ),
                });
              });
              setPictures({ ...pictures, rows: tempRows });
            });
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      });
    }
  };

  useEffect(() => {
    picturesInit();
  }, []);

  return (
    <MDBox py={3}>
      <Card sx={{ overflow: "visible" }}>
        <MDBox mt={8} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Incident Pictures
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                <MDBox mr={2}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    color="primary"
                    startIcon={<CloudUploadIcon color="white" />}
                  >
                    <p style={{ color: "white" }}>Upload</p>
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => uploadImage(event.target.files[0])}
                    />
                  </Button>
                </MDBox>
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={pictures} />
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default IncidentPictures;
