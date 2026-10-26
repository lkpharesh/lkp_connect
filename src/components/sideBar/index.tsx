import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Toolbar,
  List,
  IconButton,
  useMediaQuery,
  Badge,
} from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
// import { SlSizeFullscreen } from "react-icons/sl";
// import { BsFullscreen } from "react-icons/bs";
import Logo from "../../assets/LKP Logo (Light Theme).svg";
// import Logo from "../../assets/images/NewLogo.jpg";
import Logo1 from "../../assets/images/LKP New Logo (Dark Theme).svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, persistor } from "../../redux/store";
import { GetMenu } from "../../redux/thunk/GetMenus";
import { userOverview } from "../../redux/thunk/Overview";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import ShowToast from "../../utils/toastUtils";
import { apiServices } from "../../services";
import DrawerItem from "../DrawerItem";
import Nudge from "../common/Nudge";
import CustomModal from "../common/DPModal";
import OverviewComponent from "../../pages/Overview";
import TradeDashboard from "../../pages/TradeDashboard";
import ClientDetails from "../../pages/ClientDetails";
// import RegOverview from "../../pages/regOverView";
import EkycLinks from "../../pages/ekycLinks";
import StockStudy from "../../pages/StockStudy";
import OTDetails from "../../pages/OT";
import SPIP from "../../pages/SPIPReports";
import SPIPOverview from "../../pages/SPIPReports/SPIPOverview";
import ApnContest from "../../pages/Contest/ApnContest";
import ApnContestQ4 from "../../pages/Contest/ApnContestQ4";
import EmpContest from "../../pages/Contest/EmpContest";
import PartnerSPIP from "../../pages/Contest/SPIP/Partner";
import EmpContestQ4 from "../../pages/Contest/EmpContestQ4";
import PledgeRequest from "../../pages/PledgeRequest";
import InsertUnlistedShares from "../../pages/UnlistedShare/showUnlistedRecords";
import ShowUnlistedRecords from "../../pages/UnlistedShare/showUnlistedRecords";
import ViewApproverOne from "../../pages/UnlistedShare/ApproverOne";
import ViewApproverTwo from "../../pages/UnlistedShare/ApproverTwo";
import VendorsFile from "../../pages/UnlistedShare/UploadFile";
import MarketingMaterial from "../../pages/Marketing Materials";
import RegisDetails from "../../pages/Registration Details";
import RegulatorAnnouncement from "../../pages/regulatory announcement";
import MasterMenuMarketing from "../../pages/Masters/MarketingMaterialMaster";
import RegAnnMaster from "../../pages/Masters/RegulatoryAnnouncement";
import RegionalHead from "../../pages/KYC Dashboard/RegionalHead";
import BrokerageModificationStatus from "../../pages/KYC Dashboard/BrokerageModStatus";
import KycBrokerage from "../../pages/KYC Dashboard/KycBrokerage";
import PreProofUpload from "../../pages/preTrade/preProofUpload";
import PreTradeReport from "../../pages/preTrade/preTradeReport";
import PreTradeApproval from "../../pages/preTrade/Approval";
import IVR from "../../pages/preTrade/IVR";
import IVRComm from "../../pages/preTrade/IVRCOMM";
import CommEntry from "../../pages/Compilance/commEntry";
import ComChecker from "../../pages/Compilance/commChecker";
import AnnualPNL from "../../pages/Reports/annualPNL";
import DormantClient from "../../pages/Reports/dormantClient";
import LastTrade from "../../pages/Reports/LastTrade";
import QuarterlyPayout from "../../pages/Reports/QPayout";
import SLBM from "../../pages/Reports/SLBM";
import CoreReport from "../../pages/Reports/CoreReport";
import AccStatement from "../../pages/Reports/AnnualAccStatement";
import DPRecovery from "../../pages/Reports/DPRecovery";
import Retrival from "../../pages/Reports/ComplianceReport";
import ClientTradingReport from "../../pages/Reports/ClientTradingPatternReport";
import CTCLReport from "../../pages/Reports/CTCLReport";
import APOverview from "../../pages/Employee/Overview";
import ExclusionList from "../../pages/ExclusionList/";
import { MenuItems } from "../../types";
import SLBMHoldings from "../../pages/RMS/SLBMHoldings";
import RHDashboard from "../../pages/RHDashboard";
import "./style.css";
import ThirdPartyMaster from "../../pages/ThirdParty/Master";
import ThirdPartyApproval from "../../pages/ThirdParty/Approval";
import VendorMaster from "../../pages/ThirdParty/VendorMaster";
import VendorApproval from "../../pages/ThirdParty/VendorApproval";
import ThirdPartyStatusReport from "../../pages/ThirdParty/TPReport";
import InvoiceUpload from "../../pages/ThirdParty/Upload";
import InvoiceVerify from "../../pages/ThirdParty/Verify";
import InvoiceMail from "../../pages/ThirdParty/Mail";
import InvoiceStatusReport from "../../pages/ThirdParty/InvoiceReport";
// import PledgeHolding from "../../pages/RMS/PledgeHoldings";
import MutualFundIndex from "../../pages/MutualFund/Main";
import MtfComponent from "../../pages/RMS/Mtf";
import UnpledgeRequest from "../../pages/UnpledgeRequest";
import DPTransactionIndex from "../../pages/Reports/AMC Transaction";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MandatePayment from "../../pages/ThirdParty/Mandate";
import AmcMembership from "../../pages/AmcMembership";
import AmcMembershipQ4 from "../../pages/AmcMembershipQ4";
import LedgerDebitReport from "../../pages/AmcMembership/LedgerReport";
import VendorReport from "../../pages/ThirdParty/VendorReport";
import RMSPledgeHolding from "../../pages/RMS/PledgeHoldingAdjustment";
import ShortFallReport from "../../pages/RMS/MTFsfReport";
import MTFFileUpload from "../../pages/RMS/mtfFileUpload";
import MTFAgeingReport from "../../pages/RMS/MTFAgeingReport";
import T6SellingUpload from "../../pages/RMS/T6SellingUpload";
import T6SellingReport from "../../pages/RMS/T6SellingReport";
import RegFileUpload from "../../pages/RMS/REGFileUpload";
import RegMaster from "../../pages/RMS/RegMaster";
import PledgeReport from "../../pages/Reports/pledgeReqReport";
import ResearchCalls from "../../pages/researchCalls";
import { decryptAES } from "../../utils/encryptDecrypt";
import Expiry from "../../pages/Expiry";
import AutoPayReport from "../../pages/ThirdParty/DPAutoPay";
import EmployeeSPIP from "../../pages/Contest/SPIP/Employee";
import B2BSPIP from "../../pages/Contest/SPIP/B2B";
import MTFShortfallUpload from "../../pages/RMS/MTFShortfallUpload";
import NewClientPhysical from "../../pages/MutualFund/NewClientPhysical";
import FileUpload from "../../pages/MutualFund/FileUpload";
import StopLoss from "../../pages/Masters/stopLoss";
import ScriptMaster from "../../pages/Masters/scriptMaster";
import ContractNote from "../../pages/UnlistedShare/contractNote";
import BankRecordEntry from "../../pages/ThirdParty/bankMaster/bankRecordEntry";
import BankApproval from "../../pages/ThirdParty/bankMaster/bankApproval";
import BankReport from "../../pages/Reports/BankReport";
import ApDetails from "../../pages/AP Onboarding/Main";
import DocsDownload from "../../pages/AP Onboarding/DocsDownload";
import EmployeeTarget from "../../pages/Revamp/Employee Target";
import ZoneTarget from "../../pages/Revamp/Zone Target";
import BrokerageData from "../../pages/Reports/Brokerage";
import IncentiveTracker from "../../pages/IncentiveTracker";
import T6SellingDetailReport from "../../pages/RMS/T6SellingDetailReport";
import SLBMClientResponse from "../../pages/Reports/SLBMClientResponse";
import { FaHandHoldingMedical } from "react-icons/fa";
import T5T6DebitAgeing from "../../pages/RMS/T5T6DebitAgeing";

