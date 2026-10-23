import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CopyToClipboardCell from "./copyToClipBoardCell";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { capitalizeEachWord } from "../utils";
import pako from "pako";

interface ClientRow {
  ClientCode: string;
  ClientName: string;
  LastTradeDate: string;
  ClientStatus: string;
}
dayjs.extend(customParseFormat);
export const getClientActivityStatusColumns = (
  handleViewDetails: (row: ClientRow) => void,
  user_type: string, // Added user_type parameter
): GridColDef[] => {
  const baseColumns: GridColDef[] = [
    {
      disableColumnMenu: true,
      field: "cc",
      headerName: "Client Code",
      align: "left",
      flex: 1,
      minWidth: 90,
    },
    {
      disableColumnMenu: true,
      field: "cn",
      headerName: "Client Name",
      flex: 2,
      minWidth: 190,
    },
    {
      field: "ltd",
      headerClassName: "header-wrap-custom",
      headerName: "Last Trade Date",
      flex: 1.5,
      minWidth: 100,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null;
        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (_match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              // console.log(handleViewDetails);
              return `20${year}-${monthMap[month]}-${day}`;
            },
          ),
        );
        return parsedDate;
      },
      sortComparator: (v1, v2) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      disableColumnMenu: true,
      field: "rm",
      headerName: "RM Name",
      flex: 2,
      minWidth: 200, // Names can be long; ensure space
      renderCell: (params) => params.value || "—",
    },
    {
      disableColumnMenu: true,
      field: "dlr",
      headerName: "Dealer Name",
      flex: 2,
      minWidth: 160, // Names can be long; ensure space
      renderCell: (params) => params.value || "—",
    },
    {
      field: "hval",
      headerName: "HoldingValue",
      flex: 1,
      minWidth: 120,
      align: "right",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
      valueFormatter: (params: any) => {
        const value = parseFloat(params); // Convert the value to a number
        return new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      },
    },
    {
      field: "csts",
      headerName: "Status",
      flex: 0.8,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "bc",
      headerName: "Branch Code",
      headerClassName: "header-wrap-custom",
      flex: 0.8,
      minWidth: 65,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },

    {
      field: "mob",
      headerName: "Mobile No",
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || "";
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) => {
            // console.log(prefix, suffix, handleViewDetails); // Added only for testing purpose
            return `${prefix}${"X".repeat(middle.length)}${suffix}`;
          },
        );
        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },
  ];

  // Conditionally include MTFStatus column for Employee only
  const mtfColumn: GridColDef[] =
    user_type === "Employee"
      ? [
          {
            field: "mtf",
            headerName: "MTF Status",
            headerClassName: "header-wrap-custom",
            flex: 1,
            minWidth: 60, // Increased to prevent overlap on smaller devices
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
          },
        ]
      : [];

  const finalColumns: GridColDef[] = [
    ...baseColumns,
    ...mtfColumn,
    {
      field: "poa",
      headerName: "POA Status",
      flex: 1,
      minWidth: 60, // Slightly wider for better label display
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
    },
    {
      field: "viewDetails",
      headerName: "Details",
      minWidth: 60, // Use minWidth instead of fixed width for better responsiveness
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        // <Button
        //   onClick={() => handleViewDetails(params.row)}
        //   variant="contained"
        //   color="primary"
        //   style={{
        //     padding: "1px 9px",
        //     backgroundColor: "#11395C",
        //     fontSize: "5px",
        //     borderRadius: "18px",
        //   }}
        // >
        <Tooltip title={"View Details"} arrow placement="top">
          <OpenInNewIcon
            style={{ cursor: "pointer", color: "#11395C" }}
            onClick={() => handleViewDetails(params.row)}
          />
        </Tooltip>
        // </Button>
      ),
    },
    // {
    //   field: "ActivationDate",
    //   headerName: "Activation Date",
    //   headerClassName: "header-wrap-custom",
    //   flex: 1.2,
    //   minWidth: 110,
    //   align: "center",
    //   headerAlign: "center",
    //   disableColumnMenu: true,
    //   valueGetter: (params: any) => {
    //     const rawDate = params;
    //     if (!rawDate) return null;
    //     const parsedDate = new Date(
    //       rawDate.replace(
    //         /(\d{2})-([A-Za-z]{3})-(\d{2})/,
    //         (_match: any, day: any, month: any, year: any) => {
    //           const monthMap: any = {
    //             Jan: "01",
    //             Feb: "02",
    //             Mar: "03",
    //             Apr: "04",
    //             May: "05",
    //             Jun: "06",
    //             Jul: "07",
    //             Aug: "08",
    //             Sep: "09",
    //             Oct: "10",
    //             Nov: "11",
    //             Dec: "12",
    //           };
    //           console.log(match);
    //           return `20${year}-${monthMap[month]}-${day}`;
    //         }
    //       )
    //     );
    //     return parsedDate;
    //   },
    //   sortComparator: (v1, v2) => {
    //     if (!v1 || !v2) return 0; // Handle missing values
    //     return v1 - v2; // Sort in ascending order
    //   },
    //   valueFormatter: (params: any) => {
    //     if (!params) return "";
    //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    //   },
    // },
  ];

  return finalColumns;
};

export const accNo = [
  { value: "15770340001410", label: "15770340001410" },
  { value: "57500001047915", label: "57500001047915" },
];
export const PaymentType = [
  { value: "ALL", label: "ALL" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "IMPS", label: "IMPS" },
  { value: "OTHER", label: "OTHER" },
  { value: "UPI", label: "UPI" },
  { value: "Fund Trans", label: "Fund Trans" },
];

export const getRegulatorAnnouncement: GridColDef[] = [
  {
    field: "dt",
    headerName: "Date",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dept",
    headerName: "Department",
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "sub",
    headerName: "Subject",
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
    // renderCell: (params) => (
    //   <div style={{ padding: "0px 3px" }}>{params.value}</div>
    // ),
  },
  {
    field: "cmt",
    headerName: "LKP Comments",
    flex: 3,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // alignItems:"center"
  },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "cfp",
    headerName: "Circular",
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];
export const getMarketingMaterials: GridColDef[] = [
  {
    field: "imgs",
    headerName: "ImageEEE",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const fullPath = params.row.imgs;
      const fileName = fullPath?.split(/[/\\]/).pop();

      return <span>{fileName}</span>;
    },
  },
  {
    field: "desc",
    headerName: "Description",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "docs",
    headerName: "Document name",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const fullPath = params.row.docs;
      const fileName = fullPath?.split(/[/\\]/).pop();
      return <span>{fileName}</span>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const getAccountDetails: GridColDef[] = [
  {
    field: "month",
    headerName: "Month",
    flex: 1.1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "directChannelDIY",
    headerName: "Direct Channel (DIY)",
    flex: 1.9,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "DirectSalesTeam",
    headerName: "Direct Sales team",
    flex: 1.7,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "APReferrals",
    headerName: "AP Referrals",
    flex: 1.4,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "EmployeeReferrals",
    headerName: "Employee Referrals",
    flex: 1.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "REChannel",
    headerName: "R&E Channel",
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Total",
    headerName: "Total",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
];

export const cardDetails = [
  {
    id: 1,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN14vLyQvBxXJf60w_-n1dPFhqV-W6bjWwbw&s",
    title: "LKP Brochure",
    pdfUrl: " ",
  },
  {
    id: 2,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ibwvGamxlftRJQz6fFT3h7HH-aKKwxWmAQ&s",
    title: "SPIP Brochure",
    pdfUrl: "../../../public/JavaScript-Core.pdf",
  },
  {
    id: 3,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN14vLyQvBxXJf60w_-n1dPFhqV-W6bjWwbw&s",
    title: "Festival Creatives",
    pdfUrl: "",
  },
];

export const getCommChecker: GridColDef[] = [
  {
    field: "status",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "doc",
    headerName: "Date",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };

            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "tod",
    headerName: "Type of Document",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ctype",
    headerName: "Communication Type",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "cdesc",
    headerName: "Communication Description",
    minWidth: 240,
    flex: 2,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "dept",
    headerName: "Department",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "cpp",
    headerName: "Document",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const getClientDormantStatus = (
  handleViewDetails: (row: ClientRow) => void,
): GridColDef[] => [
  {
    field: "cc",
    headerName: "Client Code",
    align: "left",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 2,
    minWidth: 160,
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    flex: 1.5,
    minWidth: 140,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,

    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null;

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },

    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0;
      return v1 - v2;
    },

    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY");
    },
  },
  {
    field: "mob",
    headerName: "Mobile No",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,

    renderCell: (params: any) => {
      const mobile = params.value || "";

      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dcnt",
    headerName: "Days to Dormant",
    flex: 1,
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "rm",
    headerName: "RM Name",
    flex: 1,
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "dlr",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "hval",
    headerName: "HoldingValue",
    flex: 1,
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
  {
    field: "viewDetails",
    headerName: "Details",
    width: 130,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <>
        {/* <Button
          onClick={() => handleViewDetails(params.row)}
          // onClick={() => console.log("rowValues", params.row)}
          variant="contained"
          color="primary"
          style={{
            padding: "1px 9px",
            backgroundColor: "#11395C",
            fontSize: "5px",
            borderRadius: "18px",
          }}
        > */}
        <Tooltip title={"View Details"} arrow placement="top">
          <OpenInNewIcon
            style={{ cursor: "pointer", color: "#11395C" }}
            onClick={() => handleViewDetails(params.row)}
          />
        </Tooltip>
        {/* </Button> */}
      </>
    ),
  },
];

export const Corecolumns: GridColDef[] = [
  { field: "clientCode", headerName: "Client Code", minWidth: 80 },
  {
    field: "alertSequenceNo",
    headerName: "Alert Sequence No",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "virtualAccount",
    headerName: "Virtual Account",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "lkP_AccountNumber",
    headerName: "LKP Account Number",
    minWidth: 180,
    headerClassName: "header-wrap-custom",
  },
  { field: "debitCredit", headerName: "Debit/Credit", minWidth: 80 },
  { field: "amount", headerName: "Amount", minWidth: 100 },
  { field: "client_Name", headerName: "Client Name", minWidth: 80 },
  {
    field: "client_AccountNumber",
    headerName: "Client Account Number",
    minWidth: 180,
  },
  { field: "client_Bank", headerName: "Client Bank", minWidth: 80 },
  { field: "client_IFSC", headerName: "Client IFSC", minWidth: 80 },
  { field: "chequeNo", headerName: "Cheque No", minWidth: 80 },
  {
    field: "userReferenceNumber",
    headerName: "User Reference Number",
    minWidth: 180,
  },
  { field: "payment_Type", headerName: "Payment Type", minWidth: 80 },
  { field: "valueDate", headerName: "Value Date", minWidth: 80 },
  {
    field: "transactionDescription",
    headerName: "Transaction Description",
    minWidth: 200,
  },
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
];

export const slbmColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
  },
  {
    field: "bc",
    headerName: "Branch Code",
    minWidth: 90,
    flex: 0.6,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cc",
    headerName: "Client Code",
    minWidth: 110,
    flex: 0.8,
    disableColumnMenu: true,
    align: "left",
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1.5,
    disableColumnMenu: true,
    renderCell: (params: any) => (
      <Tooltip title={params.row?.mob} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    ),
  },
  {
    field: "scn",
    headerName: "Script Name",
    minWidth: 200,
    flex: 1.2,
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "isin",
    headerName: "ISIN",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: "qty",
    headerName: "Quantity",
    minWidth: 90,
    flex: 0.7,
    disableColumnMenu: true,
    align: "right",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "rm",
    headerName: "RM Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => (
      <Tooltip title={params.row?.rmmob} arrow placement="top">
        <span>{params.value || " — "}</span>
      </Tooltip>
    ),
  },
  {
    field: "dlr",
    headerName: "Dealer Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => (
      <Tooltip title={params.row?.dlrmob} arrow placement="top">
        <span>{params.value || " — "}</span>
      </Tooltip>
    ),
  },
  {
    field: "apn",
    headerName: "AP Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => (
      <Tooltip title={params.row?.apmob} arrow placement="top">
        <span>{params.value || " — "}</span>
      </Tooltip>
    ),
  },
  {
    field: "slsts",
    headerName: "SLBM Status",
    align: "center",
    minWidth: 110,
    flex: 0.7,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const clientNotTradedColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2.2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: any) =>
    //   new Date(params.value).toLocaleDateString("en-IN", {
    //     day: "2-digit",
    //     month: "short",
    //     year: "numeric",
    //   }),
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "Active",
    headerName: "Active",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const newClientAddFiveDays: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "Active",
    headerName: "Active",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const spipRenewalColumns: GridColDef[] = [
  {
    field: "IACode",
    headerName: "IA Code",
    width: 90,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    width: 250,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Backofficecode",
    headerName: "Back Office Code",
    width: 90,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );
      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "Active",
    headerName: "Active",
    width: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Start Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "EndDate",
    headerName: "Renewal due on",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "RMCode",
    headerName: "RM Code",
    width: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const upcomingDormantClientColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.5,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data
      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );
      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );
      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "DayCount",
    headerName: "Days to Dormant",
    headerClassName: "header-wrap-custom",
    flex: 1,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
];

