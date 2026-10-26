import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DropDown from "./customDropDown";
import * as TableColumns from "../../helper/tableColumns";
// import { Box, Button } from "@mui/material";
import SearchAppBar from "../../components/common/SearchBar";
import "../../pages/ClientDetails/style.css";
import EmailIcon from "@mui/icons-material/Email";
import CustomModal from "./DPModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InfoIcon from "@mui/icons-material/Info";
// import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface Trade {
  id: string;
  date: string;
  category: string;
  scriptName: string;
  rr: string; // Risk-Reward ratio
  timeFrame: string;
  status: string;
  analyst: string;
}

interface SelectedWidgetProps {
  selectedWidget?: string;
  T6Data?: any;
  getUserDetails?: (value: any, dis?: any) => void;
  handleExcel?: (value: any) => void;
  apiStatus?: boolean;
  activeGroupedClients?: any;
  inactiveGroupedClients?: any;
  showSearch?: any;
  handleSearchBasedOnInput?: (value: string) => void;
  handleSearchUser?: () => void;
  customHide?: any;
  searchValue?: any;
  tradeCWCBData?: any;
  handleEmailSend?: (
    Payment_link: string,
    EnCAccountCode: string,
    setEmailSent: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  emailSent?: boolean;
  emailSentStatus?: any;
  activeSubItem?: any;
  showExcel?: any;
  handleExcelDownload?: () => void;
  handleEditClick?: (data: any, editCheck: boolean) => void;
  handleDeleteClick?: (data: any) => void;
  handleApproval?: any;
  handleDownload?: any;
  totalCount?: any;
  activeClient?: any;
  inactiveClient?: any;
  totalLedgerDebitAmt?: any;
  dormantCount?: any;
  getRowHeight?: any;
  customCss?: boolean;
  activeMenu?: any;
  onFileUpload?: (selectedRow: string, file: File, remark: string) => void;
  getUserBrokergageModificationDetails?: any;
  previewUrl?: any;
  setSetShowImg?: any;
  showDocument?: boolean;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  setShowDocument?: any;
  fileExtension?: any;
  reportType?: string;
  onRowSelectionModelChange?: any;
  handleVerifyDetails?: any;
  isBankVerified?: any;
  setIsNudgeTableOpen?: any;
  setSegmentRow?: any;
  setIsBankVerified?: any;
  beneficiaryName?: any;
  // handleUpdate?: (data: any) => void;
  onViewAmcDetails?: (row: any) => void;
  handleMTFRow?: (row: any, field: any) => void;

  onStatusClick?: (row: any, type: string) => void;
  selectedTab?: any;
  handleDownloadExcel?: () => void;
  isCustomBtn?: any;
  handleContractMailClick?: () => void;
  onView?: (row: any) => void;
  tabValue?: any;
  editRowAccess?: boolean;
  setRows?: any;
  handleClientCountClick?: (row: any) => void;
}

const DataTable = ({
  getRowHeight,
  selectedWidget,
  T6Data,
  getUserDetails,
  // handleExcel,
  // apiStatus,
  activeGroupedClients,
  inactiveGroupedClients,
  handleSearchBasedOnInput,
  handleSearchUser,
  showSearch = false,
  customHide,
  searchValue,
  tradeCWCBData,
  emailSentStatus,
  activeSubItem,
  showExcel,
  handleExcelDownload,
  handleEditClick,
  handleApproval,
  onStatusClick,
  handleDownload,
  totalCount,
  activeClient,
  inactiveClient,
  handleDeleteClick,
  totalLedgerDebitAmt,
  dormantCount,
  customCss,
  activeMenu,
  onFileUpload,
  getUserBrokergageModificationDetails,
  previewUrl,
  setSetShowImg,
  showDocument,
  checkboxSelection,
  disableRowSelectionOnClick,
  onRowSelectionModelChange,
  setShowDocument,
  fileExtension,
  reportType,
  handleVerifyDetails,
  isBankVerified,
  setIsBankVerified,
  // handleUpdate,
  setIsNudgeTableOpen,
  setSegmentRow,
  onViewAmcDetails,
  beneficiaryName,
  handleMTFRow,
  onView,
  selectedTab,
  handleDownloadExcel,
  isCustomBtn,
  handleContractMailClick,
  tabValue,
  setRows,
  editRowAccess,
  handleClientCountClick,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
  const [modal_center, setmodal_center] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // Store selected row data
  const [action, setAction] = useState<
    "approve" | "reject" | "delete" | undefined
  >();
  const [customLedgerData, setCustomLedgerData] = useState([]);
  // const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [filteredLedgerDataDropDown, setFilteredLedgerDataDropDown] = useState<
    any[]
  >([]);

  const [showSearchCustom, setShowSearchCustom] = useState(showSearch);
  // const navigate = useNavigate();
  const { user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data || {},
  );

  console.log("userType", user_type);

  // useEffect(() => {
  //   const handleResize = () => setScreenHeight(window.innerHeight);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    console.log(
      "subItem and selectedWidgets",
      activeSubItem,
      selectedWidget,
      "previewUrl-->",
      typeof previewUrl,
    );
    setCustomLedgerData([]);
  }, [activeSubItem, selectedWidget, previewUrl]);

  useEffect(() => {
    console.log(totalRows, tradeData);

    if (selectedWidget !== "Clients With Ledger Balance") {
      setTradeData([]);
    }
  }, [selectedWidget]);

  const handleValues = (data: Trade[], responseStatus: any) => {
    const totalCount = data && data.flat().length;
    console.log("Received dropdown data:", data, totalCount, responseStatus);
    const slicedData = data && data.slice(0, totalCount);
    setTradeData(slicedData);
    setTotalRows(totalCount);
    setShowSearchCustom(responseStatus);
  };

  const tog_center = () => {
    setmodal_center(!modal_center);
    setShowDocument?.(false);
  };
  const HandleApprovalModal = (actionType: "approve" | "reject" | "delete") => {
    console.log("TestactionType", actionType);

    setAction(actionType);
    tog_center();
  };

  const handleViewDetails = (row: any) => {
    // debugger;
    console.log("View Details clicked for:", row);
    if (activeMenu === "Client Details") {
      getUserBrokergageModificationDetails?.(row);
    }
    setSelectedRow(row);
    onView?.(row);
    // tog_center();
  };

  const handleDeleteEntry = (row: any) => {
    handleDeleteClick?.(row);
  };

  const getColumns = () => {
    if (selectedWidget === "Clients With Ledger Balance") {
      return TableColumns.ClientCashColumns.map((column) => ({
        ...column,
        // sortable: false,
        // filterable: false,
      }));
    } else if (selectedWidget === "Clients Ageing Report") {
      return TableColumns.T6Columns.map((column) => ({
        ...column,
        // sortable: false,
        // filterable: false,
      }));
    } else if (selectedWidget === "clientBirthday") {
      return TableColumns.topBirthdays.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "T6Overview") {
      return TableColumns.T6OverViewColumns.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "dormantOverview") {
      return TableColumns.DormantOverViewColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "DP Debit Recovery") {
      // return [];
      // Inject handleEmailSend into the column definition
      return TableColumns.DPDebitRecovery.map((column) => {
        if (column.field === "elnk") {
          return {
            ...column,
            renderCell: (params: any) => {
              const emailID = params.row.em;
              const isEmailSent = emailSentStatus[params.row.boid]; // Check status for this BOID

              if (!emailID) {
                return <span style={{ color: "gray" }}></span>; // Placeholder if no email ID
              }
              return (
                <button
                  onClick={() => {
                    // Call both functions
                    // handleEmailSend?.();
                    // handleDpDebitDetails?.(params.row);
                    setSelectedRow(params.row); // Store the selected row data
                    tog_center(); // Open the modal
                  }}
                  disabled={isEmailSent}
                  style={{
                    color: isEmailSent && "#11395C",
                    textDecoration: isEmailSent ? "none" : "underline",
                    background: "none",
                    border: "none",
                    cursor: isEmailSent ? "default" : "pointer",
                  }}
                >
                  {isEmailSent ? (
                    "Email Sent!"
                  ) : (
                    <EmailIcon style={{ color: "#11395C" }} />
                  )}
                </button>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Communication Retrival Entry") {
      // This section is where the delete functionality will be added
      return TableColumns.communicationColumns().map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      setAction("delete");
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Communication Retrival Report") {
      return TableColumns.CompliancneReport.map((column) => {
        if (column.field === "cpp") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row); // This will trigger the download function
                  }}
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
          };
        }
        return column;
      });
    } else if (
      selectedWidget === "Total Clients" ||
      selectedWidget === "Active Clients" ||
      selectedWidget === "Inactive Clients"
      // apiStatus
    ) {
      return TableColumns.getClientActivityStatusColumns(
        handleViewDetails,
        user_type,
      );
    } else if (selectedWidget === "Upcoming Dormant Client") {
      return TableColumns.getClientDormantStatus(handleViewDetails);
    } else if (activeSubItem === "Exchange Activation") {
      return TableColumns.ApDocsDownload.map((column) => {
        if (column.field === "applNo") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    console.log("stage row", params);
                    onStatusClick?.(params.row, column.field);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.applNo}
                </button>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "RH Approval") {
      return TableColumns.RegionalHead.map((column) => {
        if (column.field === "remark") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    console.log("rowTest", params.row.rid);
                    setSelectedRow(params.row.rid);
                    // HandleApprovalModal("approve", params);
                    HandleApprovalModal("approve");
                    console.log(params.row.dummyId, "selectedrow approve");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="Approve" arrow placement="top">
                    <CheckCircleIcon
                      style={{ color: "green", marginLeft: 4 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 20, color: "gray" }}>|</div>
                <div
                  onClick={() => {
                    setSelectedRow(params.row.rid);
                    HandleApprovalModal("reject");
                    // HandleApprovalModal("reject", params);
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Tooltip title="Reject" arrow placement="top">
                    <CancelIcon style={{ color: "red", marginLeft: 4 }} />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }
        if (column.field === "cfile") {
          return {
            ...column,
            renderCell: (params: any) => {
              const fileName = params.row?.cfile;

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
                  <DownloadForOfflineIcon />
                </button>
              ) : (
                "─"
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Brokerage Modification Status") {
      return TableColumns.BrokerageModificationStatus.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "KYC Approval") {
      return TableColumns.BrokerageKyc.map((column) => {
        if (column.field === "More Details") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    setSegmentRow(params.row);
                    setIsNudgeTableOpen(true);
                    console.log(
                      params.row,
                      "selectedrow More Details",
                      setSegmentRow,
                    );
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="More details" arrow placement="top">
                    <ControlPointIcon />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }

        return column;
      });
    } else if (activeSubItem === "Terminal") {
      return TableColumns.terminalcol.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SLBM Client Holding") {
      return TableColumns.slbmColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Registration Table") {
      return TableColumns.RegisDetails.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Marketing Material") {
      return TableColumns.getMarketingMaterials.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleEdit = () => {
                handleEditClick?.(params.row, true);
                console.log("handleEdit row", params);
              };

              const handleDelete = () => {
                setAction("delete");
                handleDeleteEntry?.(params.row);
                setSelectedRow(params.row);
                tog_center();
                console.log("handleDelete row", params);
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>

                  {isDeleted ? (
                    <span
                      style={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "not-allowed",
                      }}
                    >
                      Deleted
                    </span>
                  ) : (
                    <Tooltip title="Delete" arrow placement="top">
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={handleDelete}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#11395C" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              );
            },
          };
        }

        // Return other columns unchanged
        return column;
      });
    } else if (activeMenu === "Regulatory Announcement") {
      return TableColumns.getRegulatorAnnouncement
        .filter((column) => column.field !== "action")
        .map((column) => {
          if (column.field === "cfp") {
            return {
              ...column,
              renderCell: (params: any) => (
                <Tooltip title="Download" arrow placement="top">
                  <DownloadForOfflineIcon
                    onClick={() => handleDownload(params.row)}
                    sx={{ color: "#11395C", cursor: "pointer" }}
                  />
                </Tooltip>
              ),
            };
          }
          return column;
        });
    } else if (activeSubItem === "Regulatory Announcement") {
      return TableColumns.getRegulatorAnnouncement.map((column) => {
        if (column.field === "cfp") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <Tooltip title="Download" arrow placement="top">
                  <DownloadForOfflineIcon
                    onClick={() => handleDownload(params.row)}
                    sx={{ color: "#11395C", cursor: "pointer" }}
                  />
                </Tooltip>
              );
            },
          };
        }
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      setAction("delete");
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Communication Retrival Checker") {
      return TableColumns.getCommChecker.map((column) => {
        if (column.field === "status") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      margin: "0 5px 0 5px",
                    }}
                  >
                    |
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        if (column.field === "cpp") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }

        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Dormant Client Report") {
      return TableColumns.dormantColumns(user_type);
    } else if (activeSubItem === "Quarterly Payout Recovery") {
      return TableColumns.QPayoutColumns.map((column) => ({
        ...column,
      }));
    } else if (
      selectedWidget === "Total Clients" ||
      selectedWidget === "Active Clients" ||
      selectedWidget === "Inactive Clients"
      // apiStatus
    ) {
      return TableColumns.getClientActivityStatusColumns(
        handleViewDetails,
        user_type,
      );
    } else if (activeSubItem === "Pre Trade Proof Upload") {
      return TableColumns.PreProofUploadColumns.map((column) => {
        if (column.field === "file_upload") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div>
                  <Button
                    onClick={() => {
                      setSelectedRow(params.row);
                      tog_center();
                    }}
                    sx={{
                      padding: "1px 18px",
                    }}
                  >
                    <Tooltip title={"Upload File"} arrow placement="top">
                      <UploadFileIcon
                        style={{ cursor: "pointer", color: "#11395C" }}
                      />
                    </Tooltip>
                  </Button>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Pre Trade Report") {
      return TableColumns.preTradeColumns.map((column) => {
        if (column.field === "Uploaded_Document") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                    tog_center();
                  }}
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
          };
        } else if (column.field === "sts") {
          return {
            ...column,
            renderCell: (params: any) => {
              const getStatusStyles = (status: string) => {
                switch (status.toLowerCase()) {
                  case "approved":
                    return {
                      backgroundColor: "#a5d6a7", // light green
                      color: "#1b5e20",
                      border: "1px solid #81c784",
                    };
                  case "pending":
                    return {
                      backgroundColor: "#fff59d", // light yellow
                      color: "#ff6f00",
                      border: "1px solid #ffe082",
                    };
                  case "rejected":
                    return {
                      backgroundColor: "#ef9a9a", // light red
                      color: "#b71c1c",
                      border: "1px solid #e57373",
                    };
                  default:
                    return {
                      backgroundColor: "#cfd8dc",
                      color: "#263238",
                      border: "1px solid #b0bec5", // neutral border
                    };
                }
              };

              const statusStyles = getStatusStyles(params.row.sts);

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
                      ...statusStyles,
                      borderRadius: "999px",
                      padding: "3px 16px",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      textAlign: "center",
                      minWidth: "50px",
                      lineHeight: "1",
                    }}
                  >
                    {params.row.sts}
                  </div>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Pre Trade Approval") {
      return TableColumns.PreTradeApprovalColumns.map((column) => {
        if (column.field === "Uploaded_Document") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                    tog_center();
                  }}
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
          };
        }
        if (column.field === "Actions") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    HandleApprovalModal("approve");
                    setSelectedRow(params.row.Row_id);
                    console.log(params.row.dummyId, "selectedrow approve");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="Approve" arrow placement="top">
                    <CheckCircleIcon
                      style={{ color: "#116E11", marginLeft: 4 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 20, color: "gray" }}>|</div>
                <div
                  onClick={() => {
                    HandleApprovalModal("reject");
                    setSelectedRow(params.row.Row_id);
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Tooltip title="Reject" arrow placement="top">
                    <CancelIcon style={{ color: "#FF2400", marginLeft: 4 }} />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }
        return column;
      });
    } else if (activeSubItem === "Client Trading Pattern Report") {
      const selectedColumn =
        reportType === "summarized"
          ? TableColumns.clientTradingPatternSummarizedColumns
          : reportType === "detailed"
            ? TableColumns.clientTradingPatternDetailedColumns
            : [];
      return (
        selectedColumn &&
        selectedColumn.map((column) => ({
          ...column,
        }))
      );
    } else if (activeSubItem === "CTCL Wise Activity Report") {
      const selectedColumn =
        reportType === "summarized"
          ? TableColumns.ctclUserWiseColumns
          : reportType === "detailed"
            ? TableColumns.ctclUserWiseDetailedColumns
            : [];
      return (
        selectedColumn &&
        selectedColumn.map((column) => ({
          ...column,
        }))
      );
    } else if (activeSubItem === "SPIP Performance Dashboard") {
      return TableColumns.spipPerformanceReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Performance Summary") {
      return TableColumns.SPIPOverallPerformanceReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Subscription Details") {
      // return spipSubSciptionDetailColumns.map((column) => ({
      //   ...column,
      // }));
      return TableColumns.spipSubSciptionDetailColumns.map((column) => {
        if (column.field === "invoiceDownload") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row); // This will trigger the download function
                  }}
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
          };
        }
        return column;
      });
    } else if (activeSubItem === "Branch-Wise Fees Sharing Report") {
      return TableColumns.ZONEWiseCommissionReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client-Wise Fees Sharing Report") {
      return TableColumns.ClientWiseCommissonReport.map((column) => ({
        ...column,
      }));
    } else if (
      activeSubItem === "Client Details Report" ||
      selectedWidget === "Client Details Report"
    ) {
      // return spipClientDetails.map((column) => ({
      //   ...column,
      // }));
      return TableColumns.spipClientDetails.map((column) => {
        if (column.field === "exp") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params.row.exp;

              if (status === "E") {
                return (
                  <div
                    onClick={() =>
                      window.open("https://spip.lkp.net.in/Products", "_blank")
                    }
                    style={{
                      backgroundColor: "#11395C",
                      color: "white",
                      borderRadius: "8px",
                      // padding: "0px 2px",
                      cursor: "pointer",
                      display: "inline-block",
                      textAlign: "center",
                      userSelect: "none",
                      fontSize: "9px",
                      width: "110px",
                      // margin: "2px",
                    }}
                  >
                    Subscription Expire
                  </div>
                );
              } else if (status === "A") {
                return (
                  <div
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      borderRadius: "8px",
                      padding: "0px 4px",
                      cursor: "default",
                      display: "inline-block",
                      textAlign: "center",
                      userSelect: "none",
                      opacity: 0.85, // optional for "disabled" look
                      fontSize: "9px",
                      width: "110px",
                      // margin: "2px",
                    }}
                  >
                    Ongoing
                  </div>
                );
              } else {
                return null;
              }
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Unlisted Shares Approval 1") {
      return TableColumns.getApproverOneDetails.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0066b3",
                  }}
                  onClick={() => handleViewDetails(params.row)}
                >
                  View
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Unlisted Shares Approval 2") {
      return TableColumns.getApproverTwoDetails.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0066b3",
                  }}
                  onClick={() => handleViewDetails(params.row)}
                >
                  View
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Unlisted Shares Final Approval") {
      return TableColumns.getFinalApproverDetails.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0066b3",
                  }}
                  onClick={() => handleViewDetails(params.row)}
                >
                  View
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (
      activeSubItem === "Unlisted Shares Entry" ||
      activeSubItem === "Unlisted Shares Status"
    ) {
      return TableColumns.unListedTradeColumns
        .filter((column) => {
          if (
            activeSubItem === "Unlisted Shares Status" &&
            column.field === "action"
          ) {
            return false;
          }
          return true;
        })
        .map((column) => {
          if (column.field === "action") {
            return {
              ...column,
              renderCell: (params: any) => {
                const isDeleted = params.row.isDeleted; // Add condition based on your row data

                const handleEdit = () => {
                  handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
                };

                return (
                  <>
                    <Tooltip title="Edit" arrow placement="top">
                      <IconButton
                        sx={{ p: 0 }}
                        color="primary"
                        onClick={handleEdit}
                      >
                        <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                      </IconButton>
                    </Tooltip>
                    <button
                      onClick={() => {
                        setAction("delete");
                        handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                        setSelectedRow(params.row); // Store the selected row for confirmation
                        tog_center(); // Open the modal for deletion confirmation
                      }}
                      disabled={isDeleted}
                      style={{
                        color: isDeleted ? "red" : "#11395C",
                        textDecoration: isDeleted ? "none" : "underline",
                        background: "none",
                        border: "none",
                        cursor: isDeleted ? "default" : "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      {isDeleted ? (
                        "Deleted"
                      ) : (
                        <Tooltip title="Delete" arrow placement="top">
                          <IconButton
                            sx={{ p: 0 }}
                            color="primary"
                            onClick={() => handleDeleteEntry?.(params.row)}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: "#11395C" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </button>
                  </>
                );
              },
            };
          } else if (column.field === "sts") {
            return {
              ...column,
              renderCell: (params: any) => {
                const status = params.value?.toLowerCase() || "";

                let backgroundColor = "#cfd8dc";
                let color = "#263238";
                let border = "1px solid #b0bec5";

                if (status.includes("approved")) {
                  backgroundColor = "#a5d6a7";
                  color = "#1b5e20";
                  border = "1px solid #81c784";
                } else if (status.includes("pending with approver 2")) {
                  backgroundColor = "#FFF4E5";
                  color = "#FF9800";
                  border = "1px solid #FFB74D";
                } else if (status.includes("pending")) {
                  backgroundColor = "#FFF4E5";
                  color = "#FF9800";
                  border = "1px solid #FFB74D";
                } else if (
                  status.includes("rejected") ||
                  status.includes("reject")
                ) {
                  backgroundColor = "#ef9a9a";
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
                        whiteSpace: "nowrap",
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
            };
          }

          // Return other columns unchanged
          return column;
        });
    } else if (activeMenu === "Client Request") {
      return TableColumns.ClientPledgeRequest.map((column) => {
        if (column.field === "encryptedCode") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  onClick={() => {
                    handleDownload(params.row);
                  }}
                >
                  <OpenInNewIcon
                    style={{ color: "#11395C", cursor: "pointer" }}
                  />
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeMenu === "AP Contest Achieved Brokerage") {
      return TableColumns.clientAPBrokerageColumns.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "LeaderBoard") {
      return TableColumns.APTopClientsFields.map((column) => ({
        ...column,
      }));
    } else if (
      activeMenu === "AP Contest Achieved Clients" ||
      activeMenu === "Employee Clients Achieved"
    ) {
      return TableColumns.APContestAchievedClients.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "Employee Brokerage Achieved") {
      return TableColumns.EmpBrokerageAchieved.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "AP PaymentExchangeData") {
      return TableColumns.ParOnPaymentexchangeColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "AP PaymentOtherConditionData") {
      return TableColumns.PaymentOtherConditionData.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "AP PaymentOtherData") {
      return TableColumns.ParOnPaymentOthers.map((column) => {
        if (column.field === "Edit") {
          return {
            ...column,
            renderCell: (params: any) => {
              if (params.row.isTotal) return null;

              const handleEdit = () => {
                handleEditClick?.(params.row, true);
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                </>
              );
            },
          };
        }

        return column;
      });
    } else if (selectedWidget === "Lifetime Membership") {
      return TableColumns.AmcLifeMembership.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Contest Earned") {
      return TableColumns.AmcContest.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Non-Lifetime Membership") {
      return TableColumns.AmcNonLifeMembership.map((column) => {
        if (column.field === "sch") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params?.row?.sch;

              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      marginRight: 5,
                    }}
                  >
                    {status === "Submitted" ? (
                      // 🚫 Not clickable
                      <span
                        style={{
                          color: "#003366",
                          fontWeight: 600,
                          cursor: "default",
                        }}
                      >
                        {status}
                      </span>
                    ) : status === "eSign Pending" ? (
                      // ✅ Clickable eSign Pending
                      <Tooltip title="eSign Pending" arrow placement="top">
                        <span
                          onClick={() => {
                            console.log(
                              "Clicked eSign Pending row:",
                              params.row,
                            );
                            if (onViewAmcDetails) onViewAmcDetails(params.row);
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#11395C",
                            textDecoration: "underline",
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </Tooltip>
                    ) : (
                      // Default: show OpenInNew icon for other statuses
                      <Tooltip
                        title="Lifetime AMC scheme"
                        arrow
                        placement="top"
                      >
                        <OpenInNewIcon
                          style={{ cursor: "pointer", color: "#11395C" }}
                          onClick={() => {
                            console.log("Clicked row:", params.row);
                            if (onViewAmcDetails) onViewAmcDetails(params.row);
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            },
          };
        }

        return column;
      });
    } else if (activeMenu === "Employee Non-Brokerage Achieved") {
      return TableColumns.EmpNonBrokerageAchieved.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Exclusion") {
      return TableColumns.ClientExclusionColumns.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleDelete = () => {
                if (!isDeleted) {
                  setAction("delete");
                  handleDeleteEntry?.(params.row);
                  setSelectedRow(params.row);
                  tog_center();
                }
              };

              return (
                <>
                  <Tooltip
                    title={isDeleted ? "Already deleted" : "Delete"}
                    arrow
                    placement="top"
                  >
                    <span>
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={handleDelete}
                        disabled={isDeleted}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: isDeleted ? "red" : "#11395C" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return TableColumns.RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "DP AMC Ledger Debit") {
      return TableColumns.AmcLedgerReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Third Party Vendor Master") {
      return TableColumns.ThirdParty.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      setAction("delete");
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Third Party Vendor Approval") {
      return TableColumns.ThirdParty.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      margin: "0 5px 0 5px",
                    }}
                  >
                    |
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Status Report") {
      return TableColumns.ThirdPartyStatusReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Vendor Creation") {
      return TableColumns.VendorMasterColumns.map((column) => {
        if (column.field === "actions") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;
              const isApproved = params.row.app === "A";

              // ✅ If approved, hide the entire actions (no edit/delete)
              if (isApproved) {
                return <span style={{ color: "gray" }}>--</span>;
              }

              const handleEdit = () => {
                setSelectedRow(params.row);
                handleEditClick?.(params.row, true);
              };

              const handleDelete = () => {
                setAction("delete");
                handleDeleteEntry?.(params.row);
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>

                  {isDeleted ? (
                    <span
                      style={{
                        color: "red",
                        fontSize: "0.85rem",
                        cursor: "default",
                      }}
                    >
                      Deleted
                    </span>
                  ) : (
                    <Tooltip title="Delete" arrow placement="top">
                      <IconButton
                        sx={{ p: 0 }}
                        color="primary"
                        onClick={handleDelete}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#11395C" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "Vendor Approval") {
      // return VendorMasterColumns.map((column) => ({
      //   ...column,
      // }));
      return TableColumns.VendorMasterApprovalColumns.map((column) => {
        if (column.field === "actions") {
          return {
            ...column,
            renderCell: (params: any) => {
              if (params.row.app === "A") {
                // Already approved — no actions
                return <span style={{ color: "gray" }}>--</span>;
              }

              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    onClick={() => {
                      console.log("rowTest", params.row);
                      setSelectedRow(params.row);
                      HandleApprovalModal("approve");
                      console.log(params.row.vid, "selectedrow approve");
                    }}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      marginRight: 5,
                    }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon
                        style={{ color: "green", marginLeft: 4 }}
                      />
                    </Tooltip>
                  </div>

                  <div style={{ fontSize: 20, color: "gray" }}>|</div>

                  <div
                    onClick={() => {
                      setSelectedRow(params.row);
                      HandleApprovalModal("reject");
                    }}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red", marginLeft: 4 }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        if (column.field === "armk") {
          return {
            ...column,
            renderCell: (params: any) => {
              if (params.row.app === "A" || "R") {
                return (
                  <span style={{ color: "#11395C", fontWeight: 500 }}>
                    {params.row.armk || "--"}
                  </span>
                );
              }
              return <span>--</span>;
            },
          };
        }

        if (column.field === "tdsp") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasTdsPath =
                params.row?.tdsp && params.row.tdsp.trim() !== "";

              if (!hasTdsPath) {
                return <span>--</span>;
              }
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "TDS"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "msmp") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "MSME"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "bdoc") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "BANK"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "pdoc") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    console.log("rowCheck-->", params?.row);
                    handleDownload(params.row, "PAN"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Upload") {
      return TableColumns.TpInvoiceUploadColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Third Party Invoice Verify") {
      return TableColumns.TpInvoiceVerifyColumns.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      margin: "0 5px 0 5px",
                    }}
                  >
                    |
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.rid);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        if (column.field === "delete") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleDelete = () => {
                if (!isDeleted) {
                  handleDeleteEntry?.(params.row);
                  setSelectedRow(params.row);
                  tog_center();
                }
              };

              return (
                <>
                  <Tooltip
                    title={isDeleted ? "Already deleted" : "Delete"}
                    arrow
                    placement="top"
                  >
                    <span>
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={() => {
                          setAction("delete");
                          handleDelete();
                        }}
                        disabled={isDeleted}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: isDeleted ? "red" : "#11395C" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Mail") {
      return TableColumns.TpInvoiceMailsColumns.map((column) => {
        if (column.field === "generate")
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row); // This will trigger the download function
                  }}
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
          };
        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Report") {
      return TableColumns.TpInvoiceReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Employee Target Report") {
      const HIDE_WHEN_TAB_0 = new Set([
        "mtf_cl_tg",
        "mtf_cl_ach",
        "mtf_ult_tg",
        "mtf_ult_ach",
      ]);

      const HIDE_WHEN_TAB_1 = new Set(["spip_t", "spip_a"]);
      return TableColumns.EmployeeTargetReportColumns.filter((column) => {
        if (selectedTab === 0 && HIDE_WHEN_TAB_0.has(column.field)) {
          return false;
        }

        if (selectedTab === 1 && HIDE_WHEN_TAB_1.has(column.field)) {
          return false;
        }

        return true;
      });
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return TableColumns.RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return TableColumns.RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Q4_Partner Contest Report") {
      return TableColumns.getAPContestReportColumnsQ4.map((column) => {
        if (column.field === "apc") {
          return {
            ...column,
            renderCell: (params: any) => {
              const handleClick = () => {
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={handleClick}
                >
                  {params.value}
                </span>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Partner Contest Report") {
      return TableColumns.getAPContestReportColumns.map((column) => {
        if (column.field === "apc") {
          return {
            ...column,
            renderCell: (params: any) => {
              const handleClick = () => {
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={handleClick}
                >
                  {params.value}
                </span>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Unpledge Request Report") {
      return TableColumns.clientUnpledgeReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "mandateCall") {
      return TableColumns.dpDebitMandateColumns.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => (
              <Tooltip title="Edit" arrow placement="top">
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    setSelectedRow(params.row); // if required
                    // handleEdit?.(params.row); // optional callback
                    tog_center(); // open modal
                  }}
                >
                  <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                </IconButton>
              </Tooltip>
            ),
          };
        }
        return column;
      });
    } else if (activeSubItem === "Dp Debit Collection") {
      return TableColumns.ClientMandateReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SPIP Client MIS") {
      return TableColumns.clientMISColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "MTF Shortfall Report") {
      return TableColumns.shortfallColumns.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => (
              <Tooltip
                title={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <InfoIcon sx={{ fontSize: "14px" }} />
                    Click here for Calculation
                  </span>
                }
                arrow
                placement="top"
              >
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    console.log(params?.row);

                    handleMTFRow?.(params?.row, "Action");
                  }}
                >
                  Sell
                </span>
              </Tooltip>
            ),
          };
        }
        return column;
      });
    } else if (activeSubItem === "MTF Ageing Report") {
      return TableColumns.ageingColumns.map((column) => {
        if (column.field === "cc") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={() => {
                    handleMTFRow?.(params?.row, "cc");
                  }}
                >
                  <Tooltip
                    title={
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {" "}
                        <InfoIcon sx={{ fontSize: "14px" }} />
                        Click here for more details{" "}
                      </span>
                    }
                    arrow
                    placement="top"
                  >
                    {params.value}
                  </Tooltip>
                </span>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "Vendor Details Report") {
      return TableColumns.vendorApprovalColumns.map((column) => {
        if (column.field === "tdsp") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasTdsPath =
                params.row?.tdsp && params.row.tdsp.trim() !== "";

              if (!hasTdsPath) {
                return <span>—</span>;
              }
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "TDS"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "msmp") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasMsmePath =
                params.row?.msmp && params.row.msmp.trim() !== "";

              if (!hasMsmePath) {
                return <span>—</span>;
              }
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "MSME"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "bdoc") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasBankPath =
                params.row?.bdoc && params.row.bdoc.trim() !== "";

              if (!hasBankPath) {
                return <span>—</span>;
              }

              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "BANK"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "pdoc") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasPanPath =
                params.row?.pdoc && params.row.pdoc.trim() !== "";

              if (!hasPanPath) {
                return <span>—</span>;
              }
              return (
                <button
                  onClick={() => {
                    console.log("rowCheck-->", params?.row);
                    handleDownload(params.row, "PAN"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "T6 Selling Report") {
      return TableColumns.t6SellingReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "REG Master Records") {
      return TableColumns.regMasterColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client DP AMC Report direct") {
      return TableColumns.AmcZoneReportDirect.map((column) => {
        if (column.field === "sub") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.sub}
                </button>
              );
            },
          };
        }
        if (column.field === "cmp") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.cmp}
                </button>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Client DP AMC Report indirect") {
      return TableColumns.AmcZoneReportIndirect.map((column) => {
        if (column.field === "sub") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.sub}
                </button>
              );
            },
          };
        }
        if (column.field === "cmp") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.cmp}
                </button>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "DP AMC Transaction") {
      return TableColumns.DPTransactionColumns.map((column) => {
        if (column.field === "downloadAMC") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params.row?.sch;

              // Show dash if EsignPending or null/undefined
              if (status === "Submitted" || status === "Completed") {
                // Otherwise, show the download button
                return (
                  <button
                    onClick={() => {
                      handleDownload(params.row); // trigger download
                      console.log("DP AMC Transaction row", params.row.sch);
                    }}
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
              } else {
                return <>—</>;
              }
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "AP Partner Details") {
      return TableColumns.PartnerOnboardingDetails.map((column) => {
        if (column.field === "stage") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Show dash if EsignPending or null/undefined

              return (
                <button
                  onClick={() => {
                    console.log("stage row", params);
                    onStatusClick?.(params.row, column.field);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Track
                </button>
              );
            },
          };
        }
        if (column.field === "applNo") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Show dash if EsignPending or null/undefined

              return (
                <button
                  onClick={() => {
                    console.log("stage row", params);
                    onStatusClick?.(params.row, column.field);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.applNo}
                </button>
              );
            },
          };
        }
        if (column.field === "Download Documents") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    console.log("stage row", params);
                    handleDownload(params.row.applNo);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Pledge Request Report") {
      return TableColumns.pledgeReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Indirect Channel") {
      return TableColumns.apGrossBrokerageColumns.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "expiryContestCriteria") {
      return TableColumns.expiryContestCriteria.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "expiryContestReward") {
      return TableColumns.expiryContestReward.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "todaysContestProgress") {
      return TableColumns.todaysContestProgress.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "expiryContestHistory") {
      return TableColumns.expiryContestHistory.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "RHtodaysContestProgress") {
      return TableColumns.RHtodaysContestProgress.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "RHexpiryContestReward") {
      return TableColumns.RHexpiryContestReward.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "employeesContestProgress") {
      return TableColumns.employeesContestProgress.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "employeesContestHistory") {
      return TableColumns.employeesContestHistory.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Brokerage Report") {
      let columns = [...TableColumns.brokerageWiseColumns];

      if (tabValue === "ClientWise") {
        columns = columns.filter(
          (col) => !["tradeDate", "branchName"].includes(col.field),
        );
      } else if (tabValue === "BranchWise") {
        columns = columns.filter(
          (col) =>
            !["tradeDate", "clientCode", "clientName"].includes(col.field),
        );
      } else if (tabValue === "DateWise") {
        columns = columns.filter((col) => !["branchName"].includes(col.field));
      }

      return columns;
    } else if (activeSubItem === "DP AutoPay Report") {
      return TableColumns.ClientMandateColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Download DP Mandate Report") {
      return TableColumns.mandateExecutionColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "DPMandateJVData") {
      return TableColumns.MandateTab3Columns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "partnerSharing") {
      return TableColumns.ParOnbPartnerSharing.map((column) => ({
        ...column,
        editable: column.field !== "segment" && editRowAccess,
        cellClassName:
          editRowAccess && column.field !== "segment" ? "editable-cell" : "",
      }));
    } else if (activeSubItem === "contestSPIP") {
      return TableColumns.contestSPIP.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "RHexpiryContestHistory") {
      return TableColumns.RHexpiryContestHistory.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SPIP Contest Report") {
      return TableColumns.SPIPContestReport.map((column) => {
        if (column.field === "ec") {
          return {
            ...column,
            renderCell: (params: any) => {
              const handleClick = () => {
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={handleClick}
                >
                  {params.value}
                </span>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "MTFEmailAgeing") {
      return TableColumns.mtfAgeingEmailColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Unlisted Scrip Master") {
      return TableColumns.scripMasterColumns.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      setAction("delete");
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }

        // Return other columns unchanged
        return column;
      });
    } else if (activeSubItem === "Unlisted Contract Note") {
      const baseColumns = [...TableColumns.unlistedContractColumns];

      if (tabValue === 1) {
        const rmIndex = baseColumns.findIndex((col) => col.field === "rmc");

        if (rmIndex !== -1) {
          baseColumns.splice(rmIndex + 1, 0, {
            field: "disno",
            headerName: "DIS No",
            width: 120,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            renderCell: (params: any) => {
              const { value, row } = params;

              if (value) return value;

              return (
                <Tooltip title="Add DIS Number" arrow placement="top">
                  <IconButton
                    sx={{ p: 0, mb: 0.5 }}
                    onClick={() => {
                      setSelectedRow(row);
                      tog_center();
                    }}
                  >
                    <AddCircleOutlineIcon style={{ cursor: "pointer" }} />
                  </IconButton>
                </Tooltip>
              );
            },
          });
        }
      }

      return baseColumns;
    } else if (activeSubItem === "LKP Bank Entry") {
      return TableColumns.pendingBankAccountColumns.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      setAction("delete");
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "LKP Bank Approval") {
      return TableColumns.ApprovalBankAccountColumns.map((column) => {
        if (column.field === "status") {
          return {
            ...column,
            renderCell: (params: any) => {
              console.log("checkRow", params?.row);

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.Id);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      margin: "0 5px 0 5px",
                    }}
                  >
                    |
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRow(params.row.Id);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "LKP Bank Report") {
      return TableColumns.BankAccReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "MTF Funding Yield") {
      return TableColumns.MTFFundYieldColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "T6 Selling Detail (Pre&Post)") {
      return TableColumns.T6SellingDetailReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SLBM Client Interest") {
      return TableColumns.SLBMClientResponseColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SLBM Client Position") {
      return TableColumns.SLBMPositionResponseColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SLBM Stockwatch") {
      return TableColumns.SlbmClientColumns.map((column) => {
        if (column.field === "clientCount") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <>
                  <Tooltip title="Click to view details" arrow placement="top">
                    <button
                      onClick={() => {
                        handleClientCountClick?.(params.row); // trigger download
                      }}
                      style={{
                        color: "#11395C",
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {params.row.clientCount}
                    </button>
                  </Tooltip>
                </>
              );
            },
          };
        }

        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else {
      return [];
    }
  };

  const columns = getColumns();

  const handleSearchChange = (query: string) => {
    handleSearchBasedOnInput?.(query);

    if (selectedWidget === "Clients With Ledger Balance") {
      const filtered = commonLedgerData.filter((item: any) =>
        item.ClientName?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredLedgerDataDropDown(filtered);
      console.log(query, "query", selectedWidget, filtered);
    }
  };

  const commonLedgerData =
    Array.isArray(customLedgerData) && customLedgerData.length > 0
      ? customLedgerData
      : Array.isArray(tradeCWCBData) && tradeCWCBData.length > 0
        ? tradeCWCBData
        : [];
  let rowName =
    selectedWidget === "Clients With Ledger Balance"
      ? commonLedgerData
      : selectedWidget === "Total Clients"
        ? T6Data
        : selectedWidget === "Active Clients"
          ? activeGroupedClients
          : selectedWidget === "Inactive Clients"
            ? inactiveGroupedClients
            : selectedWidget === "Active Clients" &&
                activeSubItem === "DP Debit Recovery"
              ? activeGroupedClients
              : selectedWidget === "Inactive Clients" &&
                  activeSubItem === "DP Debit Recovery"
                ? inactiveGroupedClients
                : selectedWidget === "Upcoming Dormant Client"
                  ? T6Data
                  : T6Data;
  console.log("rowName from userinfo", rowName);

  useEffect(() => {
    console.log("childData", customLedgerData, selectedWidget);
  }, [customLedgerData, selectedWidget]);

  let Msg = "";

  const deleteItems = [
    "Regulatory Announcement",
    "Unlisted Shares Entry",
    "Communication Retrival Entry",
    "Marketing Material",
    "Client Exclusion",
    "Third Party Vendor Master",
    "Third Party Invoice Verify", // delete message also for this
    "Vendor Creation",
  ];

  const actionItems = [
    "Communication Retrival Checker",
    "KYC Approval",
    "RH Approval",
    "Unlisted Shares Approval 1",
    "Unlisted Shares Approval 2",
    "Third Party Vendor Approval",
    "Third Party Invoice Verify", // approve/reject message also for this
    "Vendor Approval",
    "Unlisted Scrip Master",
    "LKP Bank Entry",
    "LKP Bank Approval",
  ];

  if (activeSubItem === "RMS Allocation") {
    Msg = "";
  } else if (activeSubItem === "Third Party Invoice Verify") {
    if (action === "delete") {
      Msg = "Are you sure want to delete this entry";
    } else if (action === "approve" || action === "reject") {
      Msg = `Are you sure want to ${action} this entry`;
    } else {
      Msg = "";
    }
  } else if (deleteItems.includes(activeSubItem)) {
    Msg = "Are you sure want to delete this entry";
  } else if (actionItems.includes(activeSubItem)) {
    Msg = `Are you sure want to ${action} this entry`;
  } else if (activeSubItem === "Pre Trade Approval" && !showDocument) {
    Msg = `Are you sure want to ${action} this entry`;
  } else if (activeSubItem === "mandateCall") {
    Msg = "Edit Details";
  } else if (
    activeSubItem === "Pre Trade Proof Upload" ||
    activeSubItem === "Pre Trade Report" ||
    (activeSubItem === "Pre Trade Approval" && showDocument)
  ) {
    Msg = "";
  } else if (actionItems.includes(activeSubItem)) {
    Msg = `Are you sure want to ${action} this entry`;
  } else if (activeSubItem === "Unlisted Contract Note") {
    Msg = "Enter DIS Number";
  } else {
    Msg = "Are you sure you want to send the email?";
  }
  return (
    <>
      <CustomModal
        tog_center={() => setmodal_center(!modal_center)}
        modal_center={modal_center}
        setmodal_center={setmodal_center}
        getUserDetails={getUserDetails} // Pass the API call function
        row={selectedRow} // Pass the selected row data
        action={action}
        handleApproval={handleApproval}
        Msg={Msg}
        activeSubItem={activeSubItem}
        isUploadMode={activeSubItem === "Pre Trade Proof Upload" ? true : false}
        handleFileUpload={(selectedRow, file, remark) => {
          console.log("Uploading file:", selectedRow, file);
          if (typeof onFileUpload === "function") {
            onFileUpload(selectedRow, file, remark);
          } else {
            console.warn("onFileUpload is not defined");
          }
        }}
        setShowImg={
          activeSubItem === "Pre Trade Report"
            ? true
            : activeSubItem === "Pre Trade Approval" && showDocument
              ? true
              : false
        }
        previewUrl={previewUrl}
        setSetShowImg={setSetShowImg}
        showDocument={showDocument}
        fileExtension={fileExtension}
        isPartnerContest={
          activeSubItem === "Partner Contest Report" ? true : false
        }
        isSPIPContest={activeSubItem === "SPIP Contest Report" ? true : false}
        handleVerifyDetails={handleVerifyDetails}
        isBankVerified={isBankVerified}
        beneficiaryName={beneficiaryName}
        setIsBankVerified={setIsBankVerified}
        selectedTab={selectedTab}
      />
      {selectedWidget === "Clients With Ledger Balance" && (
        <DropDown
          tradeData={setTradeData}
          handleValues={handleValues}
          setCustomLedgerData={setCustomLedgerData}
        />
      )}
      {(showSearch || showSearchCustom) && (
        <SearchAppBar
          onSearchChange={handleSearchChange}
          handleSearchUser={handleSearchUser}
          searchTableValue={searchValue}
          selectedWidget={selectedWidget}
          showExcel={showExcel}
          handleExcelDownload={handleExcelDownload}
          totalCount={totalCount}
          activeClient={activeClient}
          inactiveClient={inactiveClient}
          totalLedgerDebitAmt={totalLedgerDebitAmt}
          activeSubItem={activeSubItem}
          dormantCount={dormantCount}
          handleDownloadExcel={handleDownloadExcel}
        />
      )}
      <Paper
        sx={{
          height:
            selectedWidget === "Client Details Report"
              ? "200px"
              : selectedWidget === "Criteria and Rewards"
                ? T6Data.length < 10
                  ? "auto"
                  : "52vh"
                : "72vh",
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          checkboxSelection={checkboxSelection}
          onRowSelectionModelChange={onRowSelectionModelChange}
          rows={
            selectedWidget === "Clients With Ledger Balance"
              ? filteredLedgerDataDropDown.length > 0
                ? filteredLedgerDataDropDown
                : commonLedgerData
              : selectedWidget === "Total Clients"
                ? T6Data
                : // : selectedWidget === "Active Clients"
                  // ? activeGroupedClients
                  // : selectedWidget === "Inactive Clients"
                  // ? inactiveGroupedClients
                  selectedWidget === "Active Clients" &&
                    activeSubItem === "DP Debit Recovery"
                  ? activeGroupedClients
                  : selectedWidget === "Inactive Clients" &&
                      activeSubItem === "DP Debit Recovery"
                    ? inactiveGroupedClients
                    : selectedWidget === "Upcoming Dormant Client"
                      ? T6Data
                      : T6Data
          }
          localeText={{ noRowsLabel: "No Records!" }}
          columns={columns}
          rowHeight={30}
          editMode={editRowAccess ? "cell" : undefined}
          isCellEditable={(params) => {
            if (params.row.segment === "SLBM") return false;
            return !!editRowAccess;
          }}
          processRowUpdate={(newRow) => {
            if (setRows) {
              setRows((prev: any) =>
                prev.map((row: any) => (row.id === newRow.id ? newRow : row)),
              );
            }
            console.log("Updated Row:", newRow);
            return newRow;
          }}
          hideFooter={customHide ? true : false}
          // getRowId={(row: any) => (row.Id ? row?.Id : row?.cc)}
          getRowId={(row: any) =>
            row?.rid
              ? row.rid
              : row.Id
                ? row?.Id
                : row?.cc
                  ? row?.cc
                  : row.rowID
                    ? row.rowID
                    : row.id
                      ? row.id
                      : row.rowId
                        ? row.rowId
                        : row.ClientCode
                          ? row.ClientCode
                          : row.clientCode
                            ? row.clientCode
                            : row.ctermcode
                              ? row.ctermcode
                              : row.RowId
                                ? row.RowId
                                : row.dummyId
                                  ? row.dummyId
                                  : row.RowID
                                    ? row.RowID
                                    : row.ClientName
                                      ? row.ClientName
                                      : row.clientName
                                        ? row.clientName
                                        : row.BOID
                                          ? `${row.BOName}-${row.TotalDebit}-${Math.random()}`
                                          : row.Name
          }
          // Use the correct identifier for rows
          getRowClassName={(params) => {
            if (customCss) {
              if (!params.row.val) return "invalid-row";
              if (params.row.dup) return "duplicate-row";
            }
            return params.indexRelativeToCurrentPage % 2 === 0
              ? "even-row"
              : "odd-row";
          }}
          getRowHeight={getRowHeight}
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              // textAlign: "center",
              backgroundColor: "#11395C", // Set the header background color to grey
              color: "#fff", // Optionally set the text color to white for better contrast
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "11px",
              // alignItems: "center",
              alignContent: customCss ? "center" : "",
              color: "#000",
              border: "1px solid #D3D3D3 !important",
            },
            "& .editable-cell": {
              backgroundColor: "#ffffff", // editable cell background color
              cursor: "pointer",
            },
            "& .editable-cell:hover": {
              backgroundColor: "#cce7ff",
            },

            ...(customCss && {
              "& .duplicate-row": {
                backgroundColor: "#f9e28e !important", // light yellow
              },
              "& .invalid-row": {
                backgroundColor: "#ffadb0 !important", // light red
              },
            }),
          }}
          slots={
            isCustomBtn
              ? {
                  footer: () => (
                    <Button
                      variant="outlined"
                      sx={{
                        width: "15%",
                        m: 2,
                        color: "#11395C",
                        textTransform: "none",
                        borderColor: "#11395C",
                      }}
                      onClick={handleContractMailClick}
                    >
                      Send Email
                    </Button>
                  ),
                }
              : undefined
          }
          slotProps={{
            pagination: {
              sx: {
                "& .MuiTablePagination-toolbar": {
                  alignItems: "center",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "13px",
                  marginBottom: 0,
                  fontFamily: "Public Sans",
                },
                "& .MuiInputBase-root": {
                  marginTop: 0,
                },
              },
            },
          }}
        />
      </Paper>
    </>
  );
};

export default DataTable;
