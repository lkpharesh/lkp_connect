import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { useFormik } from "formik";
import {
  FormControl,
  FormHelperText,
  TextField,
  // useMediaQuery,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
const { afterToday } = DateRangePicker;
import moment from "moment";
// import { regEx } from "../../../helper/method";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import UserInfoTable from "../../../components/common/UserInfoTable";

const PledgeReport = ({ activeSubItem }: any) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [pledgeData, setPledgeData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const formik = useFormik({
    initialValues: {
      clientCode: "",
      startDate: "",
      endDate: "",
    },
    // validationSchema: Yup.object({
    //   clientCode: Yup.string().required("Please enter Client Code"),
    //   // startDate: Yup.string().required("Start date is required"),
    //   // endDate: Yup.string().required("End date is required"),
    // }),
    onSubmit: (values) => {
      const { clientCode } = values;
      console.log("submitClick", clientCode);
      console.log("Form Submitted", {
        startDate,
        endDate,
        formattedDateRange,
      });
      fetchReport();
    },
  });

  useEffect(() => {
    console.log("dataaaass", startDate, endDate, formik.values.clientCode);
  }, [formik, startDate, endDate]);

  const fetchReport = () => {
    let payload = {
      userId: user_id,
      clientCode: formik.values.clientCode || "",
      fromDate: startDate ? startDate : "", // "2025-10-30"
      toDate: endDate ? endDate : "", //"2025-10-30"
    };

    dispatch(showLoader(""));
    apiServices
      .GetPledgeReport(payload)
      .then((response) => {
        dispatch(hideLoader());

        if (response?.status === 200 && Array.isArray(response?.data)) {
          const dataWithId = response.data.map((item, index) => ({
            Id: index + 1,
            ...item,
            lastUpdate: formatDate(item.lastUpdate),
          }));
          setPledgeData(dataWithId);

          console.log("Transformed Data:", dataWithId);
        } else {
          console.warn("Unexpected response format:", response);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.error("Error fetching vendor report:", error);
      });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      // Clean up multiple spaces
      const clean = dateString.replace(/\s+/g, " ").trim();

      // Extract parts manually using regex
      const regex = /([A-Za-z]{3}) (\d{1,2}) (\d{4})/;
      const match = clean.match(regex);

      if (!match) return dateString; // fallback if not matched

      const [, monthStr, day, year] = match;
      const months: Record<string, string> = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      const month = months[monthStr];
      if (!month) return dateString;

      // Create desired output: "12-Nov-25"
      const shortYear = year.slice(-2);
      const formatted = `${day.padStart(2, "0")}-${monthStr}-${shortYear}`;

      return formatted;
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateString;
    }
  };

  const onDateRangeChange = (value: [Date | null, Date | null] | null) => {
    if (
      !value ||
      !Array.isArray(value) ||
      value.length !== 2 ||
      !value[0] ||
      !value[1]
    ) {
      setSelectedDateRange([null, null]);
      handleDateChange([null, null]);
    } else {
      setSelectedDateRange(value);
      handleDateChange(value);
    }
  };

  // const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, name } = e.target;
  //   console.log("value", name, value);
  //   if (name === "riaCode") {
  //     if (regEx.alphaNumeric.test(value)) {
  //       formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
  //     }
  //   } else {
  //     formik.handleChange(e);
  //   }
  // };

  const handleDateChange = (value: [Date | null, Date | null]) => {
    const [start, end] = value;
    if (start && end) {
      const isoStart = moment(start).format("YYYY-MM-DD");
      const isoEnd = moment(end).format("YYYY-MM-DD");

      setStartDate(isoStart);
      setEndDate(isoEnd);
      formik.setFieldValue("startDate", isoStart);
      formik.setFieldValue("endDate", isoEnd);
      // Clear touched state and errors for both if valid
      formik.setFieldError("startDate", "");
      formik.setFieldError("endDate", "");
      const formattedRange = `${moment(start).format("DD/MM/YYYY")} - ${moment(
        end,
      ).format("DD/MM/YYYY")}`;
      setFormattedDateRange(formattedRange);
    } else {
      setStartDate(null);
      setEndDate(null);
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
      setFormattedDateRange("");
    }
  };

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
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
                  <Row>
                    <Col xs={12} md={6} lg={4}>
                      <FormControl
                        fullWidth
                        error={
                          (formik.touched.startDate &&
                            Boolean(formik.errors.startDate)) ||
                          (formik.touched.endDate &&
                            Boolean(formik.errors.endDate))
                        }
                        sx={{
                          backgroundColor: "white",
                          // px: 0.5,
                          fontSize: "0.85rem",
                        }}
                      >
                        <DateRangePicker
                          id="date-range-picker"
                          size="md"
                          value={
                            selectedDateRange &&
                            selectedDateRange[0] &&
                            selectedDateRange[1]
                              ? [selectedDateRange[0], selectedDateRange[1]]
                              : undefined
                          }
                          onChange={onDateRangeChange}
                          placeholder="Select Date Range"
                          showOneCalendar
                          shouldDisableDate={afterToday()}
                          placement="bottomStart"
                          style={{ width: "100%", fontSize: "12px" }}
                          onBlur={() => {
                            formik.setFieldTouched("startDate", true);
                            formik.setFieldTouched("endDate", true);
                          }}
                        />
                        <FormHelperText>
                          {formik.touched.startDate && formik.errors.startDate
                            ? formik.errors.startDate
                            : formik.touched.endDate && formik.errors.endDate
                              ? formik.errors.endDate
                              : ""}
                        </FormHelperText>
                      </FormControl>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.clientCode &&
                          Boolean(formik.errors.clientCode)
                        }
                      >
                        <TextField
                          size="small"
                          id="client-code-input"
                          label="Enter Client Code"
                          variant="outlined"
                          name="clientCode"
                          type="text"
                          value={formik.values.clientCode}
                          onChange={(e) => {
                            // Allow only A–Z, 0–9 — remove spaces and special chars
                            const formattedValue = e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, "");

                            formik.setFieldValue("clientCode", formattedValue);
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clientCode &&
                            Boolean(formik.errors.clientCode)
                          }
                          helperText={
                            formik.touched.clientCode &&
                            formik.errors.clientCode
                          }
                          fullWidth
                          inputProps={{
                            maxLength: 15, // optional: limit length if needed
                          }}
                        />
                      </FormControl>
                    </Col>

                    <Col xs={12} sm={6} md={3} lg={2}>
                      <Button
                        className="btn-font w-100"
                        style={{
                          backgroundColor: "#11395C",
                          height: "36px",
                          fontSize: "13px",
                          padding: "4px 10px",
                        }}
                        type="submit"
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
                <UserInfoTable
                  activeSubItem={activeSubItem}
                  T6Data={pledgeData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PledgeReport;
