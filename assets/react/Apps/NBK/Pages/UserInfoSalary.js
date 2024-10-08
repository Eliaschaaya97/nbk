import React, { useState, useEffect } from "react";
import ProgressBar from "../Component/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "react-phone-number-input/style.css";
import { list } from "iso-currencies";
import ButtonModile from "./ButtonMobile";
import DropdownCheckbox from "../Component/DropdownCheckbox";

const UserInfoSalary = () => {
  const userData = useSelector(
    (state) => state.appData.userData.financialDetails || {}
  );

  const [currency, setCurrency] = useState(userData.currency || "");
  const [progress, setProgress] = useState(80);
  const [sourceOfFunds, setSourceOfFunds] = useState(
    userData.sourceOfFunds || ""
  );
  const [additionalIncomeSource, setAdditionalIncomeSource] = useState(
    userData.additionalIncomeSources || []
  );
  const [monthlyBasicSal, setMonthlyBasicSal] = useState(
    userData.monthlyBasicSalary || ""
  );
  const [monthlyAllowances, setMonthlyAllowances] = useState(
    userData.monthlyAllowances || ""
  );
  const [totalEstimatedMonthlyin, setTotalEstimatedMonthlyin] = useState(
    userData.totalEstimatedMonthlyIncome || ""
  );
  const [estimatedWealthMonth, setEstimatedWealthMonth] = useState(
    userData.estimatedWealthAmount || ""
  );
  const [otherSpecify, setotherSpecify] = useState(
    userData.othersSourceOfFound || ""
  );
  const [activeButton, setActiveButton] = useState(
    userData.isWealthInherited || "Yes"
  );
  const [sourceOfYourWealth, setSourceOfYourWealth] = useState(
    userData.sourcesOfWealth || ""
  );
  const [expectedNoTrans, setExpectedNoTrans] = useState(
    userData.expectedNumberOfTransactions || ""
  );
  const [expectedValueTrans, setExpectedValueTrans] = useState(
    userData.expectedValueOfTransactions || ""
  );
  const [frequency, setFrequency] = useState(userData.frequency || "");
  const [incomeCategory, setIncomeCategory] = useState(
    userData.incomeCategory || ""
  );

  const [errors, setErrors] = useState({});
  const [next, setNext] = useState(false);

  const isoCode = list.apply();
  const [countryISO, setCountryISO] = useState([]);

  useEffect(() => {
    const updatedCountryISO = [...countryISO, ...Object.keys(isoCode)];
    setCountryISO(updatedCountryISO);
  }, []);

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(
      updateUserData({ category: "financialDetails", data: { [field]: value } })
    );
  };
  const handleISOChange = (event) => {
    setCurrency(event.target.value);
  };
  const IncomeSources = [
    { id: "1", value: "none", label: "None" },
    {
      id: "2",
      value: "real estate lands rent income",
      label: "Real Estate/Lands (Rent Income)",
    },
    { id: "3", value: "trading", label: "Trading" },
    { id: "4", value: "investments", label: "Investments" },
    { id: "5", value: "others", label: "Others" },
  ];

  const handleIncomeSourceChange = (selectedOptions) => {
    if (selectedOptions.includes("none")) {
      setAdditionalIncomeSource(["none"]);
    } else {
      const updatedOptions = selectedOptions.filter(
        (option) => option !== "none"
      );
      setAdditionalIncomeSource(updatedOptions);
    }
  };

  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserAcountBank",
      })
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setProgress(progress + 20);
      if (progress >= 100) {
        setProgress(100);
      }
      getHeaderTitle();
    } else {
      setErrors(validationErrors);
    }
    updateUserFieldInUserData("sourceOfFunds", sourceOfFunds);
    updateUserFieldInUserData("currency", currency);
    updateUserFieldInUserData("monthlyBasicSalary", monthlyBasicSal);
    updateUserFieldInUserData("monthlyAllowances", monthlyAllowances);
    updateUserFieldInUserData(
      "additionalIncomeSources",
      additionalIncomeSource
    );
    updateUserFieldInUserData(
      "totalEstimatedMonthlyIncome",
      totalEstimatedMonthlyin
    );
    updateUserFieldInUserData("isWealthInherited", activeButton);
    updateUserFieldInUserData("expectedNumberOfTransactions", expectedNoTrans);
    updateUserFieldInUserData(
      "expectedValueOfTransactions",
      expectedValueTrans
    );
    updateUserFieldInUserData("frequency", frequency);
    updateUserFieldInUserData("othersSourceOfFound", otherSpecify);
    updateUserFieldInUserData("estimatedWealthAmount", estimatedWealthMonth);
    updateUserFieldInUserData("sourcesOfWealth", sourceOfYourWealth);
    updateUserFieldInUserData("incomeCategory", incomeCategory);
  };

  const validateForm = () => {
    const errors = {};
    if (!sourceOfFunds.trim()) {
      errors.sourceOfFunds = "Source of Funds is required";
    }

    if (!currency.trim()) {
      errors.currency = "Currency is required";
    }

    if (!monthlyAllowances.trim()) {
      errors.monthlyAllowances = "Monthly Allowances is required";
    }
    if (!additionalIncomeSource) {
      errors.additionalIncomeSource = "Additional Income Sources is required";
    }
    if (!totalEstimatedMonthlyin.trim()) {
      errors.totalEstimatedMonthlyin =
        "Total Estimated monthly income is required";
    }
    if (!estimatedWealthMonth.trim()) {
      errors.estimatedWealthMonth = "Estimated Wealth Amount is required";
    }
    if (!otherSpecify.trim() && additionalIncomeSource.includes("others")) {
      errors.otherSpecify = "Other Please Specify is required";
    }
    if (!sourceOfYourWealth.trim() && activeButton === "No" && next) {
      errors.sourceOfYourWealth = "Source of Your Wealth is required";
    }

    if (!sourceOfFunds.trim()) {
      errors.sourceOfFunds = "Source of Funds is required";
    }
    if (!expectedNoTrans.trim()) {
      errors.expectedNoTrans = "Expected No. of Transactions is required";
    }
    if (!expectedValueTrans.trim()) {
      errors.expectedValueTrans = "Expected Value of Transactions is required";
    }
    if (!frequency.trim()) {
      errors.frequency = "Frequency is required";
    }

    return errors;
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    setActiveButton(event.target.innerText);
    if (event.target.innerText === "Yes") {
      setNext(false);
      delete errors.sourceOfYourWealth;
      delete errors.sourceOfFunds;
      delete errors.expectedNoTrans;
      delete errors.expectedValueTrans;
      delete errors.frequency;
    }
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "PoliticalPosition",
      })
    );
  };
  useEffect(() => {
    if (totalEstimatedMonthlyin <= 2000) {
      setIncomeCategory('micro');
    } else if (totalEstimatedMonthlyin > 2000 && totalEstimatedMonthlyin <= 5000) {
      setIncomeCategory('small');
    } else if (totalEstimatedMonthlyin > 5000 && totalEstimatedMonthlyin <= 15000) {
      setIncomeCategory('medium');
    } else if (totalEstimatedMonthlyin > 15000) {
      setIncomeCategory('large');
    }
  }, [totalEstimatedMonthlyin]);

  return (
    <div id="Userinfosalary" className="container align-items-center p-3">
      <button
        type="submit"
        className="btn-Back"
        onClick={() => {
          getHeaderTitleBack();
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
      </button>
      <div className="intro d-flex flex-column align-items-center">
        <ProgressBar progress={progress} />
        <form className="form" onSubmit={handleNext}>
          <div className="form-group">
            <input
              type="text"
              value={sourceOfFunds}
              onChange={(e) => setSourceOfFunds(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Source of Funds</label>
          </div>
          {errors.sourceOfFunds && (
            <div className="text-danger error">{errors.sourceOfFunds}</div>
          )}
          <select
            value={currency}
            onChange={handleISOChange}
            className="form-select form-control  mb-3"
          >
            <option value="">Currency</option>
            {countryISO.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          {errors.currency && (
            <div className="text-danger error">{errors.currency}</div>
          )}
          <div className="form-group">
            <input
              type="text"
              value={new Intl.NumberFormat("en-US", {
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(monthlyBasicSal)}
              onChange={(e) => {
                const formattedValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                setMonthlyBasicSal(formattedValue);
              }}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Monthly Basic Salary</label>
          </div>

          <div className="form-group">
            <input
              type="number"
              value={monthlyAllowances}
              onChange={(e) => setMonthlyAllowances(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Monthly Allowances</label>
          </div>
          {errors.monthlyAllowances && (
            <div className="text-danger error">{errors.monthlyAllowances}</div>
          )}

          <div className="form-group-dropdown">
            <DropdownCheckbox
              idPrefix={"trtype"}
              options={IncomeSources}
              onChange={handleIncomeSourceChange}
              valueObj="value"
              labelObj="label"
              selectedData={additionalIncomeSource}
              label={"Additional Income Sources"}
            />
            {errors.additionalIncomeSource && (
              <div className="text-danger error">
                {errors.additionalIncomeSource}
              </div>
            )}
          </div>

          {additionalIncomeSource.includes("others") && (
            <>
              {" "}
              <div className="form-group">
                <input
                  type="text"
                  value={otherSpecify}
                  onChange={(e) => setotherSpecify(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">
                  If Others, Please specify
                </label>
              </div>
              {errors.otherSpecify && (
                <div className="text-danger error">{errors.otherSpecify}</div>
              )}
            </>
          )}
          <div className="form-group">
            <input
              type="number"
              value={totalEstimatedMonthlyin}
              onChange={(e) => setTotalEstimatedMonthlyin(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">
              Total Estimated monthly income in $
            </label>
          </div>
          {errors.totalEstimatedMonthlyin && (
            <div className="text-danger error">
              {errors.totalEstimatedMonthlyin}
            </div>
          )}
          <div className="form-group">
            <input
              type="number"
              value={estimatedWealthMonth}
              onChange={(e) => setEstimatedWealthMonth(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Estimated Wealth Amount </label>
          </div>
          {errors.estimatedWealthMonth && (
            <div className="text-danger error">
              {errors.estimatedWealthMonth}
            </div>
          )}
          <select
            value={incomeCategory}
            onChange={(e) => setIncomeCategory(e.target.value)}
            className="form-select form-control mb-3"
          >
            {!totalEstimatedMonthlyin && (
              <option value=""> Income Category</option>
            )}

            {totalEstimatedMonthlyin && totalEstimatedMonthlyin <= 2000 && (
              <option  value="micro">Micro {"<"} $2,000</option>
              
            )}
            {totalEstimatedMonthlyin > 2000 &&
              totalEstimatedMonthlyin <= 5000 && (
                <option value="small">Small $2,001 - $5,000</option>
              )}
            {totalEstimatedMonthlyin > 5000 &&
              totalEstimatedMonthlyin <= 15000 && (
                <option value="medium">Medium $5,001 - $15,000</option>
              )}
            {totalEstimatedMonthlyin > 15000 && (
              <option value="large">Large {">"} $15,000</option>
            )}
          </select>
          {errors.incomeCategory && (
            <div className="text-danger error">{errors.incomeCategory}</div>
          )}

          <label className="custom-control-label" htmlFor="customCheck1">
            Is your wealth inherited?
          </label>
          <div className="buttons d-flex gap-3 ">
            <button
              className={`btn px-8 py-2 ${
                activeButton === "Yes" ? "active" : ""
              }`}
              onClick={handleButtonClick}
            >
              Yes
            </button>
            <button
              className={`btn px-8 py-2 ${
                activeButton === "No" ? "active" : ""
              }`}
              onClick={handleButtonClick}
            >
              No
            </button>
          </div>
          {activeButton === "No" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  value={sourceOfYourWealth}
                  onChange={(e) => setSourceOfYourWealth(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">
                  If no, please specify sources of your wealth
                </label>
              </div>
              {errors.sourceOfYourWealth && (
                <div className="text-danger error">
                  {errors.sourceOfYourWealth}
                </div>
              )}
            </>
          )}
          <div className="form-group">
            <input
              type="number"
              value={expectedNoTrans}
              onChange={(e) => setExpectedNoTrans(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">
              Expected No. of Transactions
            </label>
          </div>
          {errors.expectedNoTrans && (
            <div className="text-danger error">{errors.expectedNoTrans}</div>
          )}
          <div className="form-group">
            <input
              type="number"
              value={expectedValueTrans}
              onChange={(e) => setExpectedValueTrans(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">
              Expected Value of Transactions
            </label>
          </div>
          {errors.expectedValueTrans && (
            <div className="text-danger error">{errors.expectedValueTrans}</div>
          )}

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="form-select form-control mb-3"
          >
            <option value="">Frequency</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.frequency && (
            <div className="text-danger error">{errors.frequency}</div>
          )}
          {/* <button type="submit" className="btn-proceed" onClick={() => setNext(true)}>
            Next
          </button> */}
          <ButtonModile buttonName={"Next"} setNext={setNext} />
        </form>
      </div>
    </div>
  );
};

export default UserInfoSalary;
