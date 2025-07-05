const {
  getTaxBySsnDb,
  createPdfBySsn,
  getPersonBySsnDb,
  searchVehiclesDb,
  getPoliceByPnumDb,
  getCompanyByHvhhDb,
  getDocumentsBySsnDb,
  getRoadpoliceBySsnDb,
  getSearchedPersonsDb,
  getBordercrossBySsnDb,
} = require("./services");


const downloadBprInfo = async (req, res, next) => {
  try {
    const createdFile = await createPdfBySsn(req);
    res.download(createdFile);
  } catch (error) {
    next(error);
  }
};

const getPersonBySsn = async (req, res, next) => {
  try {
    const person = await getPersonBySsnDb(req);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getSearchedPersons = async (req, res, next) => {
  try {
    const persons = await getSearchedPersonsDb(req);

    res.status(200).json(persons);
  } catch (err) {
    next(err);
  }
};

const getTaxBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const person = await getTaxBySsnDb(ssn);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getRoadpoliceBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const person = await getRoadpoliceBySsnDb(ssn);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const searchVehicle = async (req, res, next) => {
  try {
    const vehicles = await searchVehiclesDb(req);

    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

const getBordercrossBySsn = async (req, res, next) => {
  try {
    const { passportNumber, citizenship } = req.body;

    const person = await getBordercrossBySsnDb(passportNumber, citizenship);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getPoliceByPnum = async (req, res, next) => {
  try {
    const { pnum } = req.params;
    const person = await getPoliceByPnumDb(pnum);

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
};

const getQkagInfoBySsn = async (req, res, next) => {
  try {
    const { ssn } = req.params;
    const { firstName, lastName } = req.body;

    const documents = await getDocumentsBySsnDb(ssn, firstName, lastName);

    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
};

const getCompanyByHvhh = async (req, res, next) => {
  try {
    const company = await getCompanyByHvhhDb(req);

    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};
// async getAll(req, res) {
//     try {
//         const { count, data } = await getPaginatedResults(
//             req,
//             'Settlement',
//             {
//                 settlement_id: true,
//                 set_name_arm: true,
//             }
//         );
//         res.set({
//             'Content-Range': `posts 0-${data.length}/${count}`,
//         });
//         const modifiedData = data.map((set) => ({
//             id: set.settlement_id,
//             name: set.set_name_arm,
//         }));
//         res.send(modifiedData);
//     } catch (err) {
//         return res.json({ message: 'Try later...' });
//     }
// }

// async updateSingleCategory(req, res) {
//     try {
//         const { categoryId } = req.params;
//         const { name } = req.body;
//         const updatedCategory = await prisma.Category.update({
//             where: {
//                 id: +categoryId,
//             },
//             data: {
//                 name,
//             },
//         });
//         return res.status(200).send(updatedCategory);
//     } catch (err) {
//         logger.error(err.message);
//         res.json(err);
//     }
// }
// async createCategory(req, res) {
//     try {
//         const category = await prisma.Category.create({
//             data: req.body,
//         });
//         return res.status(200).send(category);
//     } catch (err) {
//         logger.error(err);
//         return res.json({ message: 'Check sent data and try again' });
//     }
// }

module.exports = {
  getPersonBySsn,
  getSearchedPersons,
  getQkagInfoBySsn,
  getTaxBySsn,
  getCompanyByHvhh,
  downloadBprInfo,
  getPoliceByPnum,
  getBordercrossBySsn,
  getRoadpoliceBySsn,
  searchVehicle,
};