export const spipSubscriptionColumns: GridColDef[] = [
  {
    field: "IACode",
    headerName: "IA Code",
    // flex: 1.5,
    width: 90,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    width: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Backofficecode",
    headerName: "Backoffice Code",
    // flex: 1.5,
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => params || "-", // Show '-' if empty
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    // flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    // flex: 1.5,
    width: 110,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_match: any, prefix: any, middle: any, suffix: any) =>
          `${prefix}${"X".repeat(middle.length)}${suffix}`,
      );
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "EmailId",
    headerName: "Email ID",
    // flex: 2,
    width: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Active",
    headerName: "Active",
    // flex: 1,
    width: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    // flex: 1.5,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    width: 90,
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "RMCode",
    headerName: "RM Code",
    // flex: 1,
    width: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Amount",
    headerName: "Amount",
    // flex: 1.5,
    width: 100,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => `₹${params}`, // Format as currency
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const ClientCashColumns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1.2,
    minWidth: 120,
    headerAlign: "left",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 2,
    minWidth: 200,
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 115,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",

    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null;

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };

            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },

    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0;
      return v1 - v2;
    },

    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY");
    },
  },

  {
    field: "cash",
    headerName: "Ledger Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  {
    field: "mob",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || "";

      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },

  {
    field: "brcm",
    headerName: "Current Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  {
    field: "br1m",
    headerName: "Last Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  {
    field: "br3m",
    headerName: "3 Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const T6Columns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    headerAlign: "left",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 2,
    minWidth: 150,
    disableColumnMenu: true,
  },
  {
    field: "cbal",
    headerName: "Closing Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "stkval",
    headerName: "Stock Value",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "g5",
    headerName: ">T5",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t5",
    headerName: "T5",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t4",
    headerName: "T4",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t3",
    headerName: "T3",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t2",
    headerName: "T2",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t1",
    headerName: "T1",
    flex: 1,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const T6OverViewColumns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    // flex: 1,
    minWidth: 105,
    headerAlign: "left",
    align: "left",
    // sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    // flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "cbal",
    headerName: "Closing Balance",
    flex: 0.8,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "stkval",
    headerName: "Stock Value",
    // flex: 1,
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "g5",
    headerName: ">T5",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t5",
    headerName: "T5",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t4",
    headerName: "T4",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t3",
    headerName: "T3",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t2",
    headerName: "T2",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "t1",
    headerName: "T1",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const DPDebitRecovery: GridColDef[] = [
  {
    field: "elnk",
    headerName: "Send Email",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "paylnk",
    headerName: "Payment\nLink",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { paylnk, enc } = params.row;
      if (!paylnk || !enc) return <span>No Link Available</span>;

      const fullLink = `${paylnk}${enc}`;
      return <CopyToClipboardCell fullLink={fullLink} field={"payment"} />;
    },
  },
  {
    field: "dpMandate_Link",
    headerName: "Mandate\nLink",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { paylnk, enc } = params.row;
      if (!paylnk || !enc) return <span>No Link Available</span>;

      const fullLink = `${paylnk}${enc}`;
      return (
        <CopyToClipboardCell
          fullLink={fullLink}
          field={"dpMandate"}
          selectedRow={params?.row}
        />
      );
    },
  },
  {
    field: "cc",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    minWidth: 95,
    flex: 0.7,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "boid",
    headerName: "BOID",
    minWidth: 160,
    flex: 1.2,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "bonm",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1.5,
    disableColumnMenu: true,
  },
  {
    field: "lda",
    headerName: "Total DP Debit",
    headerClassName: "header-wrap-custom",
    minWidth: 110,
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },

    // below code is used when we have rounded value eg 142

    // valueFormatter: (params: any) => {
    //   const value = parseFloat(params?.value); // Safely parse the value
    //   if (isNaN(value)) {
    //     return ""; // Return an empty string for invalid values
    //   }
    //   return value % 1 === 0
    //     ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)
    //     : new Intl.NumberFormat("en-IN", {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       }).format(value);
    // },
  },
  {
    field: "hval",
    headerName: "Holding Value",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
  {
    field: "mob",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "em",
    headerName: "Email ID",
    minWidth: 200,
    flex: 1.2,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const email = params.value || ""; // Extract the email ID

      // Mask the email if it exists
      const maskedEmail = email.replace(
        /^(.)(.*)(.@.*)$/, // Regex to capture parts of the email
        (_: any, firstChar: any, middleChars: any, domain: any) => {
          return `${firstChar}${"x".repeat(middleChars.length)}${domain}`;
        },
      );

      // Return tooltip with the original email and masked email for display
      return (
        <Tooltip title={email} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "bost",
    headerName: "Status",
    minWidth: 100,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "asts",
    headerName: "Category",
    minWidth: 100,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const terminalcol: GridColDef[] = [
  {
    field: "TerminalId",
    headerName: "Terminal Id",
    flex: 0.9,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "LoginId",
    headerName: "Terminal User",
    flex: 0.6,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "CertiRegNo",
    headerName: "Certificate No",
    flex: 2.3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "MarketSegment",
    headerName: "Exchange",
    flex: 1.2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "CertiValidityDate",
    headerName: " Validity Date",
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ServerName",
    headerName: "Server Name",
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const RegisDetails: GridColDef[] = [
  {
    field: "Segment",
    headerName: "Segment",
    width: 200,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "AP Registration Number",
    headerName: "AP Registration Number",
    width: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Date of Registration",
    headerName: "Date of Registration",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Registration Office",
    headerName: "Registration Office",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
];

export const DormantOverViewColumns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1.2,
    minWidth: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 2.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.mobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dcnt",
    headerName: "Days to Dormant",
    flex: 1,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap",
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    flex: 1.5,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };

            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const QPayoutColumns: GridColDef[] = [
  {
    field: "accd",
    headerName: "Client Code",
    minWidth: 100,
    disableColumnMenu: true,
    align: "left",
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 230,
    flex: 2,
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    flex: 1.2,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };

            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },

  {
    field: "mob",
    headerName: "Mobile no.",
    minWidth: 90,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "pay",
    headerName: "Payout Amt",
    minWidth: 150,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "rct",
    headerName: "Receipt Amt",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),

    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "epay",
    headerName: "Extra Payin",
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),

    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const dormantColumns = (user_type: string): GridColDef[] => {
  const EmployeeColumns: GridColDef[] = [
    {
      field: "cc",
      headerName: "Client Code",
      minWidth: 90,
      flex: 0.6,
      align: "left",
      disableColumnMenu: true,
    },
    {
      field: "cn",
      headerName: "Client Name",
      minWidth: 170,
      flex: 1.5,
      disableColumnMenu: true,
    },
    {
      field: "ltd",
      headerName: "Last Trade Date",
      minWidth: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null;

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (_match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };

              return `20${year}-${monthMap[month]}-${day}`;
            },
          ),
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0;
        return v1 - v2;
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY");
      },
    },
    {
      field: "avt",
      headerName: "Active",
      minWidth: 70,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "bc",
      headerName: "Branch Code",
      headerClassName: "header-wrap-custom",
      minWidth: 90,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "zn",
      headerName: "Zone",
      minWidth: 80,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "bt",
      headerName: "Branch Type",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "act_dt",
      headerName: "Activation Date",
      minWidth: 120,
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null;

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (_match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };

              return `20${year}-${monthMap[month]}-${day}`;
            },
          ),
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0;
        return v1 - v2;
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY");
      },
    },
    {
      field: "mob",
      headerName: "Mobile No",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || "";
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) =>
            `${prefix}${"X".repeat(middle.length)}${suffix}`,
        );

        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "em",
      headerName: "Email",
      minWidth: 220,
      flex: 1.5,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const email = params.value || "";
        const maskedEmail = email.replace(
          /^(.)(.*)(.@.*)$/,
          (_: any, firstChar: any, middleChars: any, domain: any) =>
            `${firstChar}${"x".repeat(middleChars.length)}${domain}`,
        );

        return (
          <Tooltip title={email} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
          </Tooltip>
        );
      },
    },

    {
      field: "br1920",
      headerName: "Brok FY1920",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
    },
    {
      field: "br2021",
      headerName: "Brok FY2021",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2122",
      headerName: "Brok FY2122",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2223",
      headerName: "Brok FY2223",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2324",
      headerName: "Brok FY2324",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "rm",
      headerName: "RM Name",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "rmst",
      headerName: "RM Status",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.6,
      align: "center",
      disableColumnMenu: true,
    },
    {
      field: "dlr",
      headerName: "Dealer Name",
      minWidth: 160,
      flex: 1.2,
      disableColumnMenu: true,
    },
    {
      field: "dlrst",
      headerName: "Dealer Status",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.6,
      align: "center",
      disableColumnMenu: true,
    },
  ];

  const PartnerColumns: GridColDef[] = [
    {
      field: "cc",
      headerName: "Client Code",
      minWidth: 90,
      flex: 0.6,
      align: "left",
      disableColumnMenu: true,
    },
    {
      field: "cn",
      headerName: "Client Name",
      minWidth: 170,
      flex: 1.5,
      disableColumnMenu: true,
    },
    {
      field: "ltd",
      headerName: "Last Trade Date",
      minWidth: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (_match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };

              return `20${year}-${monthMap[month]}-${day}`;
            },
          ),
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },

    {
      field: "act_dt",
      headerName: "Activation Date",
      minWidth: 120,
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (_match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };

              return `20${year}-${monthMap[month]}-${day}`;
            },
          ),
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "mob",
      headerName: "Mobile No",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || ""; // Extract the mobile number

        // Mask all digits except the first 2 and the last 2
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) => {
            console.log(prefix, suffix); // Added only for testing purpose
            return `${prefix}${"X".repeat(middle.length)}${suffix}`;
          },
        );

        // Return tooltip with the masked mobile number
        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },

    {
      field: "br1920",
      headerName: "Brok FY1920",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
    },
    {
      field: "br2021",
      headerName: "Brok FY2021",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2122",
      headerName: "Brok FY2122",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2223",
      headerName: "Brok FY2223",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "br2324",
      headerName: "Brok FY2324",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
  ];

  return user_type === "Employee" ? EmployeeColumns : PartnerColumns;
};

export const communicationColumns = (): GridColDef[] => [
  {
    field: "doc", // DateOfCommunication
    headerName: "Date of Communication",
    width: 120,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "tod", // TypeOfDocuments
    headerName: "Type of Document",
    minWidth: 140,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "ctype", // CommunicationType
    headerName: "Communication Type",
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "cdesc", // CommunicationDesc
    headerName: "Communication Description",
    minWidth: 200,
    headerAlign: "center",
    flex: 2,
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const dispatchProof = params.value || "N/A";
      return (
        <Tooltip title={dispatchProof} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{dispatchProof}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dept", // Department
    headerName: "Department",
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "rmk", // Remark
    headerName: "Remarks",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const CompliancneReport: GridColDef[] = [
  {
    field: "doc",
    headerName: "Date of Communication",
    width: 160,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "tod",
    headerName: "Type of Document",
    minWidth: 110,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
  },
  {
    field: "ctype",
    headerName: "Communication Type",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "cdesc",
    headerName: "Communication Description",
    minWidth: 400,
    headerAlign: "center",
    disableColumnMenu: true,
    // renderCell: (params: any) => {
    //   const dispatchProof = params.value || "N/A";
    //   return (
    //     <Tooltip title={dispatchProof} arrow placement="top">
    //       <span style={{ cursor: "pointer" }}>{dispatchProof}</span>
    //     </Tooltip>
    //   );
    // },
  },
  {
    field: "cpp",
    headerName: "Document",
    minWidth: 120,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "dept",
    headerName: "Department",
    minWidth: 100,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 2,
  },
];

export const topBirthdays: GridColDef[] = [
  {
    field: "Code",
    headerName: "Client Code",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Name",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "MobileNumber",
    headerName: "Mobile No",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        },
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "Date",
    headerName: "Date Of Birth",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: () => {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0"); // Ensure 2 digits for day
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
      const year = currentDate.getFullYear(); // Get the full year
      const formattedDate = `${day}/${month}/${year}`; // Format as dd/mm/yyyy
      return <div>{formattedDate}</div>; // Render the formatted date
    },
  },
];

export const cyptoWidgets = [
  // {
  //   id: 1,
  //   label: "Research Calls",
  //   color: "primary",
  // },
  {
    id: 2,
    label: "Clients With Ledger Balance",
  },
  { id: 3, label: "Clients Ageing Report" },
  // { id: 4, label: "MTF Open Position" },
];

export const TradeCapsules = [
  { id: 1, label: "All" },
  { id: 2, label: "Equity Cash" },
  { id: 3, label: "Equity F&O" },
  { id: 4, label: "Currency F&O" },
  { id: 5, label: "Commodity F&O" },
];

export const ClientDetailsCapsule = [
  { id: 1, label: "Upcoming Dormant Client" },
  { id: 2, label: "Active Clients", count: 150 },
  { id: 3, label: "Inactive Clients", count: 200 },
  { id: 4, label: "Total Clients", count: 100 },
];

export const DPDebitCapsules = [
  { id: 2, label: "Active Clients" },
  { id: 3, label: "Inactive Clients" },
  { id: 4, label: "Total Clients" },
];

export const ODCapsules = [
  { id: 1, label: "Backoffice Report" },
  { id: 2, label: "Template" },
];
export const AmcMembership = [
  { id: 1, label: "Lifetime Membership" },
  { id: 2, label: "Non-Lifetime Membership" },
  { id: 3, label: "Contest Earned" },
];
export const pledgeCapsules = [
  { id: 1, label: "Pledge Request" },
  // { id: 2, label: "Template" },
];

export const partnerContestCapsules = [
  { id: 1, label: "Contest Rewards" },
  { id: 2, label: "Leaderboard" },
  { id: 3, label: "Broking Revenue" },
  { id: 4, label: "Clientwise Brokerage" },
  { id: 5, label: "New Added Clients" },
];

type ClientCapsuleKey = "eq" | "fo" | "cur" | "com" | "mtf" | "slbm";

export const ClientInfoCapsules: {
  id: number;
  label: string;
  key: ClientCapsuleKey;
}[] = [
  { id: 1, label: "Equity", key: "eq" },
  { id: 2, label: "F & O", key: "fo" },
  { id: 3, label: "Currency", key: "cur" },
  { id: 4, label: "Commodity", key: "com" },
  { id: 5, label: "MTF", key: "mtf" },
  { id: 6, label: "SLBM", key: "slbm" },
];

export const BrokSlabItems = [
  {
    id: 1,
    label: "Equity Delivery",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Delivery",
  },
  {
    id: 2,
    label: "Equity Intraday",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Intraday",
  },
  {
    id: 3,
    label: "Equity Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Futures",
  },
  {
    id: 4,
    label: "Equity Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Equity_Options",
  },
  {
    id: 5,
    label: "Currency Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Currency_Futures",
  },
  {
    id: 6,
    label: "Currency Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Currency_Options",
  },
  {
    id: 7,
    label: "Commodity Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Commodity_Futures",
  },
  {
    id: 8,
    label: "Commodity Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Commodity_Options",
  },
];

export const BrokSlabItemsPennypal = [
  { id: 1, label: "Equity Delivery", subvalue: "0.5% of Turnover" },
  { id: 2, label: "Equity Intraday", subvalue: "0.5% of Turnover" },
  { id: 3, label: "Equity Futures", subvalue: "0.5% of Turnover" },
  { id: 4, label: "Equity Options", subvalue: "₹ 50 per lot" },
];

export const LastTradeDates = [
  { id: 1, label: "Equity", status: "1-Jan-24" },
  { id: 2, label: "F&O", status: "1-Jan-24" },
  { id: 3, label: "Currency", status: "Inactive" },
  { id: 4, label: "Commodity", status: "Inactive" },
  { id: 5, label: "MTF", status: "1-Jan-24" },
  { id: 6, label: "SLBM", status: "Inactive" },
];

export const DPSchemes = [
  { id: 1, label: "Equity", status: "1-Jan-24" },
  { id: 2, label: "F&O", status: "1-Jan-24" },
];

export const EkycWidgets = [
  {
    id: 1,
    icon: "ri-money-dollar-circle-fill",
    label: "Total Investedddd",
    counter: 2390.68,
    badge: "ri-arrow-up-s-fill",
    badgeColor: "success",
    percentage: "6.24",
    decimal: 2,
    prefix: "$",
    separator: ",",
    color: "primary",
  },
  {
    id: 2,
    icon: "ri-arrow-up-circle-fill",
    label: "Total Change",
    counter: 19523.25,
    badge: "ri-arrow-up-s-fill",
    badgeColor: "success",
    percentage: "3.67",
    decimal: 2,
    prefix: "$",
    separator: ",",
    color: "secondary",
  },
];

export const buttonOptions = [
  { label: "7 Days", variant: "outlined" },
  { label: "15 Days", variant: "outlined" },
  { label: "1 Month", variant: "outlined" },
  { label: "3 Months", variant: "contained" },
  { label: "6 Months", variant: "contained" },
  { label: "12 Months", variant: "contained" },
];

export const CommunicationMenu = [
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physical" },
];

export const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];

export const TypeOfDocuments = [
  { value: "Circular", label: "Circular" },
  { value: "SEBI", label: "SEBI" },
];
export const TypeOfDepartment = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];
export const TypeOfExclusionClient = [
  { value: "Branch", label: "Branch" },
  { value: "Client", label: "Client" },
];

export const InfoCapsules = [
  {
    main: "NSE",
  },
  {
    main: "BSE",
  },
  {
    main: "MCX",
  },
];

export const CashFlowHeader = [
  {
    title: "Cash from Operating Activity",
    isSubpoint: false,
    order: 0,
    shortKey: "CFO_A",
  },
  {
    title: "Profit Before Tax",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "PBT_A",
  },
  {
    title: "Interest",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "INT_A",
  },
  {
    title: "Tax",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "TAX_A",
  },
  {
    title: "Cash from Investing Activity",
    isSubpoint: false,
    order: 1,
    shortKey: "CFI_A",
  },
  {
    title: "Cash from Financing Activity",
    isSubpoint: false,
    order: 2,
    shortKey: "CFA_A",
  },
  {
    title: "Net Cash Flow",
    isSubpoint: false,
    order: 3,
    shortKey: "NCF_A",
  },
  {
    title: "Cash Plus Cash Equivalent: Begin Of Year",
    isSubpoint: true,
    parent: "Net Cash Flow",
    shortKey: "CashAndCashEquivalentBeginOfYear_A",
  },
  {
    title: "Cash Plus Cash Equivalent: End Of Year",
    isSubpoint: true,
    parent: "Net Cash Flow",
    shortKey: "CashAndCashEquivalentEndOfYear_A",
  },
];

export const BalanceSheetHeader = [
  {
    title: "Total ShareHolders Funds",
    shortKey: "TotalShareHoldersFunds_A",
  },
  {
    title: "Minority Interest Liability",
    shortKey: "LiabilityMinorityInterest_A",
  },
  {
    title: "Total Non Current Liabilities",
    shortKey: "TotalNonCurrentLiabilities_A",
  },
  {
    title: "Total Capital Liabilities",
    shortKey: "CL_A",
  },
  {
    title: "Fixed Assets",
    shortKey: "FixedAssets_A",
  },
  {
    title: "Total Non Current Assets",
    shortKey: "TotalNonCurrentAssets_A",
  },
  {
    title: "Total Current Assets",
    shortKey: "CA_A",
  },
  {
    title: "Total Assets",
    shortKey: "TA_A",
  },
  {
    title: "Contingent Liabilities plus Commitments",
    shortKey: "ContingentLiabilities_A",
  },
  {
    title: "Bonus Equity Share Capital",
    shortKey: "",
  },
  {
    title: "Non Current Investments Unquoted BookValue",
    shortKey: "NonCurrentInvestments_A",
  },
  {
    title: "Current Investments Unquoted BookValue",
    shortKey: "CurrentInvestments_A",
  },
];

