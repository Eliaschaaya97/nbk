import React, { useState } from "react";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonModile from "./ButtonMobile";
// import { parsePhoneNumber } from 'libphonenumber-js';
// import * as PhoneNumberValidator from 'libphonenumber-js';
import { parsePhoneNumberFromString } from "libphonenumber-js";

const AddressInfo = () => {
  const userDataUser = useSelector(
    (state) => state.appData.userData.user || {}
  );
  const userData = useSelector((state) => state.appData.userData.address || {});
  const regex = /^[A-Za-z\s\.\,\-\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\;\:\'\"\<\>\?\/\|\\]*$/;
  const [otherCountriesOfTaxResidence, setOtherCountriesOfTaxResidence] =
    useState(userDataUser.otherCountriesOfTaxResidence || "");
  const [city, setCity] = useState(userData.city || "");
  const [street, setStreet] = useState(userData.street || "");
  const [progress, setProgress] = useState(17);
  const [taxResidencyIDNumber, setTaxResidencyIDNumber] = useState(
    userDataUser.taxResidencyIdNumber || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    userData.internationalAddress || ""
  );
  const [buildingHouse, setBuildingHouse] = useState(userData.building || "");
  const [floor, setFloor] = useState(userData.floor || "");
  const [apartment, setApartment] = useState(userData.apartment || "");
  const [area, setArea] = useState(userData.intArea || "");
  const [internationalStreet, setInternationalStreet] = useState(
    userData.intStreet || ""
  );
  const [houseTelNo, setHouseTelNo] = useState(
    userData.houseTelephoneNumber || ""
  );
  const [internationalBuildingHouse, setInternationalBuildingHouse] = useState(
    userData.intBuilding || ""
  );
  const [internationalFloor, setInternationalFloor] = useState(
    userData.intFloor || ""
  );
  const [internationalApartment, setInternationalApartment] = useState(
    userData.intApartment || ""
  );
  const [value, setValue] = useState(
    userData.internationalHouseTelephoneNumber || ""
  );
  const [mobileValue, setMobileValue] = useState(
    userData.internationalMobileNumber || ""
  );
  const [alternateContactName, setAlternateContactName] = useState(
    userData.alternateContactName || ""
  );
  const [alternateTelephoneValue, setAlternateTelephoneValue] = useState(
    userData.alternateTelephoneNumber || ""
  );
  const [errors, setErrors] = useState({});
  const [validationMessage, setValidationMessage] = useState("");
  const [validationMessage2, setValidationMessage2] = useState("");
  const [validationMessage3, setValidationMessage3] = useState("");
  const [countryCode, setCountryCode] = useState("lb");
  const [countryCode2, setCountryCode2] = useState("lb");
  const [countryCode3, setCountryCode3] = useState("lb");

  const statusInLebanon = useSelector(
    (state) => state.appData.userData.user.statusInLebanon || {}
  );
  const countryOfOrigin = useSelector(
    (state) => state.appData.userData.user.countryOfOrigin || {}
  );
  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "user", data: { [field]: value } }));
  };
  const updateUserFieldInUserDataAddress = (field, value) => {
    dispatch(updateUserData({ category: "address", data: { [field]: value } }));
  };
  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserJob",
      })
    );
  };
  const handleAlternateContactName = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setAlternateContactName(value);
    }
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
    updateUserFieldInUserData(
      "otherCountriesOfTaxResidence",
      otherCountriesOfTaxResidence
    );
    updateUserFieldInUserData("taxResidencyIdNumber", taxResidencyIDNumber);

    updateUserFieldInUserDataAddress("city", city);
    updateUserFieldInUserDataAddress("street", street);
    updateUserFieldInUserDataAddress("building", buildingHouse);
    updateUserFieldInUserDataAddress("floor", floor);
    updateUserFieldInUserDataAddress("apartment", apartment);
    updateUserFieldInUserDataAddress("houseTelephoneNumber", houseTelNo);
    updateUserFieldInUserDataAddress("internationalAddress", selectedCountry);
    updateUserFieldInUserDataAddress("intArea", area);
    updateUserFieldInUserDataAddress("intStreet", internationalStreet);
    updateUserFieldInUserDataAddress("intBuilding", internationalBuildingHouse);
    updateUserFieldInUserDataAddress("intFloor", internationalFloor);
    updateUserFieldInUserDataAddress("intApartment", internationalApartment);

    updateUserFieldInUserDataAddress(
      "internationalHouseTelephoneNumber",
      value
    );
    updateUserFieldInUserDataAddress("internationalMobileNumber", mobileValue);
    updateUserFieldInUserDataAddress(
      "alternateContactName",
      alternateContactName
    );
    updateUserFieldInUserDataAddress(
      "alternateTelephoneNumber",
      alternateTelephoneValue
    );
  };

  const validateForm = () => {
    const errors = {};
    if(countryOfOrigin === "Lebanon")
    {

      if (!city.trim()) {
        errors.city = "City is required";
      }

      if (!street.trim()) {
        errors.street = "Street is required";
      }
      if (!buildingHouse.trim()) {
        errors.buildingHouse = "Building/House is required";
      }
      if (!floor.trim()) {
        errors.floor = "Floor is required";
      }
      if (!houseTelNo.trim()) {
        errors.houseTelNo = "House number is required";
      }
      if (!apartment.trim()) {
        errors.apartment = "Apartment is required";
      }
  }

    if (!alternateContactName.trim()) {
      errors.alternateContactName = "Alternate Contact Name is required";
    }

    if (!alternateTelephoneValue.trim()) {
      errors.alternateTelephoneValue = "Alternate Telephone Number is required";
    }

    if (statusInLebanon === "nonresident")
    {
      if (!selectedCountry.trim()) {
        errors.selectedCountry = "Country is required";
      }
      if (!area.trim()) {
        errors.area = "Area is required";
      }
      if (!internationalStreet.trim()) {
        errors.internationalStreet = "International Street is required";
      }
      if (!internationalBuildingHouse.trim()) {
        errors.internationalBuildingHouse = "International Building House is required";
      }
      if (!internationalFloor.trim()) {
        errors.internationalFloor = "International Floor is required";
      }
      if (!internationalApartment.trim()) {
        errors.internationalApartment = "International Apartment is required";
      }
      if (!value.trim()) {
        errors.value = "International House Telephone Number is required";
      }
      if (!mobileValue.trim()) {
        errors.mobileValue = "International Mobile Number is required";
      }
    }

    return errors;
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserIntroduce",
      })
    );
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    // Remove the prefix for validation
    const numberWithoutPrefix = value.replace("+961", "");
    // Check if the remaining part is numeric
    const regex = /^[0-9]*$/;
    if (regex.test(numberWithoutPrefix)) {
      setHouseTelNo(`+961${numberWithoutPrefix}`);
    }
  };

  const handleChange = (value, country) => {
    setValue(value);
    const countryCode = country?.countryCode.toUpperCase();
    let length = 0;
    value?.split("")?.forEach(() => {
      length++;
    });
    // if (length >= 9) {
    //   setValidationMessage('Phone number is valid.');
    // } else {
    //   setValidationMessage('Invalid phone number format.');
    // }
    try {
      const phoneNumber = parsePhoneNumberFromString(value, countryCode);
      if (phoneNumber && phoneNumber.isValid() && length >= 9) {
        setValidationMessage("Phone number is valid.");
      } else {
        setValidationMessage("Phone number is invalid.");
      }
    } catch (error) {
      console.error("Phone number parsing error:", error);
      setValidationMessage("Invalid phone number format.");
    }
  };
  const handleChangeMobile = (value, country) => {
    setMobileValue(value);
    const countryCode = country?.countryCode.toUpperCase();
    let length = 0;
    value?.split("")?.forEach(() => {
      length++;
    });

    // if (length >= 9) {
    //   setValidationMessage('Phone number is valid.');
    // } else {
    //   setValidationMessage('Invalid phone number format.');
    // }
    try {
      const phoneNumber = parsePhoneNumberFromString(value, countryCode);
      if (phoneNumber && phoneNumber.isValid() && length >= 9) {
        setValidationMessage2("Phone number is valid.");
      } else {
        setValidationMessage2("Phone number is invalid.");
      }
    } catch (error) {
      console.error("Phone number parsing error:", error);
      setValidationMessage2("Invalid phone number format.");
    }
  };
  const handleChangeAlternate = (value, country) => {
    setAlternateTelephoneValue(value);
    const countryCode = country?.countryCode.toUpperCase();
    let length = 0;
    value?.split("")?.forEach(() => {
      length++;
    });

    // if (length >= 9) {
    //   setValidationMessage('Phone number is valid.');
    // } else {
    //   setValidationMessage('Invalid phone number format.');
    // }
    try {
      const phoneNumber = parsePhoneNumberFromString(value, countryCode);
      if (phoneNumber && phoneNumber.isValid() && length >= 9) {
        setValidationMessage3("Phone number is valid.");
      } else {
        setValidationMessage3("Phone number is invalid.");
      }
    } catch (error) {
      console.error("Phone number parsing error:", error);
      setValidationMessage3("Invalid phone number format.");
    }
  };

  return (
    <div id="AddressInfo" className="container align-items-center p-3">
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
            <label
              className="floating-label "
              style={{ top: "7px", fontSize: "11px" }}
            >
              Other Countries of Tax Residence
            </label>
            <CountryDropdown
              value={otherCountriesOfTaxResidence}
              onChange={(value) => setOtherCountriesOfTaxResidence(value)} // Update this line
              className="form-select form-control mb-3"
              defaultOptionLabel="None"
              priorityOptions={["LB", "KW"]}
            />
          </div>
          {errors.selectedCountry && (
            <div className="text-danger error">{errors.selectedCountry}</div>
          )}

          {otherCountriesOfTaxResidence && (
            <div className="form-group">
              <input
                type="text"
                value={taxResidencyIDNumber}
                onChange={(e) => setTaxResidencyIDNumber(e.target.value)}
                placeholder=""
                className="form-control mb-3"
              />
              <label className="floating-label">Tax Residency ID Number</label>
            </div>
          )}
          {countryOfOrigin === "Lebanon" && (
            <>
              <p className="mb-3">Address in Lebanon</p>
              <div className="form-group">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">City</label>
              </div>
              {errors.city && (
            <div className="text-danger error">{errors.city}</div>
          )}
              <div className="form-group">
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Street</label>
              </div>
              {errors.street && (
                <div className="text-danger error">{errors.street}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={buildingHouse}
                  onChange={(e) => setBuildingHouse(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Building/House</label>
              </div>
              {errors.buildingHouse && (
                <div className="text-danger error">{errors.buildingHouse}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Floor</label>
              </div>
              {errors.floor && (
                <div className="text-danger error">{errors.floor}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Apartment</label>
              </div>
              {errors.apartment && (
                <div className="text-danger error">{errors.apartment}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={houseTelNo}
                  onChange={handleInputChange}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">House Tel No.</label>
              </div>
              {errors.houseTelNo && (
                <div className="text-danger error">{errors.houseTelNo}</div>
              )}
            </>
          )}
          {statusInLebanon === "nonresident" && (
            <>
              <p className="mb-3">Other International Address</p>
              <div className="form-group">
                <CountryDropdown
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  className="form-select form-control mb-3"
                  defaultOptionLabel="Country"
                />
              </div>
              {errors.selectedCountry && (
                <div className="text-danger error">{errors.selectedCountry}</div>
              )}

              <div className="form-group">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Area</label>
              </div>
              {errors.area && (
                <div className="text-danger error">{errors.area}</div>
              )}

              <div className="form-group">
                <input
                  type="text"
                  value={internationalStreet}
                  onChange={(e) => setInternationalStreet(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Street</label>
              </div>
              {errors.internationalStreet && (
                <div className="text-danger error">{errors.internationalStreet}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={internationalBuildingHouse}
                  onChange={(e) =>
                    setInternationalBuildingHouse(e.target.value)
                  }
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Building/House</label>
              </div>
              {errors.internationalBuildingHouse && (
                <div className="text-danger error">{errors.internationalBuildingHouse}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={internationalFloor}
                  onChange={(e) => setInternationalFloor(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Floor</label>
              </div>
              {errors.internationalFloor && (
                <div className="text-danger error">{errors.internationalFloor}</div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  value={internationalApartment}
                  onChange={(e) => setInternationalApartment(e.target.value)}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Apartment</label>
              </div>
              {errors.internationalApartment && (
                <div className="text-danger error">{errors.internationalApartment}</div>
              )}
              <div className="label-div">
                {" "}
                <label className="floating-label label-tel">
                  House Tel No.
                </label>
                <PhoneInput
                  disableSearchIcon={true}
                  className="mb-3"
                  country={countryCode}
                  enableSearch
                  value={value}
                  onChange={handleChange}
                  inputProps={{
                    required: true,
                  }}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "50px",
                    height: "45px",
                  }}
                />

                {validationMessage && (
                  <p
                    style={{
                      color: validationMessage.includes("invalid")
                        ? "red"
                        : "#034a8e",
                            fontFamily:"none",
                                marginBottom:"10px",
                                       fontWeight:"unset",
                                        marginTop: "-10px"
                    }}
                  >
                    {validationMessage}
                  </p>
                )}{" "}
              </div>

              <div className="label-div">
                <label className="floating-label label-tel">Mobile No.</label>
                <PhoneInput
                  disableSearchIcon={true}
                  className="mb-3"
                  country={countryCode2}
                  enableSearch
                  value={mobileValue}
                  onChange={handleChangeMobile}
                  inputProps={{
                    required: true,
                  }}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "50px",
                    height: "45px",
                  }}
                />

                {validationMessage2 && (
                  <p
                    style={{
                      color: validationMessage2.includes("invalid")
                        ? "red"
                        : "#034a8e",
                            fontFamily:"none",
                                marginBottom:"10px",
                                   fontWeight:"unset",
                                    marginTop: "-10px"
                    }}
                  >
                    {validationMessage2}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="text"
              value={alternateContactName}
              onChange={handleAlternateContactName}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Alternate Contact Name</label>
          </div>
          {errors.alternateContactName && (
            <div className="text-danger error">
              {errors.alternateContactName}
            </div>
          )}

          <div className="label-div mt-2">
            {" "}
            <label className="floating-label label-tel">
              Alternate Telephone No.
            </label>
            <PhoneInput
              className="mb-3"
              country={countryCode3}
              enableSearch
              value={alternateTelephoneValue}
              defaultValue={alternateTelephoneValue}
              onChange={handleChangeAlternate}
              disableSearchIcon={true}
              // enableAreaCodeStretch={true}
              prefix="+"
              inputStyle={{
                width: "100%",
                paddingLeft: "50px",
                height: "45px",
              }}

            />
                          {errors.alternateTelephoneValue && (
                <div className="text-danger error">
                  {errors.alternateTelephoneValue}
                </div>
              )}
            {validationMessage3 && (
              <p
                style={{
                  color: validationMessage3.includes("invalid")
                    ? "red"
                    : "#034a8e",
                        fontFamily:"none",
                            marginBottom:"10px",
                               fontWeight:"unset",
                                marginTop: "-10px"
                }}
              >
                {validationMessage3}
              </p>
            )}
          </div>
          {/* <button type="submit" className="btn-proceed">
            Next
          </button> */}
          <ButtonModile buttonName={"Next"} />
        </form>
      </div>
    </div>
  );
};

export default AddressInfo;
