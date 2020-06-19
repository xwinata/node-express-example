var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var moment = require('moment');

const snapshotusers = () => {
    console.log("--- Start snapshotuser ---");

    models.Users.findAll().then(results => {
        results.forEach(
            (user) => {
                models.UserVersions.create({
                    Name: user["Name"],
                    Email: user["Email"],
                    PhoneNumber: user["PhoneNumber"],
                    Address: user["Address"],
                    KTP: user["KTP"],
                    NPWP: user["NPWP"],
                    Passport: user["Passport"],
                    Password: user["Password"],
                    usersId: user["id"]
                }).catch( error => {
                    console.log( error )
                });
            }
        );
    }).then(result => {
        console.log(`snapshot finished!`);
    }).catch( error => {
        console.log( error )
    });
}

module.exports.snapshotusers = snapshotusers;