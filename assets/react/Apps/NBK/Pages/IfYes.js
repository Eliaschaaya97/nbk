import React, { useEffect, useState } from 'react';
import ProgressBar from '../Component/ProgressBar';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch ,useSelector } from "react-redux";
import { settingObjectData,updateUserData  } from '../Redux/Slices/AppSlice';
import AppAPI from "../Api/AppApi";



const IfYes = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState({});

  const {SendInformation} = AppAPI();
  const formData = useSelector((state) => state.appData.userData);

  
  const handleSubmitInformation = () => {
    SendInformation(formData);
    console.log('successs inside the customer declaration')
  }

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "user", data: { [field]: value } }));
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


  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };
 



  
  const handleSubmit = (e) => {
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
          <div>
            
          </div>
 
          <PhoneInput
          className="mb-3"
          country={"lb"}
          // value={"phoneNumber"}
          value={phoneNumber}
          defaultValue={phoneNumber}
          onChange={(phoneNumber, country) =>
           setPhoneNumber( phoneNumber)
          }
          disableSearchIcon={true}
          // enableAreaCodeStretch={true}
          prefix="+"
          inputStyle={{ width: "100%" , paddingLeft: "50px",height:"45px"}}
       
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
          <button type="submit" className="btn-proceed submit-btn"     onClick={() => {
             handleSubmitInformation()
            }} >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default IfYes;
