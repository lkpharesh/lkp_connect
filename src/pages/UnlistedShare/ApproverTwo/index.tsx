import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import UnlistedM from "../../../components/common/UnlistedM";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const index = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .Approver2ViewUnlisted({ userID: user_id })
      .then((response) => {
        const apiData = response?.data?.data ?? [];

        setData(
          apiData.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching approver 2 data:", error);
        ShowToast("error", "Error fetching data");
      })
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, user_id, flag]);

  const handleApproval = ({ data, remarks, action, payRemarks = [] }: any) => {
    if (!remarks?.trim()) {
      ShowToast("error", "Remarks are compulsory");
      return;
    }

    const payload = {
      rowID: data.rid,
      userID: user_id,
      status: action === "approve" ? "A" : "R",
      remarks: remarks.trim(),
      vendorName: 0,
      payRemarks,
      approverLevel: 2,
    };

    dispatch(showLoader("Processing your request..."));

    apiServices
      .ApproverActionUnlistedShares(payload)
      .then((response) => {
        if (response?.status === 200) {
          setFlag((prev) => !prev);
          setModalOpen(false);
          setSelectedRow(null);
          ShowToast("success", response?.data?.message);
        } else {
          ShowToast("error", "Error processing approval");
        }
      })
      .catch((error) => {
        ShowToast("error", error?.response?.data?.message || "Request failed");
      })
      .finally(() => dispatch(hideLoader()));
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Unlisted Shares Approval 2</h4>
          </CardHeader>

          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              onView={(row: any) => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            />
          </CardBody>
        </Card>
      </Container>

      <UnlistedM
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRow(null);
        }}
        data={selectedRow}
        approverLevel="2"
        handleAction={handleApproval}
      />
    </div>
  );
};

export default index;
