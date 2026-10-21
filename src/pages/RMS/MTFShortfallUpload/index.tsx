import React, { useState } from "react";
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
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { IoIosSend } from "react-icons/io";

const MTFShortfallUpload = ({ activeSubItem }: any) => {
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const formik = useFormik({
    initialValues: {
      mtfShortfallFile: null as File | null,
    },
    validationSchema: Yup.object({
      mtfShortfallFile: Yup.mixed()
        .required("MTF Shortfall file is required")
        .test(
          "fileType",
          "Only .xls  files are allowed",
          (value: any) => value && value.name && /\.(xls)$/i.test(value.name),
        ),
    }),
    onSubmit: () => {},
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (file && /\.(xls)$/i.test(file.name)) {
      formik.setFieldValue("mtfShortfallFile", file);
    } else {
      const errorMsg = "Only .xls file are accepted";

      formik.setFieldError("mtfShortfallFile", errorMsg);
      ShowToast("error", errorMsg);
    }

    // allow re-selecting same file
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (/\.(xls)$/i.test(file.name)) {
      formik.setFieldValue("mtfShortfallFile", file);
    } else {
      const errorMsg = "Only .xls files are accepted";
      formik.setFieldError("mtfShortfallFile", errorMsg);
      ShowToast("error", errorMsg);
    }
  };

  const handleUpload = async () => {
    const file = formik.values.mtfShortfallFile;
    if (!file) return;

    const formData = new FormData();
    formData.append("ShorfallFile", file);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      const response = await apiServices.MTFShorfallUpload(formData);

      if (response?.status === 200) {
        ShowToast("success", response?.data?.message);
        formik.resetForm();
      }
    } catch (error) {
      console.error("MTF Shortfall upload error:", error);
      ShowToast("error", "File upload failed");
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderUploadBox = (file: File | null) => (
    <div
      onClick={() => document.getElementById("mtfShortfallFile")?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: "relative",
        border: "1px dashed #ced4da",
        padding: "10px",
        borderRadius: "0.25rem",
        backgroundColor: "#f8f9fa",
        width: "30%",
        cursor: "pointer",
        minHeight: "60px",
      }}
    >
      <input
        type="file"
        id="mtfShortfallFile"
        name="mtfShortfallFile"
        accept=".xls"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {file ? (
        <>
          {file.name}
          <Tooltip title="Delete file" arrow>
            <span
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#dc3545",
              }}
              onClick={(e) => {
                e.stopPropagation();
                formik.setFieldValue("mtfShortfallFile", null);
              }}
            >
              <CloseIcon fontSize="small" />
            </span>
          </Tooltip>
        </>
      ) : (
        <span style={{ fontSize: "11.5px" }}>
          <strong>Click to upload</strong> or drag and drop your{" "}
          <strong>.xls</strong> file here
        </span>
      )}

      <small className="text-muted d-block mt-1" style={{ fontSize: "12px" }}>
        • Only <strong>.xls</strong> files are accepted
      </small>

      {formik.errors.mtfShortfallFile && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors.mtfShortfallFile}
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

    await callApi(apiServices.SendClientMTFShortfallMail, "Client MTF Email");
    await callApi(apiServices.SendDealerMTFShortfallMail, "Dealer MTF Email");
    await callApi(apiServices.SendRMMTFShortfallMail, "RM MTF Email");
    await callApi(apiServices.SendRHMTFShortfallMail, "RH MTF Email");
    await callApi(apiServices.SendAPMTFShortfallMail, "AP MTF Email");
    await callApi(apiServices.SendTLMTFShortfallMail, "TL MTF Email");
    await callApi(apiServices.SendBMMTFShortfallMail, "BM MTF Email");
    await callApi(apiServices.SendAHMTFShortfallMail, "AH MTF Email");

    dispatch(hideLoader());

    if (!hasError) {
      ShowToast("success", "All emails sent successfully");
    }
  };

  const confirmBtnStyle = {
    height: "25px",
    minWidth: "70px",
    padding: "0 12px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <CardHeader style={{ backgroundColor: "#fff" }}>
            <h4 className="card-title mb-0">{activeSubItem}</h4>
          </CardHeader>

          <CardBody>
            <form>
              <label className="form-label mb-1">
                MTF Shortfall File Upload
              </label>

              {renderUploadBox(formik.values.mtfShortfallFile)}

              <Button
                variant="contained"
                size="small"
                disabled={!formik.values.mtfShortfallFile}
                sx={{
                  mt: 2,
                  fontSize: "12px",
                  bgcolor: "#11395C",
                  textTransform: "none",
                  width: "30%",
                }}
                onClick={handleUpload}
              >
                Upload MTF Shortfall File
              </Button>
              <Col>
                <div className="mb-2" />
                <Button
                  style={{
                    backgroundColor: "#11395C",
                    fontSize: "10px",
                    height: "30px",
                    color: "#FFF",
                    textTransform: "none",
                    width: "30%",
                  }}
                  type="button"
                  onClick={() => setIsEmailConfirmOpen(true)}
                >
                  Sent Email
                  {/* <MailOutlineIcon
                        fontSize="small"
                        sx={{
                          marginLeft: "5px",
                          marginBottom: "2px",
                          fontSize: "16px",
                        }}
                      /> */}
                  <IoIosSend
                    style={{
                      marginLeft: "5px",
                      marginBottom: "1px",
                      fontSize: "20px",
                    }}
                  />
                </Button>
              </Col>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "#444",
                }}
              >
                <div>
                  <strong>Note : </strong>{" "}
                  <i style={{ fontSize: "10px" }}>
                    <strong>
                      Email sent to Client / RM / Dealer / AP / RH
                    </strong>
                  </i>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default MTFShortfallUpload;
