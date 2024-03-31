const dataTableCallingLetter = {
  columns: [
    { Header: "Nama Saksi", accessor: "name", width: "15%" },
    { Header: "Nama PIC", accessor: "picName", width: "15%" },
    { Header: "Department PIC", accessor: "picDepartment", width: "15%" },
    { Header: "Nama Pemanggil", accessor: "callerName", width: "15%" },
    { Header: "Tanggal Pemanggilan", accessor: "invitationDate", width: "15%" },
    { Header: "Status", accessor: "status", width: "10%" },
    { Header: "actions", accessor: "actions" },
  ],

  rows: [],
};

export default dataTableCallingLetter;