export const FundamentalQuarterlyPNLHeader = [
  {
    title: "Total Revenue",
    isSubpoint: false,
    order: 0,
    shortKey: "TOTAL_SR_Q",
  },
  {
    title: "Operating Revenue",
    isSubpoint: true,
    parent: "Total Revenue",
    shortKey: "OperatingIncome_Q",
  },
  {
    title: "Other Income",
    isSubpoint: true,
    parent: "Total Revenue",
    shortKey: "OI_Q",
  },
  {
    title: "Operating Expenses",
    isSubpoint: false,
    order: 1,
    shortKey: "OEXPNS_Q",
  },
  {
    title: "Operating Profit",
    isSubpoint: false,
    order: 2,
    shortKey: "OP_Q",
  },
  {
    title: "Operating Profit Margin %",
    isSubpoint: false,
    order: 3,
    shortKey: "NETPCT_Q",
  },
  {
    title: "Depreciation",
    isSubpoint: false,
    order: 4,
    shortKey: "DEP_Q",
  },
  {
    title: "Interest",
    isSubpoint: false,
    order: 5,
    shortKey: "INT_Q",
  },
  {
    title: "Profit Before Tax",
    isSubpoint: false,
    order: 6,
    shortKey: "PBT_Q",
  },
  {
    title: "Tax",
    isSubpoint: false,
    order: 7,
    shortKey: "TAX_Q",
  },
  {
    title: "Net Profit",
    isSubpoint: false,
    order: 8,
    shortKey: "NP_Q",
  },
  {
    title: "Basic EPS",
    isSubpoint: false,
    order: 9,
    shortKey: "EPS_Q",
  },
  {
    title: "Net Profit TTM",
    isSubpoint: false,
    order: 10,
    shortKey: "NP_Q_GROWTH",
  },
  {
    title: "Basic EPS TTM",
    isSubpoint: false,
    order: 11,
    shortKey: "OP4Q_Q",
  },
];

