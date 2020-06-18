'use strict';

var passwordHash = require('password-hash');
const { NetworkAuthenticationRequire } = require("http-errors");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', [
      {
        Name: "Abai",
        Email: "abai@email.com",
        PhoneNumber: "081234567890",
        Address: "jl. kaki cape sekali",
        KTP: "0123456789101112",
        NPWP: "00.000.000.0-000.001",
        Passport: "A0000001",
        Password: passwordHash.generate("abai123"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Name: "Budi",
        Email: "budi@email.com",
        PhoneNumber: "081234567891",
        Address: "jl. ditepi sawah",
        KTP: "1123456789101112",
        NPWP: "00.000.000.0-000.002",
        Passport: "A0000002",
        Password: passwordHash.generate("budi123"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Name: "Ceri",
        Email: "ceri@email.com",
        PhoneNumber: "081234567892",
        Address: "jl. aspal hitam",
        KTP: "2123456789101112",
        NPWP: "00.000.000.0-000.003",
        Passport: "A0000003",
        Password: passwordHash.generate("ceri123"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
