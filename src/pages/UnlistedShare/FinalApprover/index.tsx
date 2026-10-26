import DataTable from "../../../components/common/UserInfoTable";
import UnlistedM from "../../../components/common/UnlistedM";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const Index = ({ activeSubItem }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .Approver3ViewUnlisted({ userID: user_id })
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

  // const handleView = (row: any) => {
  //   setSelectedRow(row);
  //   setModalOpen(true);
  // };

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
      vendorName: 4,
      payRemarks: [],
      approverLevel: 3,
    };

    console.log("Approval payload", payload, payRemarks);

    dispatch(showLoader("Please wait, we are processing your request..."));

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
        ShowToast("error", error?.message || "Something went wrong");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleDownloadDealSheet = async (data: any) => {
    const base64 = data?.ds64;
    if (!base64) return;

    const pdfBase64 = base64.replace(/^data:application\/pdf;base64,/, "");
    const bytes = Uint8Array.from(atob(pdfBase64), (char) =>
      char.charCodeAt(0),
    );

    const url = URL.createObjectURL(
      new Blob([bytes], { type: "application/pdf" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "DealSheet.pdf";
    link.click();

    URL.revokeObjectURL(url);
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
            <h4 className="card-title mb-0">Unlisted Shares Final Approval </h4>
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
        approverLevel="final"
        handleAction={handleApproval}
        onDownloadDealSheet={handleDownloadDealSheet}
      />
    </div>
  );
};

export default Index;
