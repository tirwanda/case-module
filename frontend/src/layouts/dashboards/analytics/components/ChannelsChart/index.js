import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Case Module Security components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadgeDot from "components/MDBadgeDot";
import PieChart from "examples/Charts/PieChart";

// Case Module Security contexts
import { useMaterialUIController } from "context";

function ChannelsChart({ title, data }) {
  const [controller] = useMaterialUIController();
  const [channelData, setChannelData] = useState({});
  const [colors, setColors] = useState([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]);
  const { darkMode } = controller;

  useEffect(() => {
    const labesTemp = [];
    const dataTemp = [];
    data.forEach((item) => {
      labesTemp.push(item.status);
      dataTemp.push(item.percentage);
    });
    setChannelData({
      labels: labesTemp,
      datasets: {
        label: "Projects",
        backgroundColors: colors,
        data: dataTemp,
      },
    });
  }, [data]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6">{title}</MDTypography>
        <Tooltip title="Nilai dalam bentuk Persentase (%)" placement="bottom" arrow>
          <MDButton variant="outlined" color="secondary" size="small" circular iconOnly>
            <Icon>priority_high</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
      <MDBox mt={3}>
        <Grid container alignItems="center">
          <Grid item xs={7}>
            <PieChart chart={channelData} height="12.5rem" />
          </Grid>
          <Grid item xs={5}>
            <MDBox pr={1}>
              {data.map((item, index) => (
                <MDBox mb={1} key={index}>
                  <MDBadgeDot
                    color={colors[index]}
                    size="sm"
                    badgeContent={item.name}
                    style={{ padding: "0px" }}
                  />
                </MDBox>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default ChannelsChart;
