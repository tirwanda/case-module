const dataTableData = {
  columns: [
    { Header: "Nama", accessor: "reporterName", width: "15%" },
    { Header: "Plant", accessor: "plant", width: "15%" },
    { Header: "NRP", accessor: "reporterNRP", width: "10%" },
    { Header: "Category", accessor: "category", width: "20%" },
    { Header: "Waktu Kejadian", accessor: "incidentDate", width: "20%" },
    { Header: "Actions", accessor: "actions", width: "20%" },
  ],

  rows: [],
};

export default dataTableData;
