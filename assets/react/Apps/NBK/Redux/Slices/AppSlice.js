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
  // userData: {
  //   user: {
  //     fullName: "",
  //     mobileNumb: "",
  //     email: "",
  //     branchUnit: "",
  //     branchId:"",
  //     mothersName: "",
  //     gender: "",
  //     dob: "",
  //     placeOfBirth: "",
  //     countryOfOrigin: "",
  //     nationalId: "",
  //     expirationDateNationalId: "",
  //     registerPlaceAndNo: "",
  //     maritalStatus: "",
  //     passportNumber: "",
  //     placeOfIssuePassport: "",
  //     expirationDatePassport: "",
  //     otherNationalities: [],
  //     statusInLebanon: "",
  //     otherCountriesOfTaxResidence: "",
  //     taxResidencyIdNumber: "",
  //     spouseName: "",
  //     spouseProfession: "",
  //     noOfChildren: ""
  //   },
  //   address: {
  //     street: "",
  //     building: "",
  //     floor: "",
  //     apartment: "",
  //     houseTelephoneNumber: "",
  //     internationalAddress: "",
  //     internationalHouseTelephoneNumber: "",
  //     internationalMobileNumber: "",
  //     alternateContactName: "",
  //     alternateTelephoneNumber: "",
  //     intArea:"",
  //     intStreet:"",
  //     intBuilding:"",
  //     intFloor:"",
  //     intApartment:""
  //   },
  //   workDetails: {
  //     profession: "",
  //     jobTitle: "",
  //     publicSector: "",
  //     activitySector: "",
  //     entityName: "",
  //     educationLevel: "",
  //     workAddress: "",
  //     workTelephoneNumber: "",
  //     placeOfWorkListed: "",
  //     grade: ""
  //   },
  //   beneficiaryRightsOwner: {
  //     customerSameAsBeneficiary: "",
  //     broNationality: "",
  //     beneficiaryName: "",
  //     relationship: "",
  //     broCivilIdNumber: "",
  //     expirationDate: "",
  //     reasonOfBro: "",
  //     address: "",
  //     profession: "",
  //     incomeWealthDetails: ""
  //   },
  //   politicalPositionDetails: {
  //     politicalPosition: "",
  //     currentOrPrevious: "",
  //     yearOfRetirement : "",
  //     pepName: "",
  //     relationship: "",
  //     pepPosition: "",
  //     additionalInfo: "",
  //   },
  //   financialDetails: {
  //     sourceOfFunds: "",
  //     currency: "",
  //     monthlyBasicSalary: "",
  //     monthlyAllowances: "",
  //     additionalIncomeSources: "",
  //     othersSourceOfFound:"",
  //     totalEstimatedMonthlyIncome: "",
  //     estimatedWealthAmount : "",
  //     isWealthInherited: "",
  //     sourcesOfWealth: "",
  //     incomeCategory:"",
  //     expectedNumberOfTransactions: "",
  //     expectedValueOfTransactions: "",
  //     frequency: "",
  //     hasOtherAccounts: "",
  //     bankName: "",
  //     country: "",
  //     accountBalance: "",
  //     bankName2: "",
  //     country2: "",
  //     accountBalance2: "",
  //     bankName3: "",
  //     country3: "",
  //     accountBalance3: "",
  //     natureOfRelation: "",
  //     purposeOfRelation: "",
  //     selectIDType: "",
  //     frontImageID: null,
  //     backImageID: null,
  //     realEstateTitle:null,
  //     accountStatement:null,
  //     otherDocument:null,
  //     employerLetter:null,
  //   },
  // },
  userData: {
    user: {
      fullName: 'ertretret',
      mobileNumb: '9614344444',
      email: 'ee@gamil.com',
      branchUnit: 'bhamdoun',
      branchId: 2,
      mothersName: 'ewrwerewr',
      gender: 'female',
      dob: '2024-08-14',
      placeOfBirth: 'ewrwer',
      countryOfOrigin: 'Kuwait',
      nationalId: 'werewr',
      expirationDateNationalId: '2024-09-11',
      registerPlaceAndNo: 'Al Aḩmadi',
      maritalStatus: 'married',
      passportNumber: 'ewrewr',
      placeOfIssuePassport: 'werewr',
      expirationDatePassport: '2024-09-19',
      otherNationalities: [
        'Albania'
      ],
      statusInLebanon: 'resident',
      otherCountriesOfTaxResidence: 'Lebanon',
      taxResidencyIdNumber: 'ewrewr',
      spouseName: 'regreg',
      spouseProfession: 'rgreg',
      noOfChildren: '8'
    },
    address: {
      street: '',
      building: '',
      floor: '',
      apartment: '',
      houseTelephoneNumber: '',
      internationalAddress: '',
      internationalHouseTelephoneNumber: '',
      internationalMobileNumber: '',
      alternateContactName: 'ewrewr',
      alternateTelephoneNumber: '9613333333',
      intArea: '',
      intStreet: '',
      intBuilding: '',
      intFloor: '',
      intApartment: ''
    },
    workDetails: {
      profession: 'rrrgerg',
      jobTitle: 'regregreg',
      publicSector: 'yes',
      activitySector: 'regerg',
      entityName: 'regr',
      educationLevel: 'egrg',
      workAddress: 'regerg',
      workTelephoneNumber: '9614444444',
      placeOfWorkListed: 'No',
      grade: 'regerger'
    },
    beneficiaryRightsOwner: {
      customerSameAsBeneficiary: 'Yes',
      broNationality: '',
      beneficiaryName: '',
      relationship: '',
      broCivilIdNumber: '',
      expirationDate: '',
      reasonOfBro: '',
      address: '',
      profession: '',
      incomeWealthDetails: ''
    },
    politicalPositionDetails: {
      politicalPosition: 'No',
      currentOrPrevious: '',
      yearOfRetirement: '',
      pepName: '',
      relationship: '',
      pepPosition: '',
      additionalInfo: ''
    },
    financialDetails: {
      sourceOfFunds: 'ererer',
      currency: 'AFN',
      monthlyBasicSalary: '111',
      monthlyAllowances: '111',
      additionalIncomeSources: [
        'none'
      ],
      othersSourceOfFound: '',
      totalEstimatedMonthlyIncome: '11',
      estimatedWealthAmount: '111',
      isWealthInherited: 'Yes',
      sourcesOfWealth: '',
      incomeCategory: 'micro',
      expectedNumberOfTransactions: '123213',
      expectedValueOfTransactions: '213213',
      frequency: 'monthlyy',
      hasOtherAccounts: 'No',
      bankName: '',
      country: '',
      accountBalance: '',
      bankName2: '',
      country2: '',
      accountBalance2: '',
      bankName3: '',
      country3: '',
      accountBalance3: '',
      natureOfRelation: '',
      purposeOfRelation: '',
      selectIDType: 'nationalID',
      frontImageID: '157145.jpg',
      backImageID: '157145.jpg',
      realEstateTitle: '157145.jpg',
      accountStatement: '157145.jpg',
      otherDocument: '157145.jpg',
      employerLetter: '157145.jpg',
      additionalDocuments: [
        'AccountStatement',
        'EmployerLetter',
        'RealEstateTitle',
        'other'
      ]
    }
  }
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
