import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Case Module Security components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDSnackbar from "components/MDSnackbar";
import { userSignIn } from "api/authAPI";

import qs from "query-string";

// Context
import { useMaterialUIController, setUser } from "context";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [, dispatch] = useMaterialUIController();
  const [message, setMessage] = useState("");
  const [errorSB, setErrorSB] = useState(false);
  const [onSignIn, setOnSignIn] = useState(false);

  const initialState = {
    email: "",
    password: "",
  };
  const [data, setData] = useState(initialState);
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setOnSignIn(true);
    await userSignIn(qs.stringify(data))
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem("ACCESS_TOKEN", response.data.token);
          localStorage.setItem("EMAIL", response.data.user.email);
          localStorage.setItem("ROLE", response.data.user.role);
        }
        setUser(dispatch, response.data.user);
        navigate("/dashboards/security-pic-area");
      })
      .catch((err) => {
        setOnSignIn(false);
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              openErrorSB(err.response.data.error_message);
              break;
            case 401:
              openErrorSB("Authentication Failed.Bad Credentials");
              break;
            default:
              console.log("err: ", err);
              openErrorSB("Something Wrong!Please Try Again");
          }
        } else {
          console.log("err: ", err);
          openErrorSB("Something Wrong!Please Try Again");
        }
      });
  };

  const closeErrorSB = () => setErrorSB(false);
  // eslint-disable-next-line no-unused-vars
  const openErrorSB = (errorMessage) => {
    setErrorSB(true);
    setMessage(errorMessage);
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Sign In Failed"
      content={message}
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={1}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                value={data.email}
                name="email"
                type="email"
                label="Email"
                onChange={handleInputChange}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignIn(e);
                  }
                }}
                name="password"
                type="password"
                label="Password"
                onChange={handleInputChange}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSignIn}
                disabled={onSignIn}
              >
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/registration"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {renderErrorSB}
    </BasicLayout>
  );
}

export default Basic;
