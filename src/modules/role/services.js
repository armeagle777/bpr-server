const { Op, Sequelize } = require("sequelize");

const ApiError = require("../../exceptions/api-error");
const { Role, Permission } = require("../../config/sphereDatabase");

const getRolesDB = async (req) => {
  const roles = await Role.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Permission,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
  });

  return {
    roles,
  };
};

const createRoleDb = async (req) => {
  const { body } = req;

  const { name, permissions } = body;
  if (!name || !permissions) {
    throw ApiError.BadRequest("Missing fields");
  }

  const candidate = await Role.findOne({
    where: { name },
  });
  if (candidate) {
    throw ApiError.BadRequest("Role already exists");
  }

  const newRole = await Role.create({ name });

  if (permissions && permissions.length > 0) {
    const permissionsRecords = await Permission.findAll({
      where: {
        id: permissions,
      },
    });

    await newRole.setPermissions(permissionsRecords);
  }

  const createdRoleWithPermissions = await Role.findOne({
    where: { id: newRole.id },
    include: [Permission],
  });

  return createdRoleWithPermissions;
};

const updateRoleDB = async (req) => {
  const { params, body } = req;
  const { id } = params;
  const { name, permissions } = body;

  if (id != body.id) {
    throw ApiError.BadRequest("Incorrect data");
  }

  const dublicateRole = await Role.findOne({
    where: {
      name: body.name,
      id: {
        [Op.not]: +id,
      },
    },
  });

  if (dublicateRole) {
    throw ApiError.BadRequest("Role already exists");
  }

  const role = await Role.findByPk(+id);

  if (!role) {
    throw ApiError.BadRequest("Role doesn't exists");
  }

  await role.update({ name });

  const foundPermissions = await Permission.findAll({
    where: {
      id: permissions,
    },
  });

  await role.setPermissions(foundPermissions);
  const updatedRole = await Role.findByPk(id, { include: [Permission] });

  return updatedRole;
};

module.exports = {
  createRoleDb,
  getRolesDB,
  updateRoleDB,
};
