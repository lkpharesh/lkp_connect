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
  Grid,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const UnlistedM = ({
  open,
  onClose,
  data,
  handleAction,
  onDownloadDealSheet,
  approverLevel = "1",
}: any) => {
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (open) {
      setRemarks("");
      setSubmitting(false);
      setDownloading(false);
    }
  }, [open, data]);

  const formatValue = (value: any) =>
    value === null || value === undefined || value === "" ? "-" : value;

  const handleActionClick = async (action: "approve" | "reject") => {
    if (submitting) return;

    try {
      setSubmitting(true);
      await handleAction?.({ data, remarks, action });
    } finally {
      setSubmitting(false);
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

  const renderField = (label: string, value: any) => (
    <Grid item xs={12} sm={6} key={label}>
      <TextField
        fullWidth
        label={label}
        value={formatValue(value)}
        size="small"
        disabled
        sx={{
          "& .MuiInputBase-root": {
            height: 35,
            fontSize: 12.5,
            backgroundColor: "#e2e8f0",
            borderRadius: 1.5,
          },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#64748b",
          },
          "& .MuiInputLabel-root": { fontSize: 12 },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            transform: "translate(14px, -7px) scale(0.85)",
          },
        }}
      />
    </Grid>
  );

  const renderSection = (title: string, fields: any[]) => (
    <Box
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 2,
        p: 1.5,
        mb: 1.5,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: "#5c3b16",
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={1.5}>
        {fields.map(([label, value]) => renderField(label, value))}
      </Grid>
    </Box>
  );

  const renderPreviousRemarks = (label: string, value: any) => (
    <TextField
      key={label}
      fullWidth
      label={label}
      value={formatValue(value)}
      multiline
      minRows={1}
      maxRows={3}
      size="small"
      disabled
      sx={{
        mb: 1.5,
        "& .MuiInputBase-root": {
          fontSize: 12.5,
          backgroundColor: "#e2e8f0",
          borderRadius: 1.5,
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#64748b",
        },
        "& .MuiInputLabel-root": { fontSize: 12 },
      }}
    />
  );

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
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
          disabled={submitting}
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
          ["Vendor Name", data.VendorName],
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
                data.approver2Remarks,
              )}
          </Box>
        )}

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
            <Typography fontSize={13} fontWeight={700} color="#163b5c" mb={1}>
              Approver Reference Details
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              Reference details will appear here.
            </Typography>
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
            disabled={submitting}
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
            disabled={downloading || !onDownloadDealSheet || submitting}
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
          disabled={submitting}
          sx={{ textTransform: "none", mr: "auto" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          size="small"
          disabled={submitting || downloading}
          onClick={() => handleActionClick("reject")}
          sx={{ textTransform: "none", px: 2, boxShadow: "none" }}
        >
          {submitting ? (
            <CircularProgress size={17} color="inherit" />
          ) : (
            "Reject"
          )}
        </Button>

        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={submitting || downloading}
          onClick={() => handleActionClick("approve")}
          sx={{ textTransform: "none", px: 2, boxShadow: "none" }}
        >
          {submitting ? (
            <CircularProgress size={17} color="inherit" />
          ) : (
            "Approve"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnlistedM;
