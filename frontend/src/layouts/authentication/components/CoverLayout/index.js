// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Case Module Security components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Case Module Security examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";

// Case Module Security page layout routes
import pageRoutes from "page.routes";

function CoverLayout({ coverHeight, image, children, navbar, footer }) {
  return (
    <PageLayout>
      {navbar && (
        <DefaultNavbar
          routes={pageRoutes}
          action={{
            type: "external",
            route: "https://creative-tim.com/product/material-dashboard-pro-react",
            label: "buy now",
          }}
          transparent
          light
        />
      )}
      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox mt={{ xs: -20, lg: -18 }} px={1} width="calc(100% - 2rem)" mx="auto">
        <Grid container spacing={1} justifyContent="center">
          <Grid item xl={11}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      {footer && <Footer />}
    </PageLayout>
  );
}

// Setting default props for the CoverLayout
CoverLayout.defaultProps = {
  coverHeight: "35vh",
  navbar: true,
  footer: true,
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  navbar: PropTypes.bool,
  footer: PropTypes.bool,
};

export default CoverLayout;