export const FundamentalAnnualPNLHeader = [
  {
    title: "Total Revenue",
    shortKey: "SR_A",
    isSubpoint: false,
  },
  {
    title: "Operating Revenues",
    shortKey: "TotalOperatingRevenues_A",
    isSubpoint: true,
    parent: "Total Revenue",
  },
  {
    title: "Other Income",
    shortKey: "OI_A",
    isSubpoint: true,
    parent: "Total Revenue",
  },

  { title: "Operating Expenses", shortKey: "OEXPNS_A", isSubpoint: false },
  { title: "Operating Profit", shortKey: "EBIDT_A", isSubpoint: false },
  {
    title: "Operating Profit Margin %",
    shortKey: "OPMPCT_A",
    isSubpoint: false,
  },

  { title: "Total Expenses", shortKey: "TotalExpenses_A", isSubpoint: false },
  {
    title: "Other Expenses",
    shortKey: "OtherExpenses_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Employee Expenses",
    shortKey: "EmployeeBenefitExpenses_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Cost Of Power Purchased",
    shortKey: "CostOfPowerPurchased_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Cost Of Fuel",
    shortKey: "CostOfFuel_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },

  { title: "EBIDT", shortKey: "EBIDT_A", isSubpoint: false },
  { title: "EBIDT margin %", shortKey: "EBIDTPCT_A", isSubpoint: false },
  { title: "Interest", shortKey: "INT_A", isSubpoint: false },
  { title: "Depreciation", shortKey: "DEP_A", isSubpoint: false },
  { title: "Profit Before Tax", shortKey: "PBT_A", isSubpoint: false },
  { title: "Tax", shortKey: "TAX_A", isSubpoint: false },

  {
    title: "PAT Before ExtraOrdinary Items",
    shortKey: "PAT_A",
    isSubpoint: false,
  },
  { title: "Net Profit", shortKey: "NP_A", isSubpoint: false },
  { title: "Net Profit Margin %", shortKey: "NETPCT_A", isSubpoint: false },
  { title: "Basic EPS", shortKey: "BasicEPS_A", isSubpoint: false },
];

export const FundamentalRatiosHeader = [
  {
    title: "Book Value Per Share",
    shortKey: "BVSH_A",
  },
  {
    title: "RoA %",
    shortKey: "ROA_A",
  },
  {
    title: "ROE %",
    shortKey: "ROE_A",
  },
  {
    title: "ROCE %",
    shortKey: "ROCE_A",
  },
  {
    title: "Total Debt to Total Equity",
    shortKey: "DEBT_CE_A",
  },
];

export const RegionalHead: GridColDef[] = [
  {
    field: "bc",
    headerName: "Branch",
    minWidth: 70,
    flex: 0.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.6,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "seg",
    headerName: "Segment",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "expln",
    headerName: "Existing Plan",
    flex: 1.4,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "prpln",
    headerName: "Proposed Plan",
    flex: 1.2,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "cfile",
    headerName: "Download",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "req_dt",
    headerName: "Request Date",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "remark", // unchanged (action column)
    headerName: "Action",
    flex: 0.8,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    sortable: false,
  },
];

export const BrokerageModificationStatus: GridColDef[] = [
  ...RegionalHead.filter(
    (col) => col.field !== "remark" && col.field !== "cfile",
  ),
  {
    field: "sts",
    headerName: "Status",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "160px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
  {
    field: "rsn",
    headerName: "Remarks",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "kyc_dt",
    headerName: "Date approved by KYC",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const kycDate = params.row.kycApproveStatusDate;
      console.log(kycDate, "params");
      if (kycDate === "0001-01-01 00:00") {
        return <span>-</span>;
      }
    },
  },
];
export const BrokerageKyc: GridColDef[] = [
  {
    field: "More Details",
    headerName: "",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "zn",
    headerName: "Zone",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bc",
    headerName: "Branch",
    minWidth: 70,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.6,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },

  {
    field: "seg",
    headerName: "Segment",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];

export const getBrokerageKycDetails = (
  handleDownload: (row: any) => void,
): GridColDef[] => {
  return [
    ...RegionalHead.filter(
      (col) =>
        col.field !== "bc" && col.field !== "remark" && col.field !== "cfile",
    ),
    {
      field: "cfile",
      headerName: "Download",
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        const fileName = params.row?.consentfilename;

        return fileName ? (
          <button
            onClick={() => handleDownload(params.row)}
            style={{
              color: "#11395C",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span title="Download">
              <DownloadForOfflineIcon />
            </span>
          </button>
        ) : (
          "╶─"
        );
      },
    },
    {
      field: "kyc_dt",
      headerName: "Date approved by RH",
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "left",
      sortable: false,
    },
  ];
};

// export const BrokerageKyc: GridColDef[] = [
//   {
//     field: "zone",
//     headerName: "Zone",
//     minWidth: 60,
//     flex: 0.5,
//     disableColumnMenu: true,
//     headerAlign: "center",
//     align: "center",
//   },
//   ...RegionalHead,
//   {
//     field: "kycApproveStatusDate",
//     headerName: "Date approved by RH",
//     flex: 1,
//     minWidth: 180,
//     disableColumnMenu: true,
//     headerAlign: "center",
//     align: "left",
//     sortable: false,
//   },
// ];

export const PreProofUploadColumns: GridColDef[] = [
  {
    field: "file_upload",
    headerName: "Upload",
    flex: 0.6,
    minWidth: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "cc",
    headerName: "ClientCode",
    flex: 0.8,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "td",
    headerName: "Order Date Time",
    flex: 1,
    minWidth: 140,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return "";

      const date = new Date(params.value);

      if (Number.isNaN(date.getTime())) return "";

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "bs",
    headerName: "Buy Sell",
    flex: 0.6,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    flex: 1.3,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const symbol = (params.row?.sym || "").trim();
      const series = (params.row?.ser || "").trim();

      return `${symbol} / ${series}`;
    },
  },
  {
    field: "ed",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return "";

      const date = new Date(params.value);

      if (Number.isNaN(date.getTime())) return "";

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "inst",
    headerName: "Instrument Type",
    flex: 0.8,
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sp",
    headerName: "Strike Price",
    flex: 0.6,
    minWidth: 85,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "qty",
    headerName: "Quantity",
    flex: 0.6,
    minWidth: 85,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "ton",
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    flex: 1.1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const preTradeColumns: GridColDef[] = [
  {
    field: "Uploaded_Document",
    headerName: "View Document",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "td",
    headerName: "Order Date Time",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 155,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return "—";

      const date = new Date(params.value);

      if (Number.isNaN(date.getTime())) return "—";

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "bs",
    headerName: "Buy Sell",
    flex: 0.65,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sym",
    headerName: "Symbol",
    flex: 1.2,
    minWidth: 140,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      typeof params.value === "string" ? params.value.trim() || "—" : "—",
  },
  {
    field: "ed",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    flex: 0.85,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return "—";

      const date = new Date(params.value);

      if (Number.isNaN(date.getTime())) return "—";

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "inst",
    headerName: "Instrument Name",
    headerClassName: "header-wrap-custom",
    flex: 0.9,
    minWidth: 115,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      typeof params.value === "string" ? params.value.trim() || "—" : "—",
  },
  {
    field: "seg",
    headerName: "Segment",
    flex: 0.7,
    minWidth: 85,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sp",
    headerName: "Strike Price",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "qty",
    headerName: "Quantity",
    flex: 0.7,
    minWidth: 85,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "ton",
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tp",
    headerName: "Trade Price",
    flex: 0.7,
    minWidth: 85,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  // {
  //   field: "un",
  //   headerName: "User ID",
  //   flex: 0.85,
  //   minWidth: 105,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
];

export const PreTradeApprovalColumns: GridColDef[] = [
  {
    field: "Uploaded_Document",
    headerName: "View Document",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Actions",
    headerName: "Actions",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Client_id",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    flex: 0.9,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Trade_Datetime",
    headerName: "Trade Date & Time",
    headerClassName: "header-wrap-custom",
    flex: 1.3,
    minWidth: 175,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleString("en-IN") : "—",
  },
  {
    field: "Buy_Sale",
    headerName: "Buy / Sell",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 95,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sSymbol",
    headerName: "Symbol / Series",
    headerClassName: "header-wrap-custom",
    flex: 1.3,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const symbol = (params.row?.sSymbol || "").trim();
      const series = (params.row?.ser || "").trim();

      return series ? `${symbol} / ${series}` : symbol || "—";
    },
  },
  {
    field: "ExpiryDate",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    flex: 0.9,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleDateString("en-IN") : "—",
  },
  {
    field: "Instrumentname",
    headerName: "Instrument Type",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value: any) => value?.trim() || "—",
  },
  {
    field: "StrikePrice",
    headerName: "Strike Price",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 105,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "Quantity",
    headerName: "Quantity",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "order_number",
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 155,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Uploaded_By",
    headerName: "Uploaded By",
    headerClassName: "header-wrap-custom",
    flex: 0.9,
    minWidth: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Uploaded_Date",
    headerName: "Uploaded Date",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 155,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleString("en-IN") : "—",
  },
  {
    field: "Status_flag",
    headerName: "Status",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value ?? "—",
  },
  {
    field: "Status_Remark",
    headerName: "Status Remark",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value ?? "—",
  },
  {
    field: "UserRemark",
    headerName: "Remark",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const clientTradingPatternSummarizedColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.5,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 0.7,
    minWidth: 70,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const name = params.row?.rm || "N/A"; // RM_Name → rm
      const mobile = params.row?.rm_mob || "N/A"; // RM_Mobile → rm_mob
      return (
        <Tooltip
          title={
            <>
              <div>RM Name: {name}</div>
              <div>Mobile No: {mobile}</div>
            </>
          }
          arrow
          placement="top"
        >
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "on_tot_brk",
    headerName: "Online Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "off_tot_brk",
    headerName: "Offline Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "cnt_tot_brk",
    headerName: "CNT Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "on_ltd",
    headerName: "Online Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "off_ltd",
    headerName: "Offline Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "cnt_ltd",
    headerName: "CNT Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "act_sts",
    headerName: "Active Status",
    flex: 0.8,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];

export const clientTradingPatternDetailedColumns: GridColDef[] = [
  {
    field: "zn", // client_Zone
    headerName: "Zone",
    flex: 0.5,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bc", // client_Branch
    headerName: "Branch Code",
    flex: 0.7,
    minWidth: 70,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bt", // branch_Type
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cc", // client_ID → ClientCode
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const name = params.row?.rm || "N/A"; // RM_Name → rm
      const mobile = params.row?.rm_mob || "N/A"; // RM_Mobile → rm_mob

      return (
        <Tooltip
          title={
            <>
              <div>RM Name: {name}</div>
              <div>Mobile No: {mobile}</div>
            </>
          }
          arrow
          placement="top"
        >
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "cn", // client_Name
    headerName: "Client Name",
    flex: 1.3,
    minWidth: 240,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },

  // CM Brokerage
  {
    field: "on_cm_brk", // online_CM_Brokerage
    headerName: "Online CM Brok",
    flex: 1,
    minWidth: 75,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "off_cm_brk", // offline_CM_Brokerage
    headerName: "Offline CM Brok",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "cnt_cm_brk", // cnT_CM_Brokerage
    headerName: "CNT CM Brok",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  // Futures Brokerage
  {
    field: "on_fut_brk", // online_FUT_Brokerage
    headerName: "Online Futures Brok",
    flex: 1.2,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "off_fut_brk", // offline_FUT_Brokerage
    headerName: "Offline Futures Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "cnt_fut_brk", // cnT_FUT_Brokerage
    headerName: "CNT Futures Brok",
    flex: 1.1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  // Options Brokerage
  {
    field: "on_opt_brk", // online_OPT_Brokerage
    headerName: "Online Options Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "off_opt_brk", // offline_OPT_Brokerage
    headerName: "Offline Options Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "cnt_opt_brk", // cnT_OPT_Brokerage
    headerName: "CNT Options Brok",
    flex: 1.1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },

  // Trade Dates
  {
    field: "on_ltd", // online_Last_Trade_Date
    headerName: "Online Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "off_ltd", // offline_Last_Trade_Date
    headerName: "Offline Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cnt_ltd", // cnT_Last_Trade_Date
    headerName: "CNT Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },

  {
    field: "act_sts", // activeStatus
    headerName: "Active Status",
    flex: 0.8,
    minWidth: 80,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const ctclUserWiseColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.8,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clid",
    headerName: "CTCL Login ID",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cusr",
    headerName: "CTCL User Name",
    flex: 1.5,
    minWidth: 210,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },

  {
    field: "tov",
    headerName: "Turnover (Cr.)",
    flex: 1,
    minWidth: 120,
    type: "number",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gbrok",
    headerName: "Gross Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "nbrok",
    headerName: "Net Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];
export const ctclUserWiseDetailedColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.8,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clid",
    headerName: "CTCL Login ID",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cusr",
    headerName: "CTCL User Name",
    flex: 1.5,
    minWidth: 210,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "seg",
    headerName: "Exchange / Segment",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "tov",
    headerName: "Turnover (Cr.)",
    flex: 1,
    minWidth: 120,
    type: "number",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gbrok",
    headerName: "Gross Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "nbrok",
    headerName: "Net Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const quotes = [
  {
    text: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
  },
  {
    text: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
  },
  {
    text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    text: "Know what you own, and know why you own it.",
    author: "Peter Lynch",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "The four most dangerous words in investing are: 'This time it's different.'",
    author: "Sir John Templeton",
  },
  {
    text: "Time is your friend; impulse is your enemy.",
    author: "John C. Bogle",
  },
  {
    text: "Wide diversification is only required when investors do not understand what they are doing.",
    author: "Warren Buffett",
  },
  {
    text: "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki",
  },
  {
    text: "Behind every stock is a company. Find out what it's doing.",
    author: "Peter Lynch",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Risk comes from not knowing what you are doing.",
    author: "Warren Buffett",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Success is not in what you have, but who you are.",
    author: "Bo Bennett",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "I find that the harder I work, the more luck I seem to have.",
    author: "Thomas Jefferson",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
  },
];
export const simpleQuote = [
  {
    text: `Please wait`,
    author: "",
  },
];

export const spipPerformanceReportColumns: GridColDef[] = [
  {
    field: "qm", // QuarterMonth
    headerName: "Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc", // ClientCode
    headerName: "Client Code",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn", // ClientName
    headerName: "Client Name",
    width: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "st", // Status
    headerName: "Status",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sc", // ScripCode
    headerName: "Scrip Name",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sn", // SecurityName
    headerName: "Security Name",
    width: 220,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bq", // BuyQty
    headerName: "Buy Qty",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "brt", // BuyRate
    headerName: "Buy Rate",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "bv", // BuyValue
    headerName: "Buy Value",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "sq", // SellQty
    headerName: "Sell Qty",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "srt", // SellRate
    headerName: "Sell Rate",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "sv", // SellValue
    headerName: "Sell Value",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "oq", // OpenQty
    headerName: "Open Qty",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "mr", // MarketRate
    headerName: "Market Rate",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "mv", // MarketValue
    headerName: "Market Value",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "pl", // ProfitLoss
    headerName: "Profit / Loss",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "plp", // ProfitLoss_Perc
    headerName: "P/L %",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
];

export const SPIPOverallPerformanceReport: GridColDef[] = [
  {
    field: "rm", // ReportMonth
    headerName: "Report Months",
    width: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc", // ClientCode
    headerName: "Client Code",
    width: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn", // ClientName
    headerName: "Client Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ia", // InvestmentAmt
    headerName: "Investment Amount",
    width: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "op", // OpenPosition
    headerName: "Open Position Amount",
    width: 170,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "pl", // ProfitLoss
    headerName: "Profit & Loss (Rs)",
    width: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "plp", // Profitloss_Perc
    headerName: "Profit & Loss (%)",
    width: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value) ? "-" : `${value.toFixed(2)}%`;
    },
  },
];

export const spipSubSciptionDetailColumns: GridColDef[] = [
  {
    field: "bc", // BranchCode
    headerName: "Branch Code",
    width: 70,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cc", // ClientCode
    headerName: "Client Code",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn", // ClientName
    headerName: "Client Name",
    flex: 1,
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params) => (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
        title={params.value}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "pn", // ProductName
    headerName: "Product",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "im", // InvoiceMonth
    headerName: "Payment Month",
    headerClassName: "header-wrap-custom",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dur", // Duration
    headerName: "Duration (Month)",
    headerClassName: "header-wrap-custom",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "amt", // Amount
    headerName: "Amount",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "sm", // StartMonth
    headerName: "Start Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "em", // EndMonth
    headerName: "End Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "invoiceDownload", //  Invoice Download
    headerName: "Invoice Download",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const ZONEWiseCommissionReport: GridColDef[] = [
  {
    field: "cro", // CROCODE
    headerName: "ZONE",
    // flex: 1,
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bc", // BRANCHCODE
    headerName: "Partner Code",
    width: 70,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // flex: 1,
  },
  {
    field: "bn", // BRANCHNAME
    headerName: "Partner Name",
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    flex: 2,
  },
  {
    field: "dt", // DTOFTRAN
    headerName: "Month",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tf", // TotalFees
    headerName: "Total Fees",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gst", // GST
    headerName: "GST",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "fwg", // FeeswithoutGST
    headerName: "Fees without GST",
    width: 90,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "tcom", // TotalCommission
    headerName: "Total Commission",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "mcom", // MonthlyCommission
    headerName: "Monthly Commission",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "tds", // TDS
    headerName: "TDS",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "cr", // CommissionReleased
    headerName: "Commission Released",
    headerClassName: "header-wrap-custom",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "bal", // BalanceCommission
    headerName: "Balance Commission",
    headerClassName: "header-wrap-custom",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const ClientWiseCommissonReport: GridColDef[] = [
  {
    field: "cc", // CLIENTCODE
    headerName: "Client Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn", // ClientName
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "cro", // CROCODE
    headerName: "ZONE",
    flex: 1,
    minWidth: 110,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bc", // BRANCHCODE
    headerName: "Partner Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bn", // BRANCHNAME
    headerName: "Partner Name",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dt", // DTOFTRAN
    headerName: "Month",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tf", // TotalFees
    headerName: "Total Fees (₹)",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "gst", // GST
    headerName: "GST (₹)",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "fwg", // FeeswithoutGST
    headerName: "Fees w/o GST (₹)",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "tcom", // TotalCommission
    headerName: "Total Commission (₹)",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "mcom", // MonthlyCommission
    headerName: "Monthly Commission (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "tds", // TDS
    headerName: "TDS (₹)",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "cr", // CommissionReleased
    headerName: "Commission Released (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "bal", // BalanceCommission
    headerName: "Balance Commission (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
];

export const spipClientDetails: GridColDef[] = [
  {
    field: "ia",
    headerName: "Client Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 2,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "boc",
    headerName: "Backoffice Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pan",
    headerName: "PAN",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "mob",
    headerName: "Mobile No.",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "em",
    headerName: "Email ID",
    flex: 1.8,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "act",
    headerName: "Status",
    flex: 0.8,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    // renderCell: ({ value }) => (
    //   <span
    //     style={{
    //       color: value === "Yes" ? "green" : "red",
    //       fontWeight: 600,
    //     }}
    //   >
    //     {value}
    //   </span>
    // ),
  },
  {
    field: "ad",
    headerName: "Activation Date",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "rm",
    headerName: "Introducer",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "addr",
    headerName: "Address",
    flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "sd",
    headerName: "Start Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ed",
    headerName: "End Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "exp",
    headerName: "Expiry Status",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
  },
];

export const getApproverOneDetails: GridColDef[] = [
  // {
  //   field: "ds64",
  //   headerName: "Deal Sheet",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 50,
  //   align: "center",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   sortable: false,
  //   renderCell: (params) => {
  //     const base64Data = params.value;

  //     const today = new Date();
  //     const dd = String(today.getDate()).padStart(2, "0");
  //     const mm = String(today.getMonth() + 1).padStart(2, "0");
  //     const yy = String(today.getFullYear()).slice(-2);
  //     const filename = `Deal_Sheet_${dd}-${mm}-${yy}.pdf`;

  //     const handleDownload = () => {
  //       if (!base64Data) return;

  //       const binaryString = atob(base64Data);
  //       const len = binaryString.length;
  //       const bytes = new Uint8Array(len);

  //       for (let i = 0; i < len; i++) {
  //         bytes[i] = binaryString.charCodeAt(i);
  //       }

  //       const decompressed = pako.ungzip(bytes);
  //       // const blob = new Blob([decompressed], { type: "application/pdf" });
  //       const blob = new Blob([new Uint8Array(decompressed)], {
  //         type: "application/pdf",
  //       }); // FIX: Ensure it's a Uint8Array
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = filename;
  //       link.click();

  //       window.URL.revokeObjectURL(url);
  //     };

  //     return (
  //       <button
  //         onClick={handleDownload}
  //         style={{
  //           color: "#11395C",
  //           textDecoration: "underline",
  //           background: "none",
  //           border: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         <DownloadForOfflineIcon />
  //       </button>
  //     );
  //   },
  // },

  {
    field: "Action",
    headerName: "Action",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },

  {
    field: "tdt",
    headerName: "Transaction Date",
    minWidth: 110,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "bnknm",
    headerName: "Bank Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "accno",
    headerName: "Bank Acc No",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ifsc",
    headerName: "IFSC Code",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dpnm",
    headerName: "DP Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dpid",
    headerName: "DP Id",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "paym",
    headerName: "Payment Mode",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "bc",
    headerName: "Branch Code",
    minWidth: 90,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "zn",
    headerName: "Zone",
    minWidth: 80,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "ccat",
    headerName: "Client Category",
    minWidth: 110,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "rmc",
    headerName: "RM Code",
    minWidth: 80,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "rm",
    headerName: "RM Name",
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "nsec",
    headerName: "Name of Securities",
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "VendorName",
    headerName: "Vendor Name",
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "panno",
    headerName: "Pan Number",
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "nsh",
    headerName: "No of Shares",
    minWidth: 90,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
  },

  {
    field: "crt",
    headerName: "Client Rate",
    minWidth: 90,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "vrt",
    headerName: "Vendor Rate",
    minWidth: 90,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "lcps",
    headerName: "Commission Per Share",
    minWidth: 130,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "big",
    headerName: "Commission Inclusive GST",
    minWidth: 160,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "gst",
    headerName: "GST",
    minWidth: 90,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "beg",
    headerName: "Commission Exclusive GST",
    minWidth: 170,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "sbc",
    headerName: "SB Code",
    minWidth: 90,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },

  {
    field: "sbr",
    headerName: "SB Rate",
    minWidth: 90,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "sbcm",
    headerName: "SB Commission",
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },

  {
    field: "nbg",
    headerName: "Net Commission",
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(params)),
  },
];

export const getApproverTwoDetails: GridColDef[] = [
  {
    field: "ds64",
    headerName: "Deal Sheet",
    headerClassName: "header-wrap-custom",
    minWidth: 50,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => {
      const base64Data = params.value;
      const today = new Date();

      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yy = String(today.getFullYear()).slice(-2);

      const filename = `Deal_Sheet_${dd}-${mm}-${yy}.pdf`;
      console.log("base64Data", base64Data);

      const handleDownload = () => {
        if (!base64Data) return;

        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const decompressed = pako.ungzip(bytes);
        // const blob = new Blob([decompressed], { type: "application/pdf" });
        const blob = new Blob([new Uint8Array(decompressed)], {
          type: "application/pdf",
        }); // FIX: Ensure it's a Uint8Array
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        window.URL.revokeObjectURL(url);
      };

      return (
        <button
          onClick={handleDownload}
          style={{
            color: "#11395C",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <DownloadForOfflineIcon />
        </button>
      );
    },
  },
  {
    field: "Action",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "ap1",
    headerName: "Approver Code",
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ap1rmk",
    headerName: "Approver One Remarks",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "vnm",
    headerName: "Vendor Name",
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  ...getApproverOneDetails.filter(
    (col) => col.field !== "Action" && col.field !== "ds64",
  ),
];

export const unListedTradeColumns: GridColDef[] = [
  {
    field: "action",
    headerName: "Actions",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "rmc",
    headerName: "RM Code",
    width: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "tdt",
    headerName: "Transaction Date",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (value: any) => {
      if (!value) return "—";

      const [datePart] = value.split(" "); // "02/04/2026"
      const [month, day, year] = datePart.split("/"); // MM/DD/YYYY

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      const dd = String(date.getDate()).padStart(2, "0");
      const mmm = date.toLocaleString("en-US", { month: "short" });
      const yy = String(date.getFullYear()).slice(-2);

      return `${dd}-${mmm}-${yy}`;
    },
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "vnm",
    headerName: "Vendor Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "panno",
    headerName: "Pan Number",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "bnknm",
    headerName: "Bank Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "accno",
    headerName: "Bank Acc No",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ifsc",
    headerName: "IFSC Code",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dpnm",
    headerName: "DP Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dpid",
    headerName: "DP Id",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "paym",
    headerName: "Payment Mode",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "nsec",
    headerName: "Securities Name",
    width: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "nsh",
    headerName: "No. of Shares",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "crt",
    headerName: "Client Rate",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "vrt",
    headerName: "Vendor Rate",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "lcps",
    headerName: "LKP Commission/Share",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    width: 100,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "big",
    headerName: "Brokerage (Incl. GST)",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => {
    //   const value = parseFloat(params); // Convert the value to a number
    //   return new Intl.NumberFormat("en-IN", {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   }).format(value);
    // },
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gst",
    headerName: "GST",
    width: 90,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "beg",
    headerName: "Brokerage (Excl. GST)",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "sbr",
    headerName: "SubBroker Rate",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "sbc",
    headerName: "SubBroker Code",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "sbcm",
    headerName: "SubBroker Commission",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "nbg",
    headerName: "Net Brokerage",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "rmk",
    headerName: "Remark",
    // flex: 0.8,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "sts",
    headerName: "Status",
    // flex: 0.8,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const ClientPledgeRequest: GridColDef[] = [
  {
    field: "encryptedCode",
    headerName: "Pledge Request",
    headerClassName: "header-wrap-custom",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "copylnk",
    headerName: "Copy\nLink",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { enc } = params.row;
      if (!enc) return <span>No Link Available</span>;

      const fullLink = `https://allocation.lkp.net.in:51528/Pledge/direct?UserId=${enc}`;
      return <CopyToClipboardCell fullLink={fullLink} field={"pledgeLink"} />;
    },
  },
  {
    disableColumnMenu: true,
    field: "cc",
    headerName: "Client Code",
    align: "left",
    flex: 1,
    minWidth: 100,
  },
  {
    disableColumnMenu: true,
    field: "cn",
    headerName: "Client Name",
    flex: 2,
    minWidth: 160,
  },
  {
    field: "mob",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) =>
          `${prefix}${"X".repeat(middle.length)}${suffix}`,
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "csts",
    headerName: "Status",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "poa",
    headerName: "POA Status",
    flex: 1,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    minWidth: 120,
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null;

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1: any, v2: any) => {
      if (!v1 || !v2) return 0;
      return v1 - v2;
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY");
    },
  },
  {
    field: "hval",
    headerName: "Holding Value",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  // {
  //   field: "ledgerReport",
  //   headerName: "Client Report with Ledger",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
  // {
  //   field: "pledgeReport",
  //   headerName: "Client Report with Pledge",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
  // {
  //   field: "freeHolding Value",
  //   headerName: "Free Holding Value",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
];

export const clientAPBrokerageColumns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  // {
  //   field: "monthYr",
  //   headerName: "Month",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  {
    field: "gb",
    headerName: "Gross Brokerage",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },

  {
    field: "contr",
    headerName: "Contribution %",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => {
    //   return `${params} %`;
    // },
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      if (isNaN(value)) return "0%";
      return (
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value) + "%"
      );
    },
  },
];
export const APTopClientsFields: GridColDef[] = [
  {
    field: "rnk",
    headerName: "Rank",
    width: 100,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "zn",
    headerName: "Zone",
    width: 100,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },

  {
    field: "gb",
    headerName: "Gross Brokerage",
    width: 180,
    flex: 1,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
];

export const APContestAchievedClients: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ad",
    headerName: "Activation Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ltd",
    headerName: "Last Trade Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];
export const EmpBrokerageAchieved: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "gb",
    headerName: "Gross Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "nlkp",
    headerName: "Net To LKP Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "slbm_gb",
    headerName: "SLBM Gross Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "slbm_nlkp",
    headerName: "SLBM Net To LKP Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];
export const EmpNonBrokerageAchieved: GridColDef[] = [
  {
    field: "emp",
    headerName: "Employee Code",
    width: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "myr",
    headerName: "Month-Year",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },

  {
    field: "ins_g",
    headerName: "Insurance Gross",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "ins_ntl",
    headerName: "Insurance Net To LKP",
    width: 170,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "ln_rev",
    headerName: "Loan Revenue",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "mf_rev",
    headerName: "MF Revenue",
    width: 130,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "liq_rev",
    headerName: "Liquid Loans Revenue",
    width: 180,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "spip_rev",
    headerName: "SPIP Revenue",
    width: 130,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "trl_rev",
    headerName: "Trilogy Revenue",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
];
export const ClientExclusionColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    minWidth: 80,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "typ",
    headerName: "Type",
    minWidth: 80,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "code",
    headerName: "Client Code",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  // {
  //   field: "excludeFrom",
  //   headerName: "Exclude From",
  //   minWidth: 140,
  //   flex: 1,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  {
    field: "rmks",
    headerName: "Remarks",
    minWidth: 200,
    flex: 2.5,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "cby",
    headerName: "Created By",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "cdt",
    headerName: "Created On",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,

    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 80,
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
  },
];

export const RHTopClientsColumns: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    minWidth: 100,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "rev",
    headerName: "Revenue",
    minWidth: 100,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "td",
    headerName: "Last Trade Date",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // valueFormatter: (params) =>
    //   params.value ? new Date(params.value).toLocaleDateString("en-GB") : "-",
  },
  {
    field: "rmn",
    headerName: "RM Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];
export const ThirdParty: GridColDef[] = [
  {
    field: "ldc",
    headerName: "Ledger Code",
    minWidth: 70,
    flex: 0.4,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "cnm",
    headerName: "Company Name",
    minWidth: 180,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "sac",
    headerName: "SAC Number",
    minWidth: 75,
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ste",
    headerName: "State",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "gsc",
    headerName: "GST State Code",
    minWidth: 60,
    flex: 0.3,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "gst",
    headerName: "GST Number",
    minWidth: 150,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "pan",
    headerName: "PAN Number",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "em",
    headerName: "Email ID",
    minWidth: 180,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const email = params.value || "";

      const maskedEmail = email.replace(
        /^(.)(.*)(.@.*)$/,
        (_: any, firstChar: any, middleChars: any, domain: any) =>
          `${firstChar}${"x".repeat(middleChars.length)}${domain}`,
      );

      return (
        <Tooltip title={email} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "mob",
    headerName: "Mobile Number",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "ad1",
    headerName: "Address 1",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "ad2",
    headerName: "Address 2",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "ad3",
    headerName: "Address 3",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const ThirdPartyStatusReport: GridColDef[] = [
  // Spread in all columns except the one with field "action"
  ...ThirdParty.filter((col) => col.field !== "action"),

  {
    field: "apsts",
    headerName: "Status",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "160px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
];

export const TpInvoiceUploadColumns: GridColDef[] = [
  {
    field: "invn",
    headerName: "Invoice Number",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center", // Code → Center
    disableColumnMenu: true,
  },
  {
    field: "invd",
    headerName: "Invoice Date",
    minWidth: 110,
    flex: 1,
    headerAlign: "center",
    align: "center", // Date → Center
    disableColumnMenu: true,

    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "cnm",
    headerName: "Company Name",
    minWidth: 200,
    flex: 2,
    headerAlign: "center",
    align: "left", // Text → Left
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "pnm",
    headerName: "Party Name",
    minWidth: 200,
    flex: 2,
    headerAlign: "center",
    align: "left", // Text → Left
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "gst",
    headerName: "GST Number",
    minWidth: 160,
    flex: 1.5,
    headerAlign: "center",
    align: "center", // Code → Center
    disableColumnMenu: true,
  },
  {
    field: "mnth",
    headerName: "For Month",
    minWidth: 100,
    flex: 1,
    headerAlign: "center",
    align: "center", // Date → Center
    disableColumnMenu: true,
  },
  {
    field: "prd",
    headerName: "Product",
    minWidth: 150,
    flex: 1.5,
    headerAlign: "center",
    align: "left", // Text → Left
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },

  {
    field: "ste",
    headerName: "Party State",
    minWidth: 140,
    flex: 1.2,
    headerAlign: "center",
    align: "left", // Text → Left
    disableColumnMenu: true,
  },
  {
    field: "bamt",
    headerName: "Base Amount",
    minWidth: 110,
    flex: 1,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "sgst",
    headerName: "SGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "cgst",
    headerName: "CGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "igst",
    headerName: "IGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "tamt",
    headerName: "Total Amount",
    minWidth: 120,
    flex: 1.2,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
];
export const TpInvoiceVerifyColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "cdt",
    headerName: "Created On",
    minWidth: 160,
    flex: 1,
    headerAlign: "center",
    align: "center",
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "delete",
    headerName: "Delete",
    width: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];
export const TpInvoiceMailsColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "generate",
    headerName: "Generate Invoice",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];
export const TpInvoiceReportColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "vsts",
    headerName: "Status",
    minWidth: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "110px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
];
export const VendorMasterColumns: GridColDef[] = [
  {
    field: "vid",
    headerName: "Vendor ID",
    minWidth: 100,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "vnm",
    headerName: "Vendor Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ad1",
    headerName: "Address",
    minWidth: 300,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => {
      const ad1 = (params.row?.ad1 || "").trim();
      const ad2 = (params.row?.ad2 || "").trim();
      const ad3 = (params.row?.ad3 || "").trim();
      return `${ad1} ${ad2} ${ad3}`;
    },
  },
  {
    field: "cty",
    headerName: "City",
    minWidth: 100,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ste",
    headerName: "State",
    minWidth: 100,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "pin",
    headerName: "Pin Code",
    minWidth: 100,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "tele",
    headerName: "Tele No",
    minWidth: 120,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "mob",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "em",
    headerName: "Email ID",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "pan",
    headerName: "PAN No",
    minWidth: 140,
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "gst",
    headerName: "GST No",
    minWidth: 140,
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "msmf",
    headerName: "MSME Flag",
    minWidth: 110,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "msmt",
    headerName: "MSME Type",
    minWidth: 130,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "actions",
    headerName: "Actions",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    // renderCell: (params) => (
    //   <div>
    //     <IconButton
    //       onClick={() => {
    //         console.log("Edit", params.row);
    //       }}
    //     >
    //       <EditIcon fontSize="small" />
    //     </IconButton>
    //     <IconButton
    //       onClick={() => {
    //         console.log("Delete", params.row);
    //       }}
    //     >
    //       <DeleteIcon fontSize="small" />
    //     </IconButton>
    //   </div>
    // ),
  },
  {
    field: "armk",
    headerName: "Remark",
    minWidth: 160,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const VendorMasterApprovalColumns: GridColDef[] = [
  {
    field: "vid",
    headerName: "Vendor ID",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "vnm",
    headerName: "Vendor Name",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },

  {
    field: "ad1",
    headerName: "Address",
    minWidth: 400,
    flex: 1.2,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const ad1 = (params.row?.ad1 || "").trim();
      const ad2 = (params.row?.ad2 || "").trim();
      const ad3 = (params.row?.ad3 || "").trim();
      return `${ad1} ${ad2} ${ad3}`;
    },
  },

  {
    field: "cty",
    headerName: "City",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "ste",
    headerName: "State",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "pin",
    headerName: "Pin Code",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "tele",
    headerName: "Telephone No",
    minWidth: 120,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "mob",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "em",
    headerName: "Email ID",
    minWidth: 180,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "pan",
    headerName: "PAN No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "gst",
    headerName: "GST No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "msmf",
    headerName: "MSME Flag",
    minWidth: 110,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "msmt",
    headerName: "MSME Type",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "msmp",
    headerName: "MSME Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "bdoc",
    headerName: "Bank Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "pdoc",
    headerName: "Pan Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "actions",
    headerName: "Actions",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },

  {
    field: "armk",
    headerName: "Remark",
    minWidth: 160,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const getAPContestReportColumns: GridColDef[] = [
  {
    field: "apc",
    headerName: "AP Code",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "apn",
    headerName: "AP Name",
    flex: 2,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "bga",
    headerName: "Revenue Achieved",
    flex: 1.3,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        params,
      ),
  },
  {
    field: "clientsAchieved",
    headerName: "Clients Achieved",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => {
      const value = params.row.cla;
      return value ?? "-";
    },
  },
  {
    field: "accop",
    headerName: "Account Opened",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "accountsTraded",
    headerName: "Account Traded",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => {
      const value = params.row.cla;
      return value ?? "-";
    },
  },
];
export const getAPContestReportColumnsQ4: GridColDef[] = [
  // Take first two columns from base report
  getAPContestReportColumns[0], // AP Code
  getAPContestReportColumns[1], // AP Name

  // Add Minimum Brokerage column
  {
    field: "mbg",
    headerName: "Minimum Brokerage",
    flex: 1.3,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        params,
      ),
  },

  // Add remaining columns after AP Name
  ...getAPContestReportColumns.slice(2),
];

export const clientUnpledgeReport: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "isin",
    headerName: "ISIN",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sym",
    headerName: "Scrip Name",
    flex: 1,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "qty",
    headerName: "Quantity",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  // {
  //   field: "RequestedBy",
  //   headerName: "Requested By",
  //   width: 140,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
  {
    field: "rqdt",
    headerName: "Requested Date",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return ""; // safety check
      const date = new Date(params.value);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
];
export const EmployeeTargetReportColumns: GridColDef[] = [
  {
    field: "emp",
    headerName: "Emp Code",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "emp_nm",
    headerName: "Emp Name",
    minWidth: 130,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },

  {
    field: "brt",
    headerName: "Broking Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params,
      ),
  },

  {
    field: "bgra",
    headerName: "Broking Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },

  {
    field: "nbrt",
    headerName: "Non-Broking Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params,
      ),
  },

  {
    field: "nbra",
    headerName: "Non-Broking Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },

  {
    field: "trt",
    headerName: "Total Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        params,
      ),
  },

  {
    field: "tra",
    headerName: "Total Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },

  {
    field: "perRevAch",
    headerName: " % Revenue Achieved ",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    renderCell: (params) => {
      const value1 = params.row?.tra || 0;
      const value2 = params.row?.trt || 0;
      const num1 = parseFloat(value1) || 0;
      const num2 = parseFloat(value2) || 0;
      const percentage = num2 !== 0 ? (num1 / num2) * 100 : 0;
      return `${Math.round(percentage * 100) / 100}%`;
    },
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(params),
  },

  {
    field: "tmf",
    headerName: "Target MF AUM",
    minWidth: 110,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params,
      ),
  },

  {
    field: "amf",
    headerName: "Achieved MF AUM",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params,
      ),
  },

  {
    field: "fct",
    headerName: "Fresh Cash Margin Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params,
      ),
  },

  {
    field: "fca",
    headerName: "Fresh Cash Margin Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },

  {
    field: "nac",
    headerName: "New Account Target",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "nca",
    headerName: "New Clients Achieved",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "rac",
    headerName: "Reactivation Target",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "rca",
    headerName: "Reactivated Clients Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "rprd_tg",
    headerName: "Research Product Target",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "rprd_ach",
    headerName: "Research Product Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "mtf_cl_tg",
    headerName: "MTF Active Client",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "mtf_cl_ach",
    headerName: "MTF Client Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "mtf_ult_tg",
    headerName: "MTF Utilisation Target",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "mtf_ult_ach",
    headerName: "MTF Utilisation Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "spip_t",
    headerName: "SPIP Clients Target",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "spip_a",
    headerName: "SPIP Clients Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "ins_t",
    headerName: "Insurance Premium Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => new Intl.NumberFormat("en-IN").format(params),
  },

  {
    field: "ins_a",
    headerName: "Insurance Premium Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => new Intl.NumberFormat("en-IN").format(params),
  },
];

export const MutualFundList: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "aumCr",
    headerName: "AUM (Cr)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minSIP",
    headerName: "Min SIP (₹)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minLumpSum",
    headerName: "Min Lump Sum (₹)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "returns",
    headerName: "Returns (%)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
];
export const MutualFundOrder: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "aumCr",
    headerName: "Status",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minSIP",
    headerName: "Order Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minLumpSum",
    headerName: "Folio Number",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "returns",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "",
    headerName: "Remarks",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
];

export const MutualFundName: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
];
export const OrderTransaction: GridColDef[] = [
  {
    field: "security",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
    headerAlign: "center",
  },
  {
    field: "transactionPrice",
    headerName: "Transaction Price",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "quantity",
    headerName: "Quantity",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
    headerAlign: "center",
    align: "right",
  },
];
export const OrderOngoingSip: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "startDate",
    headerName: "SIP Date",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
];
export const OrderUpcomingSip: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "startDate",
    headerName: "Due Date",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
];

export const MTFStockAgeingSaleColumns: GridColDef[] = [
  {
    field: "scripName",
    headerName: "Scrip Name",
    disableColumnMenu: true,
    flex: 1.2,
    minWidth: 140,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "ageingDays",
    headerName: "Ageing Days",
    disableColumnMenu: true,
    flex: 0.8,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "availableQty",
    headerName: "Available Qty",
    disableColumnMenu: true,
    flex: 0.8,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "effectivePrice",
    headerName: "Effective Price",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return params.value?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: "marginPercent",
    headerName: "Margin %",
    disableColumnMenu: true,
    flex: 0.8,
    minWidth: 100,
    align: "right",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    renderCell: (params: any) => {
      return params.value != null ? `${params.value}%` : "";
    },
  },
  {
    field: "marginValuePerShare",
    headerName: "Margin Value Per Share",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return params.value?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: "sellQty",
    headerName: "Sell Qty",
    disableColumnMenu: true,
    flex: 0.8,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "recoveredMargin",
    headerName: "Recovered Margin",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return params.value?.toLocaleString("en-IN");
    },
  },
  {
    field: "actualMarginShortfall",
    headerName: "Actual Margin Shortfall",
    disableColumnMenu: true,
    flex: 1.2,
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return params.value?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
  {
    field: "remainingShortfall",
    headerName: "Remaining Shortfall",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return params.value?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
];
export const MfPortfolio: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 2.8, // larger space since names are long
    minWidth: 180,
  },
  {
    field: "physicalQuantity",
    headerName: "Mode",
    disableColumnMenu: true,
    flex: 0.5,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      if (params > 0) return "Physical";
      else return "Demat";
    },
  },

  {
    field: "folioNumber",
    headerName: "Folio Number",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "investedAmount",
    headerName: "Invested Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const value = params.value;
      return value?.toLocaleString("en-IN");
    },
  },

  {
    field: "currentValue",
    headerName: "Current Amount",
    disableColumnMenu: true,
    flex: 1, // larger space since names are long
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const value = params.value;
      return value?.toLocaleString("en-IN");
    },
  },
  {
    field: "xirr",
    headerName: "XIRR %",
    disableColumnMenu: true,
    flex: 0.8,
    minWidth: 60,
    headerClassName: "header-wrap-custom",
    align: "right",
    headerAlign: "center",
  },
  {
    field: "action",
    headerName: "Action",
    disableColumnMenu: true,
    flex: 1.7,
    minWidth: 180,
    align: "center",
    headerAlign: "center",
  },
];

export const MandateColumns: GridColDef[] = [
  {
    field: "mandateId",
    headerName: "Mandate ID",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    headerAlign: "right",
    align: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "status",
    headerName: "Status",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 280,
    headerAlign: "center",
  },
  {
    field: "mandateType",
    headerName: "Mandate Type",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "collectionType",
    headerName: "Collection Type",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankName",
    headerName: "Bank Name",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankAccNo",
    headerName: "Bank A/C No",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankBranch",
    headerName: "Bank Branch",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 250,
    headerAlign: "center",
  },
  {
    field: "umrnNo",
    headerName: "UMRN No",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "regnDate",
    headerName: "Regn Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "approvedDate",
    headerName: "Approved Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "uploadDate",
    headerName: "Upload Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
];

export const NFOList: GridColDef[] = [
  {
    field: "schemeName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 4,
    minWidth: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.amcIcon}
          alt={params.row.amcName}
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
      </div>
    ),
  },
  {
    field: "nfoFaceValue",
    headerName: "NAV",
    disableColumnMenu: true,
    flex: 0.5,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div>₹{Number(params.row.nfoFaceValue).toFixed(2)}</div>
    ),
  },
  {
    field: "launchDate",
    headerName: "Launch Date",
    disableColumnMenu: true,
    flex: 1,
    headerAlign: "center",
    align: "center",
    minWidth: 80,
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "closingDate",
    headerName: "Closing Date",
    disableColumnMenu: true,
    flex: 1,
    headerAlign: "center",
    align: "center",
    minWidth: 80,
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
];

export const getRecommendationListColumns = (
  selectedReturnPeriod: string,
): GridColDef[] => [
  {
    field: "schemeName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    flex: 3,
    minWidth: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.amcIcon}
          alt="AMC"
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
      </div>
    ),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1.5,
    minWidth: 160,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span style={{ fontSize: "13px" }}>
        {params.row.category?.split("|")[1]?.trim() || "-"}
      </span>
    ),
  },
  {
    field: "sipMinimum",
    headerName: "Min. SIP",
    align: "center",
    headerAlign: "center",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span>₹{Number(params.row.sipMinimum || 0).toLocaleString()}</span>
    ),
  },
  {
    field: "aum",
    headerName: "AUM (Cr)",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    renderCell: (params) => (
      <span>₹{Number(params.row.aum || 0).toLocaleString()}</span>
    ),
  },
  {
    field: "investmentAmount",
    headerName: "Min. Lump",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 120,
    renderCell: (params) => (
      <span>₹{Number(params.row.investmentAmount || 0).toLocaleString()}</span>
    ),
  },
  {
    field: selectedReturnPeriod, // 👈 dynamic field
    headerName: "Returns",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    renderCell: (params) => {
      const val = parseFloat(params.row[selectedReturnPeriod]);
      const isNegative = val < 0;
      return (
        <span style={{ color: isNegative ? "red" : "green" }}>
          {isNegative ? "-" : ""}
          {Math.abs(val).toFixed(2)}%
        </span>
      );
    },
  },
];

