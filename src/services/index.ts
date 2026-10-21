import apiService from "./apiServices";
import { endpoints } from "./endpoints";

export const apiServices = {
  getAnnualPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNL, payload);
  },
  getPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNLStatement, payload);
  },
  GetPNLAccountDetailsPdf: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNLAccountDetailsPdf, payload);
  },
  twoFactorAuthentication: async (payload: any) => {
    return await apiService("POST", endpoints.TwoFactorAuthentication, payload);
  },
  Login: async (payload: any) => {
    return await apiService("POST", endpoints.Login, payload);
  },
  sendOtp: async (payload: any) => {
    return await apiService("POST", endpoints.sendOtp, payload);
  },
  forgetPassword: async (payload: any) => {
    return await apiService("POST", endpoints.forgetPassword, payload);
  },
  ChangePassword: async (payload: any) => {
    return await apiService("POST", endpoints.ChangePassword, payload);
  },

  UnblockUser: async (payload: any) => {
    return await apiService("POST", endpoints.UnblockUser, payload);
  },
  getDropDown: async (payload: any, customHeader?: any) => {
    return await apiService(
      "POST",
      endpoints.getDropDown,
      payload,
      customHeader,
    );
  },
  getDormantReport: async (payload: any) => {
    return await apiService("POST", endpoints.getDormantReport, payload);
  },
  getUpcompingDormantReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getUpcompingDormantReport,
      payload,
    );
  },
  LastTradeDate: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.lastTradeDate,
      payload,
      {
        responseType: "blob",
      },
      155000, //api calling time
    );
  },
  GetQuaterlyPayoutGrid: async (payload: any) => {
    return await apiService("POST", endpoints.GetQuaterlyPayoutGrid, payload);
  },
  SLBMHoldingsReport: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMHoldingsReport, payload);
  },
  GetCoreAlertsReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetCoreAlertsReport, payload);
  },
  dashGetMenus: async (payload: any) => {
    return await apiService("POST", endpoints.getMenus, payload);
  },
  ClientCash: async (payload: any) => {
    return await apiService("POST", endpoints.ClientCash, payload);
  },
  T6Selling: async (payload: any) => {
    return await apiService("POST", endpoints.T6Selling, payload);
  },
  Last7dayBrokerage: async (payload: any) => {
    return await apiService("POST", endpoints.Last7dayBrokerage, payload);
  },
  GetAPRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPRevenue, payload);
  },
  GetClientStatusCnt: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientStatusCnt, payload);
  },
  DealerPerformance: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DealerPerformance,
      payload,
      {},
      155000,
    );
  },
  ClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.ClientDetails, payload);
  },
  GetBirthdayList: async (payload: any) => {
    return await apiService("POST", endpoints.GetBirthdayList, payload);
  },
  ClientDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.ClientDashboard, payload);
  },
  GetBrokerageDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageDetails, payload);
  },
  GetBrokeragePlans: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokeragePlans, payload);
  },
  UpdateClientBrokerageModification: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateClientBrokerageModification,
      payload,
    );
  },
  GetBrokerageModificationHistory: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationHistory,
      payload,
    );
  },
  ClientSegmentBrok: async (payload: any) => {
    return await apiService("POST", endpoints.ClientSegmentBrok, payload);
  },
  DPDebitRecovery: async (payload: any) => {
    return await apiService("POST", endpoints.DPDebitRecovery, payload);
  },
  DPEmail: async (payload: any) => {
    return await apiService("POST", endpoints.DPEmail, payload);
  },
  getFundamentalOverview: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalOverview}/${isin}`,
      {},
    );
  },
  getFundamentalDividend: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalDividend}/${isin}`,
      {},
    );
  },
  getFundamentalBonus: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBonus}/${isin}`,
      {},
    );
  },
  getFundamentalRatios: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalRatios}/${isin}`,
      {},
    );
  },
  getFundamentalNewsfeed: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalNewsfeed}/${isin}`,
      {},
    );
  },
  getFundamentalcashflow: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalcashflow}/${isin}`,
      {},
    );
  },
  getFundamentalBoardMeeting: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBoardMeeting}/${isin}`,
      {},
    );
  },
  getFundamentalSplit: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalSplit}/${isin}`,
      {},
    );
  },

  getFundamentalShareholding: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalShareholding}/${isin}`, // This dynamically appends ISIN
      {},
    );
  },

  getFundamentalBalanceSheet: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBalanceSheet}/${isin}`,
      {},
    );
  },
  getFundamentalAnnualPNL: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalAnnualPNL}/${isin}`,
      {},
    );
  },
  getFundamentalQuaterlyPNL: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalQuaterlyPNL}/${isin}`,
      {},
    );
  },
  ComplainceReport: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceReport, payload);
  },
  Compliance: async (payload: any) => {
    return await apiService("POST", endpoints.ComplianceData, payload);
  },
  ComplianceDownload: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceFileDownload, payload, {
      responseType: "blob",
    });
  },
  ComplainceFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceFileUpload, payload);
  },
  DashboardNudge: async (payload: any) => {
    return await apiService("POST", endpoints.DashboardNudge, payload);
  },
  ViewMarketingMaterials: async (payload: any) => {
    return await apiService("POST", endpoints.ViewMarketingMaterials, payload);
  },
  getInUpMarketMaterial: async (payload: any) => {
    return await apiService("POST", endpoints.getInUpMarketMaterial, payload);
  },
  DeleteMarketingMaterials: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteMarketingMaterials,
      payload,
    );
  },
  getInUpRegAnnoucement: async (payload: any) => {
    return await apiService("POST", endpoints.getInUpRegAnnoucement, payload);
  },
  viewRegAnnoucement: async (payload: any) => {
    return await apiService("POST", endpoints.viewRegAnnoucement, payload);
  },
  DeleteRegulatoryAnnoucement: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteRegulatoryAnnoucement,
      payload,
    );
  },
  GetAPDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPDashboard, payload);
  },
  ScripSearch: async () => {
    return await apiService("GET", endpoints.ScripSearch);
  },

  UploadTradeFile: async (payload: any) => {
    return await apiService("POST", endpoints.UploadTradeFile, payload);
  },
  GetAllRecords: async (payload: any) => {
    return await apiService("POST", endpoints.GetAllRecords, payload);
  },
  GetPreTradeReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetPreTradeReport, payload);
  },
  GetPendingApproveStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetPendingApproveStatus, payload);
  },
  SavePreTradeApproveStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SavePreTradeApproveStatus,
      payload,
    );
  },
  GetBrokerageModificationStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationStatus,
      payload,
    );
  },
  GetBrokerageKycStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageKycStatus, payload);
  },
  UpdateBrokerageKycStatusNew: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateBrokerageKycStatusNew,
      payload,
    );
  },
  GetBrokerageKycStatusNew: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageKycStatusNew,
      payload,
    );
  },
  GetBrokerageKycDetailsStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageKycDetailsStatus,
      payload,
    );
  },
  UpdateBrokerageKycStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateBrokerageKycStatus,
      payload,
    );
  },
  GetBrokerageRHStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageRHStatus, payload);
  },
  UpdateBrokerageRHStatus: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateBrokerageRHStatus, payload);
  },
  GetTechExcelApiResponse: async (payload: any) => {
    return await apiService("POST", endpoints.GetTechExcelApiResponse, payload);
  },
  GetTechExcelApiResponseNew: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetTechExcelApiResponseNew,
      payload,
    );
  },
  GetBrokerageModificationValidity: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationValidity,
      payload,
    );
  },
  GetClientWiseBrokerage: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientWiseBrokerage, payload);
  },
  CTCLActivityReport: async (payload: any) => {
    return await apiService("POST", endpoints.CTCLActivityReport, payload);
  },
  DetailedCTCLActivityReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DetailedCTCLActivityReport,
      payload,
    );
  },
  TradingPatternReport: async (payload: any) => {
    return await apiService("POST", endpoints.TradingPatternReport, payload);
  },
  DetailedTradingPatternReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DetailedTradingPatternReport,
      payload,
    );
  },
  SPIPClientPerformanceDashboard: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SPIPClientPerformanceDashboard,
      payload,
    );
  },
  SPIPClientPerformanceSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SPIPClientPerformanceSummary,
      payload,
    );
  },
  SPIPsubScriptionDetail: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPsubScriptionDetail, payload);
  },
  SPIPFeesSharingReport: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPFeesSharingReport, payload);
  },
  SPIPB2BClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPB2BClientDetails, payload);
  },
  FillQuarterName: async (payload: any) => {
    return await apiService("POST", endpoints.FillQuarterName, payload);
  },
  GenerateAndDownloadInvoice: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GenerateAndDownloadInvoice,
      payload,
    );
  },
  EKycSSOLogin: async (payload: any) => {
    return await apiService("POST", endpoints.EKycSSOLogin, payload);
  },
  Approver1ViewUnlisted: async (payload: any) => {
    return await apiService("POST", endpoints.Approver1ViewUnlisted, payload);
  },
  Approver2ViewUnlisted: async (payload: any) => {
    return await apiService("POST", endpoints.Approver2ViewUnlisted, payload);
  },
  ApproverActionUnlistedShares: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ApproverActionUnlistedShares,
      payload,
    );
  },
  UploadUnlistedSharesVendorFile: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UploadUnlistedSharesVendorFile,
      payload,
    );
  },
  ViewUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ViewUnlistedSharesRecord,
      payload,
    );
  },
  InsertUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertUnlistedSharesRecord,
      payload,
    );
  },
  UpdateUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateUnlistedSharesRecord,
      payload,
    );
  },
  DeleteUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteUnlistedSharesRecord,
      payload,
    );
  },
  GetAPContestTargetDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestTargetDetails,
      payload,
    );
  },
  GetEMPContestTargetDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEMPContestTargetDetails,
      payload,
    );
  },
  GetB2BCommissionSummary: async (payload: any) => {
    return await apiService("POST", endpoints.GetB2BCommissionSummary, payload);
  },
  GetNewClientCount: async (payload: any) => {
    return await apiService("POST", endpoints.GetNewClientCount, payload);
  },
  GetUniqueSubclientCount: async (payload: any) => {
    return await apiService("POST", endpoints.GetUniqueSubclientCount, payload);
  },
  GetClientActiveInactiveCount: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetClientActiveInactiveCount,
      payload,
    );
  },
  GetCommissionRevenueSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommissionRevenueSummary,
      payload,
    );
  },
  GetClientPledgeDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientPledgeDetails, payload);
  },
  GetEmpContestAchievedSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedSummary,
      payload,
    );
  },
  GetAPContestAchievedBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedBrokerage,
      payload,
    );
  },
  GetAPContestAchievedClients: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedClients,
      payload,
    );
  },
  GetAPContestAchievedSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedSummary,
      payload,
    );
  },
  GetEmpContestAchievedBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedBrokerage,
      payload,
    );
  },
  GetEmpContestAchievedClients: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedClients,
      payload,
    );
  },
  GetEmpContestAchievedNonBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedNonBrokerage,
      payload,
    );
  },
  SLBMHoldingsUpload: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMHoldingsUpload, payload);
  },
  SLBMHoldingsUploadOdin: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMHoldingsUploadOdin, payload);
  },
  GenerateClientPerformancePdf: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GenerateClientPerformancePdf,
      payload,
    );
  },
  GetExcludeOptions: async (payload: any) => {
    return await apiService("POST", endpoints.GetExcludeOptions, payload);
  },
  GetClientExclusionList: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientExclusionList, payload);
  },
  InsertClientExclusionEntry: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertClientExclusionEntry,
      payload,
    );
  },
  DeleteClientExclusionEntry: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteClientExclusionEntry,
      payload,
    );
  },
  GetWebPortalDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetWebPortalDetails, payload);
  },
  ViewThirdPartyMaster: async (payload: any) => {
    return await apiService("POST", endpoints.ViewThirdPartyMaster, payload);
  },
  InsertThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertThirdPartyMasterRecord,
      payload,
    );
  },
  DeleteThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteThirdPartyMasterRecord,
      payload,
    );
  },
  UpdateThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateThirdPartyMasterRecord,
      payload,
    );
  },
  ThirdPartyApproverView: async (payload: any) => {
    return await apiService("POST", endpoints.ThirdPartyApproverView, payload);
  },
  ThirdPartyApproverAction: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ThirdPartyApproverAction,
      payload,
    );
  },
  TPInvoiceStaging: async (payload: any) => {
    return await apiService("POST", endpoints.TPInvoiceStaging, payload);
  },
  UnstageTPInvoice: async (payload: any) => {
    return await apiService("POST", endpoints.UnstageTPInvoice, payload);
  },
  TPInvoiceUpload: async (payload: any) => {
    return await apiService("POST", endpoints.TPInvoiceUpload, payload);
  },
  GetUnverifiedTPInvoices: async (payload: any) => {
    return await apiService("POST", endpoints.GetUnverifiedTPInvoices, payload);
  },
  HandleTPInvoiceApproval: async (payload: any) => {
    return await apiService("POST", endpoints.HandleTPInvoiceApproval, payload);
  },
  DeleteTPInvoiceRecord: async (payload: any) => {
    return await apiService("POST", endpoints.DeleteTPInvoiceRecord, payload);
  },
  GetReadyToSendTPInvoices: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetReadyToSendTPInvoices,
      payload,
    );
  },
  GenerateTPInvoice: async (payload: any) => {
    return await apiService("POST", endpoints.GenerateTPInvoice, payload);
  },
  SendTPInvoiceBulkEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTPInvoiceBulkEmail, payload);
  },
  GetTPInvoiceRecordList: async (payload: any) => {
    return await apiService("POST", endpoints.GetTPInvoiceRecordList, payload);
  },
  GetBrokRevReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokRevReport, payload);
  },
  GetTradedClientReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradedClientReport, payload);
  },
  GetRevenueTradedClientReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetRevenueTradedClientReport,
      payload,
    );
  },
  GetDeliverySegmentReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDeliverySegmentReport,
      payload,
    );
  },
  GetIntradaySegmentReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetIntradaySegmentReport,
      payload,
    );
  },
  GetFuturesRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetFuturesRevenue, payload);
  },
  GetOptionsRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetOptionsRevenue, payload);
  },
  GetCommodityFuturesReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodityFuturesReport,
      payload,
    );
  },
  GetCommodityOptionsReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodityOptionsReport,
      payload,
    );
  },
  GetMonthlyClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetMonthlyClient, payload);
  },
  GetBrokRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokRevenue, payload);
  },
  GetTradeplaced: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradeplaced, payload);
  },
  GetTradedClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradedClient, payload);
  },
  GetRevTradedClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetRevTradedClient, payload);
  },

  VerifyBankDetails: async (payload: any) => {
    return await apiService("POST", endpoints.VerifyBankDetails, payload);
  },
  FetchPinLocation: async (payload: any) => {
    return await apiService("POST", endpoints.FetchPinLocation, payload);
  },
  SaveVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.SaveVendorDetails, payload);
  },
  ViewVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.ViewVendorDetails, payload);
  },
  ViewAccountVendorDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ViewAccountVendorDetails,
      payload,
    );
  },
  DeleteVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.DeleteVendorDetails, payload);
  },
  UpdateVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateVendorDetails, payload);
  },
  UpdateAccountApproval: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateAccountApproval, payload);
  },

  GetAPContestReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPContestReport, payload);
  },
  GetUnlistedVendorDropdown: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetUnlistedVendorDropdown,
      payload,
    );
  },
  GetClientAccessLink: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientAccessLink, payload);
  },
  MergeIntoOdinFile: async (payload: any) => {
    return await apiService("POST", endpoints.MergeIntoOdinFile, payload);
  },
  MergeIntoSymphonyFile: async (payload: any) => {
    return await apiService("POST", endpoints.MergeIntoSymphonyFile, payload);
  },
  GetUnPledgeReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetUnPledgeReport, payload);
  },
  UploadCollateralFiles: async (payload: any) => {
    return await apiService("POST", endpoints.UploadCollateralFiles, payload);
  },
  GetEmpContestReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetEmpContestReport, payload);
  },
  MF_NFODetails: async () => {
    return await apiService("GET", endpoints.MF_NFODetails);
  },
  ClientProfile: async (payload: any) => {
    return await apiService("POST", endpoints.ClientProfile, payload);
  },
  GetClientsCodeAndName: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientsCodeAndName, payload);
  },
  MF_TodayOrders: async () => {
    return await apiService("GET", endpoints.MF_TodayOrders);
  },
  MF_SchemeDetails: async (payload: any) => {
    return await apiService("POST", endpoints.MF_SchemeDetails, payload);
  },
  MFLogin: async (payload: any) => {
    return await apiService("POST", endpoints.MFLogin, payload);
  },
  MF_BasketDetialedList: async (payload: any) => {
    return await apiService("POST", endpoints.MF_BasketDetialedList, payload);
  },
  VerifyUpi: async (payload: any) => {
    return await apiService("POST", endpoints.VerifyUpi, payload);
  },
  BSEStar_SinglePayment: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_SinglePayment, payload);
  },
  CommonProcessOTP: async (payload: any) => {
    return await apiService("POST", endpoints.CommonProcessOTP, payload);
  },
  BSEStar_MfOrderEntry: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_MfOrderEntry, payload);
  },
  BSEStar_XSIPOrderEntry: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_XSIPOrderEntry, payload);
  },
  MF_FundOverView: async (payload: any) => {
    return await apiService("POST", endpoints.MF_FundOverView, payload);
  },
  BSEStar_MfMandateStatus: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_MfMandateStatus, payload);
  },
  MF_OngoingSIP: async (payload: any) => {
    return await apiService("POST", endpoints.MF_OngoingSIP, payload);
  },
  MF_PortfolioStatementReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.MF_PortfolioStatementReport,
      payload,
    );
  },
  MF_TransactionReport: async (payload: any) => {
    return await apiService("POST", endpoints.MF_TransactionReport, payload);
  },
  BSEStar_MfMandateEntry: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_MfMandateEntry, payload);
  },
  BSEStar_MfMandateENACH: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_MfMandateENACH, payload);
  },
  EnachEmailToClient: async (payload: any) => {
    return await apiService("POST", endpoints.EnachEmailToClient, payload);
  },
  SinglePaymentEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SinglePaymentEmail, payload);
  },
  ResearchCallData: async (payload: any) => {
    return await apiService("POST", endpoints.ResearchCallData, payload);
  },
  UploadTdsfile: async (payload: any) => {
    return await apiService("POST", endpoints.UploadTdsfile, payload);
  },
  GetDpClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetDpClientDetails, payload);
  },
  checkUpi: async (payload: any) => {
    return await apiService("POST", endpoints.checkUpi, payload);
  },
  CreateUpiMandate: async (payload: any) => {
    return await apiService("POST", endpoints.CreateUpiMandate, payload);
  },
  GetMandateCallBackDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetMandateCallBackDetails,
      payload,
    );
  },
  UpdateUpiMandate: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateUpiMandate, payload);
  },
  RevokeUpiMandate: async (payload: any) => {
    return await apiService("POST", endpoints.RevokeUpiMandate, payload);
  },
  GetOverviewBrokRevReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetOverviewBrokRevReport,
      payload,
    );
  },
  GetOverviewUniqueTradedClients: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetOverviewUniqueTradedClients,
      payload,
    );
  },
  GetNewAccountAddedOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetNewAccountAddedOverview,
      payload,
    );
  },
  GetDeliverySegmentOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDeliverySegmentOverview,
      payload,
    );
  },
  GetFuturesRevenueOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetFuturesRevenueOverview,
      payload,
    );
  },
  GetOptionsRevenueOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetOptionsRevenueOverview,
      payload,
    );
  },
  GetCommodity_FuturesOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodity_FuturesOverview,
      payload,
    );
  },
  GetCommodity_OptionsOverview: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodity_OptionsOverview,
      payload,
    );
  },
  GetslbmOverview: async (payload: any) => {
    return await apiService("POST", endpoints.GetslbmOverview, payload);
  },
  GetNewAccountAdded: async (payload: any) => {
    return await apiService("POST", endpoints.GetNewAccountAdded, payload);
  },
  UpcomingDormantAccount: async (payload: any) => {
    return await apiService("POST", endpoints.UpcomingDormantAccount, payload);
  },
  GetUniqueTradedClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetUniqueTradedClient, payload);
  },
  GetActiveClients: async (payload: any) => {
    return await apiService("POST", endpoints.GetActiveClients, payload);
  },
  CollectMandatePayment: async (payload: any) => {
    return await apiService("POST", endpoints.CollectMandatePayment, payload);
  },
  PreDebitMandateNotify: async (payload: any) => {
    return await apiService("POST", endpoints.PreDebitMandateNotify, payload);
  },
  ExecuteUpiMandate: async (payload: any) => {
    return await apiService("POST", endpoints.ExecuteUpiMandate, payload);
  },
  GetClientModuleDataForAmc: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetClientModuleDataForAmc,
      payload,
    );
  },
  GetZoneTargetdata: async (payload: any) => {
    return await apiService("POST", endpoints.GetZoneTargetdata, payload);
  },
  GetClientModuleDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientModuleDetails, payload);
  },
  ProcessOTP: async (payload: any) => {
    return await apiService("POST", endpoints.ProcessOTP, payload);
  },
  ActivateAMC: async (payload: any) => {
    return await apiService("POST", endpoints.ActivateAMC, payload);
  },
  SendDPAMCEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendDPAMCEmail, payload);
  },
  GetDPAMCPaymentResponse: async (payload: any) => {
    return await apiService("POST", endpoints.GetDPAMCPaymentResponse, payload);
  },
  GetClientDPContest: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientDPContest, payload);
  },
  SendFirstHolderSignature: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendFirstHolderSignature,
      payload,
    );
  },
  SendSecondHolderSignature: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendSecondHolderSignature,
      payload,
    );
  },
  SendThirdHolderSignature: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendThirdHolderSignature,
      payload,
    );
  },
  DownloadSignedPdf: async (payload: any) => {
    return await apiService("POST", endpoints.DownloadSignedPdf, payload);
  },
  SendFinalSignedMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendFinalSignedMail, payload);
  },
  GetLedgerReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetLedgerReport, payload);
  },
  GetClientMISDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientMISDetails, payload);
  },
  ViewVendorDetailsReport: async (payload: any) => {
    return await apiService("POST", endpoints.ViewVendorDetailsReport, payload);
  },
  GetAMCActivationStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetAMCActivationStatus, payload);
  },
  GetMTFShortfallData: async (payload: any) => {
    return await apiService("POST", endpoints.GetMTFShortfallData, payload);
  },
  ViewMTFAgeingReport: async (payload: any) => {
    return await apiService("POST", endpoints.ViewMTFAgeingReport, payload);
  },
  MTFAgeingFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.MTFAgeingFileUpload, payload);
  },
  MTFStockAgeingFileUpload: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.MTFStockAgeingFileUpload,
      payload,
    );
  },
  T6BSESellingFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.T6BSESellingFileUpload, payload);
  },
  T6NSESellingFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.T6NSESellingFileUpload, payload);
  },
  ViewT6SellingReport: async (payload: any) => {
    return await apiService("POST", endpoints.ViewT6SellingReport, payload);
  },
  REGBSEFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.REGBSEFileUpload, payload);
  },
  REGNSEFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.REGNSEFileUpload, payload);
  },
  ViewREGMasterdata: async (payload: any) => {
    return await apiService("POST", endpoints.ViewREGMasterdata, payload);
  },
  GetAPTop10ClientBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPTop10ClientBrokerage,
      payload,
    );
  },
  APContestLeaderboard: async (payload: any) => {
    return await apiService("POST", endpoints.APContestLeaderboard, payload);
  },
  GetAPContestDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPContestDashboard, payload);
  },
  GetAMCZoneReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetAMCZoneReport, payload);
  },
  GetDPTransactionDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetDPTransactionDetails, payload);
  },
  GetPledgeReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetPledgeReport, payload);
  },
  DPAMCDownloadFile: async (payload: any) => {
    return await apiService("POST", endpoints.DPAMCDownloadFile, payload);
  },
  GetFileuploadDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetFileuploadDetails, payload);
  },
  ViewMTFStockAgeingReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ViewMTFStockAgeingReport,
      payload,
    );
  },
  GetDPAMCZoneReportDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDPAMCZoneReportDetails,
      payload,
    );
  },
  NomineeInsertPhysical: async (payload: any) => {
    return await apiService("POST", endpoints.NomineeInsertPhysical, payload);
  },
  PhysicalClientInfo: async (payload: any) => {
    return await apiService("POST", endpoints.PhysicalClientInfo, payload);
  },
  ElogForPhysical: async (payload: any) => {
    return await apiService("POST", endpoints.ElogForPhysical, payload);
  },
  PhysicalClientRegistration: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.PhysicalClientRegistration,
      payload,
    );
  },

  GetAPGrossBrokeragePerQuarter: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPGrossBrokeragePerQuarter,
      payload,
    );
  },
  ViewComplianceData: async (payload: any) => {
    return await apiService("POST", endpoints.ViewComplianceData, payload);
  },
  DeleteComplianceData: async (payload: any) => {
    return await apiService("POST", endpoints.DeleteComplianceData, payload);
  },
  InsertComplianceData: async (payload: any) => {
    return await apiService("POST", endpoints.InsertComplianceData, payload);
  },
  UpdateComplianceData: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateComplianceData, payload);
  },
  GetComplianceReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetComplianceReport, payload);
  },
  ApproveComplianceData: async (payload: any) => {
    return await apiService("POST", endpoints.ApproveComplianceData, payload);
  },
  SendOtpSms: async (payload: any) => {
    return await apiService("POST", endpoints.SendOtpSms, payload);
  },
  ValidateOtpSms: async (payload: any) => {
    return await apiService("POST", endpoints.ValidateOtpSms, payload);
  },
  GetEmployeeExpiryDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmployeeExpiryDetails,
      payload,
    );
  },
  GetClientExpiryDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientExpiryDetails, payload);
  },
  GetZoneExpiryDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetZoneExpiryDetails, payload);
  },
  UploadHdfcMerchantFile: async (payload: any) => {
    return await apiService("POST", endpoints.UploadHdfcMerchantFile, payload);
  },
  GetClientMandateData: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientMandateData, payload);
  },
  DownloadDpMandateTrans: async (payload: any) => {
    return await apiService("POST", endpoints.DownloadDpMandateTrans, payload);
  },
  GetClientMandateExectionData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetClientMandateExectionData,
      payload,
    );
  },
  GetMandateJVReportData: async (payload: any) => {
    return await apiService("POST", endpoints.GetMandateJVReportData, payload);
  },
  GetDealerExpiryDashBoardData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDealerExpiryDashBoardData,
      payload,
    );
  },
  GetDealerExpiryHistDashBoardData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDealerExpiryHistDashBoardData,
      payload,
    );
  },
  GetZoneExpiryHistDashBoardData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetZoneExpiryHistDashBoardData,
      payload,
    );
  },
  GetZoneExpiryDashBoardData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetZoneExpiryDashBoardData,
      payload,
    );
  },
  GetSPIPContest: async (payload: any) => {
    return await apiService("POST", endpoints.GetSPIPContest, payload);
  },
  SendClientMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendClientMTFEmail, payload);
  },
  SendDealerMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendDealerMTFEmail, payload);
  },
  SendRMMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRMMTFEmail, payload);
  },
  SendRHMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRHMTFEmail, payload);
  },
  SendAPMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAPMTFEmail, payload);
  },
  GetContestSummary: async (payload: any) => {
    return await apiService("POST", endpoints.GetContestSummary, payload);
  },

  MTFShorfallUpload: async (payload: any) => {
    return await apiService("POST", endpoints.MTFShorfallUpload, payload);
  },
  ShowMailMTFAgeingData: async (payload: any) => {
    return await apiService("POST", endpoints.ShowMailMTFAgeingData, payload);
  },
  SendClientMTFShortfallMail: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendClientMTFShortfallMail,
      payload,
    );
  },
  SendDealerMTFShortfallMail: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendDealerMTFShortfallMail,
      payload,
    );
  },
  SendRMMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRMMTFShortfallMail, payload);
  },
  SendRHMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRHMTFShortfallMail, payload);
  },
  SendAPMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAPMTFShortfallMail, payload);
  },
  SLBMLastUpdate: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMLastUpdate, payload);
  },
  PhysicalClientFileUpload: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.PhysicalClientFileUpload,
      payload,
    );
  },
  GetBankDetailsForRedeem: async (payload: any) => {
    return await apiService("POST", endpoints.GetBankDetailsForRedeem, payload);
  },
  PanVerification: async (payload: any) => {
    return await apiService("POST", endpoints.PanVerification, payload);
  },
  GetPhysicalClientDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetPhysicalClientDetails,
      payload,
    );
  },
  EmailOTPForPhysical: async (payload: any) => {
    return await apiService("POST", endpoints.EmailOTPForPhysical, payload);
  },
  EmailVerificationPhysical: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.EmailVerificationPhysical,
      payload,
    );
  },
  KYCverification: async (payload: any) => {
    return await apiService("POST", endpoints.KYCverification, payload);
  },
  KYCOtpVerification: async (payload: any) => {
    return await apiService("POST", endpoints.KYCOtpVerification, payload);
  },
  PhysicalManualOnboarding: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.PhysicalManualOnboarding,
      payload,
    );
  },
  PhyicalOrder2FA: async (payload: any) => {
    return await apiService("POST", endpoints.PhyicalOrder2FA, payload);
  },
  ChildOrder: async (payload: any) => {
    return await apiService("POST", endpoints.ChildOrder, payload);
  },
  GetPhysicalResponse: async (payload: any) => {
    return await apiService("POST", endpoints.GetPhysicalResponse, payload);
  },
  UpdateClientElogStatus: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateClientElogStatus, payload);
  },
  ThirdPartyInvoiceDropdown: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ThirdPartyInvoiceDropdown,
      payload,
    );
  },
  SendCompanyWiseTPInvoiceMail: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SendCompanyWiseTPInvoiceMail,
      payload,
    );
  },
  UnlistedSharesClientSearch: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UnlistedSharesClientSearch,
      payload,
    );
  },
  UnlistedSharesClientDetail: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UnlistedSharesClientDetail,
      payload,
    );
  },
  UnlistedScripMasterDropdown: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UnlistedScripMasterDropdown,
      payload,
    );
  },
  ViewUnlistedScripMaster: async (payload: any) => {
    return await apiService("POST", endpoints.ViewUnlistedScripMaster, payload);
  },
  InsertUnlistedScripMaster: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertUnlistedScripMaster,
      payload,
    );
  },
  DeleteUnlistedScripMaster: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteUnlistedScripMaster,
      payload,
    );
  },
  UpdateUnlistedScripMaster: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateUnlistedScripMaster,
      payload,
    );
  },
  UnlistedSharesMailView: async (payload: any) => {
    return await apiService("POST", endpoints.UnlistedSharesMailView, payload);
  },
  UnlistedConsentFormMail: async (payload: any) => {
    return await apiService("POST", endpoints.UnlistedConsentFormMail, payload);
  },
  UnlistedContractNoteMail: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UnlistedContractNoteMail,
      payload,
    );
  },
  SetUnlistedSharesDISNumber: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SetUnlistedSharesDISNumber,
      payload,
    );
  },
  BeginMTFActivation: async (payload: any) => {
    return await apiService("POST", endpoints.BeginMTFActivation, payload);
  },
  ValidateSencondAuth: async (payload: any) => {
    return await apiService("POST", endpoints.ValidateSencondAuth, payload);
  },
  GetMTFClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetMTFClientDetails, payload);
  },
  MTFVerifyOTP: async (payload: any) => {
    return await apiService("POST", endpoints.MTFVerifyOTP, payload);
  },
  MTFSendOTP: async (payload: any) => {
    return await apiService("POST", endpoints.MTFSendOTP, payload);
  },
  GetMonths: async (payload: any) => {
    return await apiService("POST", endpoints.GetMonths, payload);
  },
  GetSPIPMonths: async (payload: any) => {
    return await apiService("POST", endpoints.GetSPIPMonths, payload);
  },
  ViewGrid: async (payload: any) => {
    return await apiService("POST", endpoints.ViewGrid, payload);
  },
  SPIPViewGrid: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPViewGrid, payload);
  },
  FetchClients: async (payload: any) => {
    return await apiService("POST", endpoints.FetchClients, payload);
  },
  FetchSPIPClients: async (payload: any) => {
    return await apiService("POST", endpoints.FetchSPIPClients, payload);
  },
  SendTrilogyEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTrilogyEmail, payload);
  },
  SendSpipEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendSpipEmail, payload);
  },
  InsertBankAcoountMaster: async (payload: any) => {
    return await apiService("POST", endpoints.InsertBankAcoountMaster, payload);
  },
  GetPendingEntryBankAccountMaster: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetPendingEntryBankAccountMaster,
      payload,
    );
  },
  GetEntry_Delete: async (payload: any) => {
    return await apiService("POST", endpoints.GetEntry_Delete, payload);
  },
  GetEntry_Update: async (payload: any) => {
    return await apiService("POST", endpoints.GetEntry_Update, payload);
  },
  GetEntry_Approval: async (payload: any) => {
    return await apiService("POST", endpoints.GetEntry_Approval, payload);
  },
  GetFinalReportBankAccountMaster: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetFinalReportBankAccountMaster,
      payload,
    );
  },
  BankAccountMaster_report: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.BankAccountMaster_report,
      payload,
    );
  },
  InitBOLogin: async (payload: any) => {
    return await apiService("POST", endpoints.InitBOLogin, payload);
  },
  ViewAPDashBoard: async (payload: any) => {
    return await apiService("POST", endpoints.ViewAPDashBoard, payload);
  },
  ViewApprovalData: async (payload: any) => {
    return await apiService("POST", endpoints.ViewApprovalData, payload);
  },

  EsignLKP_NSE: async (payload: any) => {
    return await apiService("POST", endpoints.EsignLKP_NSE, payload);
  },
  EsignLKP_BSE: async (payload: any) => {
    return await apiService("POST", endpoints.EsignLKP_BSE, payload);
  },
  Esign_BSELKP_Single: async (payload: any) => {
    return await apiService("POST", endpoints.Esign_BSELKP_Single, payload);
  },
  Esign_MCX_LKP_Single: async (payload: any) => {
    return await apiService("POST", endpoints.Esign_MCX_LKP_Single, payload);
  },
  EsignLKP_MCX: async (payload: any) => {
    return await apiService("POST", endpoints.EsignLKP_MCX, payload);
  },
  EsignLKp_BusinessAssociatemerge: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.EsignLKp_BusinessAssociatemerge,
      payload,
    );
  },
  DownloadSignedPdf_PO: async (payload: any) => {
    return await apiService("POST", endpoints.DownloadSignedPdf_PO, payload);
  },
  OpsApproveLevel1: async (payload: any) => {
    return await apiService("POST", endpoints.OpsApproveLevel1, payload);
  },
  ComplianceApprove: async (payload: any) => {
    return await apiService("POST", endpoints.ComplianceApprove, payload);
  },
  OpsApproveLevel2: async (payload: any) => {
    return await apiService("POST", endpoints.OpsApproveLevel2, payload);
  },
  BusinessApprove: async (payload: any) => {
    return await apiService("POST", endpoints.BusinessApprove, payload);
  },
  ManagmentApprove: async (payload: any) => {
    return await apiService("POST", endpoints.ManagmentApprove, payload);
  },
  HeadApprove: async (payload: any) => {
    return await apiService("POST", endpoints.HeadApprove, payload);
  },
  GetApprovalStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetApprovalStatus, payload);
  },
  AddBrokSharing: async (payload: any) => {
    return await apiService("POST", endpoints.AddBrokSharing, payload);
  },
  UpdateRevisedcharges: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateRevisedcharges, payload);
  },

  UploadPartnerSharingDocs: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UploadPartnerSharingDocs,
      payload,
    );
  },
  BrokShareSubmit: async (payload: any) => {
    return await apiService("POST", endpoints.BrokShareSubmit, payload);
  },
  GetRevisedPaySummary: async (payload: any) => {
    return await apiService("POST", endpoints.GetRevisedPaySummary, payload);
  },
  EsignKYC_Document_LKP: async (payload: any) => {
    return await apiService("POST", endpoints.EsignKYC_Document_LKP, payload);
  },
  DownloadAllDocs: async (payload: any) => {
    return await apiService("POST", endpoints.DownloadAllDocs, payload);
  },
  UpdateRevisedStampcharges: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateRevisedStampcharges,
      payload,
    );
  },
  UpdateEsignStatus: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateEsignStatus, payload);
  },
  ApAdminDocumentsFileDownload: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ApAdminDocumentsFileDownload,
      payload,
    );
  },
  GetApApplicationStatusFlow: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetApApplicationStatusFlow,
      payload,
    );
  },
  SendRejectionMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRejectionMail, payload);
  },
  SendMailToApprover: async (payload: any) => {
    return await apiService("POST", endpoints.SendMailToApprover, payload);
  },
  GetDetailsByAppl: async (payload: any) => {
    return await apiService("POST", endpoints.GetDetailsByAppl, payload);
  },
  GetEsignDocument: async (payload: any) => {
    return await apiService("POST", endpoints.GetEsignDocument, payload);
  },
  UploadExchangeCertificate: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UploadExchangeCertificate,
      payload,
    );
  },
  SendExchangeCertMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendExchangeCertMail, payload);
  },
  GetEmployeeRevenueTarget: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmployeeRevenueTarget,
      payload,
    );
  },
  GetZoneRevenueTarget: async (payload: any) => {
    return await apiService("POST", endpoints.GetZoneRevenueTarget, payload);
  },
  SendTLMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTLMTFEmail, payload);
  },
  SendBMMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendBMMTFEmail, payload);
  },
  SendAHMTFEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAHMTFEmail, payload);
  },
  SendTLMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTLMTFShortfallMail, payload);
  },
  SendBMMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendBMMTFShortfallMail, payload);
  },
  SendAHMTFShortfallMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAHMTFShortfallMail, payload);
  },
  GetBrokerageReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageReport, payload);
  },
  GetMTFShortfallSellQty: async (payload: any) => {
    return await apiService("POST", endpoints.GetMTFShortfallSellQty, payload);
  },
  GetVendorData: async (payload: any) => {
    return await apiService("POST", endpoints.GetVendorData, payload);
  },
  ViewT6PostPreSellingData: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ViewT6PostPreSellingData,
      payload,
    );
  },
  MarketingData: async (payload: any) => {
    return await apiService("POST", endpoints.MarketingData, payload);
  },
  UploadT5T6AgeingDebit: async (payload: any) => {
    return await apiService("POST", endpoints.UploadT5T6AgeingDebit, payload);
  },

  SLBMPosition: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMPosition, payload);
  },
  GetMTFYieldReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetMTFYieldReport, payload);
  },
  GetSLBMDDL: async (payload: any) => {
    return await apiService("GET", endpoints.GetSLBMDDL, payload);
  },

  GetNSESLBMScripSummary: async (payload: any) => {
    return await apiService("POST", endpoints.GetNSESLBMScripSummary, payload);
  },
  GetNSESLBMClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetNSESLBMClientDetails, payload);
  },

  SendDealerT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendDealerT5AgeingMail, payload);
  },
  SendRMT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRMT5AgeingMail, payload);
  },
  SendTLT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTLT5AgeingMail, payload);
  },
  SendBMT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendBMT5AgeingMail, payload);
  },
  SendAHT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAHT5AgeingMail, payload);
  },
  SendRHT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendRHT5AgeingMail, payload);
  },
  SendAPT5AgeingMail: async (payload: any) => {
    return await apiService("POST", endpoints.SendAPT5AgeingMail, payload);
  },
  DownloadT5T6ODINFile: async (payload: any) => {
    return await apiService("POST", endpoints.DownloadT5T6ODINFile, payload, {
      responseType: "blob",
    });
  },
};
