import React, { useEffect, useState } from 'react';
import ProgressBar from '../Component/ProgressBar';
import { useDispatch,useSelector } from "react-redux";
import { settingObjectData,updateUserData} from '../Redux/Slices/AppSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ButtonModile from './ButtonMobile';

const UserJob = () => {
    const userDataUser = useSelector((state) => state.appData.userData.user || {});
    const userData = useSelector((state) => state.appData.userData.workDetails || {});

    const [profession, setProfession] = useState( userData.profession || '');
    const [publicSector, setPublicSector] = useState(userData.publicSector || '');
    const [progress, setProgress] = useState(25);
    const [jobTitle, setJobTitle] = useState(userData.jobTitle || '');
    const [grade, setGrade] = useState( userData.grade || '');
    const [activitySector, setActivitySector] = useState(userData.activitySector || '');
    const [entityName, setEntityName] = useState(userData.entityName || '');
    const [educationLevel, setEducationLevel] = useState(userData.educationLevel || '');
    const [workTelNo, setWorkTelNo] = useState(userData.workTelephoneNumber || '');
    const [spouseName, setSpouseName] = useState( userDataUser.spouseName|| '');
    const [workAddress, setWorkAddress] = useState(userData.workAddress || '');
    const [spouseProfession, setSpouseProfession] = useState(  userDataUser.spouseProfession||'');
    const [noOfChildren, setNoOfChildren] = useState( userDataUser.noOfChildren|| '');
    const [activeButton, setActiveButton] = useState( userData.placeOfWorkListed || "No");
    const [errors, setErrors] = useState({});
    const [next,setNext]=useState(false);

    const dispatch = useDispatch();
  const [status ,setStatus]=useState(   localStorage.getItem("status"));

    const updateUserFieldInUserData = (field, value) => {
      dispatch(
        updateUserData(
         
          { category: "workDetails", data: { [field]: value } }
        )
      );
    };
    const updateUserFieldInUserDataUser = (field, value) => {
        dispatch(
          updateUserData(
           
            { category: "user", data: { [field]: value } }
          )
        );
      };

  
    const getHeaderTitle = () => {    
        dispatch(
            settingObjectData({
                mainField: "headerData",
                field: "currentPage",
                value: "BRODetails",
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
            updateUserFieldInUserData("profession", profession);
            updateUserFieldInUserData("jobTitle", jobTitle);
            updateUserFieldInUserData("publicSector", publicSector);
            updateUserFieldInUserData("activitySector", activitySector);
            updateUserFieldInUserData("entityName", entityName);
            updateUserFieldInUserData("educationLevel", educationLevel);
            updateUserFieldInUserData("workAddress", workAddress);
            updateUserFieldInUserData("workTelephoneNumber", workTelNo);
            updateUserFieldInUserData("grade", grade);
            updateUserFieldInUserData("placeOfWorkListed", activeButton);

            updateUserFieldInUserDataUser("spouseName", spouseName);
            updateUserFieldInUserDataUser("spouseProfession", spouseProfession);
            updateUserFieldInUserDataUser("noOfChildren", noOfChildren);

    };

    const validateForm = () => {
        const errors = {};
        if (!profession.trim()) {
            errors.profession = "Profession is required";
        }
        if (!jobTitle.trim()) {
            errors.jobTitle = "Job Title is required";
        }

        if (!grade.trim() && activeButton === "Yes" && next ) {
            errors.grade = "Grade is required for Stock Exchange listed workplaces";
        
        if (!spouseName.trim()) {
            errors.spouseName = "Spouse Name is required";
        }
        if (!spouseProfession.trim()) {
            errors.spouseProfession = "Spouse Profession is required";
        }
        if (!noOfChildren.trim()) {
            errors.noOfChildren = "Number of Children is required";
                }}
      
        return errors;
    };
  

    const handleButtonClick = (event) => {
        event.preventDefault(); 
        setActiveButton(event.target.innerText);
        if (event.target.innerText === "No") {
            setNext(false);
            delete errors.grade;
            delete errors.spouseName;
            delete errors.spouseProfession;
            delete errors.noOfChildren;
        }
    };

    const getHeaderTitleBack = () => {
        dispatch(
            settingObjectData({
                mainField: "headerData",
                field: "currentPage",
                value: "AddressInfo",
            })
        );
    };

    return (
        <div id="UserJob" className="container align-items-center p-3">
            <button
                type="submit"
                className="btn-Back"
                onClick={() => {
                    getHeaderTitleBack();
                }}
            >
                <FontAwesomeIcon icon={faArrowLeft} size="2xl" /> 
            </button>
            <div className="intro d-flex flex-column">
                <ProgressBar progress={progress}/>
                <form className="form" onSubmit={handleNext}>
                <div className="form-group">
                        <input
                            type="text"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">Profession</label>
                   
                    </div>
                    {errors.profession && <div className="text-danger error">{errors.profession}</div>}
                
                    <div className="form-group">
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">Job Title</label>
                
                    </div>
                    {errors.jobTitle && <div className="text-danger error">{errors.jobTitle}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={publicSector}
                            onChange={(e) => setPublicSector(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                      
                        />
                        <label className="floating-label">Public Sector</label>
                 
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={activitySector}
                            onChange={(e) => setActivitySector(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">Activity Sector</label>
                    
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={entityName}
                            onChange={(e) => setEntityName(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                     
                        />
                        <label className="floating-label">Entity Name</label>
                 
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                     
                        />
                        <label className="floating-label">Education Level</label>
             
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={workAddress}
                            onChange={(e) => setWorkAddress(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                          
                        />
                        <label className="floating-label">Work Address</label>
             
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={workTelNo}
                            onChange={(e) => setWorkTelNo(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Work Tel No.</label>
                 
                    </div>
                    <div className="custom-control">
                        <label className="custom-control-label" htmlFor="customCheck1">
                            Is your place of work listed in Kuwait/Lebanon Stock Exchange?
                        </label>
                        <div className="buttons d-flex gap-3 "> 
                            <button className={`btn px-8 py-2 ${activeButton === "Yes" ? "active" : ""}`} onClick={handleButtonClick}>Yes</button>
                            <button className={`btn px-8 py-2 ${activeButton === "No" ? "active" : ""}`}  onClick={(e) => { handleButtonClick(e); setNext(false); }}>No</button>
                        </div>
                    </div>
                    {activeButton === "Yes" && (
                       <div> <div className="form-group">
                            <label className="custom-control-label" htmlFor="customCheck1">
                                If Yes, Grade
                            </label>
                            <input
                                type="text"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="??"
                                className="form-control mb-3"
                               
                            />
                        
                        </div>
                            {errors.grade && <div className="text-danger error">{errors.grade}</div>}
                            </div>
                    )}
                   {status=== "married" && <> <div className="form-group">
                        <input
                            type="text"
                            value={spouseName}
                            onChange={(e) => setSpouseName(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                          
                        />
                        <label className="floating-label">Spouse Name</label>
 
                    </div>
                    {errors.spouseName && <div className="text-danger error">{errors.spouseName}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={spouseProfession}
                            onChange={(e) => setSpouseProfession(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Spouse Profession</label>
            
                    </div>
                    {errors.spouseProfession && <div className="text-danger error">{errors.spouseProfession}</div>}
                    <div className="form-group">
                        <input
                              type="number"
                            value={noOfChildren}
                            onChange={(e) => setNoOfChildren(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">No. of Children</label>
                    
                    </div>
                    {errors.noOfChildren && <div className="text-danger error">{errors.noOfChildren}</div>} </>}
                    {status=== "widow" && <> <div className="form-group">
                        <input
                            type="text"
                            value={spouseName}
                            onChange={(e) => setSpouseName(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                          
                        />
                        <label className="floating-label">Spouse Name</label>
 
                    </div>
                    {errors.spouseName && <div className="text-danger error">{errors.spouseName}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={spouseProfession}
                            onChange={(e) => setSpouseProfession(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                       
                        />
                        <label className="floating-label">Spouse Profession</label>
            
                    </div>
                    {errors.spouseProfession && <div className="text-danger error">{errors.spouseProfession}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            value={noOfChildren}
                            onChange={(e) => setNoOfChildren(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">No. of Children</label>
                    
                    </div>
                    {errors.noOfChildren && <div className="text-danger error">{errors.noOfChildren}</div>} </>}
                    {status === "divorced" &&  <><div className="form-group">
                        <input
                            type="text"
                            value={noOfChildren}
                            onChange={(e) => setNoOfChildren(e.target.value)}
                            placeholder=""
                            className="form-control mb-3"
                         
                        />
                        <label className="floating-label">No. of Children</label>
                    
                    </div>
                    {errors.noOfChildren && <div className="text-danger error">{errors.noOfChildren}</div>} </> }
                    {/* <button type="submit" className="btn-proceed" onClick={() => setNext(true)}>
                        Next
                    </button> */}
                          <ButtonModile buttonName={"Next"}/>

                </form>
            </div>
            
        </div>
    );
};

export default UserJob;
