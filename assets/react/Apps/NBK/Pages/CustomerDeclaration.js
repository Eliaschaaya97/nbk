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

const CustomerDeclaration = () => {
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
    console.log('successs inside the customer declaration')
    setTimeout(() => {
      if (parameters?.deviceType === "Android") {
        window.AndroidInterface.callbackHandler("GoToApp");
      } else if (parameters?.deviceType === "Iphone") {
        window.webkit.messageHandlers.callbackHandler.postMessage("GoToApp");
      }
    }, 3000);
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
            <p className="title-final">Customer Declaration:</p>
            <p className="paragh-final">
              I/We hereby confirm that the information provided herein is accurate, correct and complete and that the documents submitted along with this application form are genuine. I undertake to inform the National Bank of Kuwait (Lebanon) S.A.L. (“the Bank”) in writing of any changes to the
              information already provided and to update the information on this form whenever requested to do so by the Bank. I/We also hereby declare that, in the event of my/our being subject to any foreign tax laws requiring information to be shared by the Bank with the foreign government to
              whose tax laws I am/we are subject, or with its representatives, I/we explicitly agree to the Bank’s full compliance with such foreign government’s instructions and requests for information without the Bank’s need to notify me/us or to seek my/our additional consent. I understand and
              acknowledge that this declaration is with respect to all of the Bank’s products and account types (including corporate, joint, and/or individual accounts) and covers transactions, balances, supporting information, and any enquiries from the requesting government or its representatives.
              To facilitate the Bank’s compliance with the foreign tax laws to which I am/we are subject, I/We hereby undertake to provide the Bank with any documentation requested by the foreign government to whose tax laws I am/ we are subject, or to its representatives. I/We further agree to
              provide and/or update the above-referenced documents as and when required by the terms and conditions set by the foreign tax authority to which I am/we are subject, and whenever any changes occur to my/our tax situation. I/We hereby release the Bank from the stipulations of the
              Lebanese Bank Secrecy Law issued on 3 September 1956 and its amendments, in particular Article 2 thereof, for the purpose of complying with the US Foreign Account Tax Compliance Act known as FATCA and its amendments and the Tax Exchange Standard known as CRS-Common Reporting Standard
              and its amendments, and I/We hereby authorize the Bank to provide U.S. Internal Revenue Service “IRS” with the required information as per the provisions of FATCA and authorize the Bank to provide data to Ministry of Finance or any other tax authority related to CRS. The Client gives
              the Bank the right to provide the Bank’s Mother Bank (National Bank of Kuwait – Kuwait) or external branches or representative offices or affiliate companies or correspondent banks or service companies and insurance companies in contractual relationship with the Bank, with all the
              information that may be requested releasing the Bank from the stipulations of the Lebanese Banking Secrecy Law of 1956 and considering the Client’s signature as a written authorization according to article 2 of the Lebanese Banking Secrecy Law of 1956. I/We understand and agree that
              this declaration is final and irrevocable, and that it is not subject to cancellation or amendment.
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
        <p className='p-modal'>Your application was submitted successfully!</p>
        <button  className='button-modal'  onClick={() => {setModalIsOpen(false), handleButtonClick()}  }  type="submit"  >Done</button>
      </Modal>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeclaration;
