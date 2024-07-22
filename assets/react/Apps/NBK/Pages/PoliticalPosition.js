import React, { useState } from "react";
import ProgressBar from "../Component/ProgressBar";
import { useDispatch ,useSelector} from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonModile from "./ButtonMobile";

const PoliticalPosition = () => {
  const userData = useSelector((state) => state.appData.userData.politicalPositionDetails || {});


  const [yearOfRetirement, setYearOfRetirement] = useState(userData.yearOfRetirement || "");
  const [progress, setProgress] = useState(60);
  const [currentPrevious, setCurrentPrevious] = useState(userData.currentOrPrevious || "");
  const [PEPName, setPEPName] = useState(userData.pepName || "");
  const [relationship, setRelationship] = useState(userData.relationship || "");
  const [PEPPosition, setPEPPosition] = useState(userData.pepPosition || "");
  const [activeButton, setActiveButton] = useState( userData.politicalPosition || "No");
  const [errors, setErrors] = useState({});
  const [next, setNext] = useState(false);
  const [inputs, setInputs] = useState([""]);
  const updateUserFieldInUserData = (field, value) => {
    dispatch(
      updateUserData({
        category: "politicalPositionDetails",
        data: { [field]: value },
      })
    );
  };
  const regex = /^[A-Za-z\s\-']*$/;

  const dispatch = useDispatch();
  const handleAddInput = (index) => {
    if (index === inputs.length - 1) {
      // Check if the first input is clicked and only one input exists
      setInputs([...inputs, ""]); // Add a new input field
    }
  };
  const handlesPEPName= (e) => {
    const { value } = e.target;
    if (regex.test(value)) {
      setPEPName(value);
    } 
  };
  const handleChanges = (event, index) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value; // Update the value at the specific index
    setInputs(newInputs);
  };

  const getHeaderTitle = () => {
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
    updateUserFieldInUserData("politicalPosition", activeButton);
    updateUserFieldInUserData("currentOrPrevious", currentPrevious);
    updateUserFieldInUserData("yearOfRetirement", yearOfRetirement);
    updateUserFieldInUserData("pepName", PEPName);
    updateUserFieldInUserData("relationship", relationship);
    updateUserFieldInUserData("pepPosition", PEPPosition);
  };
  const validateForm = () => {
    const errors = {};
    if (activeButton === "Yes") {
      if (!currentPrevious.trim()) {
        errors.currentPrevious = "Current/Previous field is required";
      }
      if (!PEPName.trim()) {
        errors.PEPName = "PEP Name is required";
      }
      if (!relationship.trim()) {
        errors.relationship = "Relationship is required";
      }
      if (!PEPPosition.trim()) {
        errors.PEPPosition = "PEP Position is required";
      }
      if (!yearOfRetirement.trim()){
        errors.yearOfRetirement = "Year of Retirement is required";
      }
    }
    return errors;
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    setActiveButton(event.target.innerText);
    if (event.target.innerText === "No") {
      setNext(false);
      delete errors.currentPrevious;
      delete errors.yearOfRetirement;
      delete errors.PEPName;
      delete errors.relationship;
      delete errors.PEPPosition;
    }
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "BRODetails",
      })
    );
  };

  return (
    <div id="PoliticalPosition" className="container align-items-center p-3">
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
          <p className="mb-3">Political Position Details (if any):</p>
          <label className="custom-control-label" htmlFor="customCheck1">
            Are you or any of your first or second-degree relatives or close associates holding a political position?
          </label>
          <div className="buttons d-flex gap-3 ">
            <button className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`} onClick={handleButtonClick}>
              Yes
            </button>
            <button className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`} onClick={handleButtonClick}>
              No
            </button>
          </div>
          {activeButton === "Yes" && (
  <>
    <div className="form-group">
    <input
        type="text"
        value={currentPrevious}
        onChange={(e) => setCurrentPrevious(e.target.value)}
        placeholder=""
        className="form-control mb-3"
      />
      <label className="floating-label">
          If yes, please specify Current/Previous?
      </label>
    {errors.currentPrevious && (
      <div className="text-danger error">{errors.currentPrevious}</div>
    )}
    </div>

      <div className="form-group">
        <input
          type="text"
          value={yearOfRetirement}
          onChange={(e) => setYearOfRetirement(e.target.value)}
          placeholder=""
          className="form-control mb-3"
        />
        <label className="floating-label">
          If previous, please specify Year of Retirement
        </label>
        {errors.yearOfRetirement && (
          <div className="text-danger error">{errors.yearOfRetirement}</div>
        )}
      </div>
    <label className="custom-control-label" htmlFor="customCheck1">
      If you or any of your first or second-degree relatives or close associate
      (partner/consultant/legal representative) are holding political position,
      please specify your/their position:
    </label>

    <div className="form-group">
      <input
        type="text"
        value={PEPName}
        onChange={handlesPEPName}
        placeholder=""
        className="form-control mb-3"
      />
      <label className="floating-label">PEP Name</label>
      {errors.PEPName && <div className="text-danger error">{errors.PEPName}</div>}
    </div>

    <div className="form-group">
      <input
        type="text"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        placeholder=""
        className="form-control mb-3"
      />
      <label className="floating-label">Relationship</label>
      {errors.relationship && (
        <div className="text-danger error">{errors.relationship}</div>
      )}
    </div>
    <select
      value={PEPPosition}
      onChange={(e) => setPEPPosition(e.target.value)}
      className="form-select form-control mb-3"
    >
      <option value="">PEP Position</option>
      <option value="royalfamily">Royal Family</option>
      <option value="memberofparliament">Member of Parliament</option>
      <option value="seniormilitary">Senior Military</option>
      <option value="seniorgovernmentofficer">
        Senior Government Officer
      </option>
      <option value="seniorpolitician">Senior Politician</option>
      <option value="entitiesdiplomat">Entities Diplomat</option>
      <option value="courtpresidentdeputy">Court President/Deputy</option>
      <option value="attorneygeneral">Attorney General</option>
      <option value="seniorpositionatIntlorganisation">
        Senior Position at Int'l Organisation
      </option>
    </select>
    {errors.PEPPosition && (
      <div className="text-danger error">{errors.PEPPosition}</div>
    )}
  </>
)}
{/* 
          <button type="submit" className="btn-proceed" onClick={() => setNext(true)}>
            Next
          </button> */}
                  <ButtonModile buttonName={"Next"} setNext={setNext}/>

        </form>
      </div>
    </div>
  );
};

export default PoliticalPosition;
