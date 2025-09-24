const { Sequelize, DataTypes } = require("sequelize");

const host = process.env.DATABASE_HOST;
const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT || 3306;

const sequelize = new Sequelize(DB, username, password, {
  host,
  port,
  dialect: "mysql",
  logging: false,
});

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT("long"),
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pashton: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationLink: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

const Token = sequelize.define(
  "Token",
  {
    refreshToken: { type: DataTypes.TEXT("long") },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Role = sequelize.define(
  "Role",
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);
Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Token, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Token.belongsTo(User, {
  foreignKey: "userId",
});

const LogType = sequelize.define(
  "LogType",
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

const Log = sequelize.define(
  "Log",
  {
    fields: { type: DataTypes.JSON, allowNull: false },
    logTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: LogType,
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Log, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Log.belongsTo(User, {
  foreignKey: "userId",
});

LogType.hasMany(Log, {
  foreignKey: "logTypeId",
  onDelete: "CASCADE",
});

Log.belongsTo(LogType, {
  foreignKey: "logTypeId",
});

const LikeType = sequelize.define(
  "LikeType",
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

const Like = sequelize.define(
  "Savings",
  {
    fields: { type: DataTypes.JSON, allowNull: false },
    likeTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: LikeType,
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Like, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Like.belongsTo(User, {
  foreignKey: "userId",
});

LikeType.hasMany(Like, {
  foreignKey: "likeTypeId",
  onDelete: "CASCADE",
});

Like.belongsTo(LikeType, {
  foreignKey: "likeTypeId",
});

const Permission = sequelize.define(
  "Permission",
  {
    uid: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

Permission.belongsToMany(Role, { through: "Permission_Roles" });
Role.belongsToMany(Permission, { through: "Permission_Roles" });

sequelize.authenticate();

module.exports = {
  sequelize,
  User,
  Token,
  Role,
  Log,
  LogType,
  Like,
  LikeType,
  Permission,
};
