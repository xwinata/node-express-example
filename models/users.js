'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    Name: DataTypes.STRING,
    Email: DataTypes.STRING,
    PhoneNumber: DataTypes.STRING,
    Address: DataTypes.STRING,
    KTP: DataTypes.STRING,
    NPWP: DataTypes.STRING,
    Passport: DataTypes.STRING,
    Password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {paranoid: true});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};