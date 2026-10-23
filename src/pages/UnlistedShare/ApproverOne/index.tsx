import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UnlistedM from "../../../components/common/UnlistedM";
// import { VendorProvider } from "./VendorContext";

const index = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  // const [vendorList, setVendorList] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    const fetchApprover1 = async () => {
      const ViewPayload = {
        userID: user_id,
      };

      // const vendorPayload = {
      //   userID: user_id,
      //   status: "",
      //   remarks: "",
      // };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const response = await apiServices.Approver1ViewUnlisted(ViewPayload);
        console.log("Approver1ViewUnlistedResponse", response);

        // const vendorResponse =
        //   await apiServices.GetUnlistedVendorDropdown(vendorPayload);

        const mainData = response?.data?.data || [];
        // const vendorData = vendorResponse?.data?.data || [];

        // ✅ Add Id = index + 1 for mainData
        const updatedMainData = mainData.map((item: any, index: number) => ({
          ...item,
          Id: index + 1,
        }));

        // ✅ Add Id = index + 1 for vendorData
        // const updatedVendorData = vendorData.map(
        //   (item: any, index: number) => ({
        //     ...item,
        //     Id: index + 1,
        //   }),
        // );

        console.log("A1 Data", updatedMainData);

        // ⬅ Store updated data in state
        setData(updatedMainData);
        // setVendorList(updatedVendorData);
      } catch (error) {
        console.error("Error fetching compliance data:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchApprover1();
  }, [dispatch, flag]);

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
      approverLevel: 1,
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
            <h4 className="card-title mb-0">Unlisted Shares Approval 1</h4>
          </CardHeader>
          <CardBody>
            {/* <VendorProvider value={vendorList}> */}
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              // handleApproval={handleApproval}
              onView={(row: any) => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            />
            {/* </VendorProvider> */}
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
        approverLevel="1"
        handleAction={handleApproval}
      />
    </div>
  );
};

export default index;
