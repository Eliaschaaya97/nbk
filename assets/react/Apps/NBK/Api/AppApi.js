import React from "react";
import { useDispatch } from "react-redux";
import useAxiosClient from "../Utils/axios";
import { settingData, settingObjectData } from "../Redux/Slices/AppSlice";

const AppAPI = () => {
  const dispatch = useDispatch();
  const axiosClient = useAxiosClient();

  const IssueInfo = () => {
    dispatch(settingData({ field: "isloading", value: true }));
    try {
      return axiosClient.get(`/issue-info`).then((response) => {
        dispatch(settingData({ field: "isloading", value: false }));
        if (response?.data?.isSuccess) {
          const parsedData = JSON.parse(response?.data?.message);

          dispatch(
            settingData({
              field: "headerData",
              value: {
                title: "Travel Insurance",
                backLink: "",
                currentPage: "IssueInfo",
              },
            })
          );
          dispatch(settingData({ field: "products", value: parsedData }));
        }
      });
    } catch (e) {
      dispatch(settingData({ field: "isloading", value: false }));
      console.log(e);
    }
  };



  const SendInformation = (formData) => {
    // dispatch(settingData({ field: "isloading", value: true }));

    try {
      return axiosClient.post(`/submit-data`, formData).then((response) => {
        if (response?.data?.isSuccess) {
          
            const parsedDate = response?.data;
            console.log("parsed data :", parsedDate)
        }
        // dispatch(settingData({ field: "isloading", value: false }));
      });
    } catch (e) {
    //   dispatch(settingData({ field: "isloading", value: false }));
      console.log(e);
    }
  };

  return {
    // IssueInfo,
    SendInformation,
  };
};

export default AppAPI;