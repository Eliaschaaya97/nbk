import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { settingObjectData,updateUserData } from "../Redux/Slices/AppSlice";
import ProgressBar from "../Component/ProgressBar";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UserInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  const [branch, setBranch] = useState("");
  const [progress, setProgress] = useState(3);
  const [errors, setErrors] = useState({});

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
    updateUserFieldInUserData("fullName", fullName);
    updateUserFieldInUserData("mobileNumb", phoneNumber);
    updateUserFieldInUserData("email", email);
    updateUserFieldInUserData("branchUnit", branch);

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
      errors.phoneNumber = "Phone number is required";
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

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
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

          <PhoneInput placeholder="Phone Number" value={phoneNumber} className="form-control mb-3" onChange={setPhoneNumber} defaultCountry="LB" />
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
            <option value="private bank"> Private Bank</option>
          </select>
          {errors.branch && <div className="text-danger error error-branch">{errors.branch}</div>}

          <button type="submit" className="btn-proceed submit-btn" >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
