const axios = require('axios');
const path = require('path');
const { defaultAddress, defaultDocument } = require('../../utils/constants');
const { createPDF } = require('./../../utils/common');
const ApiError = require('../../exceptions/api-error');

const fakeData = {
    title: 'A new Brazilian School',
    date: '05/12/2018',
    name: 'Rodolfo',
    age: 28,
    birthdate: '12/07/1990',
    course: 'Computer Science',
    obs: 'Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce.',
};

const createPdfBySsn = async (req) => {
    const { body } = req;
    const { data } = { ...body };
    const {
        Citizenship_StoppedDate,
        DeathDate,
        IsDead,
        Certificate_Number,
        SSN_Indicator,
        PNum,
        documents,
        addresses,
    } = { ...data };

    const fileName = await createPDF(fakeData);

    return fileName;
};

const getPersonBySsnDb = async (params) => {
    const bprUrl = process.env.BPR_URL;
    const { ssn } = params;
    const { data } = await axios.get(`${bprUrl}?PNum=${ssn}`);

    if (data.length === 0) {
        return [];
    }

    const personData = data[0];
    const { AVVDocuments, AVVAddresses, ...restInfo } = personData;
    const addresses = AVVAddresses?.AVVAddress || defaultAddress;
    const documents = AVVDocuments?.Document || defaultDocument;

    const person = { addresses, documents, ...restInfo };

    return person;
};

const getSearchedPersonsDb = async (body) => {
    const bprUrl = process.env.BPR_URL;

    const {
        firstName,
        lastName,
        patronomicName,
        birthDate,
        documentNumber,
        ssn,
    } = body;

    let serachUrl = `${bprUrl}?`;

    if (ssn) {
        serachUrl += `&PNum=${ssn}`;
    }
    if (firstName) {
        serachUrl += `&first_name_like=${firstName}`;
    }
    if (lastName) {
        serachUrl += `&last_name_like=${lastName}`;
    }
    if (patronomicName) {
        serachUrl += `&middle_name_like=${patronomicName}`;
    }
    if (birthDate) {
        serachUrl += `&birth_date=${birthDate}`;
    }
    if (documentNumber) {
        serachUrl += `&docnum=${documentNumber}`;
    }
    serachUrl = serachUrl.replace(/\?\&/g, '?');

    const { data } = await axios.get(serachUrl);

    if (data.length === 0) {
        return [];
    }

    const persons = data.map((person) => {
        const { AVVDocuments, AVVAddresses, ...restInfo } = person;
        const addresses = AVVAddresses.AVVAddress;
        const documents = AVVDocuments.Document;
        return { addresses, documents, ...restInfo };
    });

    return persons;
};

const getDocumentsBySsnDb = async (ssn) => {
    const qkagUrl = process.env.QKAG_URL;

    const { data } = await axios.get(`${qkagUrl}?PNum=${ssn}`);

    if (data.length === 0) {
        return [];
    }

    const { result } = data[0];
    const documentsData = Object.values(result);

    return documentsData;
};

const getTaxBySsnDb = async (ssn) => {
    const taxUrl = process.env.TAX_URL;

    const { data } = await axios.get(`${taxUrl}?PNum=${ssn}`);

    if (data.length === 0) {
        return [];
    }

    const {
        taxPayersInfo: { taxPayerInfo },
    } = data[0];

    return taxPayerInfo;
};

const getCompanyByHvhhDb = async (hvhh) => {
    const taxUrl = process.env.PETREGISTR_URL;
    const { data } = await axios.get(`${taxUrl}?fake_tax_id=${hvhh}`);

    if (data.length === 0) {
        return [];
    }

    const {
        result: { company },
    } = data[0];

    return company;
};

module.exports = {
    getPersonBySsnDb,
    getSearchedPersonsDb,
    getDocumentsBySsnDb,
    getTaxBySsnDb,
    getCompanyByHvhhDb,
    createPdfBySsn,
};
