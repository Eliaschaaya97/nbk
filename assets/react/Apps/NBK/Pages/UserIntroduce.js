import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonModile from "./ButtonMobile";
import { countries } from "../Utils/countries";
import Select from "react-select";

const UserIntroduce = () => {
  const userData = useSelector((state) => state.appData.userData.user || {});
  const selectOptions = countries.map((country) => ({
    value: country.id,
    label: country.description,
  }));

  const [motherName, setMotherName] = useState(userData.mothersName || "");
  const [date, setDate] = useState(userData.dob || "");
  const [progress, setProgress] = useState(8);
  const regex = /^[A-Za-z\s\.\,\-\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\;\:\'\"\<\>\?\/\|\\]*$/;


  const [selectedCountry, setSelectedCountry] = useState(
    userData.countryOfOrigin || ""
  );
  const [nationality, setNationality] = useState(
    userData.nationality || ""
  );
  const [selectedState, setSelectedState] = useState(
    userData.registerPlaceAndNo || ""
  );
  const [placeOfBirth, setPlaceOfBirth] = useState(userData.placeOfBirth || "");
  const [civilNational, setCivilNational] = useState(userData.nationalId || "");
  const [expirationDate, setExpirationDate] = useState(
    userData.expirationDateNationalId || ""
  );
  const [status, setStatus] = useState(userData.maritalStatus || "");
  const [passport, setPassport] = useState(userData.passportNumber || "");
  const [placeOfIssue, setPlaceOfIssue] = useState(
    userData.placeOfIssuePassport || ""
  );
  const [secondExpirationDate, setSecondExpirationDate] = useState(
    userData.expirationDatePassport || ""
  );
  const [otherNationalities, setOtherNationalities] = useState(
    userData.otherNationalities || []
  );
  const [statusInLebanon, setStatusInLebanon] = useState(
    userData.statusInLebanon || ""
  );
  const [errors, setErrors] = useState({});
  const [dateEx, setDateEx] = useState("");
  const [validDate, setValidDate] = useState(false);
  const [gender, setGender] = useState(userData.gender || "female");

  localStorage.setItem("status", status);

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "user", data: { [field]: value } }));
  };

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    nextMonth.setDate(today.getDate() + 1);

    const formattedDate = nextMonth.toISOString().split("T")[0];
    setDateEx(formattedDate);
  }, []);

  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "AddressInfo",
      })
    );
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserInfo",
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
    updateUserFieldInUserData("mothersName", motherName);
    updateUserFieldInUserData("gender", gender);
    updateUserFieldInUserData("dob", date);
    updateUserFieldInUserData("placeOfBirth", placeOfBirth);
    updateUserFieldInUserData("countryOfOrigin", selectedCountry);
    updateUserFieldInUserData("nationality", nationality);
    updateUserFieldInUserData("nationalId", civilNational);
    updateUserFieldInUserData("expirationDateNationalId", expirationDate);
    updateUserFieldInUserData("registerPlaceAndNo", selectedState);
    updateUserFieldInUserData("maritalStatus", status);
    updateUserFieldInUserData("passportNumber", passport);
    updateUserFieldInUserData("expirationDatePassport", secondExpirationDate);
    updateUserFieldInUserData("otherNationalities", otherNationalities);
    updateUserFieldInUserData("statusInLebanon", statusInLebanon);
    updateUserFieldInUserData("placeOfIssuePassport", placeOfIssue);
  };

  const handleMotherName = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setMotherName(value);
    }
  };
  const handlePlaceofBirth = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setPlaceOfBirth(value);
    }
  };
  const handlePlaceofIssue = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setPlaceOfIssue(value);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!motherName.trim()) {
      errors.motherName = "Mother's Name is required";
    }
    if (!date.trim()) {
      errors.date = "Date of Birth is required";
    }
    if (!placeOfBirth.trim()) {
      errors.placeOfBirth = "Place of Birth is required";
    }
    if (!selectedCountry) {
      errors.selectedCountry = "Country of Origin is required";
    }
    if (!nationality) {
      errors.nationality = "Nationality is required";
    }
    if (!civilNational.trim()) {
      errors.civilNational = "Civil/National ID No. is required";
    }
    if (!selectedState) {
      errors.selectedState = "Register Place & No. is required";
    }
    if (!status) {
      errors.status = "Marital Status is required";
    }
    if (otherNationalities.length === 0) { 
      errors.otherNationalities = "Other nationalities are required"; 
    }
  
  
    if (nationality !== "Lebanon") {
      if (!passport.trim()) {
        errors.passport = "Passport is required";
      } else {
        if (!secondExpirationDate.trim()) {
          errors.secondExpirationDate = "Expiration Date is required";
        }
        if (!placeOfIssue.trim()) {
          errors.placeOfIssue = "Place of Issue is required";
        }
      }
    }
  
    if (!statusInLebanon.trim()) {
      errors.statusInLebanon = "Status in Lebanon is required";
    }
  
    return errors;
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedLabels = selectedOptions.map((option) => option.label);
    setOtherNationalities(selectedLabels);
  };

  return (
    <div id="UserIntroduce" className="container align-items-center p-3">
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
              value={motherName}
              onChange={handleMotherName}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Mother's Name</label>
          </div>
          {errors.motherName && (
            <div className="text-danger error">{errors.motherName}</div>
          )}

          <div className="radioOptionsFlex">
            <div className="radio-options">
              <input
                type="radio"
                id="female"
                name="gender"
                className="formborders"
                value="female"
                defaultChecked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="radio-options">
              <input
                type="radio"
                id="male"
                name="gender"
                className="formborders"
                value="male"
                defaultChecked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="male">Male</label>
            </div>
          </div>

          {errors.gender && (
            <div className="text-danger error error-status">
              {errors.gender}
            </div>
          )}
          <div className="form-group">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Date of Birth</label>
          </div>
          {errors.date && (
            <div className="text-danger error">{errors.date}</div>
          )}
          <div className="form-group">
            <input
              type="text"
              value={placeOfBirth}
              onChange={handlePlaceofBirth}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Place of Birth</label>
          </div>
          {errors.placeOfBirth && (
            <div className="text-danger error">{errors.placeOfBirth}</div>
          )}
          <div className="form-group">
            <CountryDropdown
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value)}
              className="form-select form-control mb-3"
              defaultOptionLabel="Country of Origin"
              priorityOptions={["LB", "KW"]}
            />
          </div>
          {errors.selectedCountry && (
            <div className="text-danger error">{errors.selectedCountry}</div>
          )}
                 <div className="form-group">
            <CountryDropdown
              value={nationality}
              onChange={(value) => setNationality(value)}
              className="form-select form-control mb-3"
              defaultOptionLabel="Nationality"
              priorityOptions={["LB", "KW"]}
            />
          </div>
          {errors.nationality && (
            <div className="text-danger error">{errors.nationality}</div>
          )}
          <div className="form-group">
            <input
              type="text"
              value={civilNational}
              onChange={(e) => {
                setCivilNational(e.target.value);
                if (e.target.value) {
                  delete errors.secondExpirationDate;
                  delete errors.placeOfIssue;
                  delete errors.passport;
                  delete errors.civilNational;
                }
              }}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Civil/National ID No.</label>
          </div>
          {errors.civilNational && (
            <div className="text-danger error">{errors.civilNational}</div>
          )}
          <div className="form-group">
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                if (e.target.value) {
                  delete errors.expirationDate;
                  delete errors.secondExpirationDate;
                  delete errors.placeOfIssue;
                  delete errors.passport;
                }
              }}
              placeholder=""
              className="form-control mb-3"
              min={dateEx}
            />
            <label className="floating-label">Expiration Date</label>
            {errors.expirationDate && (
              <div className="text-danger error">{errors.expirationDate}</div>
            )}
          </div>

          <div className="form-group">
            <RegionDropdown
              country={nationality}
              value={selectedState}
              onChange={(value) => setSelectedState(value)}
              className="form-select form-control mb-3"
              disabled={!nationality}
              defaultOptionLabel="Register Place & No."
              blankOptionLabel="Register Place & No."
            />
            {errors.selectedState && (
              <div className="text-danger error">{errors.selectedState}</div>
            )}
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select form-control mb-3"
          >
            <option value="">Marital Status</option>
            <option value="married">Married</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widow">Widow</option>
          </select>
          {errors.status && (
            <div className="text-danger error error-status">
              {errors.status}
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              value={passport}
              onChange={(e) => {
                setPassport(e.target.value);
                if (e.target.value) {
                  delete errors.expirationDate;

                  delete errors.passport;
                  delete errors.civilNational;
                }
              }}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Passport No.</label>
          </div>

          {errors.passport && (
            <div className="text-danger error">{errors.passport}</div>
          )}
          {passport && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  value={placeOfIssue}
                  onChange={handlePlaceofIssue}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Place of Issue</label>
              </div>
              {errors.placeOfIssue && (
                <div className="text-danger error">{errors.placeOfIssue}</div>
              )}
              <div className="form-group">
                <input
                  type="date"
                  value={secondExpirationDate}
                  onChange={(e) => {
                    setSecondExpirationDate(e.target.value);

                    if (e.target.value) {
                      delete errors.expirationDate;
                      delete errors.secondExpirationDate;

                      delete errors.civilNational;
                    }
                  }}
                  placeholder=""
                  className="form-control mb-3"
                  min={dateEx}
                />
                <label className="floating-label">Expiration Date</label>
              </div>
              {errors.secondExpirationDate && (
                <div className="text-danger error">
                  {errors.secondExpirationDate}
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label
              className="floating-label "
              style={{ top: "7px", fontSize: "11px" ,marginLeft:"-7px"}}
            >
              Other Nationalities
            </label>
            <Select
              options={selectOptions}
              isMulti
              value={selectOptions.filter(option => otherNationalities.includes(option.label))}
              onChange={handleSelectChange}
             className=" mb-3 mt-3"
            />
                      {errors.otherNationalities && (
            <div className="text-danger error">{errors.otherNationalities}</div>
          )}
          </div>

          <select
            value={statusInLebanon}
            onChange={(e) => setStatusInLebanon(e.target.value)}
            className="form-select form-control mb-3"
          >
            <option value="">Status in Lebanon</option>
            <option value="resident">Resident</option>
            <option value="nonresident">Non-Resident</option>
          </select>
          {errors.statusInLebanon && (
            <div className="text-danger error">{errors.statusInLebanon}</div>
          )}
          <ButtonModile buttonName={"Next"} />
        </form>
      </div>
    </div>
  );
};

export default UserIntroduce;
