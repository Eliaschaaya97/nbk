import React, { useState, useMemo,useEffect } from "react";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useDispatch ,useSelector} from "react-redux";
import { settingObjectData ,updateUserData} from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonModile from "./ButtonMobile";



const UserAcountBank = () => {
  const userData = useSelector((state) => state.appData.userData.financialDetails || {});

  const [progress, setProgress] = useState(90);

  const [activeButton, setActiveButton] = useState( userData.hasOtherAccounts || "No");
  const [country1, setCountry1] = useState(userData.country ||"");
  const [accountBalanceUsd, setAccountBalanceUsd] = useState( userData.accountBalance || "");
  const [purposeOfRelation, setPurposeOfRelation] = useState(userData.purposeOfRelation || "");
  const [natureOfRelation, setNatureOfRelation] = useState(userData.natureOfRelation || "");
  const [bankName, setBankName] = useState( userData.bankName || "");

  const [errors, setErrors] = useState({});
  const [next,setNext]=useState(false);
  const [inputSets, setInputSets] = useState(0);

  const [bankName2, setBankName2] = useState(userData.bankName2 || "");
const [country2, setCountry2] = useState(userData.country2 || "");
const [accountBalanceUsd2, setAccountBalanceUsd2] = useState(userData.accountBalance2 || "");

const [bankName3, setBankName3] = useState(userData.bankName3 || "");
const [country3, setCountry3] = useState(userData.country3|| "");
const [accountBalanceUsd3, setAccountBalanceUsd3] = useState(userData.accountBalance3 || "");
const regex = /^[A-Za-z\s\-']*$/;

  const handleAddInput = () => {
    if (inputSets < 2) {
      setInputSets(inputSets + 1);
    }
  };
  useEffect(() => {
    let sets = 0;
    if (bankName2 || country2 || accountBalanceUsd2) sets = 1;
    if (bankName3 || country3 || accountBalanceUsd3) sets = 2;
    setInputSets(sets);
  }, [bankName2, country2, accountBalanceUsd2, bankName3, country3, accountBalanceUsd3]);

  

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "financialDetails", data: { [field]: value } }));
  };


  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "VerifyYourId",
      })
    );
  };
  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserInfoSalary",
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
    updateUserFieldInUserData("hasOtherAccounts", activeButton);
    updateUserFieldInUserData("bankName", bankName);
    updateUserFieldInUserData("country", country1);
    updateUserFieldInUserData("accountBalance", accountBalanceUsd);
    updateUserFieldInUserData("natureOfRelation", natureOfRelation);
    updateUserFieldInUserData("purposeOfRelation", purposeOfRelation);
    
    updateUserFieldInUserData("bankName2", bankName2);
    updateUserFieldInUserData("country2", country2);
    updateUserFieldInUserData("accountBalance2", accountBalanceUsd2);
    
    updateUserFieldInUserData("bankName3", bankName3);
    updateUserFieldInUserData("country3", country3);
    updateUserFieldInUserData("accountBalance3", accountBalanceUsd3);

  
};

  const handleAccountBalanceUsdChange = (e) => {
    setAccountBalanceUsd(e.target.value);
  };

 
  const handleBankNameChange = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setBankName(value);
    } 
  };
  const handleBankNameChange2 = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setBankName2(value);
    } 
  };  const handleBankNameChange3 = (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setBankName3(value);
    } 
  };


  const handleTotalPurposeOfRelationChange = (e) => {
    setPurposeOfRelation(e.target.value);
  };

  const handleNatureOfRelationChange = (e) => {
    setNatureOfRelation(e.target.value);
  };
  const handleCountry1Change = (value) => {
    setCountry1(value);
  };
  const handleButtonClick = (event, buttonValue) => {
    event.preventDefault();
    setActiveButton(buttonValue);
    if (buttonValue === "No") {
        delete errors.bankName;
        delete errors.country1;
        delete errors.accountBalanceUsd;
        delete errors.natureOfRelation;
        delete errors.purposeOfRelation;
    }
};


    const validateForm = () => {
      const errors = {};
      if (activeButton === "Yes" && next) {
          if (!bankName.trim()) {
              errors.bankName = "Bank Name 1 is required";
          }
          if ( !country1.trim()) {
              errors.country1 = "Country 1 is required";
          }
          if (!accountBalanceUsd.trim()) {
              errors.accountBalanceUsd = "Account 1 Balance $ is required";
          }
          if (!natureOfRelation.trim()) {
              errors.natureOfRelation = "Nature of Relation: Personal is required";
          }
          if (!purposeOfRelation.trim()) {
              errors.purposeOfRelation = "Purpose of Relation is required";
          }
          if (inputSets >= 1) {
            if (!bankName2.trim()) {
              errors.bankName2 = "Bank Name 2 is required";
            }
            if (!country2.trim()) {
              errors.country2 = "Country 2 is required";
            }
            if (!accountBalanceUsd2.trim()) {
              errors.accountBalanceUsd2 = "Account 2 Balance $ is required";
            }
          }
          if (inputSets >= 2) {
            if (!bankName3.trim()) {
              errors.bankName3 = "Bank Name 3 is required";
            }
            if (!country3.trim()) {
              errors.country3 = "Country 3 is required";
            }
            if (!accountBalanceUsd3.trim()) {
              errors.accountBalanceUsd3 = "Account 3 Balance $ is required";
            }
          }
        }
        return errors;
      };
  return (
    <div id="UserAcountBank" className="container align-items-center p-3">
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
        <form className="form"  onSubmit={handleNext}>
    
          <label className="custom-control-label" htmlFor="customCheck1">
            Do you have other accounts at Local/International banks?
          </label>
          <div className="buttons d-flex gap-3 ">
          <button
    type="button"
    className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`}
    onClick={(e) => handleButtonClick(e, "Yes")}
>
    Yes
</button>
<button
    type="button"
    className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`}
    onClick={(e) => handleButtonClick(e, "No")}
