import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { settingObjectData,updateUserData } from "../Redux/Slices/AppSlice";
import ProgressBar from "../Component/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Modal from 'react-modal';
import AppAPI from '../Api/AppApi';
import { parsePhoneNumberFromString } from "libphonenumber-js";

const UserInfo = () => {
  const userData = useSelector((state) => state.appData.userData.user || {});
  const { fetUsers} = AppAPI();
  const [fullName, setFullName] = useState(userData.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(userData.mobileNumb || "");
  const [email, setEmail] = useState(userData.email || "");
  const [branch, setBranch] = useState(userData.branchUnit || "");
  const [progress, setProgress] = useState(3);
  const [errors, setErrors] = useState({});
  const [modalIsOpenNum, setModalIsOpenNum] = useState(false);
  const [branchId, setBranchId] = useState(null);
  const regex = /^[A-Za-z\s\-']*$/;
  const [validationMessage, setValidationMessage] = useState("");
  const [countryCode, setCountryCode] = useState("lb");


  const parameters = useSelector((state) => state.appData.parameters);
  useEffect(() => {
    switch (branch) {
      case 'sanayeh':
        setBranchId(1);
        break;
      case 'bhamdoun':
        setBranchId(2);
        break;
      case 'privatebank':
        setBranchId(3);
        break;
      default:
        setBranchId(null);
    }
  }, [branch]);

  const dispatch = useDispatch();

  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "user", data: { [field]: value } }));
  };
  const getHeaderTitle = () => {
   
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserIntroduce",
      }),
    );
  };
 
  const handleNext = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setProgress(progress + 20);
      if (progress >= 100) {
        setProgress(100);
      }
      
    const statusCode = await fetUsers(phoneNumber);
    console.log("statsCode", statusCode)
    if (statusCode == 1) {
      console.log('entered the if')
      setModalIsOpenNum(true);
 
        setTimeout(() => {
          if (parameters?.deviceType === "Android") {
            window.AndroidInterface.callbackHandler("GoToApp");
          } else if (parameters?.deviceType === "Iphone") {
            window.webkit.messageHandlers.callbackHandler.postMessage("GoToApp");
          }
        }, 2000);
   
    } else {
      getHeaderTitle();
    }} else {
      setErrors(validationErrors);
    }
    updateUserFieldInUserData("fullName", fullName);
    updateUserFieldInUserData("mobileNumb", phoneNumber);
    updateUserFieldInUserData("email", email);
    updateUserFieldInUserData("branchUnit", branch);
    updateUserFieldInUserData("branchId", branchId);


  };

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = "Full Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required or invalid'";
    }
    if (validationMessage.includes("invalid")) {
      errors.phoneNumber = 'Phone number is required or invalid';
    }

    if (!branch) {
      errors.branch = "Branch/Unit selection is required";
    }
    return errors;
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleFullNameChange = (event) => {
    const { value } = event.target;
    // Allow only alphabetic characters and symbols
    const regex = /^[A-Za-z\s\.\,\-\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\;\:\'\"\<\>\?\/\|\\]*$/;
    if (regex.test(value)) {
      setFullName(value);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };
  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "IfNo",
      })
    );
  };
  const handleChange = (value, country) => {
    setPhoneNumber(value);
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


  return (
    <div id="UserInfo" className="container d-flex flex-column  p-3">
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
            <input type="text" value={fullName} onChange={handleFullNameChange} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Full Name</label>
          </div>
          {errors.fullName && <div className="text-danger error">{errors.fullName}</div>}
          <div className="label-div"><label className="label-tel" >Mobile No.</label></div>
          <PhoneInput
          enableSearch
            className="mb-3"
            country={countryCode}
            value={phoneNumber}
            onChange={handleChange}
            disableSearchIcon={true}
            prefix="+"
            inputStyle={{ width: '100%', paddingLeft: '50px', height: '45px' }}
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
         
            )}
          {errors.phoneNumber && <div className="text-danger error">{errors.phoneNumber}</div>}

          <div className="form-group">
            <input type="email" value={email} onChange={handleEmailChange} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Email</label>
          </div>
          {errors.email && <div className="text-danger error">{errors.email}</div>}

          <select value={branch} onChange={handleBranchChange} className="form-select form-control mb-3">
            <option value="">Branch/Unit</option>
            <option value="sanayeh">Sanayeh</option>
            <option value="bhamdoun">Bhamdoun</option>
            <option value="privatebank"> Private Bank</option>
          </select>
          {errors.branch && <div className="text-danger error error-branch">{errors.branch}</div>}

          <button type="submit" className="btn-proceed submit-btn" >
            Proceed
          </button>
          <Modal
       id='modalNum'
        isOpen={modalIsOpenNum}
        onRequestClose={() => setModalIsOpenNum(false)}
        contentLabel="Example Modal"
      >
        <p className='p-modal'>Phone number already exist !</p>
      
      </Modal>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;