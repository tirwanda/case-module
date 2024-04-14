const dataTableViewCallingLetter = {
  columns: [
    { Header: "Nama Terpanggil", accessor: "name", width: "15%" },
    { Header: "Nama PIC", accessor: "picName", width: "15%" },
    { Header: "Department PIC", accessor: "picDepartment", width: "20%" },
    { Header: "Nama Pemanggil", accessor: "callerName", width: "15%" },
    { Header: "Tanggal Pemanggilan", accessor: "invitationDate", width: "15%" },
    { Header: "Attachment", accessor: "attachment", width: "10%" },
    { Header: "actions", accessor: "actions" },
  ],

  rows: [],
};

export default dataTableViewCallingLetter;
