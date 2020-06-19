'use strict';

const Users = require("./users");

module.exports = (sequelize, DataTypes) => {
  const UserVersions = sequelize.define('UserVersions', {
    Name: DataTypes.STRING,
    Email: DataTypes.STRING,
    PhoneNumber: DataTypes.STRING,
    Address: DataTypes.STRING,
    KTP: DataTypes.STRING,
    NPWP: DataTypes.STRING,
    Passport: DataTypes.STRING,
    Password: DataTypes.STRING,
    usersId: DataTypes.INTEGER
  }, {});
  UserVersions.associate = function(models) {
    // associations can be defined here
  };
  return UserVersions;
};