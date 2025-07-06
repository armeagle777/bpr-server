const { Sequelize, DataTypes } = require("sequelize");

const host = process.env.DATABASE_HOST;
const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT || 3306;

const sphereSequelize = new Sequelize(DB, username, password, {
  host,
  port,
  dialect: "mysql",
  logging: false,
});

const User = sphereSequelize.define(
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

const Token = sphereSequelize.define(
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

const Role = sphereSequelize.define(
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

const LogType = sphereSequelize.define(
  "LogType",
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

const Log = sphereSequelize.define(
  "Log",
  {
    text: { type: DataTypes.STRING, allowNull: false },
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

const Like = sphereSequelize.define(
  "Likes",
  {
    uid: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
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

const Share = sphereSequelize.define(
  "Share",
  {
    uid: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.STRING, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fromUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    toUserId: {
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
User.hasMany(Share, {
  foreignKey: "fromUserId",
  as: "SharesSent",
  onDelete: "CASCADE",
});
User.hasMany(Share, {
  foreignKey: "toUserId",
  as: "SharesReceived",
  onDelete: "CASCADE",
});

Share.belongsTo(User, {
  foreignKey: "fromUserId",
  as: "Sender",
});
Share.belongsTo(User, {
  foreignKey: "toUserId",
  as: "Receiver",
});

const Permission = sphereSequelize.define(
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

sphereSequelize.authenticate();

module.exports = {
  sphereSequelize,
  User,
  Token,
  Role,
  Log,
  LogType,
  Like,
  Share,
  Permission,
};