// export const MutualFundOrderColumns: GridColDef[] = [
//   {
//     field: "schemeName",
//     headerName: "Scheme Name",
//     disableColumnMenu: true,
//     // flex: 2,
//     minWidth: 350,
//     headerAlign: "center",
//     renderCell: (params) => (
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         <img
//           src={params.row.logo}
//           alt={params.row.logo}
//           style={{ width: "32px", height: "32px", objectFit: "contain" }}
//         />
//         <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
//       </div>
//     ),
//   },
//   {
//     field: "transType",
//     headerName: "Transaction Type",
//     disableColumnMenu: true,
//     // flex: 1,
//     minWidth: 120,
//     align: "center",
//     headerClassName: "header-wrap-custom",
//     headerAlign: "center",
//     renderCell: (params) => {
//       if (params.value?.toLowerCase() === "xsip") {
//         return "Sip";
//       }
//       return capitalizeEachWord(params.value);
//     },
//   },
//   {
//     field: "orderedDate",
//     headerName: "Order Date",
//     disableColumnMenu: true,
//     // flex: 0.7,
//     minWidth: 120,
//     align: "center",
//     headerAlign: "center",
//     renderCell: (params) => {
//       const rawDate = params.value;
//       if (!rawDate) return "";

//       return dayjs(rawDate).format("DD-MM-YYYY");
//     },
//   },

//   {
//     field: "amount",
//     headerName: "Amount",
//     disableColumnMenu: true,
//     // flex: 0.7,
//     minWidth: 120,

//     headerAlign: "center",
//     align: "center",
//   },
//   {
//     field: "remarks",
//     headerName: "Remarks",
//     disableColumnMenu: true,
//     // flex: 2,
//     minWidth: 800,
//     headerAlign: "left",
//     align: "left",
//     renderCell: (params) => capitalizeEachWord(params.value),
//   },
// ];

