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

  const [frontImageID, setFrontImageID] = useState(null);
  const [backImageID, setBackImageID] = useState(null);
  const [accountStatement, setAccountStatement] = useState(null);
  const [employerLetter, setEmployerLetter] = useState(null);
  const [realEstateTitle, setRealEstateTitle] = useState(null);
  const [otherDocument, setOtherDocument] = useState(null);
  const [progress, setProgress] = useState(93);
  const [documentStates, setDocumentStates] = useState({});

  const [errors, setErrors] = useState({});
  const [next, setNext] = useState(false);
  const [selectIDType, setSelectIDType] = useState("");
  const dispatch = useDispatch();
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const fileInputRefAccountStatement= useRef(null);
  const fileInputRefEmployerLetterReference= useRef(null);
  const fileInputRefRealEstateTitleDeed= useRef(null);
  const fileInputRefother= useRef(null);


  const [additionalDocuments, setAdditionalDocuments] = useState([]);



  const validateForm = () => {
    const errors = {};
    if (!selectIDType.trim()) {
      errors.selectIDType = "Select ID Type is required";
    }
    if (!frontImageID) {
      errors.frontImageID = "Front ID image is required";
    }
    if (!backImageID) {
      errors.backImageID = "Back ID image is required";
    }
    if (!accountStatement && additionalDocuments.includes('AccountStatement')) {
        errors.accountStatement = "Account Statement image is required";
      }
      if (!employerLetter && additionalDocuments.includes('EmployerLetter')) {
        errors.employerLetter = "Account Statement image is required";
      }
      if (!realEstateTitle && additionalDocuments.includes('RealEstateTitle')) {
        errors.realEstateTitle = "real Estate Title  image is required";
      }
      if (!otherDocument && additionalDocuments.includes('other')) {
        errors.otherDocument = "Other Document  image is required";
      }
  
    return errors;
  };

  const IncomeSources = [
    {
      id: "1",
      value: "AccountStatement",
      label: "Account Statement",
    },
    {
      id: "2",
      value: "EmployerLetter",
      label: "Employer Letter Reference",
    },
    { id: "3", value: "RealEstateTitle", label: "Real Estate Title Deed" },
    { id: "4", value: "other", label: "Other" },
  ];

  const handleIncomeSourceChange = (selectedOptions) => {
    setAdditionalDocuments(selectedOptions);
    // console.log(selectedOptions)
    dispatch(
      updateUserData({
        category: "financialDetails",
        data: { additionalDocuments: selectedOptions },
      })
    );
  };

  const handleSelectIDTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectIDType(selectedValue);
    dispatch(
      updateUserData({
        category: "financialDetails",
        data: { selectIDType: selectedValue },
      })
    );
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
      dispatch(
        updateUserData({
          category: "financialDetails",
          data: { selectIDType },
        })
      );
    } else {
      setErrors(validationErrors);
    }
  };

  const handleFileChange1 = (event, step) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Image = reader.result;
        if (step === "Front ID") {
          setFrontImageID(base64Image);
          dispatch(
            updateUserData({
              category: "financialDetails",
              data: { frontImageID: base64Image },
            })
          );
        } else if (step === "Back ID") {
          setBackImageID(base64Image);
          dispatch(
            updateUserData({
              category: "financialDetails",
              data: { backImageID: base64Image },
            })
          );
        }
      };
  
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Image = reader.result;
  
        switch (documentType) {
          case "AccountStatement":
            setAccountStatement(base64Image);
            dispatch(
              updateUserData({
                category: "financialDetails",
                data: { accountStatement: base64Image },
              })
            );
            break;
          case "EmployerLetter":
            setEmployerLetter(base64Image);
            dispatch(
              updateUserData({
                category: "financialDetails",
                data: { employerLetter: base64Image },
              })
            );
            break;
          case "RealEstateTitle":
            setRealEstateTitle(base64Image);
            dispatch(
              updateUserData({
                category: "financialDetails",
                data: { realEstateTitle: base64Image },
              })
            );
            break;
          case "other":
            setOtherDocument(base64Image);
            dispatch(
              updateUserData({
                category: "financialDetails",
                data: { otherDocument: base64Image },
              })
            );
            break;
          default:
            break;
        }
      };
  
      reader.readAsDataURL(file);
    }
  };
  
  const handleBoxClickAccountStatement = () => {

    const inputRef = fileInputRefAccountStatement.current;
    if (inputRef) {
      inputRef.click();
    } else {
      // console.log("File input ref not set");
    }
  };
  const handleBoxClickEmployerLetterReference = () => {

    const inputRef = fileInputRefEmployerLetterReference.current;
    if (inputRef) {
      inputRef.click();
    } else {
      // console.log("File input ref not set");
    }
  };
  const handleBoxClickRealEstateTitleDeed = () => {

    const inputRef = fileInputRefRealEstateTitleDeed.current;
    if (inputRef) {
      inputRef.click();
    } else {
      // console.log("File input ref not set");
    }
  };
  const handleBoxClickOther= () => {

    const inputRef = fileInputRefother.current;
    if (inputRef) {
      inputRef.click();
    } else {
      // console.log("File input ref not set");
    }
  };
  

  const handleBoxClick1 = (step) => {
    if (step === "front") {
      fileInputRefFront.current.click();
    } else if (step === "back") {
      fileInputRefBack.current.click();
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
                {frontImageID ? (
                  <img className="img" src={frontImageID} alt="Front ID" />
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
            {errors.frontImageID && (
              <div className="error text-danger error-status">
                {errors.frontImageID}
              </div>
            )}
          </div>

          <div className="form-group">
            <p className="p-step">Step 2: </p>
            <p className="p-sub">
              Place the back of your ID into the Camera frame and take a clear
              photo.
            </p>
            <div className="box" onClick={() => handleBoxClick1("back")}>
              <div className="box-image">
                {backImageID ? (
                  <img className="img" src={backImageID} alt="Back ID" />
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
            {errors.backImageID && (
              <div className="error text-danger error-status">
                {errors.backImageID}
              </div>
            )}
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


        

          {additionalDocuments.includes('AccountStatement') &&  <>  <div className="form-group">
            <div className="box" onClick={() => handleBoxClickAccountStatement("AccountStatement")}>
              <div className="box-image">
                {accountStatement ? (
                  <img className="img" src={accountStatement} alt="AccountStatement" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload Account Statement</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefAccountStatement}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "AccountStatement")}
            />
            {errors.accountStatement && (
              <div className="error text-danger error-status">
                {errors.accountStatement}
              </div>
            )}
          </div> </>}

          { additionalDocuments.includes('EmployerLetter')  &&  <>  <div className="form-group">
            <div className="box" onClick={() => handleBoxClickEmployerLetterReference("EmployerLetter")}>
              <div className="box-image">
                {employerLetter ? (
                  <img className="img" src={employerLetter} alt="EmployerLetterReference" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload Employer Letter Reference</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefEmployerLetterReference}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "EmployerLetter")}
            />
            {errors.employerLetter && (
              <div className="error text-danger error-status">
                {errors.employerLetter}
              </div>
            )}
          </div> </>}
          { additionalDocuments.includes('RealEstateTitle')  &&  <>  <div className="form-group">
            <div className="box" onClick={() => handleBoxClickRealEstateTitleDeed("RealEstateTitle")}>
              <div className="box-image">
                {realEstateTitle ? (
                  <img className="img" src={realEstateTitle} alt="realEstateTitle" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload realEstateTitle</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefRealEstateTitleDeed}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "RealEstateTitle")}
            />
            {errors.realEstateTitle && (
              <div className="error text-danger error-status">
                {errors.realEstateTitle}
              </div>
            )}
          </div> </>}
          { additionalDocuments.includes('other')  &&  <>  <div className="form-group">
            <div className="box" onClick={() => handleBoxClickOther("other")}>
              <div className="box-image">
                {otherDocument ? (
                  <img className="img" src={otherDocument} alt="otherDocument" />
                ) : (
                  <>
                    <img src={ScanID} alt="scan upload" />
                    <p className="p-img">Scan or Upload other</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              ref={fileInputRefother}
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "other")}
            />
            {errors.otherDocument && (
              <div className="error text-danger error-status">
                {errors.otherDocument}
              </div>
            )}
          </div> </>}
           



          </div>
          <ButtonModile buttonName={"Next"} setNext={setNext} />
        </form>
      </div>
    </div>
  );
};

export default VerifyYourId;
