import React  from "react";
import { useDispatch } from "react-redux";
import useAxiosClient from "../Utils/axios";
import { settingData, settingObjectData } from "../Redux/Slices/AppSlice";

const AppAPI = () => {
  const dispatch = useDispatch();
  const axiosClient = useAxiosClient();

  

  const SendInformation = (formData) => {
    dispatch(settingData({ field: "isloading", value: true }));

    try {
      return axiosClient.post(`/submit-data`, formData).then((response) => {
        if (response?.data?.isSuccess) {
          
            const parsedDate = response?.data;
            // console.log("parsed data :", parsedDate)
        }
        dispatch(settingData({ field: "isloading", value: false }));
      });
    } catch (e) {
    //   dispatch(settingData({ field: "isloading", value: false }));
      console.log(e);
    }
  };

  const SendExistingUser = (formData) => {
    dispatch(settingData({ field: "isloading", value: true }));
    
    try {
      return axiosClient.post(`/submit-existing-user`, formData).then((response) => {
        if (response?.data?.isSuccess) {
          
            const parsedDate = response?.data;
            // console.log("parsed data :", parsedDate)
        }
        dispatch(settingData({ field: "isloading", value: false }));
      });
    } catch (e) {
    //   dispatch(settingData({ field: "isloading", value: false }));
      console.log(e);
    }
  };

  const fetUsers = (phoneNumber) => {
    
    try {
        return axiosClient
            .get(`/user/checkMobile/${phoneNumber}`)
            .then((response) => {
             localStorage.setItem("statusCode",response?.data?.statusCode);
               return response?.data?.statusCode

            }
          )
                     
    } catch (e) {
        console.log(e);
    }
};

  return {
     SendExistingUser,
    SendInformation,
    fetUsers,

  };
};

export default AppAPI;