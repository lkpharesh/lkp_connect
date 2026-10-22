import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { useFormik } from "formik";
import { apiServices } from "../../../services";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import NudgeTable from "../../../components/common/NudgeTable";

interface SLBMMonth {
  ddlMonth: string;
}

interface SLBMSummaryRow {
  Id: number;
  clientCount: number;
  scrip: string;
  series: string;
  scripName: string;
  reverseLegDate: string;
  bestBidQty: number;
  bestBidPrice: number;
  bestOffersQty: number;
  bestOffersPrice: number;
  ltp: number;
  underlyingLtp: number;
  futuresLtp: number;
  spread: number;
  spreadPercent: number;
  openPositions: number;
  annualisedYield: number;
  daysToReverseLeg: number;
  ddlMonth: number;
}

interface SLBMClientRow {
  Id: number;
  clientCode: string;
  clientname: string;
  branchcode: string;
  branchtype: string;
  scrip: string;
  series: string;
  scripName: string;
  reverseLegDate: string;
  bestBidQty: number;
  bestBidPrice: number;
  bestOffersQty: number;
  bestOffersPrice: number;
  ltp: number;
  underlyingLtp: number;
  futuresLtp: number;
  spread: number;
  spreadPercent: number;
  openPositions: number;
  annualisedYield: number;
  daysToReverseLeg: number;
}

interface SLBMStopwatchProps {
  activeSubItem: string;
}

interface MonthOption {
  label: string;
  value: string;
}

type SLBMFilter = "Market" | "Opportunity";

