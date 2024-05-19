import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";
import FormField from "../FormField";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Backdrop, Box, Fade, Icon, Modal } from "@mui/material";

import dataTableInvestigators from "../../data/dataTableInvestigator";
import tableDataUser from "../../data/tableDataUser";
import { findUsersNotInInvestigators } from "api/incidentAPI";
import { addInvestigator } from "api/incidentAPI";
import { getIncident } from "api/incidentAPI";
import { deleteInvestigator } from "api/incidentAPI";

function Investigator() {
  const [investigators, setInvestigators] = useState(dataTableInvestigators);
  const [listUsers, setListUsers] = useState(tableDataUser);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [onSave, setOnSave] = useState(false);

  const { incidentId } = useParams();
  const role = localStorage.getItem("ROLE");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddInvestigator = async (userId) => {
    await addInvestigator(incidentId, userId).then((res) => {
      setMessage(res.data.message);
    });
    setOpenModal(false);
  };

  const handleDeleteInvestigator = async (userId) => {
    await deleteInvestigator(incidentId, userId).then((res) => {
      setMessage(res.data.message);
    });
  };

  const investigatorsInit = async () => {
    let canInvestigate = false;

    await getIncident(incidentId).then((res) => {
      setInvestigators({
        ...investigators,
        rows: res.data.incident.investigator.map((user) => {
          if (role === "ROLE_ADMIN" || role === "ROLE_DEPT_HEAD") {
            canInvestigate = true;
          }
          return {
            ...user,
            actions: (
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mt={{ xs: 2, sm: 0 }}
                mr={{ xs: -1.5, sm: 0 }}
              >
                {canInvestigate && (
                  <MDButton
                    variant="text"
                    color="error"
                    onClick={() => handleDeleteInvestigator(user._id)}
                  >
                    <Icon>delete</Icon>&nbsp;delete
                  </MDButton>
                )}
              </MDBox>
            ),
          };
        }),
      });
    });
  };

  const handleShowUsersNotInvestigator = async () => {
    await findUsersNotInInvestigators(incidentId).then((res) => {
      setListUsers({
        ...listUsers,
        rows: res.data.users.map((user) => ({
          ...user,
          actions: (
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={{ xs: 2, sm: 0 }}
              mr={{ xs: -1.5, sm: 0 }}
            >
              <MDButton
                variant="text"
                color="success"
                onClick={() => handleAddInvestigator(user._id)}
              >
                <Icon>add_circle</Icon>&nbsp;Add
              </MDButton>
            </MDBox>
          ),
        })),
      });
    });
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

  useEffect(() => {
    investigatorsInit();
  }, [message]);

  return (
    <MDBox py={1}>
      <Card>
        <MDBox mt={3} mb={2}>
          <MDBox mb={1} ml={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                <MDTypography variant="h5" fontWeight="medium">
                  Investigator
                </MDTypography>
              </Grid>

              <MDBox ml="auto" mt={3} display="flex">
                {role === "ROLE_ADMIN" ||
                  (role === "ROLE_DEPT_HEAD" && (
                    <MDBox mr={2}>
                      <MDButton
                        component="label"
                        role={undefined}
                        variant="contained"
                        color="dark"
                        onClick={() => {
                          handleShowUsersNotInvestigator();
                          setOpenModal(true);
                        }}
                      >
                        Tambahkan Innvestigator
                      </MDButton>
                    </MDBox>
                  ))}
              </MDBox>
            </Grid>
          </MDBox>
          <DataTable table={investigators} />
        </MDBox>
      </Card>

      {/* Open Modal Add Investigator */}
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
                Add PIC Area
              </MDTypography>
            </MDBox>
            <DataTable
              table={listUsers}
              L
              canSearch
              entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
            />
            <MDBox mt={3}>
              <Grid container spacing={3}>
                <MDBox mt={3} ml="auto" display="flex">
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

export default Investigator;
