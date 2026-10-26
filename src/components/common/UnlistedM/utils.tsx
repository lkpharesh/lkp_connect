import { Box, Grid, TextField, Typography } from "@mui/material";
import ShowToast from "../../../utils/toastUtils";

export const renderField = (label: string, value: any, columns = 6) => (
  <Grid item xs={12} sm={columns} key={label}>
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

export const renderSection = (title: string, fields: any[]) => (
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

export const renderPreviousRemarks = (label: string, value: any) => (
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

export const formatValue = (value: any) =>
  value === null || value === undefined || value === "" ? "-" : value;

export const validatePayRemarks = (payRemarks: any[] = []): boolean => {
  const requiredFields = ["payDate", "payRefNo", "amount"];

  const missingRemarks = payRemarks
    .map((item: any, index: number) => {
      const hasAnyValue = requiredFields.some(
        (key) => String(item[key] ?? "").trim() !== "",
      );

      const missingFields = requiredFields.filter(
        (key) => String(item[key] ?? "").trim() === "",
      );

      const isMandatoryRow = index === 0;

      return {
        missingFields,
        hasAnyValue,
        isMandatoryRow,
      };
    })
    .filter(
      (item) =>
        (item.isMandatoryRow || item.hasAnyValue) &&
        item.missingFields.length > 0,
    );

  if (missingRemarks.length > 0) {
    ShowToast("error", "Payment Reference Required");
    return false;
  }

  return true;
};
