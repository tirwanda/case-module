// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import IncidentInfoCard from "examples/Cards/InfoCards/IncidentInfoCard";

function IncidentInfo({ incident }) {
  const removeHTMLTags = (text) => {
    return text.replace(/<[^>]*>?/gm, "");
  };

  return (
    <MDBox>
      {incident.descriptions && (
        <IncidentInfoCard
          info={{
            namaPelapor: `${incident.reporterName}`,
            nrpPelapor: `${incident.reporterNRP}`,
            plant: `${incident.plant}`,
            divisiPelapor: `${incident.reporterDivision}`,
            departmentPelapor: `${incident.reporterDepartment}`,
            organizationUnit: `${incident.organizationUnit}`,
            tanggalLaporan: `${new Date(incident.createdAt).toLocaleString()}`,
            status: `${incident.status}`,
            kategory: `${incident.category}`,
            tanggalKejadian: `${new Date(incident.incidentDate).toLocaleString()}`,
            extension: `${incident.phone}`,
            sumberLaporan: `${incident.reportSource}`,
            deskripsi: `${removeHTMLTags(incident.descriptions)}`,
          }}
          action={{ tooltip: "Edit Profile" }}
          shadow={false}
        />
      )}
    </MDBox>
  );
}

export default IncidentInfo;
