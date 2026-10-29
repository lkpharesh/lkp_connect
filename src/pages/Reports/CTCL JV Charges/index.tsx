import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

const CTCLJVData = ({ activeSubItem }: any) => {
  const [ctclJVData, setCTCLJVData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const getCTCLJVData = () => {
    const payload = {
      user_id: user_id,
    };

    dispatch(showLoader(""));

    apiServices
      .GetCTCLJVData(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];
          const updatedData = data.map((item: any, index: number) => ({
            ...item,
            // amount: item.amount + 10626260,
            id: index + 1,
          }));
          console.log(updatedData);

          setCTCLJVData(updatedData);
        }
      })
      .catch((error) => {
        console.log("CTCL JV API Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleDownload = () => {
    const payload = {
      user_id: user_id,
    };

    dispatch(showLoader(""));

    apiServices
      .DownloadCTCLJVData(payload)
      .then((response) => {
        if (response?.status === 200) {
          const blob = new Blob([response.data], {
            type: "text/csv;charset=utf-8;",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download = "CTCLJVData.csv";
          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(url);

          ShowToast("success", "Download successful");
        }
      })
      .catch((error) => {
        console.log("CTCL JV Download Error:", error);
        ShowToast("error", "Download failed");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    getCTCLJVData();
  }, []);

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardHeader
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    borderRadius: "15px 15px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
                  <h4 className="card-title mb-0">{activeSubItem}</h4>

                  <Button
                    style={{ backgroundColor: "#11395C", color: "white" }}
                    onClick={handleDownload}
                  >
                    {/* <i className="ri-download-2-line me-1" /> */}
                    Download
                  </Button>
                </CardHeader>

                <CardBody>
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={ctclJVData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CTCLJVData;
