const { DataTypes } = require('sequelize');
const db = require('.');

const User = db.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Client = db.define('Client', {
  cid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const associationOpts = {
  foreignKey: 'userId',
  as: 'clients',
};

Client.belongsTo(User, associationOpts);
User.hasMany(Client, associationOpts);

module.exports = {
  User,
  Client,
};
