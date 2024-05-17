import React, { useState } from 'react';
import ProgressBar from '../Component/ProgressBar';
import { CountryDropdown } from 'react-country-region-selector';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useDispatch } from "react-redux";
import { settingObjectData } from '../Redux/Slices/AppSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddressInfo = () => {
    const [otherCountriesOfTaxResidence, setOtherCountriesOfTaxResidence] = useState('');
    const [street, setStreet] = useState('');
    const [progress, setProgress] = useState(17);
    const [taxResidencyIDNumber, setTaxResidencyIDNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [buildingHouse, setBuildingHouse] = useState('');
    const [floor, setFloor] = useState('');
    const [apartment, setApartment] = useState('');
    const [area, setArea] = useState('');
    const [internationalStreet, setInternationalStreet] = useState('');
    const [houseTelNo, setHouseTelNo] = useState('');
    const [internationalBuildingHouse, setInternationalBuildingHouse] = useState('');
    const [internationalFloor, setInternationalFloor] = useState('');
    const [internationalApartment, setInternationalApartment] = useState('');
    const [value, setValue] = useState('');
    const [mobileValue, setMobileValue] = useState('');
    const [alternateContactName, setAlternateContactName] = useState('');
    const [alternateTelephoneValue, setAlternateTelephoneValue] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const getHeaderTitle = () => {    
      dispatch(
        settingObjectData({
          mainField: "headerData",
          field: "currentPage",
          value: "UserJob",
        })
      );
    }

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
                        <input
                            type="text"
                            value={otherCountriesOfTaxResidence}
                            onChange={(e) => setOtherCountriesOfTaxResidence(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                            
                        />
                        <label className="floating-label">Other Countries of Tax Residence</label>
        
                    </div>
              
                    <div className="form-group">
                        <input
                            type="text"
                            value={taxResidencyIDNumber}
                            onChange={(e) => setTaxResidencyIDNumber(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Tax Residency ID Number</label>
                   
                    </div>
              
                    <p className="mb-3">
                        Address in Lebanon
                    </p>
                    <div className="form-group">
                        <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Street</label>
                    
                    </div>
                    {errors.street && <div className="text-danger error">{errors.street}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={buildingHouse}
                            onChange={(e) => setBuildingHouse(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">Building/House</label>
                  
                    </div>
                    {errors.buildingHouse && <div className="text-danger error">{errors.buildingHouse}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Floor</label>
               
                    </div>
                    {errors.floor && <div className="text-danger error">{errors.floor}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Apartment</label>
              
                    </div>
                    {errors.apartment && <div className="text-danger error">{errors.apartment}</div>}
                    <div className="form-group">
                        <input
                            type="tel"
                            value={houseTelNo}
                            onChange={(e) => setHouseTelNo(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">House Tel No.</label>
                
                    </div>
                    {errors.houseTelNo && <div className="text-danger error">{errors.houseTelNo}</div>}
                    <p className="mb-3">
                        Other International Address
                    </p>
                    <div className="form-group">
                        <CountryDropdown
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            className="form-select form-control mb-3"
                            defaultOptionLabel="Country"
                         
                        />
                       
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">Area</label>
                  
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={internationalStreet}
                            onChange={(e) => setInternationalStreet(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                        
                        />
                        <label className="floating-label">Street</label>
                    
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={internationalBuildingHouse}
                            onChange={(e) => setInternationalBuildingHouse(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                            
                        />
                        <label className="floating-label">Building/House</label>
                
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={internationalFloor}
                            onChange={(e) => setInternationalFloor(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                     
                        />
                        <label className="floating-label">Floor</label>
                 
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={internationalApartment}
                            onChange={(e) => setInternationalApartment(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Apartment</label>
                      
                    </div>
                    <PhoneInput
                        placeholder="House Tel No."
                        value={value}
                        className="form-control mb-3"
                        onChange={setValue}
                        defaultCountry='LB'
                    />
               
                    <PhoneInput
                        placeholder="Mobile No."
                        value={mobileValue}
                        className="form-control mb-3"
                        onChange={setMobileValue}
                        defaultCountry='LB'
                    />
                   
                    <div className="form-group">
                        <input
                            type="text"
                            value={alternateContactName}
                            onChange={(e) => setAlternateContactName(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                          
                        />
                        <label className="floating-label">Alternate Contact Name</label>
                    
                    </div>
                    <PhoneInput
                        placeholder="Alternate Telephone No."
                        value={alternateTelephoneValue}
                        className="form-control mb-3"
                        onChange={setAlternateTelephoneValue}
                        defaultCountry='LB'
                    />
                 
                    <button type="submit" className="btn-proceed">
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddressInfo;
