import React, { useState, useMemo } from "react";
import ProgressBar from "../Component/ProgressBar";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { settingObjectData } from "../Redux/Slices/AppSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import AppAPI from "../Api/AppApi";

const Disclaimer = () => {
  const [progress, setProgress] = useState(98);
  const {SendInformation} = AppAPI();
  const formData = useSelector((state) => state.appData.userData);
  const parameters = useSelector((state) => state.appData.parameters);


  const dispatch = useDispatch();
  const getHeaderTitleBack = () => {
    dispatch(
      settingObjectData({
        mainField: "headerData",
        field: "currentPage",
        value: "UserAcountBank",
      })
    );
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
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

  const handleSubmitInformation = () => {
    SendInformation(formData);
  }

  return (
    <div id="CustomerDeclaration" className="container align-items-center p-3">
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
        <div className="container-fluid">
        <form className="form " >
          <div>
            <p className="title-final">Disclaimer:</p>
            <p className="paragh-final">
            At NBKL, we are committed to protecting and safeguarding your personal data and to provide you with easily accessible services. 
            Please note that we will process your Personal Data for one or more of the following reasons/purposes mostly connected with the exercise of our business and services activities and/or NBKL’s relation with the Data Subject,
             or in the public interests, such as: For the purposes of the contractual relationship with you or a third party or contractual relation between you and a third party or to be able to fulfil and apply the requirements and the rights and obligations under that contract. 
             For the purposes of compliance with a legal obligation. For the purposes of safeguarding our legitimate/vital interests or those of a third party or the legitimate/vital interests of Data Subject.   
             We may share or disclose your Personal Data in connection with the purposes described in this policy. This may include sharing your Personal Data with the following: Our Mother Company and related entities for marketing, business,
              administrative and legal purposes (for example, payment, verification); Service providers, business partners, suppliers, subcontractors or agents (for example IT service providers, customer relationship management, business development and marketing support services) 
              who perform functions such as IT, marketing, payment, fulfilment and delivery of orders as well as administration and processing of payments. We may share personal information with third-party providers to facilitate certain payment services through our mobile application. 
              We will mandate these third-party providers to uphold security measures and adhere to this policy when handling your Personal Data; Professional advisers including lawyers, bankers, auditors and insurers who provide consultancy, banking, legal, insurance and accounting 
              services; Government, regulatory or other law enforcement agencies, in connection with the investigation of unlawful activities or for other reasons; Third parties, who acquire us or substantially our assets, in which case your Data (including any Sensitive Data) 
              will be one of the transferred assets   
            By agreeing to the present policy, you hereby release National Bank of Kuwait (Lebanon) S.A.L. from the obligations of the Lebanese banking Secrecy Law in relation to its terms and conditions enumerated above.
            </p>
          </div>

          <button
            type="button"
            className="btn-proceed"
            onClick={() => {
             setModalIsOpen(true),
             handleSubmitInformation()
            }}
          >
            Submit
          </button>
          
      <Modal
       id='modal'
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Example Modal"
      >
        <p className='p-modal'>Thank you for choosing NBK Lebanon. <br/> We will contact you within 3-5 days. </p>
        <button  className='button-modal'  onClick={() => {setModalIsOpen(false), handleButtonClick()}  }  type="submit"  >Done</button>
      </Modal>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