export const MutualFundOrderColumns: GridColDef[] = [
  {
    field: "schemeName",
    headerName: "Scheme Name",
    disableColumnMenu: true,
    minWidth: 350,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.logo}
          alt={params.row.logo}
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div
          style={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={params.row.schemeName} // tooltip on hover
        >
          {params.row.schemeName}
        </div>
      </div>
    ),
  },
  {
    field: "transType",
    headerName: "Transaction Type",
    disableColumnMenu: true,
    minWidth: 120,
    align: "center",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    renderCell: (params) => {
      const text =
        params.value?.toLowerCase() === "xsip"
          ? "Sip"
          : capitalizeEachWord(params.value);
      return (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={text} // tooltip
        >
          {text}
        </div>
      );
    },
  },
  {
    field: "orderedDate",
    headerName: "Order Date",
    disableColumnMenu: true,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const formattedDate = params.value
        ? dayjs(params.value).format("DD-MMM-YYYY")
        : "";
      return (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={formattedDate} // tooltip
        >
          {formattedDate}
        </div>
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    minWidth: 120,
    headerAlign: "center",
    align: "right",
    renderCell: (params) => {
      const text = params.value ?? "";
      return (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={text} // tooltip
        >
          {text}
        </div>
      );
    },
  },
  {
    field: "remarks",
    headerName: "Remarks",
    disableColumnMenu: true,
    minWidth: 600,
    flex: 4,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const text = capitalizeEachWord(params.value);
      return (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={text} // tooltip
        >
          {text}
        </div>
      );
    },
  },
];

export const dpDebitMandateColumns: GridColDef[] = [
  {
    field: "Action",
    headerName: "Action",
    flex: 2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "RequestDate",
    headerName: "Request Date",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params: any) => {
      console.log("Paramsss", params);

      if (!params) return "";

      // Extract date part (YYYY-MM-DD)
      const datePart = params.split(" ")[0];

      const date = new Date(datePart);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    field: "umn",
    headerName: "UMN",
    flex: 1.5,
    minWidth: 320,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "mandateType",
    headerName: "Mandate Type",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "mandateStatus",
    headerName: "Mandate Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 0.8,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "upi",
    headerName: "UPI ID",
    flex: 1.5,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "statusDesc",
    headerName: "Status Description",
    flex: 2,
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];

export const ClientMandateReport: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "branchcode",
    headerName: "Branch Code",
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "boid",
    headerName: "BOID",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "dpDebit",
    headerName: "DP Debit",
    minWidth: 120,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "mandateAmount",
    headerName: "Mandate Amount",
    minWidth: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "umn",
    headerName: "UMN",
    minWidth: 250,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "referenceNumber",
    headerName: "Reference No.",
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "nextRecurDate",
    headerName: "Next Recur Date",
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // Optional: format DD/MM/YYYY
    // valueFormatter: (params) => {
    //   const v = params.value?.toString();
    //   if (v?.length === 8) {
    //     return `${v.substring(0, 2)}/${v.substring(2, 4)}/${v.substring(4)}`;
    //   }
    //   return v || "N/A";
    // },
  },
];

export const AmcLifeMembership: GridColDef[] = [
  {
    field: "tc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dpid",
    headerName: "BOID",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ph1",
    headerName: "Primary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ph1_mob",
    headerName: "Mobile No.",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, p1: any, mid: any, p2: any) =>
          `${p1}${"X".repeat(mid.length)}${p2}`,
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "sts",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bsda",
    headerName: "BSDA",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dlr",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "rm",
    headerName: "RM Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ph2",
    headerName: "Second Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "ph3",
    headerName: "Third Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "zn",
    headerName: "Zone",
    flex: 1,
    minWidth: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "m_desc",
    headerName: "Scheme Category",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  // {
  //   field: "module_Modified_date",
  //   headerName: "Module Modified Date",
  //   flex: 1,
  //   minWidth: 150,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  //   valueGetter: (params: any) => {
  //     const rawDate = params;
  //     if (!rawDate) return null; // Handle missing data

  //     const parsedDate = new Date(
  //       rawDate.replace(
  //         /(\d{2})-([A-Za-z]{3})-(\d{2})/,
  //         (_match: any, day: any, month: any, year: any) => {
  //           const monthMap: any = {
  //             Jan: "01",
  //             Feb: "02",
  //             Mar: "03",
  //             Apr: "04",
  //             May: "05",
  //             Jun: "06",
  //             Jul: "07",
  //             Aug: "08",
  //             Sep: "09",
  //             Oct: "10",
  //             Nov: "11",
  //             Dec: "12",
  //           };
  //           console.log(match);
  //           return `20${year}-${monthMap[month]}-${day}`;
  //         }
  //       )
  //     );

  //     return parsedDate;
  //   },
  //   sortComparator: (v1: any, v2: any) => {
  //     if (!v1 || !v2) return 0; // Handle missing values
  //     return v1 - v2; // Sort in ascending order
  //   },
  //   valueFormatter: (params: any) => {
  //     if (!params) return "";
  //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
  //   },
  // },
];
export const AmcNonLifeMembership: GridColDef[] = [
  {
    field: "sch",
    headerName: "Activate",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "AMC_Link",
    headerName: "AMC Link",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { dpid } = params.row;
      // if (!Payment_link || !EnCAccountCode)
      //   return (
      //     <Tooltip title={"No Link Available"} arrow placement="top">
      //       <span>No Link Available</span>
      //     </Tooltip>
      //   );
      if (params?.row?.sch === "Submitted") return <span>—</span>;

      const fullLink = `${dpid}`;
      console.log(
        params?.row?.sch,
        "Payment_link,  <CopyToClipboardCellEnCAccountCode",
        fullLink,
      );
      return (
        <CopyToClipboardCell
          fullLink={fullLink}
          field={"AMC"}
          selectedRow={params?.row}
        />
      );
    },
  },
  // ...AmcLifeMembership,
  {
    field: "tc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dpid",
    headerName: "BOID",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ph1",
    headerName: "Primary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "hval",
    headerName: "Holding Value",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
  {
    field: "ph1_mob",
    headerName: "Mobile No.",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, p1: any, mid: any, p2: any) =>
          `${p1}${"X".repeat(mid.length)}${p2}`,
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "sts",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bsda",
    headerName: "BSDA",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dlr",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "rm",
    headerName: "RM Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ph2",
    headerName: "Second Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "ph3",
    headerName: "Third Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "zn",
    headerName: "Zone",
    flex: 1,
    minWidth: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "m_desc",
    headerName: "Scheme Category",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  // {
  //   field: "module_Modified_date",
  //   headerName: "Module Modified Date",
  //   flex: 1,
  //   minWidth: 150,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  //   valueGetter: (params: any) => {
  //     const rawDate = params;
  //     if (!rawDate) return null; // Handle missing data

  //     const parsedDate = new Date(
  //       rawDate.replace(
  //         /(\d{2})-([A-Za-z]{3})-(\d{2})/,
  //         (_match: any, day: any, month: any, year: any) => {
  //           const monthMap: any = {
  //             Jan: "01",
  //             Feb: "02",
  //             Mar: "03",
  //             Apr: "04",
  //             May: "05",
  //             Jun: "06",
  //             Jul: "07",
  //             Aug: "08",
  //             Sep: "09",
  //             Oct: "10",
  //             Nov: "11",
  //             Dec: "12",
  //           };
  //           console.log(match);
  //           return `20${year}-${monthMap[month]}-${day}`;
  //         }
  //       )
  //     );

  //     return parsedDate;
  //   },
  //   sortComparator: (v1: any, v2: any) => {
  //     if (!v1 || !v2) return 0; // Handle missing values
  //     return v1 - v2; // Sort in ascending order
  //   },
  //   valueFormatter: (params: any) => {
  //     if (!params) return "";
  //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
  //   },
  // },
];

export const AmcContest: GridColDef[] = [
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dpid",
    headerName: "BOID",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ph1",
    headerName: "Primary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ph1_mob",
    headerName: "Mobile No.",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) =>
          `${prefix}${"X".repeat(middle.length)}${suffix}`,
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "sts",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bt",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "dlr",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => params || "-",
  },
  {
    field: "rm",
    headerName: "RM Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ph2",
    headerName: "Secondary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ph3",
    headerName: "Third Holder Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "zn",
    headerName: "Zone",
    flex: 1,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   field: "bal_Amount",
  //   headerName: "Balance Amount",
  //   flex: 1,
  //   minWidth: 120,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "right",
  //   headerClassName: "header-wrap-custom",
  //   valueFormatter: (params: any) => {
  //     const value = parseFloat(params); // Convert the value to a number
  //     return new Intl.NumberFormat("en-IN", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(value);
  //   },
  // },

  // {
  //   field: "module_No",
  //   headerName: "Module No",
  //   flex: 1,
  //   minWidth: 80,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  //   align: "center",
  // },
  // {
  //   field: "module_Description",
  //   headerName: "Scheme",
  //   flex: 1,
  //   minWidth: 160,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  // },
  {
    field: "m_nar",
    headerName: "Scheme Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sch",
    headerName: "Scheme Status ",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const AmcLedgerReport: GridColDef[] = [
  {
    field: "tradingCode",
    headerName: "Trading Code",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "boid",
    headerName: "BO ID",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "paymentAmount",
    headerName: "Payment Amount (₹)",
    type: "number",
    align: "center",
    headerAlign: "center",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    flex: 1.2,
    minWidth: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };

            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1: any, v2: any) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const clientMISColumns: GridColDef[] = [
  {
    field: "zc",
    headerName: "Zone Code",
    headerClassName: "header-wrap-custom",
    minWidth: 70,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    minWidth: 90,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ra",
    headerName: "RA Code",
    minWidth: 85,
    flex: 0.5,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    minWidth: 220,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "pn",
    headerName: "Partner Name",
    minWidth: 220,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "pc",
    headerName: "Partner Code",
    headerClassName: "header-wrap-custom",
    minWidth: 70,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "spip_rev",
    headerName: "Total SPIP Revenue",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    flex: 1,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "ps",
    headerName: "Partner Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 0.8,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "lkps",
    headerName: "LKP Share",
    headerClassName: "header-wrap-custom",
    minWidth: 90,
    flex: 0.8,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "brk_rev",
    headerName: "Total Brokerage Revenue",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    flex: 1.2,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "pbs",
    headerName: "Partner Brok. Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 1,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "lkpbs",
    headerName: "LKP Brok. Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 1,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "em",
    headerName: "Email ID",
    minWidth: 200,
    flex: 1.2,
    align: "left",
    headerAlign: "center",
    renderCell: (params: any) => {
      const email = params.value || "";
      const maskedEmail = email.replace(
        /^(.)(.*)(.@.*)$/,
        (_: any, firstChar: any, middleChars: any, domain: any) =>
          `${firstChar}${"x".repeat(middleChars.length)}${domain}`,
      );
      return (
        <Tooltip title={email} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "mob",
    headerName: "Mobile No",
    minWidth: 140,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) =>
          `${prefix}${"X".repeat(middle.length)}${suffix}`,
      );
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "rm",
    headerName: "RM Name",
    minWidth: 160,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
];

export const shortfallColumns: GridColDef[] = [
  {
    field: "Action",
    headerName: "Action",
    headerClassName: "header-wrap-custom",
    flex: 0.6,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 250,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "mca",
    headerName: "MTF Cash Collateral (A)",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
    disableColumnMenu: true,
  },
  {
    field: "msb",
    headerName: "MTF Share Collateral (B)",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
    disableColumnMenu: true,
  },
  {
    field: "nmc",
    headerName: "Net Margin Req (C)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
    disableColumnMenu: true,
  },
  {
    field: "mld",
    headerName: "MTM Loss (D)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 100,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
    disableColumnMenu: true,
  },
  {
    field: "mse",
    headerName: "Margin Short/Excess",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const value = parseFloat(params.value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return (
        <span
          style={{
            backgroundColor: "#f8caca",
            border: "1px solid #e57373",
            color: "#c62828",
            padding: "0px 10px",
            borderRadius: "16px",
            fontWeight: 500,
          }}
        >
          {value}
        </span>
      );
    },
  },
  {
    field: "tfa",
    headerName: "Total Funded Amt (E)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "glf",
    headerName: "Grp1 Ledger (F)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "msv",
    headerName: "MTF Share Market Value",
    flex: 1.2,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "mal",
    headerName: "Max Amount Limit",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 120,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "msa",
    headerName: "Max Scrip Amount",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 80,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "ip",
    headerName: "Interest %",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    minWidth: 80,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
];

export const ageingColumns: GridColDef[] = [
  // {
  //   field: "Action",
  //   headerName: "Action",
  //   headerClassName: "header-wrap-custom",
  //   flex: 0.6,
  //   minWidth: 60,
  //   align: "center",
  //   headerAlign: "center",
  // },
  {
    field: "zn",
    headerName: "Zone",
    headerClassName: "header-wrap-custom",
    flex: 0.6,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "ct",
    headerName: "Client Type",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.4,
    minWidth: 240,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "rmc",
    headerName: "RM Code",
    flex: 0.6,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "rmn",
    headerName: "RM Name",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dc",
    headerName: "Dealer Code",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dn",
    headerName: "Dealer Name",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "nseScrip",
    headerName: "NSE Scrip",
    flex: 0.8,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "bseScrip",
    headerName: "BSE Scrip",
    flex: 0.8,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "isin",
    headerName: "ISIN",
    flex: 1.2,
    minWidth: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "mtf",
    headerName: "MTF Funded",
    flex: 1,
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d30",
    headerName: "<= 30 Days",
    flex: 0.9,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d60",
    headerName: "<= 60 Days",
    flex: 0.9,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d88",
    headerName: "<= 70 Days",
    flex: 0.9,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d89",
    headerName: "<= 80 Days",
    flex: 0.9,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d90",
    headerName: "<= 90 Days",
    flex: 0.9,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "gt90",
    headerName: "> 90 Days",
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
];

export const vendorApprovalColumns: GridColDef[] = [
  {
    field: "vnm",
    headerName: "Vendor Name",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "cty",
    headerName: "City",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ste",
    headerName: "State",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "mob",
    headerName: "Mobile No",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "em",
    headerName: "Email ID",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "bnk",
    headerName: "Bank Name",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "actn",
    headerName: "A/C No",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "bdoc",
    headerName: "Bank Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pdoc",
    headerName: "Pan Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ifsc",
    headerName: "IFSC Code",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "tdsf",
    headerName: "TDS Flag",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  {
    field: "tdsp",
    headerName: "TDS Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "msmf",
    headerName: "MSME Flag",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  {
    field: "msmp",
    headerName: "MSME Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "app",
    headerName: "Approval Status",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "armk",
    headerName: "Account Remark",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cdt",
    headerName: "Created Date",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];

export const t6SellingReportColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    headerClassName: "header-wrap-custom",
    // flex: 0.8,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "bc",
    headerName: "Branch Code",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "bt",
    headerName: "Branch Type",
    align: "center",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "cc",
    headerName: "Client Code",
    align: "center",
    headerAlign: "center",
    minWidth: 100,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.5,
    align: "left",
    headerAlign: "center",
    minWidth: 200,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ex",
    headerName: "Exchange",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 75,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    width: 160,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const symbol = (params.row?.sym || "").trim();
      const series = (params.row?.sr || "").trim();
      return `${symbol} / ${series}`;
    },
  },
  {
    field: "rt",
    headerName: "Rate",
    align: "right",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const value = params.value;
      if (value === null || value === undefined || value === "") return "—";

      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    },
  },
  {
    field: "qt",
    headerName: "Quantity",
    align: "right",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const value = params.value;
      if (value === null || value === undefined || value === "") return "—";

      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    },
  },
  {
    field: "rmc",
    headerName: "RM Name & Code",
    flex: 1.5,
    align: "left",
    headerAlign: "center",
    minWidth: 180,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const rmName = (params.row?.rmn || "").trim();
      const rmCode = (params.row?.rmc || "").trim();

      if (!rmName && !rmCode) return "—";
      if (!rmName) return rmCode;
      if (!rmCode) return rmName;

      return `${rmName} - (${rmCode})`;
    },
  },
  {
    field: "dlc",
    headerName: "Dealer Name & Code",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const dealerName = (params.row?.dln || "").trim();
      const dealerCode = (params.row?.dlc || "").trim();

      if (!dealerName && !dealerCode) return "—";
      if (!dealerName) return dealerCode;
      if (!dealerCode) return dealerName;

      return `${dealerName} - (${dealerCode})`;
    },
  },
];

export const regMasterColumns: GridColDef[] = [
  {
    field: "ex",
    headerName: "Exchange",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "sc",
    headerName: "Scrip Code",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "sym",
    headerName: "Symbol",
    flex: 1.2,
    minWidth: 160,
    align: "left",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "gsm",
    headerName: "GSM",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "irp",
    headerName: "IRP",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "uns",
    headerName: "UnsolicitedSMS",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "smp",
    headerName: "SocialMediaPlatforms",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "mmp",
    headerName: "Mandatory Market Period",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "uz",
    headerName: "Z Group",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "ssn",
    headerName: "SME Scrip NonRegtraded",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
];

export const AmcZoneReportDirect: GridColDef[] = [
  {
    field: "emp",
    headerName: "Employee Code",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "emp_nm",
    headerName: "Employee Name",
    flex: 1.5,
    minWidth: 160,
    align: "left",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "cunl",
    headerName: "Code Under Non Lifetime",
    flex: 1,
    minWidth: 160,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "sub",
    headerName: "Submitted",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => params.value ?? 0,
  },
  {
    field: "cmp",
    headerName: "Completed",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => params.value ?? 0,
  },
  {
    field: "inc",
    headerName: "Incentive Earned",
    flex: 1,
    minWidth: 140,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value !== undefined && params.value !== null
        ? params.value.toLocaleString()
        : "0",
  },
];

export const AmcZoneReportIndirect: GridColDef[] = [
  {
    field: "emp",
    headerName: "Partner Code",
    flex: 1,
    minWidth: 120,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "emp_nm",
    headerName: "Partner Name",
    flex: 1.5,
    minWidth: 160,
    disableColumnMenu: true,
    align: "left",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  ...AmcZoneReportDirect.filter(
    (col) => col.field !== "emp" && col.field !== "emp_nm",
  ),
];

export const DPTransactionColumns: GridColDef[] = [
  {
    field: "zn", // zone
    headerName: "Zone",
    flex: 0.5,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "br", // branch
    headerName: "Branch",
    flex: 0.5,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bt", // branchType
    headerName: "Branch Type",
    flex: 0.7,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "cid", // clientId
    headerName: "Client ID",
    flex: 1,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "dpid", // dP_ID
    headerName: "DP ID",
    flex: 1,
    minWidth: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "cn", // clientName
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "sch_nm", // schemeName
    headerName: "Scheme Name",
    flex: 1,
    minWidth: 120,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },

  {
    field: "req_dt", // requestDate
    headerName: "Request Date",
    flex: 1,
    minWidth: 180,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },

  {
    field: "sch", // schemeStatus
    headerName: "Scheme Status",
    flex: 0.8,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },

  {
    field: "ord", // order_Id
    headerName: "Order ID",
    flex: 0.5,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },

  {
    field: "amt", // amount
    headerName: "Amount",
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const value = params.value;
      return value?.toLocaleString("en-IN");
    },
  },
  {
    field: "pt", // amount
    headerName: "Payment Type",
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "downloadAMC",
    headerName: "Esign File",
    flex: 0.7,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];

export const pledgeReportColumns: GridColDef[] = [
  {
    field: "ucc",
    headerName: "UCC",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 120,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "symbol",
    headerName: "Symbol",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    flex: 1,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "isin",
    headerName: "ISIN",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 180,
    flex: 1.2,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "pledgeQuantity",
    headerName: "Pledge Quantity",
    headerClassName: "header-wrap-custom",
    align: "right",
    headerAlign: "center",
    minWidth: 130,
    renderCell: (params) => {
      const value = params.value;

      // Handle empty/null/undefined
      if (value === null || value === undefined || value === "") {
        return "—";
      }

      // Format the number with Indian locale and 2 decimal places
      const formattedValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));

      return formattedValue;
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 110,
    renderCell: (params) => {
      const value = params.value?.toString().trim() || "";
      return value ? value : "—";
    },
  },
  {
    field: "lastUpdate",
    headerName: "Last Updated",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 180,
    flex: 1.2,
    renderCell: (params) => {
      const value = params.value;
      return value ? value : "—";
    },
  },
  {
    field: "value",
    headerName: "Amount",
    headerClassName: "header-wrap-custom",
    align: "right",
    headerAlign: "center",
    minWidth: 180,
    flex: 1.2,

    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "prfnumber",
    headerName: "PRF Number",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 180,
    flex: 1.2,
    renderCell: (params) => {
      const value = params.value;
      return value ? value : "—";
    },
  },
  {
    field: "pledgorintref",
    headerName: "PledgeOrIntRef",
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    minWidth: 180,
    flex: 1.2,
    renderCell: (params) => {
      const value = params.value;
      return value ? value : "—";
    },
  },
];

export const MTFStockAgeingColumns: GridColDef[] = [
  // {
  //   field: "clientcode",
  //   headerName: "Client Code",
  //   flex: 1,
  //   minWidth: 120,
  //   align: "center",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   renderCell: (params) => params.value || "—",
  // },
  // {
  //   field: "clientname",
  //   headerName: "Client Name",
  //   flex: 1.5,
  //   minWidth: 220,
  //   align: "left",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   renderCell: (params) => params.value || "—",
  // },
  {
    field: "sc",
    headerName: "NSE Scrip",
    flex: 1,
    minWidth: 140,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "isin",
    headerName: "ISIN",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "—",
  },
  {
    field: "qty",
    headerName: "Quantity",
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value !== undefined ? params.value.toLocaleString() : "0",
  },
  {
    field: "fa",
    headerName: "Funding Amount",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value
        ? params.value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00",
  },
  {
    field: "mr",
    headerName: "Market Rate",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => params.value ?? "0",
  },
  {
    field: "var",
    headerName: "VAR %",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value !== undefined ? params.value.toFixed(2) + "%" : "—",
  },
  {
    field: "elm",
    headerName: "ELM %",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value !== undefined ? params.value.toFixed(2) + "%" : "—",
  },
  {
    field: "mp",
    headerName: "Margin %",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) =>
      params.value !== undefined ? params.value.toFixed(2) + "%" : "—",
  },
  {
    field: "td",
    headerName: "Trade Date",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null;

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (_: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            return `20${year}-${monthMap[month]}-${day}`;
          },
        ),
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0;
      return v1 - v2;
    },
    valueFormatter: (params: any) =>
      params ? dayjs(params).format("DD-MMM-YY") : "",
  },
  {
    field: "dy",
    headerName: "Days",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 70,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => params.value ?? "0",
  },
];

