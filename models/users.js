'use strict';
/**
 * @typedef Users
 * @property {integer} id
 * @property {string} name
 * @property {string} Email
 * @property {string} PhoneNumber
 * @property {string} Address
 * @property {string} KTP
 * @property {string} NPWP
 * @property {string} Passport
 * @property {string} Password - hashed
 */
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