import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import { TextField } from "@mui/material";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Pending", value: "Pending" },
];

const BrokerageModificationStatus = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { afterToday } = DateRangePicker;
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const [modificationStatus, setModificationStatus] = useState<any[]>([]);
  const [clientCode, setClientCode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [zoneOptions, setZoneOptions] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  // Fetch zone options
  useEffect(() => {
    const payload = {
      user_id: user_id, // Replace with dynamic value if needed
      option: "zone",
      userType: "EMP",
      zone: "ALL",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .getDropDown(payload)
      .then((res) => {
        if (res?.status === 200) {
          const formatted = res.data.data.map((item: any) => ({
            label: item.desc,
            value: item.val,
          }));
          setZoneOptions(formatted);
        }
      })
      .catch(() => ShowToast("error", "Failed to fetch zones"))
      .finally(() => dispatch(hideLoader()));
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const [fromDate, toDate] = selectedDateRange || [];

    const payload = {
      clientCode: clientCode.trim(),
      status: selectedStatus?.value || "",
      zone: selectedZone?.value || "",
      startDate: fromDate ? moment(fromDate).format("YYYY-MM-DD") : null,
      endDate: toDate ? moment(toDate).format("YYYY-MM-DD") : null,
      user_id: user_id,
    };

    console.log(payload, "payload");

    dispatch(showLoader("Loading..."));

    apiServices
      .GetBrokerageModificationStatus(payload)
      .then((response) => {
        const rows = response?.data?.data || [];
        if (response?.status === 200 && Array.isArray(rows)) {
          const mappedRows = rows.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          console.log("Mapped Modification Status", mappedRows);
          setModificationStatus(mappedRows);
        }
      })
      .catch(() => ShowToast("error", "Date is required"))
      .finally(() => dispatch(hideLoader()));
  };

  const handleExcel = () => {
    if (!modificationStatus.length) {
      ShowToast("info", "No data available to export");
      return;
    }
    try {
      // 1. Define header name mapping
      const headerMap: Record<string, string> = {
        zn: "Zone",
        sts: "Status",
        cc: "Client Code",
        bc: "Branch Code",
        cn: "Client Name",
        ctyp: "Client Type",
        seg: "Segment",
        expln: "Existing Plan",
        prpln: "Proposed Plan",
        Remarks: "Remarks",
        kyc_dt: "Status Date",
      };
      // 2. Remove 'rowId' and prepare data
      const cleanedData = (modificationStatus as Record<string, any>[]).map(
        ({ rowId, ...rest }) => rest,
      );
      // 3. Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      // 4. Rename headers
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        const cell = worksheet[cellAddress];
        if (cell && headerMap[cell.v]) {
          cell.v = headerMap[cell.v];
        }
      }
      // 5. Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Brokerage Status");
      // 6. Export
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const excelFile = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(excelFile, "Brokerage_Modification_Status.xlsx");
    } catch (error) {
      console.error("Excel Export Error:", error);
      ShowToast("error", "Failed to export Excel");
    }
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
            }}
          >
            <h4 className="card-title mb-0">Brokerage Modification Status</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row className="align-items-end">
                <Col xl={2} lg={3} md={4} sm={6} xs={12} className="mb-3">
                  <Label className="form-label text-muted label-font">
                    Client Code
                  </Label>
                  <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Enter Client Code"
                    fullWidth
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                  />
                </Col>

                <Col xl={2} lg={3} md={4} sm={6} xs={12} className="mb-3">
                  <Label className="form-label text-muted label-font">
                    Status
                  </Label>
                  <Select
                    value={selectedStatus}
                    onChange={(option: any) => setSelectedStatus(option)}
                    options={statusOptions}
                    isClearable={false}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        cursor: "pointer",
                      }),
                    }}
                  />
                </Col>

                <Col xl={2} lg={3} md={4} sm={6} xs={12} className="mb-3">
                  <Label className="form-label text-muted label-font">
                    Zone
                  </Label>
                  <Select
                    value={selectedZone}
                    onChange={(option: any) => setSelectedZone(option)}
                    options={zoneOptions}
                    isClearable
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        cursor: "pointer",
                      }),
                    }}
                  />
                </Col>

                <Col xl={3} lg={4} md={6} sm={12} xs={12} className="mb-3">
                  <Label className="form-label text-muted label-font">
                    Date Range
                  </Label>
                  <DateRangePicker
                    id="date-range-picker"
                    size="md"
                    value={
                      selectedDateRange[0] && selectedDateRange[1]
                        ? ([selectedDateRange[0], selectedDateRange[1]] as [
                            Date,
                            Date,
                          ])
                        : undefined
                    }
                    onChange={(value: [Date, Date] | null) => {
                      if (value) {
                        setSelectedDateRange(value);
                        // handleDateChange is optional if you don't need extra logic
                        // handleDateChange(value);
                      } else {
                        setSelectedDateRange([null, null]);
                      }
                    }}
                    placeholder="Start Date & End Date"
                    showOneCalendar
                    shouldDisableDate={afterToday()}
                    style={{ width: "100%", fontSize: "12px" }}
                  />
                </Col>
                <Col xl={2} lg={3} md={4} sm={6} xs={12} className="mb-3">
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#11395C",
                        color: "#fff",
                        fontSize: "12px",
                        flex: 1,
                      }}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      onClick={handleExcel}
                      style={{
                        fontSize: "12px",
                        flex: 1,
                        backgroundColor: "#11395C",
                        height: "40px",
                      }}
                    >
                      Excel
                      <DownloadIcon style={{ fontSize: "16px" }} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </form>

            <DataTable
              activeSubItem={activeSubItem}
              T6Data={modificationStatus}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default BrokerageModificationStatus;
