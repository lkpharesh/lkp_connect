import React, { useState, useEffect } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { AppDispatch, RootState } from "../../../redux/store";

const BaskedUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDetails, setUploadDetails] = useState<any>([]);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data || {},
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  // Fetch uploaded file details
  const fetchFileUploadedDetails = async () => {
    dispatch(showLoader(""));

    try {
      const response = await apiServices.GetFileuploadDetails({
        option: "MTFSHORTFALL",
      });

      if (response?.status === 200 && response?.data?.isSuccess) {
        setUploadDetails(response?.data?.data || []);
      }
    } catch (error) {
      console.log("Error fetching file details", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchFileUploadedDetails();
  }, []);

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      ShowToast("error", "Please select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.append("User_id", String(user_id));

      const response = await apiServices.UploadMTFCADG1File(formData);

      if (response?.data?.isSuccess || response?.status === 200) {
        ShowToast("success", "File uploaded successfully");

        setSelectedFile(null);

        // Refresh uploaded file details
        await fetchFileUploadedDetails();
      } else {
        ShowToast("error", "File upload failed");
      }
    } catch (error) {
      console.log("Upload error", error);
      ShowToast("error", "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid style={{ minHeight: "85vh" }}>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <CardHeader style={{ backgroundColor: "#fff" }}>
            <h4 className="card-title mb-0">MTF CAD Scrip Intraday Upload</h4>
          </CardHeader>

          <CardBody>
            <div>
              <input
                type="file"
                className="form-control"
                accept=".t01"
                onChange={handleFileChange}
                style={{
                  width: "30%",
                }}
              />

              <Button
                variant="contained"
                size="small"
                disabled={!selectedFile || uploading}
                sx={{
                  mt: 2,
                  fontSize: "12px",
                  bgcolor: "#11395C",
                  textTransform: "none",
                  width: "30%",
                }}
                onClick={handleUpload}
              >
                {uploading ? "Uploading..." : "Upload MTF Shortfall File"}
              </Button>

              <div
                style={{ marginTop: "15px", fontSize: "11px", color: "#444" }}
              >
                {uploadDetails?.length > 0 ? (
                  uploadDetails.map((item: any, index: number) => (
                    <div key={index}>
                      <strong>Uploaded On:</strong>{" "}
                      {new Date(item.uon).toLocaleString("en-IN")}
                      &nbsp; | &nbsp;
                      <strong>Uploaded By:</strong> {item.uby}
                    </div>
                  ))
                ) : (
                  <span>No file uploaded yet.</span>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default BaskedUpload;
