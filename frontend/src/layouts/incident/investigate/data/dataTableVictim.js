const dataTableVictim = {
  columns: [
    { Header: "Tipe Korban", accessor: "type", width: "15%" },
    { Header: "Nama Korban", accessor: "name", width: "15%" },
    { Header: "KTP Korban", accessor: "ktp", width: "15%" },
    { Header: "NRP Korban", accessor: "nrpVictim", width: "15%" },
    { Header: "NRP PIC", accessor: "nrpPic", width: "15%" },
    { Header: "Nama PIC", accessor: "picName", width: "15%" },
    { Header: "Department PIC", accessor: "picDepartment", width: "15%" },
    { Header: "actions", accessor: "actions" },
  ],

  rows: [],
};

export default dataTableVictim;
