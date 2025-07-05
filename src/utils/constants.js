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

const sphereCronConfig = "0 20 * * *";

const ERROR_MESSAGES = {
  MIDDLEWARE_MESSAGES: {
    NOT_AUTHORIZED: "Մուտք եղեք համակարգ",
    HAS_NO_RIGHTS: "Լիազորությունները բացակյում են",
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
  STATISTICS: {
    uid: "6000",
    name: "Վիճակագրություն",
    description: "Վիճակագրական տվյալներ",
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
  ARTSAKH: {
    uid: "8000",
    name: "Տեղահանություն",
    description: "Արցախի տեղահանության տեղեկատվություն",
  },
  WP: {
    uid: "9000",
    name: "Աշխատանքի թույլտվություն",
    description: "Արցախի տեղահանության տեղեկատվություն",
  },
  CITIZENSHIP_REPORT: {
    uid: "10001",
    name: "Քաղաքացիության տեղեկանք",
    description: "Տեղեկանք անձի քաղաքացիության վերաբերյալ(Ձև 3)",
  },
  PASSPORTS_REPORT: {
    uid: "10002",
    name: "Անձնագրերի տեղեկանք",
    description: "Տեղեկանք անձի անձնագրերի վերաբերյալ",
  },
  PNUM_REPORT: {
    uid: "10003",
    name: "ՀԾՀ տեղեկանք",
    description: "Տեղեկանք անձի ՀԾՀ վերաբերյալ",
  },
  BORDERCROSS: {
    uid: "20000",
    name: "Սահմանահատումներ",
    description:
      "Տեղեկատվություն անձի սահմանահատումների, վիզաների և կացության քարտերի վերաբերյալ",
  },
  ROADPOLICE: {
    uid: "30000",
    name: "ՃՈ",
    description:
      "ՃՈ տեղեկատվություն անձի մեքենաների և վարորդական վկ. վերաբերյալ",
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
  ADMIN: {
    uid: "9999",
    name: "Ադմինիստրատոր",
    description: "Ադմինիստրատոր",
  },
};
const texekanqTypes = {
  CITIZEN: "Քաղաքացիության մասին տեղեկանք",
  PASSPORTS: "Անձնագրերի մասին տեղեկանք",
  PNUM: "ՀԾՀ մասին տեղեկանք",
};

module.exports = {
  defaultDocument,
  defaultAddress,
  sphereCronConfig,
  ERROR_MESSAGES,
  permissionsMap,
  texekanqTypes,
};
