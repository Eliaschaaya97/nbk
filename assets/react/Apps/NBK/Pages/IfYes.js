import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { settingObjectData, updateUserData } from '../Redux/Slices/AppSlice';
import AppAPI from '../Api/AppApi';
import ProgressBar from '../Component/ProgressBar';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';


const IfYes = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  const { SendExistingUser ,fetUsers} = AppAPI();
  const parameters = useSelector((state) => state.appData.parameters);

  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenNum, setModalIsOpenNum] = useState(false);
  const [branchId, setBranchId] = useState(null);
  

  const handleButtonClick = () => {
      if (parameters?.deviceType === "Android") {
        window.AndroidInterface.callbackHandler("GoToApp");
      } else if (parameters?.deviceType === "Iphone") {
        window.webkit.messageHandlers.callbackHandler.postMessage("GoToApp");
      }

    if (isBottomSlider) {
      dispatch(settingData({ field: "bottomSlider", value: { isShow: false } }));
    } else if (isModalData) {
      dispatch(settingData({ field: "modalData", value: { isShow: false } }));
    } else {
      dispatch(settingObjectData({ mainField: "headerData", field: "currentPage", value: headerData.backLink }));
    }
  };

  


  useEffect(() => {
    switch (branch) {
      case 'sanayeh':
        setBranchId(1);
        break;
      case 'bhamdoun':
        setBranchId(2);
        break;
      case 'privatebank':
        setBranchId(3);
        break;
      default:
        setBranchId(null);
    }
  }, [branch]);
  
  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } 
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    if (!branch) {
      errors.branch = 'Branch/Unit selection is required';
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

  const handleFormSubmit = (e) => {
    
    e.preventDefault();
    

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
   

      setProgress(progress + 20);
      if (progress >= 100) {
        setProgress(100);
      }

    fetUsers(phoneNumber);
    const statusCode = localStorage.getItem('statusCode');
    if (statusCode === '1') {
      setModalIsOpenNum(true);
 
        setTimeout(() => {
          if (parameters?.deviceType === "Android") {
            window.AndroidInterface.callbackHandler("GoToApp");
          } else if (parameters?.deviceType === "Iphone") {
            window.webkit.messageHandlers.callbackHandler.postMessage("GoToApp");
          }
        }, 2000);
   
    } else {
      setModalIsOpen(true);
      SendExistingUser({
        fullName,
        mobileNumb: phoneNumber,
        email,
        branchUnit: branch,
        branchId:branchId,
      });
      setTimeout(() => {
        if (parameters?.deviceType === "Android") {
          window.AndroidInterface.callbackHandler("GoToApp");
        } else if (parameters?.deviceType === "Iphone") {
          window.webkit.messageHandlers.callbackHandler.postMessage("GoToApp");
        }
      }, 3000);
  
    }
  
    } else {
      setErrors(validationErrors);
    }
  };

  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: 'headerData',
        field: 'currentPage',
        value: '',
      })
    );
  };

  return (
    <div id="IfYes" className="container d-flex flex-column align-items-center p-3">
      <button type="button" className="btn-Back" onClick={getHeaderTitleBack}>
        <FontAwesomeIcon icon={faArrowLeft} size="2xl" />
      </button>
      


      <div className="intro d-flex flex-column align-items-center">
        <p className="mb-3">
          Please refer to your branch. We will contact you within 3 working days.
        </p>
        <form className="form" onSubmit={handleFormSubmit}>
          

          <div className="form-group">
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder=""
              className="form-control mb-3"
            />
            <label className="floating-label">Full Name</label>
          </div>
          {errors.fullName && <div className="error text-danger">{errors.fullName}</div>}
          <div className="label-div"><label className=" label-tel" >Mobile No.</label></div>
          <PhoneInput
            className="mb-3"
            country="lb"
            value={phoneNumber}
            onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
            disableSearchIcon={true}
            prefix="+"
            inputStyle={{ width: '100%', paddingLeft: '50px', height: '45px' }}
          />
        
          {errors.phoneNumber && <div className="error text-danger">{errors.phoneNumber}</div>}
      
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
          {errors.email && <div className="error text-danger">{errors.email}</div>}
          
          <select
            value={branch}
            onChange={handleBranchChange}
            className="form-select form-control mb-3"
          >
            <option value="">Branch/Unit</option>
            <option value="sanayeh">Sanayeh</option>
            <option value="bhamdoun">Bhamdoun</option>
            <option value="privatebank">Private Bank</option>
          </select>
          {errors.branch && <div className="error text-danger error-status">{errors.branch}</div>}
          
          <button type="submit" className="btn-proceed submit-btn" >
            Proceed
          </button>
          <Modal
       id='modal'
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Example Modal"
      >
        <p className='p-modal'>Thank you for choosing NBK Lebanon. <br/> We will contact you within 5-7 days. </p>
        <button  className='button-modal'  onClick={() => {setModalIsOpen(false) ,handleButtonClick() }  }  type="submit"  >Done</button>
      </Modal>
      <Modal
       id='modalNum'
        isOpen={modalIsOpenNum}
        onRequestClose={() => setModalIsOpenNum(false)}
        contentLabel="Example Modal"
      >
        <p className='p-modal'>Phone number already exist !</p>
      
      </Modal>
        </form>
      </div>
    </div>
  );
};

export default IfYes;