export const extendedAmcReport: GridColDef[] = [
  {
    field: "id",
    headerName: "Sr. No.",
    flex: 1,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "dpid",
    headerName: "DP ID",
    flex: 1,
    minWidth: 180,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ph1",
    headerName: "Primary Holder",
    flex: 1.5,
    minWidth: 220,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "sch_nm",
    headerName: "Scheme Name",
    flex: 1.2,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
];

export const apGrossBrokerageColumns: GridColDef[] = [
  {
    field: "apc",
    headerName: "AP Code",
    minWidth: 200,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "apn",
    headerName: "AP Name",
    flex: 1,
    minWidth: 50,
    align: "left",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },

  // Q1
  {
    field: "q1",
    headerName: "Q1 Gross Brokerage",
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },

  // Q2
  {
    field: "q2",
    headerName: "Q2 Gross Brokerage",
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },

  // Q3
  {
    field: "q3",
    headerName: "Q3 Gross Brokerage",
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },

  // Q4
  {
    field: "q4",
    headerName: "Q4 Gross Brokerage",
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },
];

export const formatNumber = (value: any) => {
  if (value == null || value === "") return "—";

  const num = Number(value);

  if (Number.isNaN(num)) return value;

  return Math.round(num).toLocaleString("en-IN");
};

export const expiryContestReward: GridColDef[] = [
  {
    field: "noOfLots",
    headerName: "Min No of Lots",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },
  {
    field: "minBrok",
    headerName: "Min Brokerage",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => formatNumber(params.value),
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
  },
  {
    field: "giftVoucher",
    headerName: "Gift Voucher",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];
export const RHexpiryContestReward: GridColDef[] = [
  {
    field: "criteria",
    headerName: "Criteria",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  ...expiryContestReward,
];
export const expiryContestCriteria: GridColDef[] = [
  {
    field: "da",
    headerName: "Day",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "inde",
    headerName: "Index",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "Instumen",
    headerName: "Instrument",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const todaysContestProgress: GridColDef[] = [
  {
    field: "day",
    headerName: "Day",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "index",
    headerName: "Index",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "instrument",
    headerName: "Instrument",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "noOfLots",
    headerName: "No of Lots",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.noOfLots >= 100;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "minBrokerage",
    headerName: "Brokerage",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.minBrokerage >= 5000;
      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.uniqueClients >= 5;
      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "qualified",
    headerName: "Qualified",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "prize",
    headerName: "Gift Voucher",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];
export const expiryContestHistory: GridColDef[] = [
  {
    field: "ExpiryDate",
    headerName: "Expiry Date",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      if (!params.value) return ""; // safety check
      const date = new Date(params.value);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "day",
    headerName: "Day",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "index",
    headerName: "Index",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "instrument",
    headerName: "Instrument",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "noOfLots",
    headerName: "No of Lots",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.noOfLots >= 100;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "minBrokerage",
    headerName: "Brokerage",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.minBrokerage >= 5000;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.uniqueClients >= 5;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "qualified",
    headerName: "Qualified",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "prize",
    headerName: "Gift Voucher",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];

export const RHexpiryContestHistory: GridColDef[] = [
  {
    field: "ExpiryDate",
    headerName: "Expiry Date",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      if (!params.value) return ""; // safety check
      const date = new Date(params.value);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "day",
    headerName: "Day",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "index",
    headerName: "Index",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "zone",
    headerName: "Zone",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "instrument",
    headerName: "Instrument",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "noOfLots",
    headerName: "No of Lots",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.noOfLots >= 500;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "minBrokerage",
    headerName: "Brokerage",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.minBrokerage >= 50000;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.uniqueClients >= 20;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "qualified",
    headerName: "Qualified",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "prize",
    headerName: "Gift Voucher",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];
export const RHtodaysContestProgress: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "day",
    headerName: "Day",
    disableColumnMenu: true,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "index",
    headerName: "Index",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "instrument",
    headerName: "Instrument",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "noOfLots",
    headerName: "No of Lots",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.noOfLots >= 500;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "minBrokerage",
    headerName: "Brokerage",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.minBrokerage >= 50000;
      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.uniqueClients >= 20;
      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "qualified",
    headerName: "Qualified",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "prize",
    headerName: "Gift Voucher",
    disableColumnMenu: true,
    flex: 1,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];
export const employeesContestProgress: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 0.8,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "empName",
    headerName: "Employee Name",
    flex: 1.8,
    minWidth: 180,
    align: "left",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "noOfLots",
    headerName: "No of Lots",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.noOfLots >= 100;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "minBrokerage",
    headerName: "Brokerage",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.minBrokerage >= 5000;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "uniqueClients",
    headerName: "Unique Clients",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const isQualified = params.row?.uniqueClients >= 5;

      return (
        <div
          style={{
            backgroundColor: isQualified ? "#b1edbf" : "transparent",
          }}
        >
          {formatNumber(params.value)}
        </div>
      );
    },
  },
  {
    field: "qualified",
    headerName: "Qualified",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "prize",
    headerName: "Gift Voucher",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: ({ value }) => {
      // null / undefined / empty
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // string-based NA checks (NA, N/A, n/a, na, etc.)
      if (typeof value === "string") {
        if (typeof value === "string" && value.toUpperCase().includes("N")) {
          return "-";
        }
      }
      return value;
    },
  },
];
export const employeesContestHistory: GridColDef[] = [
  {
    field: "ExpiryDate",
    headerName: "Expiry Date",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    renderCell: (params) => {
      if (!params.value) return ""; // safety check
      const date = new Date(params.value);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "index",
    headerName: "Index",
    flex: 1,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  ...employeesContestProgress,
];

export const brokerageWiseColumns: GridColDef[] = [
  {
    field: "tradeDate",
    headerName: "Trade Date",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      if (!params.value) return "-";

      return new Date(params.value)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
  {
    field: "branchCode",
    headerName: "Branch",
    flex: 0.7,
    minWidth: 110,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    flex: 0.7,
    minWidth: 130,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "branchName",
    headerName: "Branch Name",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => params.value || "-",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 250,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "eQ_Brok",
    headerName: "EQ Brokerage",
    flex: 1,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "fnO_Brok",
    headerName: "F&O Brokerage",
    flex: 1,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "comm_Brok",
    headerName: "Commodity Brokerage",
    flex: 1,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "slbM_Brok",
    headerName: "SLBM Brokerage",
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "total_Brok",
    headerName: "Total Brokerage",
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "apSharing_Brok",
    headerName: "AP Sharing Brokerage",
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
  {
    field: "neT_To_LKP_Brok",
    headerName: "LKP Share",
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(params)),
  },
];
export const ClientMandateColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 80,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchcode",
    headerName: "Branch",
    minWidth: 100,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 120,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 220,
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "boId",
    headerName: "BO ID",
    minWidth: 180,
    flex: 1.2,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "mandateAmount",
    headerName: "Mandate Amount",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "mandateStatus",
    headerName: "Status",
    minWidth: 120,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "umn",
    headerName: "UMN",
    minWidth: 260,
    flex: 2,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];

export const mandateExecutionColumns: GridColDef[] = [
  {
    field: "clientcode",
    headerName: "Client Code",
    minWidth: 120,
    flex: 1,
  },
  {
    field: "dpCode",
    headerName: "DP Code",
    minWidth: 200,
    flex: 1.5,
  },
  {
    field: "executionAmount",
    headerName: "Execution Amount",
    minWidth: 150,
    flex: 1,
    type: "number",
    align: "right",
    headerAlign: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "ExecutionDate",
    headerName: "Execution Date",
    minWidth: 180,
    flex: 1.2,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "custRefNo",
    headerName: "Customer Ref No",
    minWidth: 180,
    flex: 1.3,
  },
  {
    field: "downloadJVReceipt",
    headerName: "Receipt",
    minWidth: 130,
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value === "YES" ? (
        <span style={{ color: "green", fontWeight: 500 }}>{params.value}</span>
      ) : (
        <span style={{ color: "red", fontWeight: 500 }}>{params.value}</span>
      ),
  },
];

export const MandateTab3Columns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 80,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchCode",
    headerName: "Branch",
    minWidth: 100,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1.5,
    disableColumnMenu: true,
  },
  {
    field: "dpCode",
    headerName: "DP Code",
    minWidth: 200,
    flex: 1.5,
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    minWidth: 150,
    flex: 1,
    type: "number",
    align: "right",
    headerAlign: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    disableColumnMenu: true,
  },
  {
    field: "CreatedOn",
    headerName: "Created On",
    minWidth: 180,
    flex: 1.2,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "custRefno",
    headerName: "Customer Ref No",
    minWidth: 180,
    flex: 1.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  // {
  //   field: "receipt",
  //   headerName: "Receipt",
  //   minWidth: 130,
  //   flex: 1,
  //   align: "center",
  //   headerAlign: "center",
  //   renderCell: () => (
  //     <span style={{ color: "green", fontWeight: 500 }}>Download</span>
  //   ),
  // },
];

export const contestSPIP: GridColDef[] = [
  // {
  //   field: "rmc",
  //   headerName: "RM Code",
  //   flex: 1,
  //   align: "center",
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  //   renderCell: (params) => params.value || "—",
  // },
  // {
  //   field: "rmn",
  //   headerName: "RM Name",
  //   flex: 2,
  //   headerClassName: "header-wrap-custom",
  //   renderCell: (params) => params.value || "—",
  // },
  // {
  //   field: "br",
  //   headerName: "Branch",
  //   flex: 0.8,
  //   align: "center",
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  // },
  // {
  //   field: "brn",
  //   headerName: "Branch Name",
  //   flex: 2,
  //   headerClassName: "header-wrap-custom",
  // },
  {
    field: "cc",
    headerName: "RA Code",
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.6,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  // {
  //   field: "my",
  //   headerName: "Month",
  //   flex: 0.9,
  //   align: "center",
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  // },
  {
    field: "sid",
    headerName: "Start Date",
    flex: 1.2,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "eid",
    headerName: "End Date",
    flex: 1.2,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "prd",
    headerName: "Payment Date",
    flex: 1.3,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "sf",
    headerName: "Subscription Fees (Excl. GST)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    renderCell: (params) => formatNumber(params.value),
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "dr",
    headerName: "Duration Month",
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => formatNumber(params.value),
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];
export const SPIPContestReport: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.7,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ec",
    headerName: "Code",
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "en",
    headerName: "Name",
    flex: 2,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "tc",
    headerName: "Total Client",
    flex: 1,
    headerClassName: "header-wrap-custom",
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "ta",
    headerName: "Total Amount",
    flex: 1,
    headerClassName: "header-wrap-custom",
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        // minimumFractionDigits: 2,
        // maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const mtfAgeingEmailColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.6,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "bc",
    headerName: "Branch Code",
    flex: 0.8,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "emailId",
    headerName: "Email",
    flex: 0.8,
    minWidth: 240,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => params.value.toLowerCase() || "—",
  },
  {
    field: "ct",
    headerName: "Client Type",
    flex: 0.8,
    minWidth: 110,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1.4,
    minWidth: 220,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "rmc",
    headerName: "RM Code",
    flex: 0.7,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "rmn",
    headerName: "RM Name",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "dc",
    headerName: "Dealer Code",
    flex: 0.7,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "dn",
    headerName: "Dealer Name",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "mtf",
    headerName: "MTF Funded",
    flex: 1,
    minWidth: 160,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d30",
    headerName: "≤ 30 Days",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d60",
    headerName: "≤ 60 Days",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d88",
    headerName: "≤ 88 Days",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d89",
    headerName: "≤ 89 Days",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "d90",
    headerName: "≤ 90 Days",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "gt90",
    headerName: "> 90 Days",
    flex: 1,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
];

export const scripMasterColumns: GridColDef[] = [
  {
    field: "action",
    headerName: "Actions",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "isin",
    headerName: "ISIN",
    flex: 1,
    minWidth: 140,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "scpnm",
    headerName: "Scrip Name",
    flex: 1.8,
    minWidth: 250,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "isact",
    headerName: "Status",
    flex: 0.8,
    minWidth: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <span
        style={{
          color: params.value ? "#16a34a" : "#dc2626",
          fontWeight: 600,
        }}
      >
        {params.value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export const unlistedContractColumns: GridColDef[] = [
  {
    field: "rmc",
    headerName: "RM Code",
    width: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "tdt",
    headerName: "Transaction Date",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // valueFormatter: (value: any) => {
    //   if (!value) return "—";

    //   const [datePart] = value.split(" "); // "02/04/2026"
    //   const [month, day, year] = datePart.split("/"); // MM/DD/YYYY

    //   const date = new Date(Number(year), Number(month) - 1, Number(day));

    //   const dd = String(date.getDate()).padStart(2, "0");
    //   const mmm = date.toLocaleString("en-US", { month: "short" });
    //   const yy = String(date.getFullYear()).slice(-2);

    //   return `${dd}-${mmm}-${yy}`;
    // },
  },
  {
    field: "cn",
    headerName: "Client Name",
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "bnknm",
    headerName: "Bank Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: ({ value }) => value || "—",
  },
  {
    field: "accno",
    headerName: "Bank Acc No",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: ({ value }) => value || "—",
  },
  {
    field: "ifsc",
    headerName: "IFSC Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "dpnm",
    headerName: "DP Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "dpid",
    headerName: "DP Id",
    width: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "paym",
    headerName: "Payment Mode",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "nsec",
    headerName: "Securities Name",
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "nsh",
    headerName: "No. of Shares",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "crt",
    headerName: "Client Rate",
    width: 120,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "vrt",
    headerName: "Vendor Rate",
    width: 120,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "lcps",
    headerName: "LKP Commission/Share",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "big",
    headerName: "Brokerage (Incl. GST)",
    width: 160,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "gst",
    headerName: "GST",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "beg",
    headerName: "Brokerage (Excl. GST)",
    width: 170,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "sbr",
    headerName: "SubBroker Rate",
    width: 130,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "sbc",
    headerName: "SubBroker Code",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "sbcm",
    headerName: "SubBroker Commission",
    width: 170,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "nbg",
    headerName: "Net Brokerage",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  // {
  //   field: "rmk",
  //   headerName: "Remark",
  //   minWidth: 180,
  //   flex: 1,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  //   renderCell: ({ value }) => value || "—",
  // },
  // {
  //   field: "sts",
  //   headerName: "Status",
  //   minWidth: 150,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  //   renderCell: ({ value }) => value || "—",
  // },
];

export const stopLossTrilogyColumns: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "pan",
    headerName: "PAN",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "emailId",
    headerName: "Email ID",
    flex: 1,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "monthName",
    headerName: "Month",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const stopLossSPIPColumns: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "pan",
    headerName: "PAN",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "emailId",
    headerName: "Email ID",
    flex: 1,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
];

export const stopLossColumns: GridColDef[] = [
  {
    field: "serialNo",
    headerName: "Serial No",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "symbol",
    headerName: "Symbol",
    width: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "stoplossPrice",
    headerName: "Stoploss Price",
    width: 150,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "targetPrice",
    headerName: "Target Price",
    width: 150,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "buyPrice",
    headerName: "Buy Price",
    width: 150,
    headerAlign: "center",
    align: "right",
  },
];

export const pendingBankAccountColumns: GridColDef[] = [
  {
    field: "action",
    headerName: "Action",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "MemberName",
    headerName: "Member Name",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BankAccountName",
    headerName: "Bank Account Name",
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BankAccountNumber",
    headerName: "Account Number",
    width: 170,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "IFSCCode",
    headerName: "IFSC Code",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Purpose",
    headerName: "Purpose",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "AccountType",
    headerName: "Account Type",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Division",
    headerName: "Division",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "OpeningDate",
    headerName: "Opening Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "ClosingDate",
    headerName: "Closing Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  // {
  //   field: "RequestedBy",
  //   headerName: "Requested By",
  //   width: 130,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  // {
  //   field: "RequestedDate",
  //   headerName: "Requested Date",
  //   width: 170,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  //   valueFormatter: (params: any) => {
  //     if (!params) return "";
  //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
  //   },
  // },
  // {
  //   field: "Status",
  //   headerName: "Status",
  //   width: 120,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
];

export const ApprovalBankAccountColumns: GridColDef[] = [
  {
    field: "status",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "MemberName",
    headerName: "Member Name",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BankAccountName",
    headerName: "Bank Account Name",
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BankAccountNumber",
    headerName: "Account Number",
    width: 170,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "IFSCCode",
    headerName: "IFSC Code",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Purpose",
    headerName: "Purpose",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "AccountType",
    headerName: "Account Type",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Division",
    headerName: "Division",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "OpeningDate",
    headerName: "Opening Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "ClosingDate",
    headerName: "Closing Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const MTFFundYieldColumns: GridColDef[] = [
  {
    field: "clientcode",
    headerName: "Client Code",
    width: 110,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientname",
    headerName: "Client Name",
    minWidth: 210,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "branchcode",
    headerName: "Branch Code",
    width: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "zone",
    headerName: "Zone",
    width: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    width: 110,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "mtfFundedAmt",
    headerName: "MTF Funded Amount",
    width: 120,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "mtfInterest",
    headerName: "MTF Interest",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "debitFundAmt",
    headerName: "Debit Fund Amount",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "debitInterest",
    headerName: "Debit Interest",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "shortmgnFundedAmt",
    headerName: "Short Margin Funded Amount",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "shortMarginInterest",
    headerName: "Short Margin Interest",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "totalFundAmt",
    headerName: "Total Fund Amount",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "totalInterestAmt",
    headerName: "Total Interest Amount",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "brokerage",
    headerName: "Brokerage",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "subBrokerage",
    headerName: "Sub Brokerage",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "netBrokerage",
    headerName: "Net Brokerage",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "totalIncome",
    headerName: "Total Income",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) =>
      Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    field: "yieldPerc",
    headerName: "Yield (%)",
    width: 110,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (value: any) => `${Number(value ?? 0).toFixed(2)}%`,
  },
];

export const BankAccReportColumns: GridColDef[] = [
  // {
  //   field: "ApprovalStatus",
  //   headerName: "Remark",
  //   minWidth: 200,
  //   flex: 2,
  //   headerAlign: "center",
  //   renderCell: (params: any) => {
  //     const status = params.value?.toLowerCase() || "";
  //     console.log("Statusass", status);

  //     let backgroundColor = "#cfd8dc"; // Default neutral
  //     let color = "#263238";
  //     let border = "1px solid #b0bec5";

  //     if (status.includes("approve")) {
  //       backgroundColor = "#a5d6a7"; // Light green
  //       color = "#1b5e20";
  //       border = "1px solid #81c784";
  //     } else if (status.includes("pending")) {
  //       backgroundColor = "#FFF4E5"; // Soft peach / beige
  //       color = "#FF9800"; // Warm orange (not too saturated)
  //       border = "1px solid #FFB74D"; // Light orange border
  //     } else if (status.includes("reject") || status.includes("reject")) {
  //       backgroundColor = "#ef9a9a"; // Light red
  //       color = "#b71c1c";
  //       border = "1px solid #e57373";
  //     }

  //     return (
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           height: "100%",
  //           width: "100%",
  //           fontFamily: "Public Sans",
  //         }}
  //       >
  //         <div
  //           style={{
  //             backgroundColor,
  //             color,
  //             border,
  //             borderRadius: "999px",
  //             padding: "3px 6px",
  //             fontSize: "11px",
  //             fontWeight: 600,
  //             // textTransform: "capitalize",
  //             whiteSpace: "nowrap",
  //             display: "inline-block",
  //             textAlign: "center",
  //             minWidth: "160px",
  //             lineHeight: "1",
  //           }}
  //         >
  //           {params.value}
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  {
    field: "ApprovalStatus",
    headerName: "Approval",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      params.value === "R"
        ? "Rejected"
        : params?.value === "A"
          ? "Approved"
          : "",
  },
  {
    field: "MemberName",
    headerName: "Member Name",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "BankAccountName",
    headerName: "Bank Name",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "BankAccountNumber",
    headerName: "Account Number",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "right",
  },

  {
    field: "IFSCCode",
    headerName: "IFSC Code",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "Purpose",
    headerName: "Purpose",
    minWidth: 120,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "AccountType",
    headerName: "Account Type",
    minWidth: 150,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },

  {
    field: "Status",
    headerName: "Status",
    minWidth: 100,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "OpeningDate",
    headerName: "Opening Date",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YYYY");
    },
  },

  {
    field: "ClosingDate",
    headerName: "Closing Date",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YYYY");
    },
  },

  {
    field: "Division",
    headerName: "Division",
    minWidth: 120,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  // {
  //   field: "AccApproval",
  //   headerName: "Approval",
  //   minWidth: 100,
  //   flex: 0.7,
  //   align: "center",
  //   headerAlign: "center",
  // },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export const PartnerOnboardingDetails: GridColDef[] = [
  // {
  //   field: "id",
  //   headerName: "Sr. No",
  //   width: 90,
  //   flex: 1,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  {
    field: "applNo",
    headerName: "App. No.",
    width: 100,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "aP_Name",
    headerName: "Name of Prospect",
    flex: 1.1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "date",
    headerName: "Date",
    width: 140,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY");
    },
  },
  {
    field: "referralName",
    headerName: "Referred By",
    flex: 1.4,
    minWidth: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "city",
    headerName: "City",
    width: 130,
    headerAlign: "center",
    align: "left",
    flex: 0.8,
    disableColumnMenu: true,
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "partnerType",
    headerName: "Partner Type",
    width: 150,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "applStatus",
    headerName: "Status",
    width: 130,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "Download Documents",
    headerName: "Download",
    width: 130,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "stage",
    headerName: "Track Application",
    width: 130,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];

export const ParOnbPartnerSharing: GridColDef[] = [
  {
    field: "segment",
    headerName: "Segment",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    editable: false,
  },
  {
    field: "apshare",
    headerName: "AP Share (%)",
    minWidth: 110,
    headerAlign: "center",
    align: "center",
    flex: 1,
    disableColumnMenu: true,
    renderCell: (params) => {
      const isDisabled = params.row.segment === "SLBM";

      return (
        <span
          style={{
            opacity: isDisabled ? 0.5 : 1,
            pointerEvents: isDisabled ? "none" : "auto",
          }}
        >
          {params.value != null ? `${params.value}%` : "-"}
        </span>
      );
    },
  },
  {
    field: "lkpShare",
    headerName: "LKP Share (%)",
    minWidth: 110,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => {
      const isDisabled = params.row.segment === "SLBM";

      return (
        <span style={{ opacity: isDisabled ? 0.5 : 1 }}>
          {params.value != null ? `${params.value}%` : "-"}
        </span>
      );
    },
  },
  {
    field: "minRetention",
    headerName: "Minimum Retention",
    minWidth: 130,
    headerClassName: "header-wrap-custom",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => {
      const isDisabled = params.row.segment === "SLBM";

      return (
        <span style={{ opacity: isDisabled ? 0.5 : 1 }}>
          {params.value != null ? `${params.value}` : "-"}
        </span>
      );
    },
  },
];

export const ParOnPaymentexchangeColumns: GridColDef[] = [
  {
    field: "exchangeName",
    headerName: "Exchange Charges",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "segmentName",
    headerName: "Segments",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "gst",
    headerName: "GST",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "total",
    headerName: "Total",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];
export const ParOnPaymentOthers: GridColDef[] = [
  {
    field: "exchangeName",
    headerName: "Others",
    flex: 1,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "total",
    headerName: "Proposed Total",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "Edit",
    headerName: "Edit",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "revisedTotal",
    headerName: "Revised Total",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) =>
      typeof params === "number" && !isNaN(params)
        ? new Intl.NumberFormat("en-IN").format(params)
        : params,
  },

  {
    field: "attachment",
    headerName: "Attachment",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "remark",
    headerName: "Remark",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];
export const PaymentOtherConditionData: GridColDef[] = [
  {
    field: "exchangeName",
    headerName: "Others",
    flex: 1,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "segmentName",
    headerName: "Segment Name",
    flex: 1,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },

  {
    field: "fileName",
    headerName: "Attachment",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "remarks",
    headerName: "Remark",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },

  {
    field: "amount",
    headerName: "Proposed Total",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "revisedTotal",
    headerName: "Revised Total",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];

export const ApDocsDownload: GridColDef[] = [
  {
    field: "applNo",
    headerName: "App. No.",
    width: 100,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "aP_Name",
    headerName: "Name of Prospect",
    flex: 1.1,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "date",
    headerName: "Date",
    width: 140,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY");
    },
  },
  {
    field: "referralName",
    headerName: "Referred By",
    flex: 1.4,
    minWidth: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "city",
    headerName: "City",
    width: 130,
    headerAlign: "center",
    align: "left",
    flex: 0.8,
    disableColumnMenu: true,
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "partnerType",
    headerName: "Partner Type",
    width: 150,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
];

export const T6SellingDetailReportColumns: GridColDef[] = [
  {
    field: "zn",
    headerName: "Zone",
    flex: 0.6,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "bc",
    headerName: "Branch Code",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "bt",
    headerName: "Branch Type",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "cn",
    headerName: "Client Name",
    // flex: 1.6,
    minWidth: 210,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cc",
    headerName: "Client Code",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },

  {
    field: "ex",
    headerName: "Exchange",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 85,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
    disableColumnMenu: true,
  },
  {
    field: "rmc",
    headerName: "RM Code",
    minWidth: 80,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "dlc",
    headerName: "Dealer Code",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "me",
    headerName: "Multiple Of Excess",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "per",
    headerName: "Extra Selling Perc",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ag",
    headerName: "T6 Ageing Value",
    flex: 1,
    minWidth: 160,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "ss",
    headerName: "T6 Selling StockValue",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "pre",
    headerName: "Pre Excess/Deficit",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "po",
    headerName: "Post Excess/Deficit",
    flex: 0.9,
    minWidth: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "act",
    headerName: "Active",
    flex: 0.9,
    minWidth: 130,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "poa",
    headerName: "POA",
    flex: 0.9,
    minWidth: 130,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "nri",
    headerName: "NriFlag",
    flex: 0.9,
    minWidth: 130,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "rmn",
    headerName: "RM Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "dln",
    headerName: "Dealer Name",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
];

export const SLBMClientResponseColumns: GridColDef[] = [
  {
    field: "BranchCode",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ClientType",
    headerName: "Client Type",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "SLBM_Status",
    headerName: "SLBM Status",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "ClientStatus",
    headerName: "Client Status",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "EmailID",
    headerName: "Email ID",
    flex: 1.5,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "HoldingValue",
    headerName: "Holding Value",
    flex: 1.5,
    minWidth: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
  {
    field: "RMName",
    headerName: "RM Name",
    flex: 1.5,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "DealerName",
    headerName: "Dealer Name",
    flex: 1.5,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },
];

export const SLBMPositionResponseColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "branchcode",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "branchname",
    headerName: "Branch Name",
    flex: 1.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "branchtype",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "clientcode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "clientname",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "positionDate",
    headerName: "Position Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "symbol",
    headerName: "Symbol",
    flex: 1.5,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "expirydate",
    headerName: "Expiry Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "lenderqty",
    headerName: "Lender Qty",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },

  {
    field: "borrowerqty",
    headerName: "Borrower Qty",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(params)),
  },
];
