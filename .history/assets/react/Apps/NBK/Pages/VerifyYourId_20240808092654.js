import React, { useRef, useState } from "react";
import ProgressBar from "../Component/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonModile from "./ButtonMobile";
import ScanID from "./../../../../../assets/images/nbk/Scan ID.svg";

import "react-phone-input-2/lib/style.css";
import DropdownCheckbox from "../Component/DropdownCheckbox";

const VerifyYourId = () => {
  const userDataUser = useSelector(
    (state) => state.appData.userData.user || {}
  );
  const userData = useSelector(
    (state) => state.appData.userData.workDetails || {}
  );
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [profession, setProfession] = useState(userData.profession || "");
  const [progress, setProgress] = useState(9);
  const [grade, setGrade] = useState(userData.grade || "");
  const [workTelNo, setWorkTelNo] = useState(
    userData.workTelephoneNumber || ""
  );
  const [activeButton, setActiveButton] = useState(
    userData.placeOfWorkListed || "No"
  );
  const [documentStates, setDocumentStates] = useState({});
  const [errors, setErrors] = useState({});
  const [next, setNext] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectIDType, setSelectIDType] = useState("");
  const dispatch = useDispatch();
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const fileInputRefs = useRef({
    AccountStatement: null,
    EmployerLetterReference: null,
    RealEstateTitleDeed: null,
    other: null,
  });

  const [additionalDocuments, setAdditionalDocuments] = useState([]);

  const IncomeSources = [
    {
      id: "1",
      value: "AccountStatement",
      label: "Account Statement",
    },
    {
      id: "2",
      value: "EmployerLetterReference",
      label: "Employer Letter Reference",
    },
    { id: "3", value: "RealEstateTitleDeed", label: "Real Estate Title Deed" },
    { id: "4", value: "other", label: "Other" },
  ];

  const handleIncomeSourceChange = (selectedOptions) => {
    setAdditionalDocuments(selectedOptions);
    dispatch(updateUserData({
      category: 'verifyID',
      data: { additionalDocuments: selectedOptions }
    }));
  };

  const handleSelectIDTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectIDType(selectedValue);
    dispatch(updateUserData({
      category: 'verifyID',
      data: { selectIDType: selectedValue }
    }));
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
      dispatch(updateUserData({
        category: 'verifyID',
        data: { selectIDType, frontImage, backImage, additionalDocuments }
      }));
    } else {
      setErrors(validationErrors);
    }
  };
  

  const validateForm = () => {
    const errors = {};
    if (!selectIDType.trim()) {
      errors.selectIDType = "Select ID Type is required";
    }
    return errors;
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    setActiveButton(event.target.innerText);
    if (event.target.innerText === "No") {
      setNext(false);
      delete errors.grade;
      delete errors.spouseName;
      delete errors.spouseProfession;
      delete errors.noOfChildren;
    }
  };

  const handleFileChange = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setDocumentStates((prevState) => ({
        ...prevState,
        [documentType]: imageUrl,
      }));
  
      dispatch(updateUserData({
        category: 'verifyID',
        data: { additionalDocuments: { ...documentStates, [documentType]: imageUrl } }
      }));
    }
  };
  

  const handleBoxClick = (doc) => {
    console.log("Box clicked");
    const inputRef = fileInputRefs.current[doc];
    if (inputRef) {
      inputRef.click();
    } else {
      console.log("File input ref not set");
    }
  };

  const handleBoxClick1 = (step) => {
    if (step === "front") {
      fileInputRefFront.current.click();
    } else if (step === "back") {
      fileInputRefBack.current.click();
    }
  };


  const handleFileChange1 = (event, step) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (step === "Front ID") {
        setFrontImage(imageUrl);
        dispatch(updateUserData({
          category: 'verifyID',
          data: { frontImage: imageUrl }
        }));
      } else if (step === "Back ID") {
        setBackImage(imageUrl);
        dispatch(updateUserData({
          category: 'verifyID',
          data: { backImage: imageUrl }
        }));
      }
    }
  };

  return (
    <div id="VerifyYourId" className="container align-items-center p-3">
      <button
        type="submit"
        className="btn-Back"
        onClick={() => {
          getHeaderTitleBack();
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
      </button>
      <div className="intro d-flex flex-column">
        <ProgressBar progress={progress} />
        <form className="form" onSubmit={handleNext}>
          <p className="Title">Verify Your Identity</p>
          <div className="form-group">
            <select
              value={selectIDType}
              onChange={handleSelectIDTypeChange}
              className="form-select form-control mb-3"
            >
              <option value="">Select ID Type</option>
              <option value="nationalID">National ID</option>
              <option value="passport">Passport</option>
            </select>
            {errors.selectIDType && (
              <div className="error text-danger error-status">
                {errors.selectIDType}
              </div>
            )}
          </div>
          <div className="form-group">
            <p className="p-step">Step 1: </p>
            <p className="p-sub">
              Place the front of your ID into the Camera frame and take a clear
              photo.
            </p>
            <div className="box" onClick={() => handleBoxClick1("front")}>
              <div className="box-image">
                {frontImage ? (
                  <img className="img" src={frontImage} alt="Front ID" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload Front ID</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefFront}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange1(e, "Front ID")}
            />
          </div>

          <div className="form-group">
            <p className="p-step">Step 2: </p>
            <p className="p-sub">
              Place the back of your ID into the Camera frame and take a clear
              photo.
            </p>
            <div className="box" onClick={() => handleBoxClick1("back")}>
              <div className="box-image">
                {backImage ? (
                  <img className="img" src={backImage} alt="Back ID" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload Back ID</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefBack}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange1(e, "Back ID")}
            />
          </div>
          <div
            className="form-group-dropdown"
            style={{ marginBottom: "130px" }}
          >
            <p className="Title">Additional Documents</p>
            <DropdownCheckbox
              idPrefix={"trtype"}
              options={IncomeSources}
              onChange={handleIncomeSourceChange}
              valueObj="value"
              labelObj="label"
              selectedData={additionalDocuments}
              label={"Select"}
            />
            {errors.additionalDocuments && (
              <div className="text-danger error">
                {errors.additionalDocuments}
              </div>
            )}
            {additionalDocuments.map((doc, index) => (
            <div key={index} className="form-group mt-4">
              <div
                className="box"
                onClick={() => handleBoxClick(doc.value)}
              >
                <div className="box-image">
                  {documentStates[doc.value] ? (
                    <img className="img" src={documentStates[doc.value]} alt={doc.label} />
                  ) : (
                    <>
                      <img src={ScanID} alt="scan upload" />
                      <p className="p-img">Scan or Upload {doc.label}</p>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="camera"
                style={{ display: "none" }}
                ref={(el) => (fileInputRefs.current[doc.value] = el)}
                onChange={(e) => handleFileChange(e, doc.value)}
              />
            </div>
          ))}
          </div>
          <ButtonModile buttonName={"Next"} setNext={setNext} />
        </form>
      </div>
    </div>
  );
};

export default VerifyYourId;
