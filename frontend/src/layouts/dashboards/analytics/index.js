import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import { Autocomplete } from "@mui/material";
import Card from "@mui/material/Card";

// Case Module Security components
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Case Module Security examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultStatisticsCard from "examples/Cards/StatisticsCards/DefaultStatisticsCard";
import HorizontalBarChart from "layouts/dashboards/analytics/components/HorizontalBarChart";

// Sales dashboard components
import ChannelsChart from "layouts/dashboards/analytics/components/ChannelsChart";

// Data
import MDInput from "components/MDInput";
import { getDataAnalytics } from "api/analyticsAPI";

function Analytics() {
  const [searchParam, setSearchParam] = useState({ plant: "P1 Sunter" });
  const [horizontabBarStatusData, setHorizontalBarStatusData] = useState({});
  const [horizontabBarCategorysData, setHorizontalBarCategoryData] = useState({});
  const [horizontabBarSourceData, setHorizontalBarSourceData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const [listPlant, setListPlant] = useState([
    "P1 Sunter",
    "P2 Pegangsaan",
    "Pulo Gadung",
    "P3 Cikarang",
    "P4 Karawang",
    "P5 Karawang",
    "P6 Deltamas",
    "PQE",
    "SRTC",
  ]);

  const getAnalyticsData = async (plant) => {
    await getDataAnalytics(plant).then((response) => {
      let labelsTemp = [];
      let dataTemp = [];
      setAnalyticsData(response.data);

      response.data.status.forEach((item) => {
        labelsTemp.push(item.name);
        dataTemp.push(item.count);
      });
      setHorizontalBarStatusData({
        labels: labelsTemp,
        datasets: [
          {
            label: "Jumlah laporan",
            color: "dark",
            data: dataTemp,
          },
        ],
      });

      labelsTemp = [];
      dataTemp = [];
      response.data.category.forEach((item) => {
        labelsTemp.push(item.name);
        dataTemp.push(item.count);
      });
      setHorizontalBarCategoryData({
        labels: labelsTemp,
        datasets: [
          {
            label: "Jumlah laporan",
            color: "dark",
            data: dataTemp,
          },
        ],
      });

      labelsTemp = [];
      dataTemp = [];
      response.data.reportSource.forEach((item) => {
        labelsTemp.push(item.name);
        dataTemp.push(item.count);
      });
      setHorizontalBarSourceData({
        labels: labelsTemp,
        datasets: [
          {
            label: "Jumlah laporan",
            color: "dark",
            data: dataTemp,
          },
        ],
      });
    });
  };

  const handleSeacrhForm = () => {
    getAnalyticsData(searchParam);
  };

  useEffect(() => {
    getAnalyticsData(searchParam);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar showRoutes={false} isMini />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {/* Search Options */}
            <Grid item xs={12} sm={8}>
              <MDBox pb={1}>
                <Card id="basic-info" sx={{ overflow: "visible" }}>
                  <MDBox p={3}>
                    <MDTypography variant="h6">Search Options</MDTypography>
                  </MDBox>
                  <MDBox component="form" pb={3} px={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={10}>
                        <MDBox>
                          <MDBox display="inline-block">
                            <MDTypography
                              component="label"
                              variant="button"
                              fontWeight="regular"
                              color="text"
                              textTransform="capitalize"
                            >
                              Plant
                            </MDTypography>
                          </MDBox>
                          <Autocomplete
                            options={listPlant}
                            defaultValue="P1 Sunter"
                            onChange={(_, value) => {
                              setSearchParam({ ...searchParam, plant: value });
                            }}
                            renderInput={(params) => <MDInput {...params} variant="standard" />}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <MDBox mt={3}>
                          <MDButton
                            variant="gradient"
                            color="dark"
                            disabled={searchParam.plant === null}
                            onClick={() => handleSeacrhForm(searchParam)}
                          >
                            Search
                          </MDButton>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            {/* Total Incident */}
            <Grid item xs={12} sm={4}>
              <DefaultStatisticsCard
                title="Total Laporan Kejadian"
                count={analyticsData.count || ""}
              />
            </Grid>
          </Grid>
        </MDBox>
        {analyticsData.count > 0 && (
          <MDBox>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={4}>
                  <ChannelsChart
                    title={"Presentase Laporan Kejadian Berdasarkan Status"}
                    data={analyticsData.status}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={8}>
                  <HorizontalBarChart
                    title="Jumlah Laporan Kejadian Berdasarkan Status"
                    chart={horizontabBarStatusData}
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={4}>
                  <ChannelsChart
                    title={"Presentase Laporan Kejadian Berdasarkan Kategory Laporan"}
                    data={analyticsData.category}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={8}>
                  <HorizontalBarChart
                    title="Jumlah Laporan Kejadian Berdasarkan Kategory Laporan"
                    chart={horizontabBarCategorysData}
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} lg={4}>
                  <ChannelsChart
                    title={"Presentase Laporan Kejadian Berdasarkan Sumber Laporan"}
                    data={analyticsData.reportSource}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={8}>
                  <HorizontalBarChart
                    title="Jumlah Laporan Kejadian Berdasarkan Sumber Laporan"
                    chart={horizontabBarSourceData}
                  />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