const SLBMStopwatch = ({ activeSubItem }: SLBMStopwatchProps) => {
  const [months, setMonths] = useState<MonthOption[]>([]);
  const [loadingMonths, setLoadingMonths] = useState(false);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<SLBMSummaryRow[]>([]);
  const [clientData, setClientData] = useState<SLBMClientRow[]>([]);
  const [selectedSlbmRow, setSelectedSlbmRow] = useState<SLBMSummaryRow | null>(
    null,
  );

  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      filter: "Market" as SLBMFilter,
      symbol: "",
      ddlMonth: "",
    },
    validate: (values) => {
      const errors: Partial<Record<"symbol" | "ddlMonth", string>> = {};
      console.log("formValues", values);

      //   if (!values.symbol.trim()) {
      //     errors.symbol = "Please enter a symbol or name.";
      //   }

      //   if (!values.ddlMonth) {
      //     errors.ddlMonth = "Please select a month.";
      //   }

      return errors;
    },
    onSubmit: async (values) => {
      setSummaryData([]);
      setClientData([]);

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));
        const response = await apiServices.GetNSESLBMScripSummary({
          ddlMonth: values.ddlMonth,
          symbol: values.symbol.trim().toUpperCase(),
          filter: values.filter,
        });

        if (
          response?.status === 200 &&
          response?.data?.isSuccess &&
          Array.isArray(response?.data?.data)
        ) {
          dispatch(hideLoader());
          const rows: SLBMSummaryRow[] = response.data.data.map(
            (item: Omit<SLBMSummaryRow, "Id">, index: number) => ({
              ...item,
              Id: index + 1,
            }),
          );

          setSummaryData(rows);
        } else {
        }
      } catch (error) {
        console.error("GetNSESLBMScripSummary error:", error);
      } finally {
        dispatch(hideLoader());
      }
    },
  });

  // Load the month dropdown on page load.
  useEffect(() => {
    let isMounted = true;

    const fetchMonths = async () => {
      setLoadingMonths(true);

      try {
        const response = await apiServices.GetSLBMDDL({});

        if (
          response?.status === 200 &&
          response?.data?.isSuccess &&
          Array.isArray(response?.data?.data)
        ) {
          const options: MonthOption[] = response.data.data.map(
            (item: SLBMMonth) => ({
              label: item.ddlMonth,
              value: item.ddlMonth,
            }),
          );

          if (isMounted) {
            setMonths(options);

            if (options.length > 0) {
              formik.setFieldValue("ddlMonth", options[0].value);
            }
          }
        } else if (isMounted) {
        }
      } catch (error) {
        console.error("GetSLBMDDL error:", error);
      } finally {
        if (isMounted) {
          setLoadingMonths(false);
        }
      }
    };

    void fetchMonths();

    return () => {
      isMounted = false;
    };
    // Load only once when the component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClientCountClick = async (row: SLBMSummaryRow) => {
    setClientData([]);
    setSelectedSlbmRow(row);

    try {
      dispatch(showLoader("Please wait, we are fetching client details..."));

      const response = await apiServices.GetNSESLBMClientDetails({
        ddlMonth: row.ddlMonth,
        symbol: row.scrip,
        filter: formik.values.filter,
      });

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        Array.isArray(response?.data?.data)
      ) {
        const rows: SLBMClientRow[] = response.data.data.map(
          (item: Omit<SLBMClientRow, "Id">, index: number) => ({
            ...item,
            Id: index + 1,
          }),
        );

        setClientData(rows);
        setIsNudgeTableOpen(true);
      }
    } catch (error) {
      console.error("GetNSESLBMClientDetails error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <NudgeTable
            isOpen={isNudgeTableOpen}
            onClose={() => setIsNudgeTableOpen(false)}
            selectedReport="SLBM Client Detail"
            singleData={clientData}
            slbmSelectedRow={selectedSlbmRow}
            // selectedTab={selectedType}
          />
          <Row className="row-font">
            <Col lg={12}>
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
                  <h4 className="card-title mb-0">{activeSubItem}</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row className="g-3 align-items-end">
                      {/* Radio buttons */}
                      <Col xs={12} md={4} lg="auto">
                        <FormControl
                          component="fieldset"
                          sx={{
                            minHeight: 40,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <RadioGroup
                            row
                            name="filter"
                            value={formik.values.filter}
                            onChange={async (event) => {
                              const newFilter = event.target
                                .value as SLBMFilter;

                              // Avoid calling the API if the selected option hasn't changed.
                              if (newFilter === formik.values.filter) return;

                              // Update Formik's filter value first.
                              await formik.setFieldValue("filter", newFilter);

                              // Submit using the updated filter value.
                              await formik.submitForm();
                            }}
                            sx={{
                              alignItems: "center",
                              minHeight: 40,
                            }}
                          >
                            <FormControlLabel
                              value="Market"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#11395C",
                                    "&.Mui-checked": {
                                      color: "#11395C",
                                    },
                                  }}
                                />
                              }
                              label="Market"
                              sx={{ mb: 0 }}
                            />
                            <FormControlLabel
                              value="Opportunity"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#11395C",
                                    "&.Mui-checked": {
                                      color: "#11395C",
                                    },
                                  }}
                                />
                              }
                              label="Opportunities"
                              sx={{ mb: 0 }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Col>

                      {/* Symbol / Name */}
                      <Col xs={12} md={3} lg={3}>
                        <TextField
                          fullWidth
                          size="small"
                          id="symbol"
                          name="symbol"
                          label="Enter Symbol/Name"
                          placeholder="Enter Symbol/Name"
                          value={formik.values.symbol}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              minHeight: 38.7,
                              // "& fieldset": {
                              //   borderColor: "#11395C",
                              // },
                              // "&:hover fieldset": {
                              //   borderColor: "#11395C",
                              // },
                              "&.Mui-focused fieldset": {
                                borderColor: "#11395C",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#11395C",
                            },
                          }}
                        />
                      </Col>

                      {/* Month dropdown */}
                      <Col xs={12} md={4} lg={3}>
                        <Select
                          options={months}
                          value={
                            months.find(
                              (option) =>
                                option.value === formik.values.ddlMonth,
                            ) ?? null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "ddlMonth",
                              option?.value ?? "",
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("ddlMonth", true)
                          }
                          placeholder="Select Month"
                          isLoading={loadingMonths}
                          isClearable
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                              fontSize: "12px",
                            }),
                            control: (base) => ({
                              ...base,
                              minHeight: 40,
                              fontSize: "12px",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              fontSize: "12px",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontSize: "12px",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "12px",
                            }),
                            option: (base) => ({
                              ...base,
                              fontSize: "12px",
                            }),
                            input: (base) => ({
                              ...base,
                              fontSize: "12px",
                            }),
                          }}
                        />
                      </Col>

                      {/* Submit button */}
                      <Col xs={12} md={12} lg={3}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            minHeight: 40,
                            maxWidth: "100px",
                            textTransform: "none",
                            backgroundColor: "#11395C",
                            "&:hover": {
                              backgroundColor: "#0b2944",
                            },
                          }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  {" "}
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={summaryData}
                    handleClientCountClick={handleClientCountClick}
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

export default SLBMStopwatch;
