import { useState } from "react";
import DataTable from "../../../components/common/UserInfoTable";
import UnlistedM from "../../../components/common/UnlistedM";
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const Index = ({ activeSubItem }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // const handleView = (row: any) => {
  //   setSelectedRow(row);
  //   setModalOpen(true);
  // };

  const handleApproval = async ({
    data,
    remarks,
    action,
    payRemarks = [],
  }: any) => {
    // Connect your final approver API here.
    // Use data, remarks, action and payRemarks in its payload.
    console.log(data, remarks, action, payRemarks);
  };

  const handleDownloadDealSheet = async (data: any) => {
    // Connect your existing deal sheet download handler here.
    console.log(data, "final approver");
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
              // T6Data={data}

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
