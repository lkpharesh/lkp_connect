import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { renderField, renderPreviousRemarks, renderSection } from "./utils";

const UnlistedM = ({
  open,
  onClose,
  data,
  handleAction,
  onDownloadDealSheet,
  approverLevel = "1",
}: any) => {
  const [remarks, setRemarks] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [payRemarks, setPayRemarks] = useState([
    { payDate: "", payRefNo: "", amount: "" },
    { payDate: "", payRefNo: "", amount: "" },
    { payDate: "", payRefNo: "", amount: "" },
  ]);

  useEffect(() => {
    if (open) {
      setRemarks("");

      setDownloading(false);
    }
  }, [open, data]);

  const handleActionClick = async (action: "approve" | "reject") => {
    try {
      await handleAction?.({ data, remarks, action, payRemarks });
    } finally {
    }
  };

  const handleDownload = async () => {
    if (!onDownloadDealSheet || downloading) return;

    try {
      setDownloading(true);
      await onDownloadDealSheet(data);
    } finally {
      setDownloading(false);
    }
  };

  if (!data) return null;
  const totalPayAmount = payRemarks.reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0,
  );

  const requiredAmount = (Number(data?.crt) || 0) * (Number(data?.nsh) || 0);

  const isPaymentAmountValid = totalPayAmount >= requiredAmount;
  return (
    <Dialog
      open={open}
      onClose={downloading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          maxHeight: "85vh",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.75,
          backgroundColor: "#11395c",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontSize={16} fontWeight={700}>
          Unlisted Transaction Details
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "#fff" }}
          aria-label="Close dialog"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#f1f5f9",
          p: 2,
          "&:first-of-type": { pt: 2 },
        }}
      >
        {renderSection("Transaction Details", [
          ["RM Code", data.rmc],
          ["Transaction Date", data.tdt],
          ["Client Name", data.cn],
          ["Client Code", data.cc],
          ["Securities Name", data.nsec],
          ["ISIN", data.isin],
          ["Vendor Name", data.vnm],
          ["PAN Card", data.panno],
        ])}

        {renderSection("Client DP Details", [
          ["DP Name", data.dpnm],
          ["DP ID", data.dpid],
        ])}

        {renderSection("Client Bank Details", [
          ["Bank Account Number", data.accno],
          ["Bank Name", data.bnknm],
          ["IFSC Code", data.ifsc],
          ["Payment Mode", data.paym],
          ["Date of Issue", data.isudt],
          ["Cheque / Reference Number", data.cqnum],
        ])}

        {renderSection("Transaction Calculations", [
          ["Client Rate", data.crt],
          ["Vendor Rate", data.vrt],
          ["Number of Shares", data.nsh],
          ["LKP Commission per Share", data.lcps],
          ["Brokerage Inclusive GST", data.big],
          ["Total GST", data.gst],
          ["Brokerage Exclusive GST", data.beg],
          ["Sub-broker Rate", data.sbr],
          ["Sub-broker Code", data.sbc],
          ["Sub-broker Commission", data.sbcm],
          ["Net Brokerage", data.nbg],
        ])}

        {(approverLevel === "2" || approverLevel === "final") && (
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 1.5,
              mb: 1.5,
              backgroundColor: "#fff",
            }}
          >
            <Typography fontSize={13} fontWeight={700} color="#163b5c" mb={1.5}>
              Previous Approver Remarks
            </Typography>

            {renderPreviousRemarks(
              "Approver 1 Remarks",
              data.PreApproverRemarks[0].remarks,
            )}

            {approverLevel === "final" &&
              renderPreviousRemarks(
                "Approver 2 Remarks",
                data.PreApproverRemarks[1].remarks,
              )}
          </Box>
        )}

        {approverLevel === "2" && (
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 1.5,
              mb: 1.5,
              backgroundColor: "#fff",
            }}
          >
            <Typography fontSize={13} fontWeight={700} color="#163b5c" mb={1.5}>
              Approver Reference Details
            </Typography>

            {payRemarks.map((item, index) => (
              <Box key={index} mb={2}>
                <Typography fontSize={12} fontWeight={600} mb={1}>
                  Payment Reference {index + 1}
                </Typography>

                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Payment Date"
                      InputLabelProps={{ shrink: true }}
                      value={item.payDate}
                      onChange={(e) =>
                        setPayRemarks((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? { ...row, payDate: e.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Reference Number"
                      value={item.payRefNo}
                      onChange={(e) =>
                        setPayRemarks((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? { ...row, payRefNo: e.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Amount"
                      value={item.amount}
                      onChange={(e) =>
                        setPayRemarks((prev) =>
                          prev.map((row, i) =>
                            i === index
                              ? { ...row, amount: e.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
        {approverLevel === "final" && (
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 1.5,
              mb: 1.5,
              backgroundColor: "#fff",
            }}
          >
            <Typography fontSize={13} fontWeight={700} color="#163b5c" mb={1.5}>
              Previous Payment Reference Details
            </Typography>

            {(data.PayRemarks ?? []).map((item: any, index: number) => (
              <Box key={index} mb={2}>
                <Typography fontSize={12} fontWeight={600} mb={1}>
                  Payment Reference {index + 1}
                </Typography>

                <Grid container spacing={1.5}>
                  {renderField("Payment Date", item.payDate, 4)}
                  {renderField("Reference Number", item.payRefNo, 4)}
                  {renderField("Amount", item.amount, 4)}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
        <Box
          sx={{
            border: "1px solid #dbe5ef",
            borderRadius: 2,
            p: 1.5,
            backgroundColor: "#fff",
          }}
        >
          <Typography fontSize={13} fontWeight={700} color="#163b5c" mb={1}>
            Your Remarks
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            multiline
            minRows={2}
            maxRows={4}
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: 12.5,
                borderRadius: 1.5,
              },
            }}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          gap: 1,
          backgroundColor: "#fff",
          flexWrap: "wrap",
        }}
      >
        {approverLevel === "final" && (
          <Button
            variant="outlined"
            size="small"
            startIcon={
              downloading ? <CircularProgress size={15} /> : <DownloadIcon />
            }
            onClick={handleDownload}
            disabled={downloading || !onDownloadDealSheet}
            sx={{
              textTransform: "none",
              mr: "auto",
            }}
          >
            {downloading ? "Downloading..." : "Download Deal Sheet"}
          </Button>
        )}

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={onClose}
          sx={{ textTransform: "none", mr: "auto" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={downloading}
          onClick={() => handleActionClick("reject")}
          sx={{ textTransform: "none", px: 2, boxShadow: "none" }}
        >
          Reject
        </Button>

        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={
            downloading || (approverLevel === "2" && !isPaymentAmountValid)
          }
          onClick={() => handleActionClick("approve")}
          sx={{ textTransform: "none", px: 2, boxShadow: "none" }}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnlistedM;