>
    No
</button>
          </div>
          {activeButton === "Yes" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  value={bankName}
                  onChange={handleBankNameChange}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Bank Name 1</label>
                {errors.bankName && <div className="text-danger error">{errors.bankName}</div>}
              </div>
           

              <div className="form-group">
          <CountryDropdown
    value={country1}
    onChange={(value) => handleCountry1Change(value)} // Update this line
    className="form-select form-control mb-3"
    defaultOptionLabel="Country 1"
    priorityOptions={['LB', 'KW']}
/>
{errors.country1 && <div className="text-danger error">{errors.country1}</div>}

     
          </div>
              <div className="form-group">
                <input
                  type="number"
                  value={accountBalanceUsd}
                  onChange={handleAccountBalanceUsdChange}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Account 1 Balance $</label>
                {errors.accountBalanceUsd && <div className="text-danger error">{errors.accountBalanceUsd}</div>}
              </div>
              <div className="add-input">
                {inputSets >= 1 && (
                  <div key={1}>
                    <div className="form-group">
                      <input
                        type="text"
                        value={bankName2}
                        onChange={handleBankNameChange2}
                        placeholder="Bank Name 2"
                        className="form-control mb-3"
                      />
                      <label className="floating-label">Bank Name 2</label>
                      {errors.bankName2 && <div className="text-danger error">{errors.bankName2}</div>}
                    </div>
                 
                    <div className="form-group">
          <CountryDropdown
    value={country2}
    onChange={(value) => setCountry2(value)} // Update this line
    className="form-select form-control mb-3"
    defaultOptionLabel="Country 2"
    priorityOptions={['LB', 'KW']}
/>
{errors.country2 && <div className="text-danger error">{errors.country2}</div>}
          </div>
                    <div className="form-group">
                      <input
                        type="number"
                        value={accountBalanceUsd2}
                        onChange={(e) => setAccountBalanceUsd2(e.target.value)}
                        placeholder="Account 2 Balance $"
                        className="form-control mb-3"
                      />
                      <label className="floating-label">Account 2 Balance $</label>
                      {errors.accountBalanceUsd2 && <div className="text-danger error">{errors.accountBalanceUsd2}</div>}
                    </div>
                  </div>
                )}
                {inputSets >= 2 && (
                  <div key={2}>
                    <div className="form-group">
                      <input
                        type="text"
                        value={bankName3}
                        onChange={handleBankNameChange3}
                        placeholder="Bank Name 3"
                        className="form-control mb-3"
                      />
                      <label className="floating-label">Bank Name 3</label>
                      {errors.bankName3 && <div className="text-danger error">{errors.bankName3}</div>}
                    </div>
              
                    <div className="form-group">
          <CountryDropdown
    value={country3}
    onChange={(value) => setCountry3(value)} // Update this line
    className="form-select form-control mb-3"
    defaultOptionLabel="Country 3"
    priorityOptions={['LB', 'KW']}
/>
{errors.country3 && <div className="text-danger error">{errors.country3}</div>}
          </div>
                    <div className="form-group">
                      <input
                        type="number"
                        value={accountBalanceUsd3}
                        onChange={(e) => setAccountBalanceUsd3(e.target.value)}
                        placeholder="Account 3 Balance $"
                        className="form-control mb-3"
                      />
                      <label className="floating-label">Account 3 Balance $</label>
                      {errors.accountBalanceUsd3 && <div className="text-danger error">{errors.accountBalanceUsd3}</div>}
                    </div>
                  </div>
                )}
                {inputSets < 2 && (
                  <input
                    className="border-add"
                    type="button"
                    value="Other Account"
                    onClick={handleAddInput}
                  />
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={natureOfRelation}
                  onChange={handleNatureOfRelationChange}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Nature of Relation: Personal</label>
                {errors.natureOfRelation && <div className="text-danger error">{errors.natureOfRelation}</div>}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={purposeOfRelation}
                  onChange={handleTotalPurposeOfRelationChange}
                  placeholder=""
                  className="form-control mb-3"
                />
                <label className="floating-label">Purpose of Relation</label>
                {errors.purposeOfRelation && <div className="text-danger error">{errors.purposeOfRelation}</div>}
              </div>
              <div>
                <p className="paragh">
                  If no further changes to your submitted data are required, please press “Next”.
                </p>
              </div>
            </>
          )}
          <ButtonModile buttonName={"Next"} setNext={setNext} />
        </form>
      </div>
    </div>
  );
};

export default UserAcountBank;