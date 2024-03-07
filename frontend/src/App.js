import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Case Module Security components
import MDBox from "components/MDBox";

// Case Module Security examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Case Module Security themes
import theme from "assets/theme";

// Case Module Security Dark Mode themes
import themeDark from "assets/theme-dark";

// Case Module Security routes
import routes from "routes";

// Case Module Security contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Layouts Component
import SignInBasic from "layouts/authentication/sign-in/basic";
import RegisterStepper from "layouts/authentication/sign-up/cover";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import SecurityPICArea from "layouts/dashboards/securityPICArea";
import Employes from "layouts/dashboards/employes";
import UpdateIncident from "layouts/incident/update-incident";
import ViewIncident from "layouts/incident/view-incident";
import Investigate from "layouts/incident/investigate";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [render, setRender] = useState(false);
  const { pathname } = useLocation();
  const [customRoutes, setCustomRoutes] = useState(routes);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  function getDashboardRoutes() {
    const role = localStorage.getItem("ROLE");

    if (role === "ROLE_ADMIN" || role === "ROLE_USER") {
      return [
        {
          name: "Security PIC Area",
          key: "Security PIC Area",
          route: "/dashboards/security-pic-area",
          component: <SecurityPICArea />,
        },
        {
          name: "Employes",
          key: "Employes",
          route: "/dashboards/employes",
          component: <Employes />,
        },
      ];
    }
    return null;
  }

  const handleRoutes = () => {
    const newRoutes = [...customRoutes];
    const posDashboardSideNav = newRoutes.findIndex((route) => route.key === "dashboards");

    newRoutes[posDashboardSideNav].collapse = getDashboardRoutes();

    setCustomRoutes(newRoutes);
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
    handleRoutes();
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    handleRoutes();
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, [pathname]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Case Module"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        <Route path="/sign-in" element={<SignInBasic />} />
        <Route path="/registration" element={<RegisterStepper />} />
        <Route path="/pages/incident/:incidentId" element={<UpdateIncident />} />
        <Route path="/pages/view-incident/:incidentId" element={<ViewIncident />} />
        <Route path="/pages/investigate/:incidentId" element={<Investigate />} />
        {localStorage.getItem("ACCESS_TOKEN") && getRoutes(customRoutes)}
        <Route path="*" element={<Navigate to="/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
