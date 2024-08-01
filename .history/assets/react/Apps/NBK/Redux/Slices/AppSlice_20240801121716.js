import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parameters: null,
  mobileResponse: "",
  flag: null,
  headerData: {
    title: "NBK",
    backLink: "",
    currentPage: "",
  },
  userData: {
    user: {
      fullName: "",
      mobileNumb: "",
      email: "",
      branchUnit: "",
      branchId:"",
      mothersName: "",
      gender: "",
      dob: "",
      placeOfBirth: "",
      countryOfOrigin: "",
      nationalId: "",
      expirationDateNationalId: "",
      registerPlaceAndNo: "",
      maritalStatus: "",
      passportNumber: "",
      placeOfIssuePassport: "",
      expirationDatePassport: "",
      otherNationalities: [],
      statusInLebanon: "",
      otherCountriesOfTaxResidence: "",
      taxResidencyIdNumber: "",
      spouseName: "",
      spouseProfession: "",
      noOfChildren: ""
    },
    address: {
      street: "",
      building: "",
      floor: "",
      apartment: "",
      houseTelephoneNumber: "",
      internationalAddress: "",
      internationalHouseTelephoneNumber: "",
      internationalMobileNumber: "",
      alternateContactName: "",
      alternateTelephoneNumber: "",
      intArea:"",
      intStreet:"",
      intBuilding:"",
      intFloor:"",
      intApartment:""
    },
    workDetails: {
      profession: "",
      jobTitle: "",
      publicSector: "",
      activitySector: "",
      entityName: "",
      educationLevel: "",
      workAddress: "",
      workTelephoneNumber: "",
      placeOfWorkListed: "",
      grade: ""
    },
    beneficiaryRightsOwner: {
      customerSameAsBeneficiary: "",
      broNationality: "",
      beneficiaryName: "",
      relationship: "",
      broCivilIdNumber: "",
      expirationDate: "",
      reasonOfBro: "",
      address: "",
      profession: "",
      incomeWealthDetails: ""
    },
    politicalPositionDetails: {
      politicalPosition: "",
      currentOrPrevious: "",
      yearOfRetirement : "",
      pepName: "",
      relationship: "",
      pepPosition: "",
      additionalInfo: ""
      currentPrevious
    },
    financialDetails: {
      sourceOfFunds: "",
      currency: "",
      monthlyBasicSalary: "",
      monthlyAllowances: "",
      additionalIncomeSources: "",
      othersSourceOfFound:"",
      totalEstimatedMonthlyIncome: "",
      estimatedWealthAmount : "",
      isWealthInherited: "",
      sourcesOfWealth: "",
      incomeCategory:"",
      expectedNumberOfTransactions: "",
      expectedValueOfTransactions: "",
      frequency: "",
      hasOtherAccounts: "",
      bankName: "",
      country: "",
      accountBalance: "",
      bankName2: "",
      country2: "",
      accountBalance2: "",
      bankName3: "",
      country3: "",
      accountBalance3: "",
      natureOfRelation: "",
      purposeOfRelation: ""
    }
  },
};

const AppSlice = createSlice({
  name: "appPage",
  initialState,
  reducers: {
    settingData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    settingObjectData: (state, action) => {
      const { mainField, field, value } = action.payload;
      state[mainField][field] = value;
    },

    setFlage: (state, action) => {
          state.flag = action.payload;
    },
    updateUserData: (state, action) => {
      const { category, data } = action.payload;
      state.userData[category] = { ...state.userData[category], ...data };
    },

    resetData: (state) => {
      state.mobileResponse = "";
      state.headerData = { title: "NBK", backLink: "", curretPage: ""};
      state.flag = null;
      state.userData = {
        user: {},
        address: {},
        workDetails: {},
        beneficiaryRightsOwner: {},
        politicalPositionDetails: {},
        financialDetails: {},
      };
    },
  },
});

export const { settingData, settingObjectData, setFlage, resetData,updateUserData  } = AppSlice.actions;

export default AppSlice.reducer;
