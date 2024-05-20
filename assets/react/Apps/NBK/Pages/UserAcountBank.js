import React, { useState, useMemo } from "react";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useDispatch ,useSelector} from "react-redux";
import { settingObjectData ,updateUserData} from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const UserAcountBank = () => {
  const userData = useSelector((state) => state.appData.userData.financialDetails || {});

  const [progress, setProgress] = useState(90);

  const [activeButton, setActiveButton] = useState( userData.hasOtherAccounts || "No");
  const [country1, setCountry1] = useState(userData.country ||"");
  const [accountBalanceUsd, setAccountBalanceUsd] = useState( userData.accountBalance || "");
  const [purposeOfRelation, setPurposeOfRelation] = useState(userData.purposeOfRelation || "");
  const [natureOfRelation, setNatureOfRelation] = useState(userData.natureOfRelation || "");
  const [bankName, setBankName] = useState( userData.bankName || "");
  const [inputs, setInputs] = useState(['']);
  const [errors, setErrors] = useState({});
  const [next,setNext]=useState(false);

 const handleAddInput = (index) => {
  if (index === inputs.length - 1) { 
      setInputs([...inputs, '']); 
  }
};
const handleChanges = (event, index) => {
  const newInputs = [...inputs];
  newInputs[index] = event.target.value; 
  setInputs(newInputs);
};

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "financialDetails", data: { [field]: value } }));
  };


  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "CustomerDeclaration",
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
  
};

  const handleAccountBalanceUsdChange = (e) => {
    setAccountBalanceUsd(e.target.value);
  };

  const handleBankNameChange = (e) => {
    setBankName(e.target.value);
  };



  const handleTotalPurposeOfRelationChange = (e) => {
    setPurposeOfRelation(e.target.value);
  };

  const handleNatureOfRelationChange = (e) => {
    setNatureOfRelation(e.target.value);
  };
  const handleCountry1Change = (e) => {
    setCountry1(e.target.value);
  };
  const handleButtonClick = (event) => {
    event.preventDefault(); 
    setActiveButton(event.target.innerText);
    if (event.target.innerText === "No") {
     
      delete errors.bankName ;
      delete errors.country1;
      delete  errors.accountBalanceUsd;
      delete errors.natureOfRelation;
      delete errors.purposeOfRelation;
  }
  }


    const validateForm = () => {
      const errors = {};
      if (activeButton === "Yes" && next) {
          if (!bankName.trim()) {
              errors.bankName = "Bank Name 1";
          }
          if ( !country1.trim()) {
              errors.country1 = "Country 1";
          }
          if (!accountBalanceUsd.trim()) {
              errors.accountBalanceUsd = "Account 1 Balance $";
          }
          if (!natureOfRelation.trim()) {
              errors.natureOfRelation = "Nature of Relation: Personalis required";
          }
          if (!purposeOfRelation.trim()) {
              errors.purposeOfRelation = "Purpose of Relation is required";
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
                        <button className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`} onClick={handleButtonClick}>Yes</button>
                        <button className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`} onClick={handleButtonClick}>No</button>
                    </div>
                    {activeButton==="Yes" &&(
                      <>
          <div className="form-group">
            <input type="text" value={bankName} onChange={handleBankNameChange} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Bank Name 1</label>
          </div>
          {errors.bankName && <div className="text-danger error">{errors.bankName}</div>}
          <div className="form-group">
            <input type="text" value={country1} onChange={handleCountry1Change} placeholder="" className="form-control mb-3"  />
            <label className="floating-label">Country 1</label>
          </div>
          {errors.country1 && <div className="text-danger error">{errors.country1}</div>}
          <div className="form-group">
            <input type="text" value={accountBalanceUsd} onChange={handleAccountBalanceUsdChange} placeholder="" className="form-control mb-3"  />
            <label className="floating-label">Account 1 Balance $</label>
          </div>
          {errors.accountBalanceUsd && <div className="text-danger error">{errors.accountBalanceUsd}</div>}
          <div className='add-input'>

                <input
                className='border-add'
                    key={index}
                    type="text"
                    placeholder="Other Acccout"
                    value={input}
                    onChange={(e) => handleChanges(e, index)}
                    onClick={() => handleAddInput(index)}
                />
    
        </div>
          <div className="form-group">
            <input type="text" value={natureOfRelation} onChange={handleNatureOfRelationChange} placeholder="" className="form-control mb-3"  />
            <label className="floating-label">Nature of Relation: Personal</label>
          </div>
          {errors.natureOfRelation && <div className="text-danger error">{errors.natureOfRelation}</div>}
          <div className="form-group">
            <input type="text" value={purposeOfRelation} onChange={handleTotalPurposeOfRelationChange} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Purpose of Relation</label>
          </div>
          {errors.purposeOfRelation && <div className="text-danger error">{errors.purposeOfRelation}</div>}
          <div>
            <p className="paragh">if no further changes to your submitted data are required, please press “Next”.</p>
          </div>
          </>   )}
          <button
            type="submit"
            className="btn-proceed"
            onClick={() => 
             setNext(true)
            }
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAcountBank;
