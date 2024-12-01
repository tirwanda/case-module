// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Case Module Security components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Case Module Security examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

// Case Module Security page layout routes
import pageRoutes from "page.routes";

// Images
import bgImage from "assets/images/bg-pricing.jpg";

function Header({ children }) {
  return (
    <>
      <MDBox
        position="relative"
        minHeight="50vh"
        height="50vh"
        borderRadius="xl"
        m={2}
        pt={2}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { black } }) =>
            `${linearGradient(rgba(black.main, 0.25), rgba(black.main, 0.25))}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ position: "relative", py: 10, textAlign: "center" }}
        >
          <Grid item xs={11} lg={5}>
            <MDBox mb={1}>
              <MDTypography variant="h2" color="white" fontWeight="bold">
                Registrasi Kendaraan Menginap
              </MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="body2" color="white" fontWeight="light">
                Daftarkan kendaraan Anda untuk izin menginap di PT Astra Honda Motor
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Grid container sx={{ px: 6, my: 8 }}>
        <Grid item xs={12}>
          <Card sx={{ mt: -25 }}>{children}</Card>
        </Grid>
      </Grid>
    </>
  );
}

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
