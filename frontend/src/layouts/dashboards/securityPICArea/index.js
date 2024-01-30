import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/dashboards/securityPICArea/data/dataTableData";
import { getEmployes } from "api/employesAPI";
import MDSnackbar from "components/MDSnackbar";

function SecurityPICArea() {
  const [employes, setEmployes] = useState(dataTableData);
  const [lastDelete, setLastDelete] = useState({});
  const [successSB, setSuccesSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const openSuccessSB = (data) => {
    setSuccesSB(true);
    setMessage(data);
  };
  const closeSuccessSB = () => setSuccesSB(false);
  const openErrorSB = (data) => {
    setErrorSB(true);
    setMessage(data);
  };
  const closeErrorSB = () => setErrorSB(false);

  const getPICArea = () => {
    const role = localStorage.getItem("ROLE");

    if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN" || role === "ROLE_USER") {
      getEmployes()
        .then((res) => {
          setEmployes({
            ...employes,
            rows: res.data.data.map((item) => ({
              ...item,
            })),
          });
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }
  };

  useEffect(() => {
    getPICArea();
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Success"
      content={`Successfully deleting asset ${message}`}
      dateTime="A few seconds ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Failed to create line"
      content={message}
      dateTime="A few secons ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Master Data Security Area
            </MDTypography>
          </MDBox>
          <DataTable table={employes} canSearch />
        </Card>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SecurityPICArea;