import ClientPosition from "../../pages/Reports/ClientPosition";
import MTFYield from "../../pages/MTF Funding Yield";
const drawerWidth = 260;
import SLBMStopwatch from "../../pages/Reports/SLBMStopwatch";

// Utility functions for Drawer
const openedMixin = (theme: Theme, drawerWidth: any): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  // overflowY: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean; // Custom open prop
  isNudgeOpen?: any;
}

// Custom AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isNudgeOpen",
})<CustomAppBarProps>(({ theme, open, isNudgeOpen }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = isMobile ? 180 : 260;
  const collapsedDrawerWidth = isMobile ? 60 : 72;

  const leftMargin = open ? drawerWidth : collapsedDrawerWidth;

  return {
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    margin: "15px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    // zIndex: !isNudgeOpen ? "" : "auto", // Exisiting old added new below for FS modal
    zIndex: !isNudgeOpen ? "1000" : "100",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: isMobile
      ? open
        ? `calc(100% - ${drawerWidth + 30}px)`
        : "calc(100% - 30px)"
      : open
        ? `calc(100% - ${leftMargin + 30}px)`
        : `calc(100% - 30px)`,
    marginLeft: isMobile
      ? open
        ? `${drawerWidth}px`
        : "0px"
      : `${leftMargin}px`,
  };
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const width = isMobile ? 180 : drawerWidth;

  return {
    width: width,
    flexShrink: 0,
    whiteSpace: "nowrap",
    ...(open && {
      ...openedMixin(theme, width),
      "& .MuiDrawer-paper": {
        ...openedMixin(theme, width),
        height: "100vh",
        overflowY: "auto",
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...closedMixin(theme),
        height: "100vh",
        overflowY: "auto",
      },
    }),
  };
});

const SideBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => {
    const storedMenu = localStorage.getItem("activeMenu");
    return storedMenu ?? ""; // Will be set later conditionally if needed
  });

  const [activeSubItem, setActiveSubItem] = useState(() => {
    const storedSubItem = localStorage.getItem("activeSubItem");
    return storedSubItem ?? "";
  });
  // const [selectedPerformanceSection, setSelectedPerformanceSection] =
  //   useState("");

  const [selectedViewMore, setSelectedViewMore] = useState<string>("");
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<boolean>(false);
  const [dataStatus, setDataStatus] = useState("");

  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [modal_animationZoom, setmodal_animationZoom] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);

  const [sideBarNudge, setSideBarNudge] = useState<any[][]>([]);
  const [modal_center, setmodal_center] = useState<boolean>(false);

  // const drawerWidth = isMobile ? 180 : 240;
  // const settings = ["Change User", "Logout"];
  const [userAccess, setUserAccess] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [showMyPerformance, setShowMyPerformance] = useState<boolean>(false);
  const [activeClickCountIvrEq, setActiveClickCountIvrEq] = useState(0);
  const [activeClickCountIvrComm, setActiveClickCountIvrComm] = useState(0);
  // const [showStarburst, setShowStarburst] = useState(true);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, user_type } = useSelector(
    (state: RootState) => state.UserLogin && state.UserLogin?.data?.data,
  );

  const { name, emailID, authenticationValue } = useSelector(
    (state: RootState) => state.AuthUser && state.AuthUser?.data?.data,
  );
  console.log("reduxStateUserName", name, user_type);

  const EmployeeLastBrokingDate = useSelector(
    (state: RootState) => state.userOverView?.data?.data?.data,
  );

  console.log("EMpLastDate", EmployeeLastBrokingDate);

  const apBrokingLastDate = useSelector(
    (state: RootState) => state.APBrokerage?.data?.data?.data?.dailyRevenue,
  );

  console.log("apBrokingLastDateValue", apBrokingLastDate);

  useEffect(() => {
    if (activeMenu !== "" || activeSubItem !== "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    const fetchBrokerage = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        user_id: user_id,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(userOverview(payload))
        .unwrap()
        .then((response) => {
          console.log("Response", response);
          if (response?.status === 200) {
            dispatch(hideLoader());
          }
        })
        .catch((Err) => {
          const { message } = Err;
          console.log("Error->", message);
          dispatch(hideLoader());
          // formik.setFieldError("password", message);
          // ShowToast(
          //   "error",
          //   message ||
          //     "Sorry for the inconvenience, please try after some time."
          // );
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };

    fetchBrokerage();
  }, [dispatch]);

  useEffect(() => {
    const userId = localStorage.getItem("AdminId");

    const updatedSettings = [
      ...(userId === import.meta.env.VITE_ADMIN_CRED_1 ||
      userId === import.meta.env.VITE_ADMIN_CRED_2
        ? ["Change User"]
        : []),
      "Logout",
    ];

    setUserAccess(updatedSettings);
  }, []); // Empty dependency to run only on mount

  // useEffect(() => {
  //   if (selectedViewMore) {
  //     const timeoutId = setTimeout(() => {
  //       setSelectedViewMore("");
  //     }, 3000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [selectedViewMore]);

  useEffect(() => {
    if (
      activeMenu !== "Reports" &&
      activeMenu !== "Referal Lead" &&
      activeMenu !== "Compliance" &&
      activeMenu !== "KYC Dashboard" &&
      activeMenu !== "Masters" &&
      activeMenu !== "RMS" &&
      activeMenu !== "IVR" &&
      activeMenu !== "SPIP" &&
      activeMenu !== "DashBoard" &&
      activeMenu !== "TPD Report" &&
      activeMenu !== "Trading" &&
      activeMenu !== "Zone Overview" &&
      activeMenu !== "Account" &&
      activeMenu !== "Partner OnBoarding" &&
      activeSubItem
    ) {
      const timeoutId = setTimeout(() => {
        setActiveSubItem("");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [activeMenu]);

  useEffect(() => {
    //this is for Employee user last date
    if (EmployeeLastBrokingDate && EmployeeLastBrokingDate.length > 0) {
      const EmpLastDate =
        EmployeeLastBrokingDate[EmployeeLastBrokingDate.length - 1]?.dt;
      setDataStatus(EmpLastDate || "No date available"); // Set default value if empty
      console.log("LASTDATE_Employee-->", EmpLastDate);
    } else {
      // this is for Partner user last date
      const apLastDate =
        apBrokingLastDate &&
        apBrokingLastDate[apBrokingLastDate.length - 1]?.dt;
      console.log("LASTDATE-->", apLastDate);
      setDataStatus(apLastDate || "No date available");
    }
  }, [EmployeeLastBrokingDate, apBrokingLastDate]);

  useEffect(() => {
    if (!showMyPerformance) return;

    const fetchDashboardNudge = async () => {
      dispatch(showLoader(""));

      try {
        const payload = { user_id };
        const response = await apiServices.DashboardNudge(payload);

        const data = response?.data;
        console.log("dashBoardNudgeData", data);

        if (!data || response?.status !== 200) {
          console.error("Failed to fetch dashboard nudge");
          return;
        }

        const reportTypes = new Set<string>();

        Object.values(data).forEach((table: any) => {
          table?.forEach((entry: any) => {
            if (entry?.ReportType) {
              reportTypes.add(entry.ReportType);
            }
          });
        });

        console.log("reportTypeSize", reportTypes.size);

        setNudgeCount(reportTypes.size);
        setSideBarNudge(data);
      } catch (error) {
        console.error("Error fetching dashboard nudge:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchDashboardNudge();
  }, [dispatch, showMyPerformance, user_id]);

  console.log("user", user_id);

  const username = localStorage.getItem("userName");
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";

  // useEffect(() => {
  //   const handleFullScreenChange = () => {
  //     setIsFullScreen(!!document.fullscreenElement);
  //   };

  //   document.addEventListener("fullscreenchange", handleFullScreenChange);

  //   return () => {
  //     document.removeEventListener("fullscreenchange", handleFullScreenChange);
  //   };
  // }, []);

  // const openFullScreen = () => {
  //   const elem = document.documentElement;
  //   elem.requestFullscreen?.();
  // };

  // const closeFullScreen = () => {
  //   document.exitFullscreen?.();
  // };
  useEffect(() => {
    if (activeMenu === "Client Details") {
      setApiStatus(true);
      console.log(apiStatus);
    } else {
      setApiStatus(false);
    }
  }, [activeMenu]);

  useEffect(() => {
    // let userId = localStorage.getItem("Id");
    let payload = {
      user_id: user_id,
      menu_Type: "byUser",
    };

    dispatch(GetMenu(payload))
      .unwrap()
      .then((res) => {
        console.log("response", res);
        console.log("GetMenusRes", res?.data?.data);
        // console.log("res11111", res?.data);
        const processedMenus = buildMenuHierarchy(res?.data);
        console.log("menuItems-->", processedMenus);
        setMenuItems(processedMenus);

        const storedMenu = localStorage.getItem("activeMenu");
        const storedSubItem = localStorage.getItem("activeSubItem");

        if (!storedMenu) {
          if (user_type === "Partner") {
            setActiveMenu("My Performance");
          } else if (user_type === "Employee") {
            setActiveMenu("Trading");
          }
        } else {
          // Restore from localStorage
          setActiveMenu(storedMenu);
          if (storedSubItem) {
            setActiveSubItem(storedSubItem);
          }
        }
      })
      .catch((Err) => {
        const { message } = Err;
        console.log("Error->", message);
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time.",
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);

  const buildMenuHierarchy = (data: any) => {
    // Create a map of menu items with the `mc` as the key
    const menuMap = new Map();
    data.forEach((item: any) => {
      menuMap.set(item.mc, { ...item, subItems: [] });
    });

    // Iterate over the data and find child menus
    const menuHierarchy: any = [];
    data.forEach((item: any) => {
      if (item.pmc === 0) {
        menuHierarchy.push(menuMap.get(item.mc));
      } else {
        // Child menu, add to parent
        const parentMenu = menuMap.get(item.pmc);
        if (parentMenu) {
          parentMenu.subItems.push(menuMap.get(item.mc));
        }
      }
    });
    console.log("MenuOrder-->", menuHierarchy);

    return menuHierarchy;
  };

  useEffect(() => {
    if (!isMobile) {
      handleDrawerOpen();
    }
  }, []);

  useEffect(() => {
    if (activeMenu === "Zone Overview") {
      setActiveSubItem("");
    }
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu === "IVR" && activeSubItem === "IVR Mapping EQ") {
      setActiveSubItem("");
    }
    if (activeMenu === "IVR" && activeSubItem === "IVR Mapping COMM") {
      setActiveSubItem("");
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    setIsNudgeOpen(false);
    localStorage.setItem("activeMenu", activeMenu);
    localStorage.setItem("activeSubItem", activeSubItem);
    console.log("MenuMaster", activeMenu, activeSubItem);
    console.log("MenuMaster", isNudgeOpen);
  }, [activeMenu, activeSubItem]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Unified handler for toggling the drawer submenus
  // const handleMenuClick = (menuTitle: string, hasSubItems: any) => {
  //   // setActiveMenu((prevActive) => (prevActive === menuTitle ? "" : menuTitle));

  //   // ------------------Exisiting Logic-----------
  //   // setActiveMenu((prevActive) =>
  //   //   prevActive === menuTitle ? menuTitle : menuTitle
  //   // );
  //   // ----------------------------------------------------
  //   setActiveMenu((prevActive) => {
  //     // If double-clicked on the same parent and it has submenus, close it
  //     if (prevActive === menuTitle && hasSubItems) {
  //       return "";
  //     }
  //     // Otherwise, keep current logic: activate the menu
  //     return menuTitle;
  //   });
  // };

  const handleMenuClick = (menuTitle: string, hasSubItems: any) => {
    setActiveMenu((prevActive) => {
      if (prevActive === menuTitle && hasSubItems) {
        // If clicking the same menu with subitems, collapse it and reset subitem
        setActiveSubItem("");
        return "";
      }
      console.log("menuTitle prevActive", menuTitle, hasSubItems, prevActive);

      // if (
      //   menuTitle === "Zone Overview" ||
      //   menuTitle === "Account" ||
      //   menuTitle === "Employee Target" ||
      //   menuTitle === "Partner Contest"
      // ) {
      //   setShowStarburst(false);
      // }
      // Always reset subitem when switching to a new main menu
      setActiveSubItem("");

      return menuTitle;
    });
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log("data", event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (value: any) => {
    console.log("values", value);
    if (value === "Logout") {
      persistor.purge();
      localStorage.removeItem("tkn");
      localStorage.removeItem("Id");
      localStorage.removeItem("uIdType");
      localStorage.removeItem("userName");
      localStorage.removeItem("activeMenu");
      localStorage.removeItem("AdminId");
      localStorage.removeItem("activeSubItem");
      sessionStorage.removeItem("dashboardNudgeFetched");
      sessionStorage.removeItem("authPan");
      navigate("/");
    } else if (value === "Change User") {
      setmodal_center(true); // Open the CustomModal
    } else {
      console.log("User clicked on:", value);
    }

    setAnchorElUser(null);
  };

  const handleSubItemClick = (subItem: string) => {
    console.log("SubItemClickvalue-->", subItem);
    // setActiveSubItem(subItem); // Set active sub-item
    if (activeSubItem === subItem) {
      // user clicked same tab again
      setActiveClickCountIvrEq((prev) => prev + 1);
      setActiveClickCountIvrComm((prev) => prev + 1);
    } else {
      setActiveSubItem(subItem);
      setActiveClickCountIvrEq(1); // reset count for new tab
      setActiveClickCountIvrComm(1); // reset count for new tab
    }
    if (isMobile) {
      setTimeout(() => {
        handleMobileDrawerClose();
      }, 400);
    }
  };

  const handleTradingOpen = (value: any) => {
    console.log("ClickedValue", value);
    if (value === "T6") {
      setActiveMenu("Trading");
      setSelectedViewMore(value);
    }
    if (value === "Dormant") {
      setActiveMenu("Client Details");
      setSelectedViewMore(value);
    }
    if (value === "spipSubExpiry") {
      setActiveMenu("SPIP");
      setActiveSubItem("Client Details Report");
      setSelectedViewMore(value);
    }
    if (value === "ClientOnboarding") {
      setActiveMenu("Mutual Fund");
      setActiveSubItem("Client Onboarding");
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(
      "https://rekyc.lkponline.com/v1/company/lkpsec/modification/login",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
  };
  const handleMobileDrawerClose = () => {
    handleDrawerClose();
    // handleMenuClick("");
  };
  const performanceComponents: Record<string, JSX.Element> = {
    Employee: <OverviewComponent handleTradingOpen={handleTradingOpen} />,
    Default: <APOverview handleTradingOpen={handleTradingOpen} />,
  };

  const revenueDetailsSubItems: Record<string, JSX.Element> = {
    "Regulatory Announcement": <RegAnnMaster activeSubItem={activeSubItem} />,
    "Marketing Material": <MasterMenuMarketing activeSubItem={activeSubItem} />,
    "Client Exclusion": <ExclusionList activeSubItem={activeSubItem} />,
    "Unlisted Scrip Master": <ScriptMaster activeSubItem={activeSubItem} />,
    "RA Sell Message send": <StopLoss activeSubItem={activeSubItem} />,
  };

  const kycSubItems: Record<string, JSX.Element> = {
    "RH Approval": <RegionalHead activeSubItem={activeSubItem} />,
    "KYC Approval": <KycBrokerage activeSubItem={activeSubItem} />,
    "Brokerage Modification Status": (
      <BrokerageModificationStatus activeSubItem={activeSubItem} />
    ),
  };

  const reportsSubItems: Record<string, JSX.Element> = {
    "Tax P&L Statement": <AnnualPNL />,
    "Dormant Client Report": <DormantClient activeSubItem={activeSubItem} />,
    "Last Trade Data": <LastTrade />,
    "Quarterly Payout Recovery": (
      <QuarterlyPayout activeSubItem={activeSubItem} />
    ),
    "SLBM Client Holding": <SLBM activeSubItem={activeSubItem} />,
    "Core Alerts Report": <CoreReport />,
    "Account Performance Report": <AccStatement />,
    "DP Debit Recovery": <DPRecovery activeSubItem={activeSubItem} />,
    "Client Trading Pattern Report": (
      <ClientTradingReport activeSubItem={activeSubItem} />
    ),
    "CTCL Wise Activity Report": <CTCLReport activeSubItem={activeSubItem} />,
    "Unpledge Request Report": (
      <UnpledgeRequest activeSubItem={activeSubItem} />
    ),
    "DP AMC Transaction": <DPTransactionIndex activeSubItem={activeSubItem} />,
    "Pledge Request Report": <PledgeReport activeSubItem={activeSubItem} />,
    "LKP Bank Report": <BankReport activeSubItem={activeSubItem} />,
    "MTF Funding Yield": <MTFYield activeSubItem={activeSubItem} />,
    "Brokerage Report": <BrokerageData activeSubItem={activeSubItem} />,
    "SLBM Client Interest": (
      <SLBMClientResponse activeSubItem={activeSubItem} />
    ),
    "SLBM Client Position": <ClientPosition activeSubItem={activeSubItem} />,
    "SLBM Stockwatch": <SLBMStopwatch activeSubItem={activeSubItem} />,
  };

  // const referalSubItems: Record<string, JSX.Element> = {
  //   "Referal Entry": <AmcMembership activeSubItem={activeSubItem} />,
  // };

  const complianceSubItems: Record<string, JSX.Element> = {
    // "UCCCode MATCH": (
    //   <MutualFundIndex
    //     activeSubItem={activeSubItem}
    //     // activeMenu={activeMenu}
    //   />
    // ),
    "Communication Retrival Entry": <CommEntry activeSubItem={activeSubItem} />,
    "Communication Retrival Checker": (
      <ComChecker activeSubItem={activeSubItem} />
    ),
    "Communication Retrival Report": <Retrival activeSubItem={activeSubItem} />,
    // "UCCCode MATCH": <VendorsFile />,
  };

  const ivrSubItems: Record<string, JSX.Element> = {
    "Pre Trade Proof Upload": <PreProofUpload activeSubItem={activeSubItem} />,
    "Pre Trade Report": <PreTradeReport activeSubItem={activeSubItem} />,
    "Pre Trade Approval": <PreTradeApproval activeSubItem={activeSubItem} />,
    "IVR Mapping EQ": (
      <IVR
        activeMenu={activeMenu}
        activeSubItem={activeSubItem}
        activeClickCount={activeClickCountIvrEq}
      />
    ),
    "IVR Mapping COMM": (
      <IVRComm
        activeMenu={activeMenu}
        activeSubItem={activeSubItem}
        activeClickCount={activeClickCountIvrComm}
      />
    ),
    "Referal Product Wise MIS Report": (
      <KycBrokerage activeSubItem={activeSubItem} />
    ),
  };
  // const tradingSubItems: Record<string, JSX.Element> = {
  //   "Client Pledge Request": <PledgeRequest activeSubItem={activeSubItem} />,
  // };

  const rmsSubItems: Record<string, JSX.Element> = {
    "Upload SLBM Holding": <SLBMHoldings />,
    "Pledge Holdings Adjustment": (
      <RMSPledgeHolding activeSubItem={activeSubItem} />
    ),
    "MTF File Merge": <MtfComponent activeSubItem={activeSubItem} />,
    "MTF Shortfall Report": <ShortFallReport activeSubItem={activeSubItem} />,
    "MTF File Upload": <MTFFileUpload activeSubItem={activeSubItem} />,
    "MTF Ageing Report": <MTFAgeingReport activeSubItem={activeSubItem} />,
    "T6 Selling File Upload": <T6SellingUpload activeSubItem={activeSubItem} />,
    "T6 Selling Report": <T6SellingReport activeSubItem={activeSubItem} />,
    "REG File Upload": <RegFileUpload activeSubItem={activeSubItem} />,
    "REG Master Records": <RegMaster activeSubItem={activeSubItem} />,
    "MTF Shortfall Upload": (
      <MTFShortfallUpload activeSubItem={activeSubItem} />
    ),
    "T6 Selling Detail (Pre&Post)": (
      <T6SellingDetailReport activeSubItem={activeSubItem} />
    ),
    "T5/T6 Debit Ageing File upload": (
      <T5T6DebitAgeing activeSubItem={activeSubItem} />
    ),
  };
  const tpdSubItems: Record<string, JSX.Element> = {
    "Unlisted Shares Entry": (
      <ShowUnlistedRecords activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Approval 1": (
      <ViewApproverOne activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Approval 2": (
      <ViewApproverTwo activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Status": (
      <InsertUnlistedShares activeSubItem={activeSubItem} />
    ),

    "Unlisted Shares File Upload": <VendorsFile />,
    "Unlisted Contract Note": <ContractNote activeSubItem={activeSubItem} />,
  };
  const AccountSubItems: Record<string, JSX.Element> = {
    "Third Party Vendor Master": (
      <ThirdPartyMaster activeSubItem={activeSubItem} />
    ),
    "Third Party Vendor Approval": (
      <ThirdPartyApproval activeSubItem={activeSubItem} />
    ),
    "Status Report": <ThirdPartyStatusReport activeSubItem={activeSubItem} />,
    "Vendor Creation": <VendorMaster activeSubItem={activeSubItem} />,
    "Vendor Approval": <VendorApproval activeSubItem={activeSubItem} />,
    "Third Party Invoice Upload": (
      <InvoiceUpload activeSubItem={activeSubItem} />
    ),
    "Third Party Invoice Verify": (
      <InvoiceVerify activeSubItem={activeSubItem} />
    ),
    "Third Party Invoice Mail": <InvoiceMail activeSubItem={activeSubItem} />,
    "Third Party Invoice Report": (
      <InvoiceStatusReport activeSubItem={activeSubItem} />
    ),
    "Dp Debit Collection": <MandatePayment activeSubItem={activeSubItem} />,
    "DP AMC Ledger Debit": <LedgerDebitReport activeSubItem={activeSubItem} />,
    "Vendor Details Report": <VendorReport activeSubItem={activeSubItem} />,
    "DP AutoPay Report": <AutoPayReport activeSubItem={activeSubItem} />,
    "LKP Bank Entry": <BankRecordEntry activeSubItem={activeSubItem} />,
    "LKP Bank Approval": <BankApproval activeSubItem={activeSubItem} />,
  };

  const q4SubItems: Record<string, JSX.Element> = {
    "Employee Target": <EmpContestQ4 activeMenu={activeSubItem + "-Q4"} />,
    "DP AMC Contest": <AmcMembershipQ4 activeMenu={activeSubItem + "-Q4"} />,
    "Partner Contest": <ApnContestQ4 activeSubItem={activeSubItem + "-Q4"} />,
    "Partner SPIP": <PartnerSPIP activeSubItem={activeSubItem} />,
    "Employee SPIP": <EmployeeSPIP activeMenu={activeMenu} />,
    "B2B SPIP": <B2BSPIP activeMenu={activeMenu} />,
  };
  const q3SubItems: Record<string, JSX.Element> = {
    "Employee Target": <EmpContest activeMenu={activeMenu} />,
    "DP AMC Contest": <AmcMembership activeMenu={activeMenu} />,
    "Partner Contest": <ApnContest activeMenu={activeMenu} />,
  };
  const mutualFundSubItems: Record<string, JSX.Element> = {
    Investment: <MutualFundIndex handleTradingOpen={handleTradingOpen} />,
    "Client Onboarding": <NewClientPhysical />,
    "File Upload": <FileUpload />,
  };
  const targetSubItems: Record<string, JSX.Element> = {
    "My Target": <EmployeeTarget />,
    "Zone Target": <ZoneTarget />,
  };
  // const referralLeadSubItems: Record<string, JSX.Element> = {
  //   "Referal Entry Status": <EmployeeTarget />,
  //   "Referal Lead Updation": <ZoneTarget />,
  // };
  const PartnerOnBoardingSubItems: Record<string, JSX.Element> = {
    "Ops Level 1 Approval": <ApDetails activeSubItem={activeSubItem} />,
    "Compliance Approval": <ApDetails activeSubItem={activeSubItem} />,
    "Ops Level 2 Approval": <ApDetails activeSubItem={activeSubItem} />,
    "Business Approval": <ApDetails activeSubItem={activeSubItem} />,
    "Management Approval": <ApDetails activeSubItem={activeSubItem} />,
    "Lkp Esign": <ApDetails activeSubItem={activeSubItem} />,
    "Exchange Activation": <DocsDownload activeSubItem={activeSubItem} />,
  };

  const getSubItemComponent = (
    subItems: Record<string, JSX.Element | null>,
  ): JSX.Element | null => subItems[activeSubItem] || null;

  const componentResolver = (mo: number, mn: string) => {
    console.log("MenuOrder", mo, mn);
    const map: Record<string, JSX.Element | null> = {
      "My Performance":
        user_type === "Employee"
          ? performanceComponents.Employee
          : performanceComponents.Default,
      Trading: (
        <TradeDashboard
          selectedTrading={selectedViewMore}
          showMyPerformance={showMyPerformance}
        />
      ),
      Reports: getSubItemComponent(reportsSubItems),
      "Zone Overview": (
        <RHDashboard activeSubItem={activeSubItem} activeMenu={activeMenu} />
      ),
      Masters: getSubItemComponent(revenueDetailsSubItems),
      RMS: getSubItemComponent(rmsSubItems),
      Compliance: getSubItemComponent(complianceSubItems),
      "KYC Dashboard": getSubItemComponent(kycSubItems),
      "Stock Study": <StockStudy />,
      "Mutual Fund": getSubItemComponent(mutualFundSubItems),
      // "Referal Lead": getSubItemComponent(referralLeadSubItems),
      Target: getSubItemComponent(targetSubItems),
      DashBoard: null,
      "Regulatory Announcement": (
        <RegulatorAnnouncement activeMenu={activeMenu} />
      ),
      "Marketing Materials": <MarketingMaterial />,
      EKYC: <EkycLinks />,
      "Back Office Report": <OTDetails />,
      "Registration Details": <RegisDetails activeSubItem={activeSubItem} />,
      IVR: getSubItemComponent(ivrSubItems),
      "SPIP Dashboard": (
        <SPIPOverview
          activeSubItem={activeSubItem}
          handleTradingOpen={handleTradingOpen}
        />
      ),
      SPIP: (
        <SPIP
          activeSubItem={activeSubItem}
          activeMenu={activeMenu}
          handleTradingOpen={handleTradingOpen}
          selectedViewMore={selectedViewMore}
        />
      ),
      "TPD Report": getSubItemComponent(tpdSubItems),
      "Employee Target": <EmpContest activeMenu={activeMenu} />,
      "Employee Target-Q4": <EmpContestQ4 activeMenu={activeMenu} />,
      "Partner Contest": <ApnContest activeMenu={activeMenu} />,
      "Partner Contest-Q4": <ApnContestQ4 activeMenu={activeMenu} />,
      "Q4 Contest": getSubItemComponent(q4SubItems),
      "Q3 Contest": getSubItemComponent(q3SubItems),
      "Client Details": (
        <ClientDetails
          handleDrawerClose={handleDrawerClose}
          handleDrawerOpen={handleDrawerOpen}
          apiStatus={apiStatus}
          selectedTrading={selectedViewMore}
          activeMenu={activeMenu}
        />
      ),
      Account: getSubItemComponent(AccountSubItems),
      "Client Request": <PledgeRequest activeMenu={activeMenu} />,
      "DP AMC Contest": <AmcMembership activeMenu={activeMenu} />,
      "DP AMC Contest-Q4": <AmcMembershipQ4 activeMenu={activeMenu} />,
      "Research Calls": <ResearchCalls />,
      "Expiry Contest": <Expiry />,
      "Partner OnBoarding": getSubItemComponent(PartnerOnBoardingSubItems),
      Incentive: <IncentiveTracker />,
    };
    return map[mn] ?? null;
  };
  const renderContent = () => {
    const active = menuItems.find((item) => item.mn === activeMenu);
    console.log("activeMenu", active);

    return active ? componentResolver(active.mo, active.mn) : null;
  };

  const handleNotificationClick = () => {
    setIsNudgeOpen(true); // Toggle the visibility of Nudge component
    setmodal_animationZoom((prev) => !prev);
    console.log("MenuMaster--->", isNudgeOpen);
  };

  function tog_animationZoom() {
    setmodal_animationZoom((prev) => !prev);
    setIsNudgeOpen(false);
  }

  const toCamelCase = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const hasMyPerformance = menuItems.some(
      (menu) => menu.mn === "My Performance",
    );
    setShowMyPerformance(hasMyPerformance);
  }, [menuItems]);

  const handleSSOLogin = () => {
    console.log("TestSSOLogin");
    const userEmail = (emailID && emailID) || "";
    let payload = {
      email: userEmail,
    };

    dispatch(showLoader(""));
    apiServices
      .EKycSSOLogin(payload)
      .then((response) => {
        console.log("EKycSSOLoginResponse", response?.data?.data);
        dispatch(hideLoader());
        if (response?.status === 200) {
          if (response?.data?.data?.success) {
            const url = response?.data?.data?.url;
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }
      })
      .catch((Error) => {
        console.log("Errrror", Error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleWebPortalLogin = () => {
    console.log("TestSSOLogin");

    const userPan = decryptAES(localStorage.getItem("authPan") || "");
    let payload = {
      user_id: user_id,
      panNo: (authenticationValue && authenticationValue) || userPan,
    };

    dispatch(showLoader(""));
    apiServices
      .GetWebPortalDetails(payload)
      .then((response) => {
        console.log("WebLoginResponse", response?.data?.data?.webPortalLink);
        dispatch(hideLoader());
        if (response?.status === 200) {
          const url = response?.data?.data?.webPortalLink;
          window.open(url, "_blank", "noopener,noreferrer");
        }
      })
      .catch((Error) => {
        console.log("Errrror", Error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  // const handleResearchAdvisoryClick = () => {
  //   const payload = {
  //     syncPointPartnerCode: "LKPDIS",
  //     ssoUserCode: `${user_type === "Partner" ? "AP" : "EMP"}${user_id.slice(-4)}`,
  //   };

  //   dispatch(showLoader(""));

  //   apiServices
  //     .InitBOLogin(payload)
  //     .then((response) => {
  //       if (response?.status === 200) {
  //         const url = response?.data?.data?.url;

  //         console.log("INITBBO", url);

  //         if (url) {
  //           window.open(url, "_blank", "noopener,noreferrer");
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("ERRRRROR", error);
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  return (
    <>
      <CustomModal
        tog_center={() => setmodal_center(!modal_center)}
        modal_center={modal_center}
        setmodal_center={setmodal_center}
        Msg={"Change User"}
        activeSubItem={activeSubItem}
        isAdmin={true}
      />

      {isNudgeOpen && (
        <Nudge
          modal_animationZoom={modal_animationZoom}
          tog_animationZoom={tog_animationZoom}
          sideBarNudge={sideBarNudge}
        />
      )}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} isNudgeOpen={isNudgeOpen}>
          <Toolbar>
            {open ? (
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  { marginRight: isMobile ? 0 : 2 },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
            )}
            {!open && (
              <Box sx={{ flexGrow: 0 }}>
                <Box
                  component="img"
                  alt="Logo"
                  src={Logo}
                  width={"auto"}
                  height="50px"
                />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                marginRight: "1rem",
              }}
            >
              {/* Blinking NEW badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: "-9px",
                  right: "-10px",
                  backgroundColor: "#E53935",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  lineHeight: 1,
                  padding: "3px 6px",
                  borderRadius: "10px",
                  zIndex: 2,
                  fontFamily: "Public Sans",

                  // Blink animation
                  animation: "blinkNew 1s infinite",

                  "@keyframes blinkNew": {
                    "0%, 50%": {
                      opacity: 1,
                    },
                    "51%, 100%": {
                      opacity: 0,
                    },
                  },
                }}
              >
                NEW
              </Box>

              <Button
                onClick={() => {
                  window.open(
                    "/insurance/insurance-summary.html",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                variant="outlined"
                style={{
                  height: "25px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  padding: "4px 12px",
                  fontFamily: "Public Sans",
                  borderColor: "#11395C",
                  color: "#11395C",
                  textTransform: "none",
                }}
              >
                Insurance
                <FaHandHoldingMedical style={{ marginLeft: "5px" }} />
              </Button>
            </Box>
            {/* <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-11px",
                  right: "5px",
                  width: "25px",
                  height: "25px",
                  background: "#FF5A54",
                  clipPath:
                    "polygon(50% 0%, 58% 18%, 78% 5%, 82% 25%, 100% 18%, 92% 38%, 100% 50%, 92% 62%, 100% 82%, 82% 75%, 78% 95%, 58% 82%, 50% 100%, 42% 82%, 22% 95%, 18% 75%, 0% 82%, 8% 62%, 0% 50%, 8% 38%, 0% 18%, 18% 25%, 22% 5%, 42% 18%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  transform: "rotate(25deg)",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: "6.5px",
                    fontWeight: 700,
                    fontFamily: "Public Sans",
                  }}
                >
                  NEW
                </span>
              </div>

              <Button
                variant="outlined"
                onClick={handleResearchAdvisoryClick}
                style={{
                  height: "25px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  padding: "4px 12px",
                  fontFamily: "Public Sans",
                  borderColor: "#11395C",
                  color: "#11395C",
                  textTransform: "none",
                  marginRight: "1rem",
                }}
              >
                Research Advisory Products
              </Button>
            </div> */}
            <Button
              onClick={handleWebPortalLogin}
              variant="outlined"
              style={{
                height: "25px", // increased height for better readability
                // minWidth: "220px", // ensure full text fits
                borderRadius: "5px",
                fontSize: "12px",
                padding: "4px 12px",
                fontFamily: "Public Sans",
                borderColor: "#11395C", // outlined border color
                color: "#11395C", // text color matches border
                textTransform: "none",
                marginRight: "1rem",
              }}
            >
              Old Web Portal
            </Button>
            {/* {showMyPerformance && ( */}
            <>
              <Button
                onClick={handleSSOLogin}
                style={{
                  height: "25px",
                  width: "90px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  padding: "4px 12px",
                  fontFamily: "Public Sans",
                  backgroundColor: "#11395C",
                  color: "#fff",
                  marginRight: "8px",
                }}
                className="btn-sm"
              >
                E-KYC
              </Button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "25px",
                  padding: "4px 12px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontFamily: "Public Sans, sans-serif",
                  border: "1px solid #11395C",
                  color: "#11395C",
                  cursor: "pointer",
                  gap: "6px",
                  marginRight: "1rem",
                }}
              >
                <a
                  href="https://rekyc.lkponline.com/v1/company/lkpsec/modification/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "#11395C",
                    fontSize: "12px",
                  }}
                >
                  ReKYC
                </a>

                <Tooltip title={copied ? "Copied !" : "Copy link"} arrow>
                  <ContentCopyIcon
                    fontSize="small"
                    onClick={handleCopy}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </div>
            </>
            {/* )} */}
            {/* <Box
              sx={{
                padding: isMobile ? "0" : "10px",
              }}
            >
              {!isMobile ? (
                <div
                  style={{ marginRight: !showMyPerformance ? "2rem" : "0rem" }}
                >
                  <IconButton
                    onClick={isFullScreen ? closeFullScreen : openFullScreen}
                    sx={{ p: 0 }}
                  >
                    {isFullScreen ? (
                      <BsFullscreen style={{ cursor: "pointer" }} />
                    ) : (
                      <SlSizeFullscreen style={{ cursor: "pointer" }} />
                    )}
                  </IconButton>
                </div>
              ) : null}
            </Box> */}
            {showMyPerformance && (
              <MenuItem>
                <IconButton
                  size="large"
                  aria-label="show 6 new notifications"
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{ p: 0 }}
                >
                  <Badge badgeContent={nudgeCount} color="error">
                    <NotificationsIcon sx={{ color: "#11395C" }} />
                  </Badge>
                </IconButton>
              </MenuItem>
            )}
            <Typography
              component="div"
              sx={{
                color: "black",
                fontSize: "10px",
                mr: 1,
                fontFamily: "Public Sans",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontFamily: "Public Sans" }}>
                {toCamelCase(name)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "grey",
                  fontFamily: "Public Sans",
                }}
              >
                {`Data as on- ${dataStatus}`}
              </Typography>
            </Typography>
            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src="/static/images/avatar/2.jpg"
                  style={{ backgroundColor: "#284c6c" }}
                >
                  {firstLetter}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userAccess.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>

        {open && (
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#11395C",
              },
              position: "relative",
              zIndex: 9,
            }}
          >
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                // zIndex: 1,
                marginTop: isMobile ? "0px" : "0px",
              }}
            >
              <Box
                component="img"
                alt="Logo"
                src={Logo1}
                width={"auto"}
                height="85px"
                style={{ marginLeft: isMobile ? "0px" : " -20px" }}
              />
            </Box>

            <List sx={{ py: 0 }}>
              {menuItems.map((item) => (
                <DrawerItem
                  key={item.mc}
                  title={item.mn}
                  open={open}
                  subItems={item.subItems}
                  handleDrawerOpen={handleDrawerOpen}
                  isMobile={isMobile}
                  activeMenu={activeMenu}
                  handleClick={() =>
                    handleMenuClick(item.mn, !!item.subItems?.length)
                  }
                  handleSubItemClick={handleSubItemClick}
                  visible={true}
                />
              ))}
            </List>
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            pt: "79px", // Adjust according to actual AppBar height
            backgroundColor: "#f1f1f1",
            overflow: "hidden",
            // width: "100vw", // Full width of the viewport
            // height: "100vh", // Full height of the viewport
          }}
        >
          {/* <Box>{renderMenu(menuItems, activeMenu, handleTradingOpen)}</Box> */}
          <Box>{renderContent()}</Box>
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
