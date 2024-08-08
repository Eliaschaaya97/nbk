import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Main from "./Pages/Main";
import Logo from "./Component/LogoComponent";
import { settingData } from "./Redux/Slices/AppSlice";
import 'react-phone-number-input/style.css'
import UserInfo from "./Pages/UserInfo";
import UserIntroduce from "./Pages/UserIntroduce";
import AddressInfo from "./Pages/AddressInfo";
import UserJob from "./Pages/UserJob";
import BRODetails from "./Pages/BRODetails";
import PoliticalPosition from "./Pages/PoliticalPosition";
import UserInfoSalary from "./Pages/UserInfoSalary";
import UserAcountBank from "./Pages/UserAcountBank";
import CustomerDeclaration from "./Pages/CustomerDeclaration";
import IfNo from "./Pages/IfNo";
import IfYes from "./Pages/IfYes";
import VerifyYourId from "./Pages/VerifyYourId";


const App = ({parameters}) => {
    const headerData = useSelector((state) => state.appData.headerData);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(settingData({ field: "parameters", value: parameters }));
        dispatch(
          settingData({
            field: "headerData",
            value: {
              title: "NBK",
              backLink: "",
              currentPage: "",
            },
          })
        );
        
        
      }, []);

      useEffect(() => {
        dispatch(settingData({ field: "mobileResponse", value: "" }));
        const searchParams = new URLSearchParams(window.location.search);
        const idParam = searchParams.get("comp");
        if (idParam) {
          dispatch(
            settingObjectData({
              mainField: "headerData",
              field: "currentPage",
              value: idParam,
            })
          );
        }
        window.handleCheckout = (message) => {
          dispatch(settingData({ field: "mobileResponse", value: message }));
        };
      });
      useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, [headerData.currentPage]); 

      return (
        <div id="PageBody">
            <div className="container d-flex flex-column align-items-center p-3">
                <Logo />
            </div>
            
            {headerData.currentPage === "er" && <Main />}
            {headerData.currentPage === "IfNo" && <IfNo />}
            {headerData.currentPage === "IfYes" && <IfYes />}
            {headerData.currentPage === "UserInfo" && <UserInfo />}
            {headerData.currentPage === "UserIntroduce" && <UserIntroduce />}
            {headerData.currentPage === "AddressInfo" && <AddressInfo />}
            {headerData.currentPage === "UserJob" && <UserJob />}
            {headerData.currentPage === "BRODetails" && <BRODetails />}
            {headerData.currentPage === "PoliticalPosition" && <PoliticalPosition />}
            {headerData.currentPage === "UserInfoSalary" && <UserInfoSalary />}
            {headerData.currentPage === "UserAcountBank" && <UserAcountBank />}
            {headerData.currentPage === "CustomerDeclaration" && <CustomerDeclaration />}
            {headerData.currentPage === "" && <VerifyYourId/>}
        </div>
    );
    
}
export default App;
