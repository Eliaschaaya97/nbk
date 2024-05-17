import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { settingObjectData,updateUserData } from "../Redux/Slices/AppSlice";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UserIntroduce = () => {
  const [motherName, setMotherName] = useState("");
  const [date, setDate] = useState("");
  const [progress, setProgress] = useState(8);
  const [selectedGender, setSelectedGender] = useState("Female");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [civilNational, setCivilNational] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [status, setStatus] = useState("");
  const [passport, setPassport] = useState("");
  const [placeOfIssue, setPlaceOfIssue] = useState("");
  const [secondExpirationDate, setSecondExpirationDate] = useState("");
  const [otherNationalities, setOtherNationalities] = useState("");
  const [statusInLebanon, setStatusInLebanon] = useState("");
  const [errors, setErrors] = useState({});
  const [dateEx ,setDateEx]=useState("");
  const [validDate,setValidDate]=useState(false);
  const [gender,setGender] =useState("female");

  localStorage.setItem("status",status);


  const dispatch = useDispatch();
  const updateUserDataHandler = (category, data) => {
    dispatch(updateUserData({ category, data }));
  };

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1 ));
    nextMonth.setDate(today.getDate() + 1);

  
    const formattedDate = nextMonth.toISOString().split('T')[0];
    setDateEx(formattedDate);
   
  }, []);

  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "AddressInfo",
      })
    );
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserInfo",
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
  };

  const validateForm = () => {
    const errors = {};
    if (!motherName.trim()) {
      errors.motherName = "Mother's Name is required";
    }
    if (!date.trim()) {
      errors.date = "Date of Birth is required";
    }
    if (!placeOfBirth.trim()) {
      errors.placeOfBirth = "Place of Birth is required";
    }
    if (!selectedCountry) {
      errors.selectedCountry = "Country of Origin is required";
    }
    if (!civilNational.trim() && !secondExpirationDate.trim() && !placeOfIssue.trim()&& !passport.trim() ) {
      errors.civilNational = "Civil/National ID No. is required";
    }

  
    if (!selectedState) {
      errors.selectedState = "Register Place & No. is required";
    }
    if (!status) {
      errors.status = "Marital Status is required";
    }
    if (!passport.trim() &&  !expirationDate.trim() && !civilNational.trim()) {
      errors.passport = "Passport No. is required";
    }
    if (!placeOfIssue.trim() &&  !expirationDate.trim() && !civilNational.trim() ) {
      errors.placeOfIssue = "Place of Issue is required";
    }
    if (!expirationDate.trim() &&  !secondExpirationDate.trim() && !placeOfIssue.trim()&& !passport.trim()) {
      errors.expirationDate = " Expiration Date is required";
    }
    if (  !secondExpirationDate.trim() && !expirationDate.trim() && !civilNational.trim()  ) {
      errors.secondExpirationDate = " Expiration Date is required";
    }
  
    if (!statusInLebanon.trim()) {
      errors.statusInLebanon = "Status in Lebanon is required";
    }
    return errors;
  };


  return (
    <div id="UserIntroduce" className="container align-items-center p-3">
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
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder=""
              className="form-control mb-3"
              
            />
            <label className="floating-label">Mother's Name</label>
      
          </div>
          {errors.motherName && <div className="text-danger error">{errors.motherName}</div>}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select form-control mb-3"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Femalae</option>
  
            
          </select>
          {errors.gender && <div className="text-danger error error-status">{errors.gender}</div>}
          <div className="form-group">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder=""
              className="form-control mb-3"
           
            />
            <label className="floating-label">Date of Birth</label>

          </div>
          {errors.date && <div className="text-danger error">{errors.date}</div>}
          <div className="form-group">
            <input
              type="text"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              placeholder=""
              className="form-control mb-3"
             
            />
            <label className="floating-label">Place of Birth</label>

          </div>
          {errors.placeOfBirth && <div className="text-danger error">{errors.placeOfBirth}</div>}
          <div className="form-group">
          <CountryDropdown
    value={selectedCountry}
    onChange={(value) => setSelectedCountry(value)} // Update this line
    className="form-select form-control mb-3"
    defaultOptionLabel="Country of Origin"
    priorityOptions={['LB', 'KW']}
/>

     
          </div>
          {errors.selectedCountry && <div className="text-danger error">{errors.selectedCountry}</div>}
          <div className="form-group">
            <input
              type="text"
              value={civilNational}
              onChange={(e) => {setCivilNational(e.target.value);
                if (e.target.value) {
           
                  delete errors.secondExpirationDate; 
                  delete errors.placeOfIssue;
                  delete errors.passport;
                  delete errors.civilNational;
                }}}
              placeholder=""
              className="form-control mb-3"
            
            />
            <label className="floating-label">Civil/National ID No.</label>
          
          </div>
          {errors.civilNational && <div className="text-danger error">{errors.civilNational}</div>}
          <div className="form-group">
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                if (e.target.value) {
                  delete errors.expirationDate; 
                  delete errors.secondExpirationDate; 
                  delete errors.placeOfIssue;
                  delete errors.passport;
                
                }
              }}
              placeholder=""
              className="form-control mb-3"
              min={dateEx}
           
            />
            <label className="floating-label">Expiration Date</label>
            {errors.expirationDate && <div className="text-danger error">{errors.expirationDate}</div>}

          </div>
   
          <div className="form-group">
            <RegionDropdown
              country={selectedCountry}
              value={selectedState}
              onChange={(value) => setSelectedState(value)}
              className="form-select form-control mb-3"
              disabled={!selectedCountry}
              defaultOptionLabel="Register Place & No."
              blankOptionLabel="Register Place & No."
            />
            {errors.selectedState && <div className="text-danger error">{errors.selectedState}</div>}
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select form-control mb-3"
          >
            <option value="">Marital Status</option>
            <option value="married">Married</option>
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="widow">Widow</option>
            
          </select>
          {errors.status && <div className="text-danger error error-status">{errors.status}</div>}
          <div className="form-group">
            <input
              type="text"
              value={passport}
              onChange={(e) =>{ setPassport(e.target.value);
              if (e.target.value) {
                delete errors.expirationDate; 
               
            
                delete errors.passport;
                delete errors.civilNational;
              }}}
              placeholder=""
              className="form-control mb-3"
             
            />
            <label className="floating-label">Passport No.</label>

          </div>
          {errors.passport && <div className="text-danger error">{errors.passport}</div>}
          <div className="form-group">
            <input
              type="text"
              value={placeOfIssue}
              onChange={(e) =>{ setPlaceOfIssue(e.target.value);
              
                if (e.target.value) {
                  delete errors.expirationDate; 
       
                  delete errors.placeOfIssue;
           
                  delete errors.civilNational;
                }}}
              placeholder=""
              className="form-control mb-3"
             
            />
            <label className="floating-label">Place of Issue</label>
            
          </div>
          {errors.placeOfIssue && <div className="text-danger error">{errors.placeOfIssue}</div>}
          <div className="form-group">
      <input
        type="date"
        value={secondExpirationDate}
        onChange={(e) => {
          setSecondExpirationDate(e.target.value);
     
          if (e.target.value) {
            delete errors.expirationDate; 
            delete errors.secondExpirationDate; 
    
     
            delete errors.civilNational;
          }
        }}
        placeholder=""
        className="form-control mb-3"
        min={dateEx}
      />
      <label className="floating-label">Expiration Date</label>
    </div>
    {errors.secondExpirationDate && <div className="text-danger error">{errors.secondExpirationDate}</div>}

          <div className="form-group">
            <input
              type="text"
              value={otherNationalities}
              onChange={(e) => setOtherNationalities(e.target.value)}
              placeholder=""
              className="form-control mb-3"
            
            />
            <label className="floating-label">Other Nationalities</label>

          </div>
        
          <div className="form-group">
            <input
              type="text"
              value={statusInLebanon}
              onChange={(e) => setStatusInLebanon(e.target.value)}
              placeholder=""
              className="form-control mb-3"
         
            />
            <label className="floating-label">Status in Lebanon</label>

          </div>
          {errors.statusInLebanon && <div className="text-danger error">{errors.statusInLebanon}</div>}
          <button type="submit" className="btn-proceed" onClick={()=>updateUserDataHandler()}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserIntroduce;
