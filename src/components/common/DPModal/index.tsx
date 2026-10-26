import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal as ReactstrapModal,
  ModalBody,
  Col,
  Row,
  Input,
} from "reactstrap";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { regEx } from "../../../helper/method";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { AuthUser } from "../../../redux/thunk/AuthUser";
import { updateUserId } from "../../../redux/slices/Login/login";
import ShowToast from "../../../utils/toastUtils";
import { useVendors } from "../../../pages/UnlistedShare/ApproverOne/VendorContext";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
// import { isAdminAccess } from "../../../helper/commmon";
import { pdfjs, Document, Page } from "react-pdf";
import ApnContest from "../../../pages/Contest/ApnContest";
import ApnContestQ4 from "../../../pages/Contest/ApnContestQ4";
import { encryptAES } from "../../../utils/encryptDecrypt";
import { setAuthenticationValue } from "../../../redux/slices/AuthnticateUser";
import EmployeeSPIP from "../../../pages/Contest/SPIP/Employee";
import ApnSPIP from "../../../pages/Contest/SPIP/Partner";
import B2BSPIP from "../../../pages/Contest/SPIP/B2B";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any, dis?: any) => void;
  row?: any;
  handleApproval?: (
    value: any,
    remark: string,
    entryFlag: string,
    base64?: string,
    vendorId?: string,
  ) => void;

  Msg?: string;
  activeSubItem?: any;
  action?: "approve" | "reject" | "delete";
  expiredtime?: boolean;
  isAdmin?: boolean;
  isUploadMode?: boolean;
  handleFileUpload?: (selectedRow: string, file: File, remark: string) => void;
  setShowImg?: any;
  previewUrl?: any;
  setSetShowImg?: any;
  showDocument?: any;
  fileExtension?: any;
  isDropUpload?: any;
  isPartnerContest?: boolean;
  isSPIPContest?: boolean;
  handleVerifyDetails?: (accNo: any, ifscCode: any) => void;
  isBankVerified?: any;
  setIsBankVerified?: any;
  beneficiaryName?: any;
  selectedTab?: any;
}

const prefixOptions = ["EMP", "APN"];

