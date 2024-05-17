import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { settingObjectData } from '../Redux/Slices/AppSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const IfNo = () => {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState(false); 

    const getHeaderTitle = () => {    
        dispatch(
          settingObjectData({
            mainField: "headerData",
            field: "currentPage",
            value: "UserInfo",
          })
          
        );
    }

    const handleCheckboxChange = (e) => {
        setChecked(e.target.checked);
        setError(false); 
    }

    const handleSubmit = (e) => {
        
        e.preventDefault();
        if (!checked) {
            setError(true); 
            return; 
        }
    
        getHeaderTitle();
    }
    const getHeaderTitleBack = () => {
        dispatch(
            settingObjectData({
                mainField: "headerData",
                field: "currentPage",
                value: "UserAountBank",
            })
        );
    };
    
    return (
        <div id="IfNo" className="container d-flex flex-column align-items-center p-3">
            <button
    type="submit" 
    className="btn-Back"
    onClick={() => {
        getHeaderTitleBack();
    }}
>
    <FontAwesomeIcon icon={faArrowLeft} size="2xl" /> 
</button>

            <div className="intro d-flex flex-column align-items-center container-fluid">
                <p className="mb-3">
                    What you need to open a New Fresh Relationship
                </p>
                <form className="form mb-3" onSubmit={handleSubmit}>  
                    <ul>
                        <li><strong>Nationality: Lebanese, Kuwaiti or GCC</strong></li>
                        <li><strong>Age: 18+</strong></li>
                        <li><strong>Minimum Initial Deposit to open the account: $5,000 cash or transfer</strong></li>
                        <li><strong>Minimum Wealth: $100,000 or salary =&gt; $3,000</strong></li>
                        <li><strong>Documents required:
                            <ul>
                                <li>National ID or Passport</li>
                                <li>Statement of account for the last 3 months 
                                    or Employer Letter Reference for employees</li>
                            </ul>
                            </strong>
                        </li>
                    </ul>
                    <div className="terms custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" checked={checked} onChange={handleCheckboxChange} />
                        <label className="custom-control-label" htmlFor="customCheck1">
                            I have read and fully understood the requirements to open a New Fresh Relationship; I agree to be bound by the said requirements; and I acknowledge that the requirements may be amended from time to time by the Bank as stated herein.
                        </label>
                 
                    </div>
                    {error && <p className="text-danger error m-0">Please agree to the terms</p>}
                    <button className="btn-proceed">
                        Proceed
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IfNo;
