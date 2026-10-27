import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  Col,
  Row,
  Button,
} from "reactstrap";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { ClientInfoCapsules } from "../../../helper/tableColumns.tsx";
// import PerformanceHistoryChart from "../PerformanceHistory";
import SegmentWiseTable from "../../../components/common/fullTable";
import BrokerageSlab from "../BrokerageSlab";
import { useMediaQuery } from "@mui/material";
import "../style.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { ClientUserDetails } from "../../../redux/thunk/ClientUserDetails";
import { useEffect, useState } from "react";
// import AbbakusImg from "../../../assets/images/Abakkus.png";
// import NarnoliaImg from "../../../assets/images/Narnolia.png";
// import RenassImg from "../../../assets/images/renaissance.png";
import Tooltip from "@mui/material/Tooltip";
import ShowToast from "../../../utils/toastUtils.tsx";
import { apiServices } from "../../../services/index.ts";
import axios from "axios";

const UserInfoModal = ({
  isOpen,
  onClose,
  handleModalClose,
  selectedClientCode,
  branch,
  handleFileUpload,
  uploadedFileName,
  selectedWidget,
  // fetchMtfToken,
}: any) => {
  const [clientDetails, setClientDetails] = useState({
    cn: "", // Client_Name
    cc: "", // Clientcode
    mob: "", // Mobile_No
    ct: "", // City
    age: 0, // Age
    em: "", // Email_Id
    eqdt: "", // EquityTradeDate
    eq: "", // Equity
    fodt: "", // F_OTradeDate
    fo: "", // F_O
    curdt: "", // CurrencyTradeDate
    cur: "", // Currency
    comdt: "", // Commodity_TradeDate
    com: "", // Commodity
    mtf: "", // MTF
    slbmdt: "", // SLBM_TradeDate
    slbm: "", // SLBM
    eq_in: 0, // Equity_Intraday
    eq_del: 0, // Equity_Delivery
    eq_fut: 0, // Equity_Futures
    eq_opt: 0, // Equity_Options
    cur_fut: 0, // Currency_Futures
    cur_opt: 0, // Currency_Options
    com_fut: 0, // Commodity_Futures
    com_opt: 0, // Commodity_Options
    sts: "", // status
    dob: "",
    pan: "",
  });

  const isMobile = useMediaQuery("(max-width:768px)");
  console.log(isMobile);

  const dispatch = useDispatch<AppDispatch>();
  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  useEffect(() => {
    const fetchClientUserDetails = async () => {
      const Id = localStorage.getItem("Id");
      let payload = {
        user_id: Id,
        clientCode: selectedClientCode,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(ClientUserDetails(payload))
        .unwrap()
        .then((response) => {
          dispatch(hideLoader());
          console.log("ClientDetailsResponse", response?.data?.data);
          setClientDetails(response?.data?.data);
        })
        .catch((err) => {
          console.log("ResponseError", err);
          dispatch(hideLoader());
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    fetchClientUserDetails();
  }, [dispatch]);

  function tog_fullscreen1() {
    handleModalClose(true);
  }

  const handleSlbmActivation = async () => {
    try {
      const token: any = await fetchSlbmActivation();

      if (!token) {
        return;
      }

      const payload = {
        clientcode: clientDetails?.cc,
        apiType: "segments",
      };

      dispatch(showLoader(""));

      const response = await axios.post(
        "https://api.lkpconnect.net.in/api/ReKyc/GetReKycURL",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("GetReKycURL response:", response?.data?.data);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data?.deeplink
      ) {
        const deeplink = response.data.data.deeplink;

        window.open(deeplink, "_blank", "noopener,noreferrer");

        return;
      }

      // 5. API returned failure
      ShowToast(
        "error",
        response?.data?.errorMessages ||
          response?.data?.message ||
          "Compliance upload failed.",
      );
    } catch (error: any) {
      console.log("GetReKycURL Error:", error);

      ShowToast(
        "error",
        error?.response?.data?.errorMessages || "Compliance upload failed.",
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  const fetchSlbmActivation = async () => {
    console.log("clientDetailsData", clientDetails);

    const formattedDob = clientDetails?.dob?.split("T")[0];

    const payload = {
      user_id: clientDetails?.cc,
      user_type: "Client",
      dob: formattedDob,
      pan: clientDetails?.pan,
    };

    try {
      dispatch(showLoader(""));

      const response = await apiServices.ValidateSencondAuth(payload);

      if (response?.status === 200 && response?.data?.token) {
        console.log("tokenResponse", response.data.token);

        return response.data.token;
      }

      ShowToast(
        "error",
        response?.data?.errorMessages || "Authentication failed.",
      );

      return null;
    } catch (error: any) {
      console.log("ValidateSencondAuth Error:", error);

      ShowToast(
        "error",
        error?.response?.data?.errorMessages || "Authentication failed.",
      );

      return null;
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      toggle={onClose}
      className="modal-fullscreen"
      id="fullscreeexampleModal"
      // style={{ marginTop: "50px", paddingRight: "10px" }}
    >
      <ModalHeader
        className="modal-title"
        id="fullscreeexampleModalLabel"
        style={{
          display: "flex",
          justifyContent: "space-between", // Keeps "Client Details" on the left and "Back" on the right
          alignItems: "center",
        }}
      >
        <span>Client Details</span>
        <Button
          onClick={tog_fullscreen1}
          style={{
            padding: "0 1rem",
            height: "30px",
            lineHeight: "26px",
            marginBottom: "10px",
            fontSize: "12px",
            backgroundColor: "#11395C",
            position: "absolute",
            right: "15px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          Back
        </Button>
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#E5E4E2" }}>
        <Card
          style={{
            borderRadius: "23px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            // position: "sticky",
            // top: 0,
            // zIndex: 10,
          }}
        >
          <CardBody>
            <Row className="details-card gx-3 gy-3">
              {/* Client Name */}
              <Col xs="12" md={2} className="text-center">
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    fontFamily: "Public Sans",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Client Name
                  </p>
                  <h6 className="user-info">{clientDetails.cn}</h6>
                </div>
              </Col>
              {/* Client Code */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Client Code
                  </p>
                  <h6 className="user-info">{clientDetails.cc}</h6>
                </div>
              </Col>
              {/* Mobile No */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Mobile No
                  </p>
                  <h6 className="user-info">{clientDetails.mob}</h6>
                </div>
              </Col>
              {/* City */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    City
                  </p>
                  <h6 className="user-info">{clientDetails.ct}</h6>
                </div>
              </Col>
              {/* Age */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Client Status
                  </p>
                  <h6 className="user-info">
                    <FiberManualRecordIcon
                      fontSize="small"
                      sx={{
                        color:
                          clientDetails.sts === "Active"
                            ? "#01D28E"
                            : "#FF0606",
                      }}
                    />
                    {clientDetails.sts}
                  </h6>
                </div>
              </Col>
              {/* Email Id */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Email Id
                  </p>
                  <h6 className="user-info">
                    {clientDetails.em.toLowerCase()}
                  </h6>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        {/* <Card
          style={{
            borderRadius: "23px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            maxHeight: "80px",
          }}
        >
          <CardBody
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
            }}
          >
            <Row
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <Col
                md={3}
                xs={12}
                style={{
                  borderRight: isMobile ? "none" : "1px solid #E5E7EB",
                  marginBottom: isMobile ? "20px" : "0px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0px 10px 0px 0px",
                  }}
                >
                  <h5
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "18px",
                      color: "#11395C",
                      margin: 0,
                    }}
                  >
                    Research Advisory Products
                  </h5>
                </div>
              </Col>

              <Col md={9} xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "0px 0px 0px 10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      width: "100%",
                      alignItems: "center",
                      flexWrap: isMobile ? "wrap" : "nowrap",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "40px",
                        border: "4px solid #C7DCF7",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(360deg, #FFFFFF 0%, #D6EBFF 100%)",
                      }}
                    >
                      <img
                        src={AbbakusImg}
                        alt="abakkus"
                        style={{
                          width: "90px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "120px",
                        height: "40px",
                        border: "4px solid #C7DCF7",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(360deg, #FFFFFF 0%, #D6EBFF 100%)",
                      }}
                    >
                      <img
                        src={NarnoliaImg}
                        alt="narnolia"
                        style={{
                          width: "90px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "120px",
                        height: "40px",
                        border: "4px solid #C7DCF7",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(360deg, #FFFFFF 0%, #D6EBFF 100%)",
                      }}
                    >
                      <img
                        src={RenassImg}
                        alt="renaissance"
                        style={{
                          width: "90px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <Button
                      onClick={() =>
                        window.open(
                          "https://researchproducts.lkpsec.com/",
                          "_blank",
                        )
                      }
                      style={{
                        backgroundColor: "#11395C",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 18px",
                        fontSize: "14px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        marginLeft: "auto",
                      }}
                    >
                      Click Here To Subscribe
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card> */}
        <Row className="gx-3 gy-2 align-items-start">
          {/* Left Side: Last Trade Date */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                height: "100%",
              }}
            >
              <CardBody
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50px" }}
              >
                <p
                  style={{
                    fontFamily: "Poppins",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: 0,
                  }}
                >
                  Segment
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Right Side: BrokSlabItemstwo in a Single Row */}
          <Col md={9}>
            <Row className="">
              {ClientInfoCapsules.map((item) => {
                const status = clientDetails[item.key] || "Inactive";
                console.log("Statttus", status, item);
                const color = status === "Active" ? "#01D28E" : "#FF0606";

                return (
                  <Col md={2} key={item.id}>
                    <Card
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <CardBody
                        className="text-center"
                        style={{
                          height: "50px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Public Sans",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "12px",
                            margin: "4px 0",
                          }}
                        >
                          {item.label}
                        </p>
                        {/* <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#777",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          <FiberManualRecordIcon
                            fontSize="small"
                            sx={{ color: color }}
                          />
                          {status}
                        </p> */}
                        <p
                          style={{
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiberManualRecordIcon
                            fontSize="small"
                            sx={{ color: color }}
                          />

                          {/* {item.key === "mtf" && status === "Inactive" ? (
                            <Tooltip title="Click to activate MTF" arrow>
                              <span
                                style={{
                                  color: "#777",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                onClick={() => {
                                  console.log("Activate MTF clicked");
                                  fetchMtfToken(clientDetails);
                                  // call activation API or open modal here
                                }}
                              >
                                {status}
                              </span>
                            </Tooltip>
                          ) : ( */}
                          {/* <span style={{ color: "#777" }}>{status}</span> */}
                          {/* )} */}

                          {item.key === "slbm" &&
                          status === "Inactive" &&
                          selectedWidget === "Active Clients" ? (
                            <>
                              {" "}
                              <Tooltip title="Click to activate SLBM" arrow>
                                <span
                                  style={{
                                    color: "#777",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => {
                                    console.log("Activate MTF clicked");
                                    handleSlbmActivation();
                                    // call activation API or open modal here
                                  }}
                                >
                                  {status}
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            // item.key === "mtf" && status === "Inactive" ? (
                            //   <Tooltip title="Click to activate MTF" arrow>
                            //     <span
                            //       style={{
                            //         color: "#777",
                            //         cursor: "pointer",
                            //         textDecoration: "underline",
                            //       }}
                            //       onClick={() => {
                            //         console.log("Activate MTF clicked");
                            //         fetchMtfToken(clientDetails);
                            //         // call activation API or open modal here
                            //       }}
                            //     >
                            //       {status}
                            //     </span>
                            //   </Tooltip>
                            // ) :
                            <span style={{ color: "#777" }}>{status}</span>
                          )}
                        </p>
                        {/* {item.key === "mtf" && status === "Inactive" && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#007bff",
                              // marginTop: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              console.log("Activate MTF clicked");
                              // call activation API or open modal here
                            }}
                          >
                            Click to activate MTF
                          </span>
                        )} */}
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        {/* <PerformanceHistoryChart /> */}
        <SegmentWiseTable selectedClientCode={selectedClientCode} />
        <BrokerageSlab
          setClientDetails={clientDetails}
          selectedClientCode={selectedClientCode}
          branch={branch}
          onFileUpload={handleFileUpload}
          uploadedFileName={uploadedFileName}
        />
      </ModalBody>
      {/* <div className="modal-footer">
        <Link
          to="#"
          type="button"
          onClick={onClose}
          className="btn btn-link link-success fw-medium"
        >
          <i className="ri-close-line me-1 align-middle" />
          Close
        </Link>
        <Button color="primary" className="btn btn-primary ">
          Save changes
        </Button>
      </div> */}
    </Modal>
  );
};

export default UserInfoModal;
