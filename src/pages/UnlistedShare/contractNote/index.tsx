import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { Tabs, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

interface UnlistedSharesMailViewItem {
  note: boolean;
  form: boolean;
  rid: number;
  tdt: string;
  cc: string;
  cn: string;
  bc: string;
  zn: string;
  ccat: string;
  rmc: string;
  rm: string;
  nsec: string;
  nsh: number;
  crt: number;
  vrt: number;
  lcps: number;
  big: number;
  gst: number;
  beg: number;
  sbc: string;
  sbr: number;
  sbcm: number;
  nbg: number;
  vnm: string | null;
  sts: string | null;
  rmk: string | null;
  dpid: string;
  dpnm: string;
  accno: string;
  bnknm: string;
  ifsc: string;
  paym: string;
  cqnum: string;
  isin: string;
  isudt: string;
  disno: string | null;
}

const ContractNote = ({ activeSubItem }: any) => {
  const [tabValue, setTabValue] = useState(0);
  const [flag, setFlag] = useState(false);
  const [mailViewData, setMailViewData] = useState<
    UnlistedSharesMailViewItem[]
  >([]);

  const { user_id } = useSelector((s: RootState) => s.UserLogin?.data?.data);

  const dispatch = useDispatch<AppDispatch>();

  const fetchMailViewData = () => {
    if (!user_id) return;

    const payload = { user_Id: user_id };

    dispatch(showLoader(""));

    apiServices
      .UnlistedSharesMailView(payload)
      .then((response) => {
        if (response?.status === 200) {
          const apiData: UnlistedSharesMailViewItem[] =
            response?.data?.data || [];

          let filteredData: UnlistedSharesMailViewItem[] = [];

          switch (tabValue) {
            case 0:
              filteredData = apiData.filter((item) => item.note === false);
              break;
            case 1:
              filteredData = apiData.filter((item) => item.form === false);
              break;
            default:
              filteredData = [];
          }

          setMailViewData(filteredData);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    fetchMailViewData();
  }, [user_id, tabValue, flag]);

  const handleContractMailClick = async () => {
    if (!mailViewData || mailViewData.length === 0) return;

    dispatch(showLoader(""));

    let successCount = 0;
    let failCount = 0;

    try {
      for (const item of mailViewData) {
        const payload = {
          user_id: user_id,
          rowId: item.rid,
        };

        try {
          //TAB 0 → Always call Contract Note API
          if (tabValue === 0) {
            const response =
              await apiServices.UnlistedContractNoteMail(payload);

            if (response?.status === 200) successCount++;
            else failCount++;
          }

          // TAB 1 → Consent Form logic
          else if (tabValue === 1) {
            if (!item.disno || item.disno.trim() === "") {
              ShowToast("error", `Please enter DIS No for ${item.cn}`);
              failCount++;
              continue;
            }

            const response = await apiServices.UnlistedConsentFormMail(payload);

            if (response?.status === 200) successCount++;
            else failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0 && failCount === 0) {
        ShowToast(
          "success",
          tabValue === 0
            ? "Contract Note mail sent successfully"
            : "Consent Form mail sent successfully",
        );
      } else if (successCount > 0 && failCount > 0) {
        ShowToast(
          "error",
          `${failCount} mail(s) failed. ${successCount} sent successfully.`,
        );
      }
      setFlag((prev) => !prev);
    } catch (error) {
      ShowToast("error", "Something went wrong while sending mails.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const getUserDetails = (row: any, dis: any) => {
    console.log("TestTest", row, dis);
    const payload = {
      user_id: user_id,
      rowId: row?.rid,
      disNumber: dis,
    };
    dispatch(showLoader(""));
    apiServices
      .SetUnlistedSharesDISNumber(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("successResponse", response?.data?.data);
          ShowToast("success", response?.data?.message);
          fetchMailViewData();
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Errrror", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  //   marginTop: "1rem",
                  marginLeft: ".7rem",
                  marginBottom: ".7rem",
                  backgroundColor: "white",
                  borderRadius: "11px",
                  width: "fit-content",
                  minHeight: 0,
                  // border: "1.5px solid #11395C",
                }}
              >
                <Tab
                  label="Contract Note"
                  sx={{
                    textTransform: "none",
                    fontWeight: 400,
                    borderRadius: "10px",
                    px: 3,
                    minHeight: 10,
                    backgroundColor: tabValue === 0 ? "#11395C" : "white",
                    color: tabValue === 0 ? "white" : "#11395C",
                    "&.Mui-selected": {
                      color: "white !important",
                    },
                    "& .MuiTab-wrapper": {
                      color: tabValue === 0 ? "white" : "#11395C",
                    },
                  }}
                />

                <Tab
                  label="Consent Form"
                  sx={{
                    textTransform: "none",
                    fontWeight: 400,
                    borderRadius: "10px",
                    px: 3,
                    minHeight: 10,
                    backgroundColor: tabValue === 1 ? "#11395C" : "white",
                    color: tabValue === 1 ? "white" : "#11395C",
                    "&.Mui-selected": {
                      color: "white !important",
                    },
                    "& .MuiTab-wrapper": {
                      color: tabValue === 1 ? "white" : "#11395C",
                    },
                  }}
                />
              </Tabs>
              <Card
                style={{
                  minHeight: "80vh",
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
                  <h4 className="card-title mb-0">
                    {tabValue === 0 ? "Contract Note" : "Consent Form"}
                  </h4>
                </CardHeader>
                <CardBody>
                  {" "}
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={mailViewData}
                    isCustomBtn={true}
                    tabValue={tabValue}
                    getUserDetails={getUserDetails}
                    // handleDownload={handleExtendedVersion}
                    handleContractMailClick={handleContractMailClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ContractNote;
