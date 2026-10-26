import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  Button,
} from "reactstrap";
import { DataGrid } from "@mui/x-data-grid";
import "../../../components/common/table/style.css";
import {
  clientNotTradedColumns,
  spipRenewalColumns,
  upcomingDormantClientColumns,
  newClientAddFiveDays,
  spipSubscriptionColumns,
  getBrokerageKycDetails,
  MTFStockAgeingColumns,
  extendedAmcReport,
  stopLossTrilogyColumns,
  stopLossSPIPColumns,
  MTFStockAgeingSaleColumns,
  SlbmClientDetailsColumns,
} from "../../../helper/tableColumns.tsx";
import { Stack, TextField } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";

const NudgeTable = ({
  isOpen,
  onClose,
  selectedReport,
  filteredData,
  singleData,
  handleAction,
  handleDownload,
  selectedTab,
  slbmSelectedRow,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: any;
  filteredData?: Record<string, any[]>;
  singleData?: any;
  selectedTab?: any;
  handleAction?: (payload: {
    row: any;
    remarks: string;
    action: "A" | "R";
  }) => void;
  handleDownload?: (row: any) => void;
  slbmSelectedRow?: {
    scrip: string;
    scripName: string;
    series: string;
  } | null;
}) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [remarks, setRemarks] = useState<string>("");
  const [showValidation, setShowValidation] = useState(false); // for red textfield when empty
  const [activeTab, setActiveTab] = useState<"sub" | "cmp">(
    selectedTab ?? "sub",
  );

  useEffect(() => {
    console.log("SelectedTab111", selectedTab, singleData, selectedTab);
  }, [selectedTab, singleData, selectedTab]);

  useEffect(() => {
    setActiveTab(selectedTab ?? "sub");
  }, [isOpen, selectedTab]);

  const handleActionClick = (actionType: "A" | "R") => {
    // Validation: remarks should not be empty
    if (!remarks.trim()) {
      setShowValidation(true);
      return;
    }
    // Clear error before proceeding
    setShowValidation(false);
    // Proceed with parent callback
    handleAction?.({
      row: singleData,
      remarks: remarks.trim(),
      action: actionType,
    });

    console.log(singleData, remarks, actionType, "from nudge");

    // Optional: reset input
    setRemarks("");
  };

  useEffect(() => {
    console.log("filteredData:", filteredData);
    console.log(singleData, "singleData");
    setShowValidation(false);
  }, [filteredData, isOpen]);

  // Get data specific to selectedReport
  const reportData = useMemo(() => {
    if (selectedReport === "AMC Contest Report") {
      const list =
        activeTab === "sub"
          ? singleData?.submittedList
          : singleData?.completedList;

      return Array.isArray(list)
        ? list.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
        : [];
    }

    if (Array.isArray(singleData)) {
      return singleData;
    }

    const data = filteredData?.[selectedReport];

    return Array.isArray(data) ? data : [];
  }, [filteredData, singleData, selectedReport, activeTab]);

  // Select columns based on the selectedReport
  const columns = useMemo(() => {
    switch (selectedReport) {
      case "Client not traded since last 10 days":
        return clientNotTradedColumns;

      case "SPIP Renewal in next 30 days":
        return spipRenewalColumns;

      case "New Client added in last 5 days":
        return newClientAddFiveDays;

      case "Upcoming Dormant Client":
        return upcomingDormantClientColumns;

      case "SPIP Subscription in last 10 days":
        return spipSubscriptionColumns;

      case "MTF Stock Ageing Report":
        return MTFStockAgeingColumns;

      case "MTF Stock Ageing Sale Report":
        return MTFStockAgeingSaleColumns;

      case "AMC Contest Report":
        return extendedAmcReport;

      case "More details about segment":
        return getBrokerageKycDetails(handleDownload ?? (() => {}));

      case "SLBM Client Detail":
        return SlbmClientDetailsColumns;

      case "Client List":
        if (selectedTab === "SPIP") {
          return stopLossSPIPColumns;
        }
        if (selectedTab === "Trilogy") {
          return stopLossTrilogyColumns;
        }
        return [];

      default:
        return [];
    }
  }, [selectedReport, selectedTab]);

  const rowHeight = 40;
  const headerHeight = 56;
  const padding = 40;
  const minHeight = 200;
  const calculatedHeight = Math.min(
    Math.max(reportData.length * rowHeight + headerHeight + padding, minHeight),
    400,
  );

  const reportDataCustom = filteredData?.[selectedReport]?.[0];
  console.log("reportDataCustom", reportDataCustom);

  return (
    <Modal size="xl" isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader
        className="modal-title"
        id="myExtraLargeModalLabel"
        toggle={onClose}
        style={{
          padding: "8px 16px",
          marginBottom: "0px",
          marginRight: selectedReport === "SLBM Client Detail" ? "20px" : "0px",
        }}
      >
        {selectedReport === "AMC Contest Report" ? (
          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
              marginTop: ".5rem",
            }}
          >
            <div
              onClick={() => setActiveTab("sub")}
              style={{
                cursor: "pointer",
                borderBottom:
                  activeTab === "sub" ? "2px solid #11395C" : "none",
                paddingBottom: "4px",
                fontWeight: activeTab === "sub" ? "600" : "400",
                color: activeTab === "sub" ? "#11395C" : "#666",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Submitted Count
              <span
                style={{
                  backgroundColor: "#e3e6eb",
                  color: "#666",
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  minWidth: "22px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {singleData?.summary?.sub_tot}
              </span>
            </div>

            <div
              onClick={() => setActiveTab("cmp")}
              style={{
                cursor: "pointer",
                borderBottom:
                  activeTab === "cmp" ? "2px solid #11395C" : "none",
                paddingBottom: "4px",
                fontWeight: activeTab === "cmp" ? "600" : "400",
                color: activeTab === "cmp" ? "#11395C" : "#666",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Completed Count
              <span
                style={{
                  backgroundColor: "#e3e6eb",
                  color: "#666",
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  minWidth: "22px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {singleData?.summary?.cmp_tot}
              </span>
            </div>
          </div>
        ) : (
          <>
            <span style={{ marginLeft: "1.5rem" }}>{selectedReport}</span>
            {selectedReport === "SLBM Client Detail" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "1.5rem",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#667085",
                  }}
                >
                  <span style={{ fontWeight: 100 }}>Scrip:</span>{" "}
                  {slbmSelectedRow?.scrip || "-"}
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#667085",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#667085",
                    }}
                  >
                    <span style={{ fontWeight: 100 }}>Scrip Name:</span>{" "}
                    {slbmSelectedRow?.scripName || "-"}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#667085",
                    }}
                  >
                    <span style={{ fontWeight: 100 }}>Series:</span>{" "}
                    {slbmSelectedRow?.series || "-"}
                  </div>
                  {/* )} */}
                </div>
              </div>
            ) : (
              <span style={{ marginLeft: "1.5rem" }}>{selectedReport}</span>
            )}
          </>
        )}
      </ModalHeader>

      <ModalBody
        style={{
          paddingTop: selectedReport === "SLBM Client Detail" ? "0px" : "8px",
        }}
      >
        <Card className="main-card">
          <CardBody
            className="main-card-body"
            style={{
              overflow: "hidden",
              height: `${calculatedHeight}px`,
              width: "100%",
              overflowX: "auto",
              fontFamily: "Public Sans, sans-serif",
              padding: "10px",
            }}
          >
            {selectedReport === "MTF Stock Ageing Report" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "130px auto",
                  alignItems: "center",
                  marginBottom: ".1rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 200,
                    fontSize: "12px",
                    color: "grey",
                  }}
                >
                  Client Name / Code :
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "grey",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {reportDataCustom?.cn || "-"} / {reportDataCustom?.cc || "-"}
                </div>
              </div>
            )}

            <DataGrid
              rows={reportData.map((row: any, index: any) => ({
                id: index,
                ...row,
              }))}
              columns={columns}
              pageSizeOptions={[0, 5]}
              rowHeight={30}
              localeText={{ noRowsLabel: "No Records!" }}
              sx={{
                border: 0,
                fontFamily: '"Public Sans", sans-serif',
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#11395C",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "12px",
                },
                "& .MuiDataGrid-cell": {
                  fontFamily: '"Public Sans", sans-serif',
                  fontSize: "12px",
                  color: "#000",
                  border: "1px solid #D3D3D3 !important",
                },
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0
                  ? "even-row"
                  : "odd-row"
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
          </CardBody>
        </Card>
        {selectedReport === "More details about segment" && (
          <div style={{ marginTop: "20px" }}>
            <Stack spacing={2} direction="column">
              <TextField
                label="Remarks"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (e.target.value.trim()) {
                    setShowValidation(false); // live remove error
                  }
                }}
                error={showValidation && !remarks.trim()}
                fullWidth
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  style={{
                    backgroundColor: "#EE4B2B",
                    borderColor: "#EE4B2B",
                    color: "#fff",
                  }}
                  onClick={() => handleActionClick("R")}
                >
                  Reject
                </Button>
                <Button
                  style={{ color: "white", backgroundColor: "#11395C" }}
                  onClick={() => {
                    handleActionClick("A");
                  }}
                >
                  Approve
                </Button>
              </Stack>
            </Stack>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default NudgeTable;
