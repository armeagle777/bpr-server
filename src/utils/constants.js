const defaultDocument = [
  {
    Photo_ID: "",
    Document_Status: "PRIMARY_VALID",
    Document_Type: "",
    Document_Number: "",
    Other_DocumentType: null,
    Document_Department: "",
    BasicDocument: {
      Basic_Document_Code: "",
      Basic_Document_Name: "",
      Basic_Document_Number: "",
      Basic_Document_Country: {
        CountryName: "",
        CountryCode: "",
        CountryShortName: "",
      },
    },
    Person: {
      Nationality: {
        NationalityName: "",
        NationalityCode: "",
      },
      Citizenship: {
        Citizenship: [
          {
            CountryName: "",
            CountryCode: "",
            CountryShortName: "",
          },
        ],
      },
      Last_Name: "",
      First_Name: "",
      Patronymic_Name: "",
      Birth_Date: "",
      Genus: "",
      English_Last_Name: "",
      English_First_Name: "",
      English_Patronymic_Name: "",
      Birth_Country: {
        CountryName: "",
        CountryCode: "",
        CountryShortName: "",
      },
      Birth_Region: "",
      Birth_Community: "",
      Birth_Residence: null,
      Birth_Address: null,
    },
    PresidentOrder: null,
    PassportData: {
      Passport_Type: "",
      Passport_Issuance_Date: "",
      Passport_Validity_Date: "",
      Passport_Validity_Date_FC: "",
      Passport_Extension_Date: null,
      Passport_Extension_Department: null,
      Related_Document_Number: null,
      Related_Document_Date: null,
      Related_Document_Department: null,
    },
  },
];

const defaultAddress = [
  {
    RegistrationAddress: {
      Postal_Index: null,
      Foreign_Country: {
        CountryName: "",
        CountryCode: "",
        CountryShortName: "",
      },
      Foreign_Region: "",
      Foreign_Community: "",
      Foreign_Address: null,
    },
    ResidenceDocument: null,
    RegistrationData: {
      Registration_Department: "",
      Registration_Date: "",
      Registration_Type: "",
      Registration_Status: "",
      Temporary_Registration_Date: null,
      Registration_Aim: {
        AimName: "",
        AimCode: "",
      },
      UnRegistration_Aim: null,
      Registered_Date: null,
      Registered_Department: null,
    },
  },
];

const ERROR_MESSAGES = {
  MIDDLEWARE_MESSAGES: {
    NOT_AUTHORIZED: "Մուտք եղեք համակարգ",
    HAS_NO_RIGHTS: "Լիազորությունները բացակայում են",
    NO_USER_INFO: "Խնդրում ենք կրկին մուտք գործել համակարգ",
  },
};

const permissionsMap = {
  BPR: {
    uid: "1000",
    name: "ԲՊՌ",
    description: "ԲՊՌ Որոնում",
  },
  PETREGISTER: {
    uid: "2000",
    name: "ՊետՌեգիստր",
    description: "Ռեգիստրի Որոնում",
  },
  POLICE: {
    uid: "3000",
    name: "ՆԳՆ",
    description: "Ոստիկանության Որոնում",
  },
  WEAPON: {
    uid: "3100",
    name: "Զենք",
    description: "Զենքի տեղեկատվության որոնում",
  },
  TAX: {
    uid: "4000",
    name: "ՊԵԿ",
    description: "Հարկային Որոնում",
  },
  ZAQS: {
    uid: "5000",
    name: "ՔԿԱԳ",
    description: "ՔԿԱԳ Որոնում",
  },
  MOJ_CES: {
    uid: "6001",
    name: "ԴԱՀԿ",
    description: "ԴԱՀԿ Համակարգի Որոնում",
  },
  MLSA: {
    uid: "6100",
    name: "Սոցապ",
    description: "Սոցիալական Վճարումների Որոնում",
  },
  KADASTR: {
    uid: "7000",
    name: "Կադաստր",
    description: "Կադաստրի պետական կոմիտե",
  },
  KADASTR_CERTIFICATE: {
    uid: "7001",
    name: "Սեփականության վկայական",
    description: "Կադաստր ըստ սեփ. վկայականի",
  },
  ASYLUM: {
    uid: "20000",
    name: "Փախստականներ",
    description: "Փախստականների բազայում որոնում",
  },
  WP: {
    uid: "9000",
    name: "Աշխատանքի թույլտվություն",
    description: "Արցախի տեղահանության տեղեկատվություն",
  },
  ROADPOLICE: {
    uid: "30000",
    name: "ՃՈ",
    description:
      "ՃՈ տեղեկատվություն անձի մեքենաների և վարորդական վկ. վերաբերյալ",
  },
  ROADPOLICE_TRANSACTIONS: {
    uid: "31000",
    name: "Տ/Մ հաշվառումներ",
    description: "Անձի կատարած բոլոր հաշվառման գործարքների պատմության հարցում",
  },
  ROADPOLICE_FULL_SEARCH: {
    uid: "40000",
    name: "ՃՈ ամբողջական որոնում",
    description: "ՃՈ տեղեկատվության որոնում բոլոր պարամետրերով",
  },
  WP_PERSON_SEARCH: {
    uid: "50000",
    name: "Աշխ թույլտվության անձի որոնում",
    description:
      "Անձի  որոնում աշխ թույլտվության համակարգում բոլոր պարամետրերով",
  },
  MTA_PROPERTY_TAXES: {
    uid: "61000",
    name: "Գույքահարկ",
    description:
      "Ֆիզ։ և իրավաբանական անձանց մեքենայի, անշարժ գույքի գույքահարկեր",
  },
  ADMIN: {
    uid: "9999",
    name: "Ադմինիստրատոր",
    description: "Ադմինիստրատոր",
  },
  HR: {
    uid: "8888",
    name: "HR",
    description: "ՄՌԿ",
  },
};

const logTypesMap = {
  bpr: {
    name: "ԲՊՌ Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tax: {
    name: "ՊԵԿ Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  qkag: {
    name: "ՔԿԱԳ Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  petRegister: {
    name: "Պետական Ռեգիստրի Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  cadaster: {
    name: "Կադաստրի Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  police: {
    name: "Որոնվողների Բազայում Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  weapon: {
    name: "Զենքերի Բազայում Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  wp: {
    name: "Աշխ. Թույլտվության Բազայում Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  roadPolice: {
    name: "ՃՈ Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  roadPoliceTransactions: {
    name: "Տ/Մ Հաշվառումների Պատմության Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  territorialMinPropertyTaxes: {
    name: "Մեքենայի և անշարժ գույքի գույքահարկերի որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  asyum: {
    name: "Փախստականների Բազայում Որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  login: {
    name: "Մուտք համակարգ",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  logout: {
    name: "Ելք համակարգից",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createUser: {
    name: "Նոր օգտատիրոջ գրանցում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  updateUser: {
    name: "Օգտատիրոջ տվյալների փոփոխում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  pdfDownload: {
    name: "PDF գեներացում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  mojCes: {
    name: "ԴԱՀԿ բազայում որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  mlsa: {
    name: "Սոցիալական վճարումների որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  taxPayerInfo: {
    name: "Հարկ վճարողի տվյալների որոնում",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const APPLICATION_JSON_HEADERS = {
  "Content-Type": "application/json",
};

module.exports = {
  defaultDocument,
  defaultAddress,
  ERROR_MESSAGES,
  permissionsMap,
  logTypesMap,
  APPLICATION_JSON_HEADERS,
};
