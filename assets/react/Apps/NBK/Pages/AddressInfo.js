import React, { useState } from "react";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch ,useSelector} from "react-redux";
import { settingObjectData, updateUserData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AddressInfo = () => {
 const userDataUser = useSelector((state) => state.appData.userData.user || {});
 const userData = useSelector((state) => state.appData.userData.address || {});


  const [otherCountriesOfTaxResidence, setOtherCountriesOfTaxResidence] = useState(userDataUser.otherCountriesOfTaxResidence || "");
  const [street, setStreet] = useState( userData.street|| "");
  const [progress, setProgress] = useState(17);
  const [taxResidencyIDNumber, setTaxResidencyIDNumber] = useState( userDataUser.taxResidencyIdNumber|| "");
  const [selectedCountry, setSelectedCountry] = useState(userData.internationalAddress || "");
  const [buildingHouse, setBuildingHouse] = useState(  userData.building||"");
  const [floor, setFloor] = useState(userData.floor||"");
  const [apartment, setApartment] = useState( userData.apartment||"");
  const [area, setArea] = useState(userData.intArea || "");
  const [internationalStreet, setInternationalStreet] = useState( userData.intStreet ||"");
  const [houseTelNo, setHouseTelNo] = useState( userData.houseTelephoneNumber|| "");
  const [internationalBuildingHouse, setInternationalBuildingHouse] = useState(userData.intBuilding ||"");
  const [internationalFloor, setInternationalFloor] = useState(userData.intFloor || "");
  const [internationalApartment, setInternationalApartment] = useState(userData.intApartment || "");
  const [value, setValue] = useState( userData.internationalHouseTelephoneNumber|| "");
  const [mobileValue, setMobileValue] = useState( userData.internationalMobileNumber|| "");
  const [alternateContactName, setAlternateContactName] = useState( userData.alternateContactName|| "");
  const [alternateTelephoneValue, setAlternateTelephoneValue] = useState(  userData.alternateTelephoneNumber|| "");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const updateUserFieldInUserData = (field, value) => {
    dispatch(updateUserData({ category: "user", data: { [field]: value } },));
  };
  const updateUserFieldInUserDataAddress = (field, value) => {
    dispatch(updateUserData({ category: "address", data: { [field]: value } },
));
  };
  const getHeaderTitle = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserJob",
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
    updateUserFieldInUserData("otherCountriesOfTaxResidence", otherCountriesOfTaxResidence);
    updateUserFieldInUserData("taxResidencyIdNumber", taxResidencyIDNumber);

    updateUserFieldInUserDataAddress("street", street);
    updateUserFieldInUserDataAddress("building", buildingHouse);
    updateUserFieldInUserDataAddress("floor", floor);
    updateUserFieldInUserDataAddress("apartment", apartment);
    updateUserFieldInUserDataAddress("houseTelephoneNumber", houseTelNo);
    updateUserFieldInUserDataAddress("internationalAddress", selectedCountry);
    updateUserFieldInUserDataAddress("intArea", area);
    updateUserFieldInUserDataAddress("intStreet", internationalStreet);
    updateUserFieldInUserDataAddress("intBuilding", internationalBuildingHouse);
    updateUserFieldInUserDataAddress("intFloor", internationalFloor);
    updateUserFieldInUserDataAddress("intApartment", internationalApartment);

    updateUserFieldInUserDataAddress("internationalHouseTelephoneNumber", value);
    updateUserFieldInUserDataAddress("internationalMobileNumber", mobileValue);
    updateUserFieldInUserDataAddress("alternateContactName", alternateContactName);
    updateUserFieldInUserDataAddress("alternateTelephoneNumber", alternateTelephoneValue);
  };

  const validateForm = () => {
    const errors = {};

    if (!street.trim()) {
      errors.street = "Street is required";
    }
    if (!buildingHouse.trim()) {
      errors.buildingHouse = "Building/House is required";
    }
    if (!floor.trim()) {
      errors.floor = "Floor is required";
    }
    if (!apartment.trim()) {
      errors.apartment = "Apartment is required";
    }

    if (!houseTelNo.trim()) {
      errors.houseTelNo = "House Tel No. is required";
    }

    console.log(selectedCountry);
    return errors;
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserIntroduce",
      })
    );
  };

  return (
    <div id="AddressInfo" className="container align-items-center p-3">
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
            <input type="text" value={otherCountriesOfTaxResidence} onChange={(e) => setOtherCountriesOfTaxResidence(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Other Countries of Tax Residence</label>
          </div>

          <div className="form-group">
            <input type="text" value={taxResidencyIDNumber} onChange={(e) => setTaxResidencyIDNumber(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Tax Residency ID Number</label>
          </div>

          <p className="mb-3">Address of Residence</p>
          <div className="form-group">
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Street</label>
          </div>
          {errors.street && <div className="text-danger error">{errors.street}</div>}
          <div className="form-group">
            <input type="text" value={buildingHouse} onChange={(e) => setBuildingHouse(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Building/House</label>
          </div>
          {errors.buildingHouse && <div className="text-danger error">{errors.buildingHouse}</div>}
          <div className="form-group">
            <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Floor</label>
          </div>
          {errors.floor && <div className="text-danger error">{errors.floor}</div>}
          <div className="form-group">
            <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Apartment</label>
          </div>
          {errors.apartment && <div className="text-danger error">{errors.apartment}</div>}
          <div className="form-group">
            <input type="tel" value={houseTelNo} onChange={(e) => setHouseTelNo(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">House Tel No.</label>
          </div>
          {errors.houseTelNo && <div className="text-danger error">{errors.houseTelNo}</div>}
          <p className="mb-3">Other International Address</p>
          <div className="form-group">
            <CountryDropdown value={selectedCountry} onChange={setSelectedCountry} className="form-select form-control mb-3" defaultOptionLabel="Country" />
          </div>
          <div className="form-group">
            <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Area</label>
          </div>
          <div className="form-group">
            <input type="text" value={internationalStreet} onChange={(e) => setInternationalStreet(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Street</label>
          </div>
          <div className="form-group">
            <input type="text" value={internationalBuildingHouse} onChange={(e) => setInternationalBuildingHouse(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Building/House</label>
          </div>
          <div className="form-group">
            <input type="text" value={internationalFloor} onChange={(e) => setInternationalFloor(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Floor</label>
          </div>
          <div className="form-group">
            <input type="text" value={internationalApartment} onChange={(e) => setInternationalApartment(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Apartment</label>
          </div>
          <div className="label-div"> <label className="floating-label label-tel" >House Tel No.</label>
          <PhoneInput
          className="mb-3"
          country={"lb"}

          value={value}
          defaultValue={value}
          onChange={(value, country) =>
            setValue( value)
          }
          disableSearchIcon={true}
          // enableAreaCodeStretch={true}
          prefix="+"
          inputStyle={{ width: "100%" , paddingLeft: "50px",height:"45px"}}
       
        />
     </div> 
        <div className="label-div"><label className="floating-label label-tel" >Mobile No.</label> 
          <PhoneInput
          className="mb-3"
          country={"lb"}

          value={mobileValue}
          defaultValue={mobileValue}
          onChange={(mobileValue, country) =>
            setMobileValue( mobileValue)
          }
          disableSearchIcon={true}
          // enableAreaCodeStretch={true}
          prefix="+"
          inputStyle={{ width: "100%" , paddingLeft: "50px",height:"45px"}}
       
        />
        </div> 
           
          <div className="form-group">
            <input type="text" value={alternateContactName} onChange={(e) => setAlternateContactName(e.target.value)} placeholder="" className="form-control mb-3" />
            <label className="floating-label">Alternate Telephone Name</label>
          </div>
          <div className="label-div">  <label className="floating-label label-tel" >Alternate Telephone No.</label>
          <PhoneInput
          className="mb-3"
          country={"lb"}

          value={alternateTelephoneValue}
          defaultValue={alternateTelephoneValue}
          onChange={(alternateTelephoneValue, country) =>
            setAlternateTelephoneValue( alternateTelephoneValue)
          }
          disableSearchIcon={true}
          // enableAreaCodeStretch={true}
          prefix="+"
          inputStyle={{ width: "100%" , paddingLeft: "50px",height:"45px"}}
          
       
        /></div>  
 
          <button type="submit" className="btn-proceed">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressInfo;
