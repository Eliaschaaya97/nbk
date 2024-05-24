import React, { useEffect, useState } from "react";
import ProgressBar from "../Component/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonMobile from "./ButtonMobile";
import { CountryDropdown } from "react-country-region-selector";

const BRODetails = () => {
  const userData = useSelector((state) => state.appData.userData.beneficiaryRightsOwner || {});
  const [beneficiaryName, setBeneficiaryName] = useState(userData.beneficiaryName || "");
  const [progress, setProgress] = useState(45);
  const [BRONationality, setBRONationality] = useState(userData.broNationality || "");
  const [expirationDate, setExpirationDate] = useState(userData.expirationDate || "");
  const [relationship, setRelationship] = useState(userData.relationship || "");
  const [beneficiaryCivilIDNo, setBeneficiaryCivilIDNo] = useState(userData.broCivilIdNumber || "");
  const [address, setAddress] = useState(userData.address || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [reasonOfBRO, setReasonOfBRO] = useState(userData.reasonOfBro || "");
  const [incomeWealthDetails, setIncomeWealthDetails] = useState(userData.incomeWealthDetails || "");
  const [activeButton, setActiveButton] = useState(userData.customerSameAsBeneficiary || "Yes");
  const [errors, setErrors] = useState({});
  const [next, setNext] = useState(false);

  const dispatch = useDispatch();

  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "beneficiaryRightsOwner", data: { [field]: value } }));
  };

  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "PoliticalPosition",
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
    updateUserFieldInUserData("customerSameAsBeneficiary", activeButton);
    updateUserFieldInUserData("broNationality", BRONationality);
    updateUserFieldInUserData("beneficiaryName", beneficiaryName);
    updateUserFieldInUserData("relationship", relationship);
    updateUserFieldInUserData("broCivilIdNumber", beneficiaryCivilIDNo);
    updateUserFieldInUserData("expirationDate", expirationDate);
    updateUserFieldInUserData("reasonOfBro", reasonOfBRO);
    updateUserFieldInUserData("address", address);
    updateUserFieldInUserData("profession", profession);
    updateUserFieldInUserData("incomeWealthDetails", incomeWealthDetails);
  };

  const validateForm = () => {
    const errors = {};
    if (activeButton === "No" && next) {
      if (!BRONationality.trim()) {
        errors.BRONationality = "BRO Nationality is required";
      }
      if (!beneficiaryName.trim()) {
        errors.beneficiaryName = "Beneficiary Name is required";
      }
      if (!relationship.trim()) {
        errors.relationship = "Relationship is required";
      }
      if (!beneficiaryCivilIDNo.trim()) {
        errors.beneficiaryCivilIDNo = "Beneficiary Civil ID No. is required";
      }
      if (!expirationDate.trim()) {
        errors.expirationDate = "Expiration Date is required";
      }
      if (!reasonOfBRO.trim()) {
        errors.reasonOfBRO = "Reason of BRO is required";
      }
      if (!address.trim()) {
        errors.address = "Address is required";
      }
      if (!profession.trim()) {
        errors.profession = "Profession is required";
      }
      if (!incomeWealthDetails.trim()) {
        errors.incomeWealthDetails = "Income/Wealth Details is required";
      }
    }
    return errors;
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    setActiveButton(event.target.innerText);
    if (event.target.innerText === "Yes") {
      setNext(false);
      setErrors({});
    }
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserJob",
      })
    );
  };

  useEffect(() => {
    // Function to add event listeners to input fields
    const addInputEventListeners = () => {
      const handleFocus = () => {
        console.log("Keyboard is open");
        setKeyboardVisible(true);
      };

      const handleBlur = () => {
        console.log("Keyboard is closed");
        setKeyboardVisible(false);
      };

      // Add event listeners to all input elements
      const inputs = document.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);
      });

      // Cleanup event listeners on component unmount
      return () => {
        inputs.forEach((input) => {
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("blur", handleBlur);
        });
      };
    };

    // Add listeners on initial render
    const cleanup = addInputEventListeners();

    // Re-add listeners when activeButton or inputs change
    if (activeButton === "No") {
      cleanup();
      addInputEventListeners();
    }

    // Cleanup listeners on unmount
    return cleanup;
  }, [activeButton, next]);

  return (
    <div id="BRODetails" className="container align-items-center p-3">
      <button type="submit" className="btn-Back" onClick={getHeaderTitleBack}>
        <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
      </button>
      <div className="intro d-flex flex-column align-items-center">
        <ProgressBar progress={progress} />
        <form className="form" onSubmit={handleNext}>
          <p className="mb-3">Beneficiary Rights Owner (BRO) Details:</p>
          <label className="custom-control-label" htmlFor="customCheck1">
            Customer same as beneficiary?
          </label>
          <div className="buttons d-flex gap-3 ">
            <button className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`} onClick={handleButtonClick}>
              Yes
            </button>
            <button className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`} onClick={handleButtonClick}>
              No
            </button>
          </div>
          {activeButton === "No" && (
            <>
              <div className="form-group">
                <CountryDropdown
                  value={BRONationality}
                  onChange={(value) => setBRONationality(value)} // Update this line
                  className="form-select form-control mb-3"
                  defaultOptionLabel="Please specify BRO Nationality"
                  priorityOptions={["LB", "KW"]}
                />
              </div>

              {errors.BRONationality && <div className="text-danger error">{errors.BRONationality}</div>}
              <div className="form-group">
                <input type="text" value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Please specify Beneficiary Name</label>
              </div>
              {errors.beneficiaryName && <div className="text-danger error">{errors.beneficiaryName}</div>}
              <div className="form-group">
                <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Relationship</label>
              </div>
              {errors.relationship && <div className="text-danger error">{errors.relationship}</div>}
              <div className="form-group">
                <input type="text" value={beneficiaryCivilIDNo} onChange={(e) => setBeneficiaryCivilIDNo(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Beneficiary Civil ID No.</label>
              </div>
              {errors.beneficiaryCivilIDNo && <div className="text-danger error">{errors.beneficiaryCivilIDNo}</div>}
              <div className="form-group">
                <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Expiration Date</label>
              </div>
              {errors.expirationDate && <div className="text-danger error">{errors.expirationDate}</div>}
              <div className="form-group">
                <input type="text" value={reasonOfBRO} onChange={(e) => setReasonOfBRO(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Reason of BRO</label>
              </div>
              {errors.reasonOfBRO && <div className="text-danger error">{errors.reasonOfBRO}</div>}
              <div className="form-group">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Address</label>
              </div>
              {errors.address && <div className="text-danger error">{errors.address}</div>}
              <div className="form-group">
                <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Profession</label>
              </div>
              {errors.profession && <div className="text-danger error">{errors.profession}</div>}
              <div className="form-group">
                <input type="text" value={incomeWealthDetails} onChange={(e) => setIncomeWealthDetails(e.target.value)} placeholder="" className="form-control mb-3" />
                <label className="floating-label">Income/Wealth Details</label>
              </div>
              {errors.incomeWealthDetails && <div className="text-danger error">{errors.incomeWealthDetails}</div>}
            </>
          )}
          <ButtonMobile buttonName={"Next"} setNext={setNext} />
        </form>
      </div>
    </div>
  );
};
export default BRODetails;
