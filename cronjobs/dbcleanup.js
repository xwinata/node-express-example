var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var moment = require('moment');

const dbcleanup = (days) => {
    console.log("--- Start dbcleanup ---");
    if (!days) {
        days = 5
    }

    models.Users.destroy({
        where: {
            deletedAt: {
                [Op.lte]: moment().subtract(days, 'seconds').toDate(),
                [Op.not]: null
            }
        },
        force: true
    }).then(result => {
        console.log(`dbcleanup finished! cleaned ${result} row(s)`);
    }).catch( error => {
        console.log( error )
    });
}

module.exports.dbcleanup = dbcleanup;