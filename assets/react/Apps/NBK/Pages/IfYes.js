import React, { useEffect, useState } from 'react';
import ProgressBar from '../Component/ProgressBar';
import PhoneInput from 'react-phone-number-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from "react-redux";
import { settingObjectData,updateUserData  } from '../Redux/Slices/AppSlice';




const IfYes = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const updateUserDataHandler = (category, data) => {
    dispatch(updateUserData({ category, data }));
  };
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
      formIsValid = false;
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
      formIsValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    }

    if (!branch.trim()) {
      errors.branch = "Branch is required";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
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
 
    updateUserDataHandler("user", {
      fullName: fullName,
      mobileNumb: phoneNumber,
      email:email,
      branchUnit:branch
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission
      console.log("Form submitted successfully");
    }
  };

  const getHeaderTitleBack = () => {
 
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "",
      })
    );
  };



  return (
    <div id="IfYes" className="container d-flex flex-column align-items-center p-3">
      <button
        type="button"
        className="btn-Back"
        onClick={() => {
          getHeaderTitleBack();
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
      </button>

      <div className="intro d-flex flex-column align-items-center">
        <p className="mb-3">
          Please refer to your branch. We will contact you within 3 working days.
        </p>
        <form className="form" onSubmit={handleSubmit}>
      
          <div className="form-group">
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Full Name of Branch</label>
          </div>
          {errors.fullName && <div className="error text-danger ">{errors.fullName}</div>}
          <PhoneInput

  withCountryCallingCode
  value={phoneNumber}
  className="form-control mb-3"
  onChange={setPhoneNumber}
  defaultCountry='LB'
  placeholder
  prefix="+"
/>
          {errors.phoneNumber && <div className="error text-danger  ">{errors.phoneNumber}</div>}
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Email</label>
          </div>
          {errors.email && <div className="error text-danger ">{errors.email}</div>}
          <select
            value={branch}
            onChange={handleBranchChange}
            className="form-select form-control mb-3"
          >
            <option value="">Branch/Unit</option>
            <option value="sanayeh">Sanayeh</option>
            <option value="bhamdoun">Bhamdoun</option>
            <option value="private bank">Private Bank</option>
          </select>
          {errors.branch && <div className="error text-danger error-status">{errors.branch}</div>}
          <button type="submit" className="btn-proceed submit-btn" onClick={()=>updateUserDataHandler()}>
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default IfYes;
