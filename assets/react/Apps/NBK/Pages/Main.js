import React, {useState, useEffect } from "react";
import {useSelector} from "react-redux";
import IfYes from "../Pages/IfYes";
import IfNo from "../Pages/IfNo";
import { useDispatch } from "react-redux";
import { settingObjectData } from '../Redux/Slices/AppSlice';


const Main = () => { 
    const [activeButton, setActiveButton] = useState("");
    const dispatch = useDispatch();

    const handleButtonClick = (event) => {
        const buttonValue = event.target.innerText;

        dispatch(
            settingObjectData({
                mainField: "headerData",
                field: "currentPage",
                value: buttonValue === "No" ? "IfNo" : "IfYes"
            })
        );
        setActiveButton(buttonValue);
    };


    const {flag} = useSelector((state) => state.appData);


    if (activeButton === "Yes") {
        return <IfYes setActiveButton={setActiveButton}/>;
    }

    if (activeButton === "No") {
        return <IfNo setActiveButton={setActiveButton}/>;
    }


    return (
        <div id="Main" className="d-flex flex-column align-items-center justify-content-center">
        <div className="container d-flex flex-column align-items-center p-3">
            <div className="container">
                    <div className="intro d-flex flex-column"> 
                        <p className="mb-3">
                            Do you have an existing relationship with NBK Lebanon?
                        </p>
                        <div className="buttons d-flex gap-3 "> 
                            <button className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`} onClick={handleButtonClick}>Yes</button>
                            <button className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`} onClick={handleButtonClick}>No</button>
                        </div>
                     
                </div>
            </div>
        </div>
    </div>
);
}



export default Main;