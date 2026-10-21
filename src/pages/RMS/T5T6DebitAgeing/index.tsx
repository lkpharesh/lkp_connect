import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as ReactStrapButton,
} from "reactstrap";
import { Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import type { RootState } from "../../../redux/store";
import { IoIosSend } from "react-icons/io";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { formatDateTime } from "../../../helper/commmon";

interface FormValues {
  excelFile: File | null;
}

const confirmBtnStyle = {
  height: "25px",
  minWidth: "70px",
  padding: "0 12px",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const T5T6DebitAgeing = ({ activeSubItem }: any) => {
  const [lastUploadedDetails, setLastUploadedDetails] = useState<{
    uploadedBy: string;
    uploadedOn: string;
  } | null>(null);
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    fetchLastUploadedDetails();
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      excelFile: null,
    },

    validationSchema: Yup.object({
      excelFile: Yup.mixed<File>()
        .required("Excel file is required")
        .test(
          "excel-format",
          "Only .xls and .xlsx files are accepted",
          (file) => {
            if (!file) return true;

            return /\.(xls|xlsx)$/i.test(file.name);
          },
        ),
    }),

    onSubmit: async (values) => {
      const file = values.excelFile;
      setIsUploadSuccessful(false);
      if (!file) {
        ShowToast("error", "Please upload an Excel file");
        return;
      }

      const formData = new FormData();

      formData.append("File", file);
      formData.append("User_id", user_id);

      dispatch(showLoader(""));

      try {
        console.log("FormData", formData);

        const response = await apiServices.UploadT5T6AgeingDebit(formData);

        // HTTP request successful
        if (response?.status === 200) {
          // API-level validation failed
          if (
            response?.data?.statusCode === 400 ||
            response?.data?.isSuccess === false
          ) {
            ShowToast(
              "error",
              response?.data?.message || "Invalid file format",
            );

            return;
          }

          // API success
          if (
            response?.data?.statusCode === 200 &&
            response?.data?.isSuccess === true
          ) {
            console.log("T5T6 Ageing Debit upload response:", response?.data);
            setIsUploadSuccessful(true);
            ShowToast(
              "success",
              response?.data?.message || "Excel file uploaded successfully",
            );

            formik.resetForm();

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            await fetchLastUploadedDetails();
          } else {
            ShowToast("error", response?.data?.message || "File upload failed");
          }
        } else {
          ShowToast("error", response?.data?.message || "File upload failed");
        }
      } catch (error) {
        console.error("T5T6 Ageing Debit upload error:", error);

        ShowToast("error", "Something went wrong while uploading the file");
      } finally {
        dispatch(hideLoader());
      }
    },
  });

  const fetchLastUploadedDetails = async () => {
    try {
      const response = await apiServices.GetFileuploadDetails({
        option: "T5Ageing",
      });

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data?.length > 0
      ) {
        const details = response.data.data[0];

        setLastUploadedDetails({
          uploadedBy: details.uby || "—",
          uploadedOn: details.uon || "",
        });
      } else {
        setLastUploadedDetails(null);
      }
    } catch (error) {
      console.error("Error fetching last uploaded details:", error);

      setLastUploadedDetails(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    validateAndSetFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    validateAndSetFile(file);

    // Allow selecting the same file again
    event.target.value = "";
  };

  const validateAndSetFile = (file: File) => {
    const isExcelFile = /\.(xls|xlsx)$/i.test(file.name);

    if (!isExcelFile) {
      formik.setFieldValue("excelFile", null);
      formik.setFieldTouched("excelFile", true, false);

      formik.setFieldError(
        "excelFile",
        "Only .xls and .xlsx files are accepted",
      );

      return;
    }

    formik.setFieldError("excelFile", undefined);
    formik.setFieldValue("excelFile", file);
  };

  const downloadOptions = [
    { label: "ONLYBLOCK", optionType: "ONLYBLOCK" },
    { label: "BUYBLOCK", optionType: "BUYBLOCK" },
    { label: "WEBRETAIL", optionType: "WEBRETAIL" },
    { label: "T6MTF/BuyBlock Remove", optionType: "T6MTF" },
    { label: "T6MTF/BuyBlock Assign", optionType: "T6MTFBLOCK" },
    { label: "T6MTF/BuyBlock Remove Test", optionType: "T6MTFTest" },
  ];

  const handleDownloadFile = async (optionType: string) => {
    dispatch(showLoader("Downloading file..."));

    try {
      const response = await apiServices.DownloadT5T6ODINFile({
        user_id: user_id,
        optionType: optionType,
      });

      if (response?.status !== 200 || !response?.data) {
        ShowToast("error", "Failed to download file");
        return;
      }

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "text/plain" });

      let fileName = `${optionType}.txt`;
      const disposition = response?.headers?.["content-disposition"];
      if (disposition) {
        const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
        if (match?.[1]) fileName = decodeURIComponent(match[1]);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download error:", error);
      ShowToast("error", "Something went wrong while downloading the file");
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderUploadBox = (fileValue: File | null) => (
    <div>
      <div
        style={{
          position: "relative",
          border: "1px dashed #ced4da",
          padding: "10px",
          borderRadius: "0.25rem",
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
          width: "25%",
          minHeight: "55px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="excelFile"
          name="excelFile"
          accept=".xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {fileValue ? (
          <>
            <span
              style={{
                fontSize: "13px",
                paddingRight: "35px",
                wordBreak: "break-word",
              }}
            >
              {fileValue.name}
            </span>

            <Tooltip title="Delete file" arrow>
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(event) => {
                  event.stopPropagation();

                  formik.setFieldValue("excelFile", null);

                  formik.setFieldTouched("excelFile", false);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </span>
            </Tooltip>
          </>
        ) : (
          <>
            <span style={{ fontSize: "13px" }}>
              <strong>Click to upload</strong> or drag and drop your{" "}
              <strong>.xls / .xlsx</strong> file here
            </span>

            {/* <div className="mt-1">
              <small
                className="text-muted d-block"
                style={{ fontSize: "12px" }}
              >
                • Only <strong>.xls/.xlsx</strong> files are accepted.
              </small>
            </div> */}
          </>
        )}
      </div>

      {formik.errors.excelFile && formik.touched.excelFile && (
        <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
          {formik.errors.excelFile}
        </div>
      )}
    </div>
  );

  const handleSendEmail = async () => {
    const payload = {
      user_id: user_id,
    };
    dispatch(showLoader("Sending email..."));
    let hasError = false;
    const callApi = async (
      apiFn: (payload: any) => Promise<any>,
      apiName: string,
    ) => {
      try {
        const res = await apiFn(payload);
        if (res?.status !== 200) {
          throw new Error();
        }
      } catch {
        hasError = true;
        ShowToast("error", `${apiName} failed to send email`);
      }
    };

    await callApi(apiServices.SendDealerT5AgeingMail, "Dealer Email");
    await callApi(apiServices.SendRMT5AgeingMail, "RM Email");
    await callApi(apiServices.SendTLT5AgeingMail, "TL Email");
    await callApi(apiServices.SendBMT5AgeingMail, "BM Email");
    await callApi(apiServices.SendAHT5AgeingMail, "AH Email");
    await callApi(apiServices.SendRHT5AgeingMail, "RH Email");
    await callApi(apiServices.SendAPT5AgeingMail, "AP Email");

    dispatch(hideLoader());

    if (!hasError) {
      ShowToast("success", "All emails sent successfully");
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid style={{ minHeight: "85vh" }}>
        <Modal
          isOpen={isEmailConfirmOpen}
          toggle={() => setIsEmailConfirmOpen(false)}
          centered
          style={{ maxWidth: "400px" }}
        >
          <ModalHeader
            toggle={() => setIsEmailConfirmOpen(false)}
          ></ModalHeader>
          <i
            style={{ textAlign: "center" }}
            className="ri-alert-line display-5 text-warning"
          ></i>
          <ModalBody
            style={{ padding: "5px", fontSize: "14px", textAlign: "center" }}
          >
            Are you sure you want to send the Email?
          </ModalBody>

          <ModalFooter
            className="justify-content-center"
            style={{
              padding: "8px 12px",
              minHeight: "unset",
            }}
          >
            <ReactStrapButton
              color="#11395C"
              style={{
                ...confirmBtnStyle,
                borderColor: "#11395C",
                backgroundColor: "#fff",
              }}
              onClick={() => setIsEmailConfirmOpen(false)}
            >
              No
            </ReactStrapButton>

            <ReactStrapButton
              style={{
                ...confirmBtnStyle,
                backgroundColor: "#11395C",
                borderColor: "#11395C",
              }}
              onClick={() => {
                setIsEmailConfirmOpen(false);
                handleSendEmail();
              }}
            >
              Yes
            </ReactStrapButton>
          </ModalFooter>
        </Modal>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              backgroundColor: "#fff",
              padding: "0.5rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">{activeSubItem}</h4>
          </CardHeader>

          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "7px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "1 1 300px",
                    minWidth: "250px",
                  }}
                >
                  <label className="form-label">Upload Excel File</label>
                  {renderUploadBox(formik.values.excelFile)}
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                // fullWidth
                sx={{
                  fontSize: "10px",
                  color: "#fff",
                  width: "25%",
                  height: "30px",
                  bgcolor: "#11395C",
                  "&:hover": {
                    bgcolor: "#0d2d49",
                  },
                  textTransform: "none",
                  padding: "6px 20px",
                }}
              >
                Upload File
              </Button>
              <Col>
                <div className="mb-2" />
                <Button
                  type="button"
                  disabled={!isUploadSuccessful}
                  onClick={() => setIsEmailConfirmOpen(true)}
                  sx={{
                    backgroundColor: "#11395C",
                    fontSize: "10px",
                    height: "30px",
                    color: "#FFF",
                    textTransform: "none",
                    width: "25%",
                    "&:hover": {
                      backgroundColor: "#0d2d49",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#bdbdbd",
                      color: "#ffffff",
                      cursor: "not-allowed",
                    },
                  }}
                >
                  Sent Email
                  <IoIosSend
                    style={{
                      marginLeft: "5px",
                      marginBottom: "1px",
                      fontSize: "20px",
                    }}
                  />
                </Button>
              </Col>
              {lastUploadedDetails && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "10px",
                    color: "#344054",
                    lineHeight: "1.6",
                  }}
                >
                  <div>
                    <strong>Last Uploaded By:</strong>{" "}
                    {lastUploadedDetails.uploadedBy}
                  </div>

                  <div>
                    <strong>Last Uploaded On:</strong>{" "}
                    {formatDateTime(lastUploadedDetails.uploadedOn)}
                  </div>
                </div>
              )}
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#344054",
                    marginTop: "5px",
                    // marginBottom: "6px",
                    // border: "1px solid black",
                  }}
                >
                  File Download :
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {downloadOptions.map((item) => (
                    <Button
                      key={item.optionType}
                      type="button"
                      variant="outlined"
                      disabled={!isUploadSuccessful}
                      onClick={() => handleDownloadFile(item.optionType)}
                      sx={{
                        fontSize: "10px",
                        height: "30px",
                        color: "#11395C",
                        borderColor: "#11395C",
                        textTransform: "none",
                        padding: "6px 14px",
                        "&:hover": {
                          borderColor: "#0d2d49",
                          backgroundColor: "rgba(17, 57, 92, 0.06)",
                        },
                        "&.Mui-disabled": {
                          color: "#9e9e9e",
                          borderColor: "#bdbdbd",
                          cursor: "not-allowed",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default T5T6DebitAgeing;