const CustomModal = ({
  tog_center,
  modal_center,
  setmodal_center,
  getUserDetails,
  row,
  Msg,
  action,
  handleApproval,
  activeSubItem,
  expiredtime,
  isAdmin,
  isUploadMode,
  handleFileUpload,
  setShowImg,
  previewUrl,
  setSetShowImg,
  showDocument,
  fileExtension,
  isDropUpload,
  isPartnerContest,
  isSPIPContest,
  handleVerifyDetails,
  isBankVerified,
  setIsBankVerified,
  beneficiaryName,
  selectedTab,
}: CustomModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const vendors = useVendors();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // const isImage = ["jpg", "jpeg", "png", "gif", "bmp"].includes(
  //   fileExtension.toLowerCase()
  // );
  // const isPDF = fileExtension.toLowerCase() === "pdf";

  // const { name } = useSelector(
  //   (state: RootState) => state.AuthUser?.data?.data
  // );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("TestProps", "row", row, action);
  }, [row, action]);

  useEffect(() => {
    if (activeSubItem === "mandateCall" && row) {
      formik.setValues({
        ...formik.values,
        umn: row.umn || "",
        mandateAmount: row.amount || "",
        mandateUpi: row.upi || "",
      });
    }
  }, [activeSubItem, row]);

  useEffect(() => {
    console.log("Actionnn", action);
  }, [action]);

  useEffect(() => {
    if (activeSubItem === "Vendor Approval" && selectedFile) {
      handleFileUpload?.(row, selectedFile, formik.values.tdsFlag);
    }
  }, [activeSubItem, selectedFile]);

  const handleSessionClear = () => {
    localStorage.clear();
    sessionStorage.clear();
    setmodal_center(false);
    navigate("/");
  };
  const shouldValidateRemark = () =>
    [
      "Communication Retrival Checker",
      "KYC Approval",
      "RH Approval",
      "Pre Trade Approval",
      "Third Party Vendor Approval",
      "Third Party Invoice Verify",
    ].includes(activeSubItem) &&
    !isAdmin &&
    !showDocument &&
    action !== "delete";

  const formik = useFormik({
    initialValues: {
      remark: "",
      userChangeValue: "",
      userPanValue: "",
      dropdownOption: "",
      tdsFlag: "Yes",
      uploadProof: null,
      prefix: "EMP",
      disNo: "",

      // mandateCall fields
      umn: row?.umn || "",
      mandateAmount: row?.amount,
      mandateUpi: row?.upi,
    },
    validationSchema: Yup.object({
      // For Vendor Approval
      ...(activeSubItem === "Vendor Approval" &&
        action === "approve" && {
          remark: Yup.string().trim().required("Remark is required"),
          tdsFlag: Yup.string().required("TDS Flag is required"),
          uploadProof: Yup.mixed<File>()
            .nullable()
            .when("tdsFlag", {
              is: "Yes", // only validate when Yes
              then: (schema) =>
                schema
                  .required("TDS Document is required")
                  .test("fileSize", "File too large", (value) =>
                    value instanceof File
                      ? value.size <= 5 * 1024 * 1024
                      : true,
                  )
                  .test("fileType", "Unsupported file format", (value) =>
                    value instanceof File
                      ? ["application/pdf", "image/jpeg", "image/png"].includes(
                          value.type,
                        )
                      : true,
                  ),
              otherwise: (schema) => schema.notRequired(),
            }),
        }),

      // Remark validation for "Communication Retrival Checker"
      ...((activeSubItem === "Communication Retrival Checker" ||
        activeSubItem === "KYC Approval" ||
        activeSubItem === "RH Approval" ||
        activeSubItem === "Third Party Vendor Approval" ||
        activeSubItem === "Vendor Approval" ||
        activeSubItem === "Pre Trade Approval" ||
        activeSubItem === "LKP Bank Approval") &&
        !isAdmin && {
          remark: Yup.string().trim().required("Remark is required"),
        }),
      ...(shouldValidateRemark() && {
        remark: Yup.string().trim().required("Remark is required"),
      }),

      // Admin validation for userChangeValue
      ...(isAdmin && {
        userChangeValue: Yup.string()
          .trim()
          .matches(/^[0-9]{4}$/, "Client code must be exactly 4 digits")
          .required("Client code is required"),

        userPanValue: Yup.string()
          .trim()
          .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
          .required("PAN number is required"),
      }),
      ...(isDropUpload && {
        remark: Yup.string().required("Remark is required"),
        dropdownOption: Yup.string().required("Vendor Name is required"),
      }),
      ...(activeSubItem === "mandateCall" && {
        mandateAmount: Yup.number()
          .min(10000, "Amount must be at least 10,000")
          .required("Amount is required"),

        mandateUpi: Yup.string().trim().required("UPI ID is required"),
      }),
      ...(activeSubItem === "Unlisted Contract Note" && {
        disNo: Yup.string()
          .trim()
          .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters allowed")
          .required("DIS No is required"),
      }),
    }),
    onSubmit: (values) => {
      if (activeSubItem === "Unlisted Contract Note") {
        console.log("Row", row);
        getUserDetails?.(row, values?.disNo);
        setmodal_center(false);
        formik.resetForm();
        return;
      }

      if (activeSubItem === "mandateCall") {
        console.log({
          umn: values.umn,
          amount: values.mandateAmount,
          upi: values.mandateUpi,
        });

        getUserDetails?.({
          ...row,
          umn: values.umn,
          amount: values.mandateAmount,
          upi: values.mandateUpi,
          customDisable: true,
        });

        setmodal_center(false);
        return;
      }
      if (
        action === "delete" ||
        activeSubItem === "DP Debit Recovery" ||
        activeSubItem === "mandateCall"
      ) {
        if (getUserDetails && row) {
          getUserDetails(row);
        }
        setmodal_center(false);
        console.log("test112121212", action, row);
        return; // 🚨 prevent further execution
      }

      if (action && row) {
        const entryFlag = action === "approve" ? "A" : "R";
        const standardItems = [
          "Communication Retrival Checker",
          "KYC Approval",
          "RH Approval",
          "Pre Trade Approval",
          "Third Party Vendor Approval",
          "Third Party Invoice Verify",
          "Vendor Approval",
          "mandateCall",
          "Unlisted Scrip Master",
          "LKP Bank Approval",
        ];
        const isStandardFlow = standardItems.includes(activeSubItem);
        const isSpecialRejectCase =
          activeSubItem === "Unlisted Shares Approval 1" && action === "reject";
        if (isStandardFlow || isSpecialRejectCase) {
          handleApproval?.(row, values.remark, entryFlag);
        }
        console.log(values.remark, "values.remark", row, entryFlag);
        formik.resetForm();
        setmodal_center(false);
      }
    },
  });

  const handleClose = () => {
    setmodal_center(false);
    formik.resetForm();
    setSelectedFile(null);
    setIsBankVerified(false);
    setZoomLevel(1);
    setIsDragging(false);
    setScrollPos({ left: 0, top: 0 });
    setPdfPageNumber(1);
  };

  const handleCustomChange = (event: any) => {
    const { name, value } = event.target;
    console.log("eventCheck", name, value);

    if (name === "userChangeValue") {
      if (regEx.number.test(value)) {
        formik.setFieldValue(name, value.replace(/\s/g, ""));
      }
    } else if (name === "userPanValue") {
      const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      formik.setFieldValue(name, sanitizedValue);
    } else {
      formik.handleChange(event);
    }
  };

  const handleUserClick = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        userChangeValue: true,
        userPanValue: true,
      });
      return;
    }
    let payload = {
      user_id:
        formik?.values?.prefix === "EMP"
          ? `EMP-${formik.values.userChangeValue}`
          : `APN-${formik.values.userChangeValue}`,
      user_type: formik?.values?.prefix === "EMP" ? "Employee" : "Partner",
      auth_type: "PAN",
      auth_value: formik.values.userPanValue,
    };
    console.log("Payload", payload);
    dispatch(showLoader("Please wait, we are processing your request..."));
    dispatch(AuthUser(payload))
      .unwrap()
      .then((response) => {
        console.log("2FAresponse", response);
        if (response?.status === 200) {
          const { token, user_type } = response?.data;
          setTimeout(() => {
            console.log("2FA_Response", response?.data);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("tkn", token);
            localStorage.setItem(
              "authPan",
              encryptAES(formik?.values?.userPanValue),
            );
            localStorage.setItem("uIdType", user_type);
            console.log("panValue", formik.values?.userPanValue);
            dispatch(setAuthenticationValue(formik.values.userPanValue));
            // localStorage.setItem("userName", name);
            dispatch(
              updateUserId(
                `${formik.values.prefix}-${formik.values.userChangeValue}`,
              ),
            );
            localStorage.setItem(
              "Id",
              `${formik.values.prefix}-${formik.values.userChangeValue}`,
            );
            setmodal_center(false);
            formik.resetForm();
            window.location.reload();
          }, 300);
          // navigate("/dashboard");
        }
      })
      .catch((error) => {
        const { message } = error;
        console.log("Error->", message);
        dispatch(hideLoader());
        // formik.setFieldError("password", message);
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time.",
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file); // This will convert to base64 with MIME prefix
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUploadClick = () => {
    if (selectedFile && handleFileUpload) {
      console.log("rowCheck-->", row);

      handleFileUpload(row, selectedFile, formik.values.remark);
      setSelectedFile(null);
      setmodal_center(false);
      formik.setFieldValue("remark", "");
    } else {
      ShowToast("error", "Please select a file to upload.");
    }
  };
  const handleDropUploadClick = async () => {
    // Validate Formik fields first
    const isValid = await formik.validateForm().then((errors) => {
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          remark: true,
          dropdownOption: true,
        });
        return false;
      }
      return true;
    });

    // Validate file input
    // if (!selectedFile) {
    //   ShowToast("error", "Please select a PDF file to upload.");
    //   return;
    // }

    if (!isValid) {
      ShowToast("error", "Please fill all required fields.");
      return;
    }
    let base64 = "";
    if (selectedFile) {
      const base64String = await fileToBase64(selectedFile);
      console.log("Base64 file:", base64String);
      base64 = base64String;
    }
    //  All fields are valid
    console.log(
      "rowCheck Base64-->",
      row,
      formik.values.remark,
      "dropdwon====>",
      formik.values.dropdownOption,
      "base64====>",
      base64,
      action,
    );
    handleApproval?.(
      row,
      formik.values.remark,
      action ?? "approve",
      formik.values.dropdownOption,
      // base64
    );
    setSelectedFile(null);
    setmodal_center(false);
    formik.resetForm(); // handleFileUpload(row, selectedFile, formik.values.remark);
  };

  const handleVerifyBank = () => {
    const { actn, ifsc } = row;
    handleVerifyDetails?.(actn, ifsc);
  };

  const renderMandateFields = () => (
    <Box sx={{ mt: 2 }}>
      {/* UMN */}
      <TextField
        label="UMN"
        size="small"
        fullWidth
        disabled
        value={formik.values.umn ? formik.values.umn : row?.umn}
        sx={{ mb: 2 }}
      />

      {/* Amount (numeric only) */}
      <TextField
        label="Amount"
        size="small"
        fullWidth
        name="mandateAmount"
        value={
          formik.values.mandateAmount
            ? formik.values.mandateAmount
            : row?.amount
        }
        onChange={(e) => {
          const value = e.target.value;

          // allow empty + numeric only
          if (/^[0-9]*$/.test(value)) {
            formik.setFieldValue("mandateAmount", value);
          }
        }}
        onBlur={() => {
          const value = Number(formik.values.mandateAmount);

          formik.setFieldTouched("mandateAmount", true);

          if (value && value < 5000) {
            formik.setFieldError(
              "mandateAmount",
              "Amount must be at least 5000",
            );
          }
        }}
        error={
          formik.touched.mandateAmount && Boolean(formik.errors.mandateAmount)
        }
        helperText={
          formik.touched.mandateAmount &&
          typeof formik.errors.mandateAmount === "string"
            ? formik.errors.mandateAmount
            : ""
        }
        sx={{ mb: 2 }}
      />

      {/* UPI ID */}
      <TextField
        label="UPI ID"
        size="small"
        fullWidth
        name="mandateUpi"
        value={formik.values.mandateUpi ? formik.values.mandateUpi : row?.upi}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mandateUpi && Boolean(formik.errors.mandateUpi)}
        helperText={
          formik.touched.mandateUpi &&
          typeof formik.errors.mandateUpi === "string"
            ? formik.errors.mandateUpi
            : ""
        }
      />
    </Box>
  );

  const renderHeaderIcon = () => {
    if (isAdmin) {
      return <ChangeCircleIcon sx={{ color: "#11395C", fontSize: "3.5rem" }} />;
    }
    if (
      ![
        "Communication Retrival Checker",
        "Pre Trade Proof Upload",
        "Pre Trade Report",
        "Pre Trade Approval",
        "Vendor Creation",
      ].includes(activeSubItem) &&
      !showDocument &&
      !isAdmin
    ) {
      return <i className="ri-alert-line display-5 text-warning"></i>;
    }
    return null;
  };

  const renderMessage = () => {
    if (activeSubItem === "DP Debit Recovery" && !isAdmin) {
      return (
        <>
          <h6 className="mb-4">
            An email will be sent informing the client about his DP Debit dues
            along with a link for payment.
          </h6>
          <h6 className="mb-3">{Msg}</h6>
        </>
      );
    }
    return <h6 className="mb-3">{Msg}</h6>;
  };

  const shouldShowRemarkField = () => {
    console.log(action, "dsdsdsdsd", activeSubItem);
    const remarkItems = [
      "Communication Retrival Checker",
      "KYC Approval",
      "RH Approval",
      "Pre Trade Approval",
      "Third Party Vendor Approval",
      "Vendor Approval",
      "Third Party Invoice Verify",
      "LKP Bank Approval",
    ];
    return (
      remarkItems.includes(activeSubItem) &&
      !showDocument &&
      !isAdmin &&
      action !== "delete"
    );
  };

  const renderVendorFields = () => (
    <>
      <TextField
        label="Bank Acc No"
        variant="outlined"
        fullWidth
        size="small"
        value={row?.actn}
        disabled={true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="accNo"
        sx={{ mt: 2 }}
      />
      <TextField
        label="IFSC No"
        variant="outlined"
        fullWidth
        size="small"
        value={row?.ifsc}
        disabled={true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="accNo"
        sx={{ mt: 2 }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // ensures opposite sides
          mt: 1.5,
          width: "100%",
        }}
      >
        {isBankVerified ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#11395C",
              fontSize: "12px",
              flex: 1,
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Beneficiary Name:{" "}
            <span style={{ color: "#2e7d32", fontFamily: "Public Sans" }}>
              {beneficiaryName}
            </span>
          </Typography>
        ) : (
          <Box sx={{ flex: 1 }} /> // keeps spacing consistent when hidden
        )}

        <Button
          style={{
            fontSize: "10px",
            minWidth: "37px",
            padding: "5px 12px",
            borderRadius: "6px",
            // marginTop: "px",
            color: "#fff",
            backgroundColor: "#11395C",
            borderColor: "#11395C",
            cursor: isBankVerified ? "not-allowed" : "pointer",
          }}
          disabled={isBankVerified}
          onClick={handleVerifyBank}
        >
          {isBankVerified ? "Verified!" : "Verify Bank Account?"}
        </Button>
      </Box>

      {/* TDS Flag Section */}
      <FormControl sx={{ width: "100%", mt: 2 }}>
        <FormLabel
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "left",
            color: "#11395C",
            // mb: 1,
          }}
        >
          TDS Flag
        </FormLabel>

        <RadioGroup
          row
          name="tdsFlag"
          value={formik.values.tdsFlag}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // sx={{ gap: 2 }}
        >
          <FormControlLabel
            value="Yes"
            control={
              <Radio
                sx={{
                  color: "#11395C",
                  "&.Mui-checked": { color: "#11395C" },
                }}
              />
            }
            label="Yes"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
          />

          <FormControlLabel
            value="No"
            control={
              <Radio
                sx={{
                  color: "#11395C",
                  "&.Mui-checked": { color: "#11395C" },
                }}
              />
            }
            label="No"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
          />
        </RadioGroup>

        {formik.touched.tdsFlag && formik.errors.tdsFlag && (
          <FormHelperText error>{formik.errors.tdsFlag}</FormHelperText>
        )}
      </FormControl>

      {/* Upload Proof Section - Shown Only When Yes */}
      {formik.values.tdsFlag === "Yes" && (
        <Box>
          <FormLabel
            sx={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "left",
              color: "#11395C",
            }}
          >
            Upload TDS Document
          </FormLabel>

          {/* If no file uploaded → show Upload Area */}
          {!selectedFile && (
            <>
              {/* Hidden file input */}
              <input
                id="uploadProof"
                name="uploadProof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    formik.setFieldValue("uploadProof", file);
                    setSelectedFile(file);
                  }
                }}
              />

              {/* Styled Upload Area */}
              <label htmlFor="uploadProof">
                <Box
                  sx={{
                    border: "1px dashed #11395C",
                    minWidth: "29rem",
                    borderRadius: "6px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f9fafb",
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#eef6fb" },
                    // p: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", color: "gray" }}
                  >
                    <i
                      className="ri-upload-2-line"
                      style={{
                        fontSize: "20px",
                        color: "#11395C",
                        marginRight: "5px",
                      }}
                    />{" "}
                    (Accepted: JPG, JPEG, PNG, PDF)
                  </Typography>
                </Box>
              </label>
            </>
          )}

          {/* If file uploaded → show only selected file section */}
          {selectedFile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // mt: 1,
                p: 0.5,
                border: "1px solid #ddd",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5",
                minWidth: "29rem",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "#333",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "90%",
                }}
              >
                {selectedFile.name}
              </Typography>

              <i
                className="ri-close-line"
                style={{
                  fontSize: "18px",
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedFile(null);
                  formik.setFieldValue("uploadProof", null); // clear Formik value too
                }}
              />
            </Box>
          )}

          {/* Formik error */}
          {formik.touched.uploadProof && formik.errors.uploadProof && (
            <FormHelperText error>{formik.errors.uploadProof}</FormHelperText>
          )}
        </Box>
      )}
    </>
  );

  const renderRemarkField = () => (
    <TextField
      label="Enter Remark *"
      variant="outlined"
      fullWidth
      size="small"
      value={formik.values.remark}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      name="remark"
      error={formik.touched.remark && Boolean(formik.errors.remark)}
      helperText={formik.touched.remark && formik.errors.remark}
      // sx={{ mb: activeSubItem === "Vendor Approval" ? 2 : 0 }}
    />
  );

  const renderAdminFields = () => (
    <Row style={{ gap: isMobile ? "1rem" : "0", fontFamily: "Public Sans" }}>
      <Col xs={12}>
        <TextField
          size="small"
          label="Enter Client Code"
          variant="outlined"
          name="userChangeValue"
          value={formik.values.userChangeValue}
          onChange={handleCustomChange}
          onBlur={formik.handleBlur}
          fullWidth
          sx={{ width: isMobile ? "100%" : "50%" }}
          inputProps={{ maxLength: 4 }}
          error={
            formik.touched.userChangeValue &&
            Boolean(formik.errors.userChangeValue)
          }
          helperText={
            formik.touched.userChangeValue && formik.errors.userChangeValue
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Select
                  value={formik.values.prefix}
                  onChange={(e) =>
                    formik.setFieldValue("prefix", e.target.value)
                  }
                  size="small"
                  variant="standard"
                  disableUnderline
                  sx={{ minWidth: 60 }}
                >
                  {prefixOptions.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </InputAdornment>
            ),
          }}
        />
      </Col>
      <Col xs={12}>
        <TextField
          size="small"
          label="Enter PAN Number"
          variant="outlined"
          name="userPanValue"
          value={formik.values.userPanValue}
          onChange={handleCustomChange}
          onBlur={formik.handleBlur}
          fullWidth
          inputProps={{ maxLength: 10 }}
          sx={{ width: isMobile ? "100%" : "50%" }}
          error={
            formik.touched.userPanValue && Boolean(formik.errors.userPanValue)
          }
          helperText={formik.touched.userPanValue && formik.errors.userPanValue}
        />
      </Col>
      <Row style={{ justifyContent: "center" }}>
        <Col xs={6} style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            style={{
              width: isMobile ? "100%" : "150px",
              backgroundColor: "#11395C",
              borderColor: "#11395C",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Col>
        <Col xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            style={{
              width: isMobile ? "100%" : "150px",
              backgroundColor: "#EE4B2B",
              borderColor: "#EE4B2B",
            }}
            onClick={handleUserClick}
          >
            Change
          </Button>
        </Col>
      </Row>
    </Row>
  );

  const renderConfirmationButtons = () => (
    <div className="hstack gap-2 pt-2 justify-content-center">
      {expiredtime ? (
        <Button
          className="btn"
          style={{
            width: "80px",
            backgroundColor: "#11395C",
            borderColor: "#11395C",
          }}
          onClick={
            expiredtime
              ? handleSessionClear
              : () => {
                  setmodal_center(false);
                  console.log("clicked Regulator Announcements");
                }
          }
        >
          OK
        </Button>
      ) : (
        <>
          <Button
            className="btn"
            style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="btn"
            type="submit"
            style={{ width: "80px", backgroundColor: "#11395C" }}
            onClick={() => {
              console.log(activeSubItem, "dpMKodal");
            }}
          >
            Yes
          </Button>
        </>
      )}
    </div>
  );

  const renderUploadSection = () => (
    <>
      <div style={{ fontFamily: "Public Sans" }}>
        <h5 style={{ margin: 0, fontWeight: 700 }}>
          Upload Proof of Communication
        </h5>
      </div>
      <Col lg={12} style={{ padding: "16px" }}>
        <Input
          name="uploadProof"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="form-control mb-3"
          onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
          style={{ width: "100%", minHeight: "40px" }}
        />
        <TextField
          label="Enter Remark"
          variant="outlined"
          fullWidth
          size="small"
          className="mb-3"
          value={formik.values.remark}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="remark"
          error={formik.touched.remark && Boolean(formik.errors.remark)}
          helperText={formik.touched.remark && formik.errors.remark}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button
            className="btn"
            style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
            onClick={() => {
              handleClose();
              setSelectedFile(null);
              setmodal_center(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="btn"
            style={{ width: "80px", backgroundColor: "#11395C" }}
            onClick={handleFileUploadClick}
          >
            Upload
          </Button>
        </div>
      </Col>
    </>
  );
  const renderDropUploadSection = () => {
    console.log(row, "merumMD", action, vendors); //  Now this will run

    return (
      <>
        <Col lg={12}>
          <Input
            type="select"
            name="dropdownOption"
            className="form-control mb-3"
            value={formik.values.dropdownOption}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              minHeight: "40px",
              marginTop: "16px",
              borderColor: "#C4C4C4",
            }}
          >
            <option value="">-- Select Vendor Name --</option>
            {Array.isArray(vendors) &&
              vendors.map((vendor) => (
                <option key={vendor.rid} value={vendor.rid}>
                  {vendor.vn}
                </option>
              ))}
          </Input>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              className="btn"
              style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
              onClick={() => {
                handleClose();
                setSelectedFile(null);
                setmodal_center(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn"
              style={{ width: "80px", backgroundColor: "#11395C" }}
              onClick={handleDropUploadClick}
            >
              Yes
            </Button>
          </div>
        </Col>
      </>
    );
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    const container = containerRef.current;
    if (container) {
      setScrollPos({ left: container.scrollLeft, top: container.scrollTop });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (container) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      container.scrollLeft = scrollPos.left - dx;
      container.scrollTop = scrollPos.top - dy;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderContractDisFields = () => {
    return (
      <TextField
        label="Enter DIS No"
        variant="outlined"
        fullWidth
        size="small"
        name="disNo"
        value={formik.values.disNo}
        onChange={(e) => {
          const value = e.target.value;

          // Allow only alphanumeric while typing
          if (/^[a-zA-Z0-9]*$/.test(value)) {
            formik.setFieldValue("disNo", value.toUpperCase());
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.disNo && Boolean(formik.errors.disNo)}
        helperText={
          formik.touched.disNo && typeof formik.errors.disNo === "string"
            ? formik.errors.disNo
            : ""
        }
        sx={{ mt: 2 }}
      />
    );
  };

  const renderImagePreview = () => {
    const extension = fileExtension?.toLowerCase(); // optional chaining
    const isImage = [".png", ".jpg", ".jpeg"].includes(extension);
    const isPDF = extension === ".pdf";

    return (
      <div style={{ textAlign: "center" }}>
        <div
          key={`${fileExtension}-${previewUrl}`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: "100%",
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #ccc",
            borderRadius: "10px",
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isImage && (
            <img
              src={previewUrl}
              onLoad={() => setSetShowImg(true)}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
                transition: "transform 0.2s ease",
                maxWidth: "unset",
                maxHeight: "unset",
                width: "auto",
                height: "auto",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}

          {isPDF && (
            <Document
              file={previewUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading="Loading PDF..."
            >
              <Page
                pageNumber={pdfPageNumber}
                width={440 * zoomLevel}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>

        {(isImage || isPDF) && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleZoomOut}
              variant="outlined"
              disabled={zoomLevel <= 1}
              style={{
                minWidth: "80px",
                height: "30px",
                fontSize: "12px",
                padding: "4px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Zoom Out
            </Button>
            {isPDF && numPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  // size="small"
                  onClick={() =>
                    setPdfPageNumber((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={pdfPageNumber <= 1}
                  style={{
                    minWidth: "80px",
                    height: "30px",
                    fontSize: "12px",
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Prev
                </Button>
                <span>
                  Page {pdfPageNumber} of {numPages}
                </span>
                <Button
                  onClick={() =>
                    setPdfPageNumber((prev) => Math.min(prev + 1, numPages))
                  }
                  disabled={pdfPageNumber >= numPages}
                  style={{
                    minWidth: "80px",
                    height: "30px",
                    fontSize: "12px",
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            <Button
              onClick={handleZoomIn}
              variant="outlined"
              disabled={zoomLevel >= 3}
              style={{
                minWidth: "80px",
                height: "30px",
                fontSize: "12px",
                padding: "4px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Zoom In
            </Button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log("formikValues", formik.values, formik.errors);
  }, [formik.values, formik.errors]);

  useEffect(() => {
    console.log("selectedTab changed:", selectedTab);
  }, [selectedTab]);

  const renderContestByTab = () => {
    // Partner Contest → 2 tabs
    if (isPartnerContest) {
      switch (selectedTab) {
        case 0:
          return (
            <ApnContest
              activeMenu="Partner Contest"
              isCustomRender={true}
              row={row}
            />
          );
        case 1:
          return (
            <ApnContestQ4
              activeMenu="Partner Contest"
              isCustomRender={true}
              row={row}
            />
          );
        default:
          return null;
      }
    }

    // SPIP Contest → 3 tabs
    if (isSPIPContest) {
      switch (selectedTab) {
        case "EMP":
          return (
            <EmployeeSPIP
              activeSubItem="Employee SPIP"
              isCustomRender={true}
              row={row}
            />
          );
        case "APN":
          return (
            <ApnSPIP
              activeSubItem="Partner SPIP"
              isCustomRender={true}
              row={row}
            />
          );
        case "B2B":
          return (
            <B2BSPIP activeSubItem="B2B SPIP" isCustomRender={true} row={row} />
          );
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <ReactstrapModal
      isOpen={modal_center}
      toggle={tog_center}
      centered
      backdrop="static"
      keyboard={false}
      style={{
        maxWidth: setShowImg
          ? "700px"
          : activeSubItem === "Partner Contest Report" ||
              activeSubItem === "SPIP Contest Report"
            ? "90%"
            : "500px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <ModalBody
        className="text-center p-3"
        style={
          isPartnerContest || isSPIPContest
            ? {
                backgroundColor: "#E5E4E2",
              }
            : undefined
        }
      >
        {isPartnerContest || isSPIPContest ? (
          <>
            {!expiredtime && (
              <i
                className="ri-close-line"
                onClick={() => {
                  setmodal_center(false);
                  setSelectedFile(null);
                  handleClose();
                }}
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-1px",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  zIndex: 1000,
                  color: "#000",
                }}
              />
            )}
            {renderContestByTab()}
          </>
        ) : (
          <>
            {!expiredtime && (
              <i
                className="ri-close-line"
                onClick={() => {
                  setmodal_center(false);
                  setSelectedFile(null);
                  handleClose();
                }}
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-1px",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  zIndex: 1000,
                  color: "#000",
                }}
              />
            )}
            {/*  here Icons based on Conditions */}
            {renderHeaderIcon()}
            {/* Message Section */}
            <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
              {renderMessage()}
            </div>
            {/* Main Form */}
            <form onSubmit={formik.handleSubmit}>
              {activeSubItem === "mandateCall" && renderMandateFields()}
              {shouldShowRemarkField() && renderRemarkField()}
              {activeSubItem === "Vendor Approval" &&
                action === "approve" &&
                renderVendorFields()}
              {isAdmin && renderAdminFields()}
              {activeSubItem === "Unlisted Contract Note" &&
                renderContractDisFields()}
              {!isAdmin &&
                !isUploadMode &&
                !isDropUpload &&
                !setShowImg &&
                renderConfirmationButtons()}

              {isUploadMode && renderUploadSection()}
              {isDropUpload && renderDropUploadSection()}
              {setShowImg && renderImagePreview()}
            </form>
          </>
        )}
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
