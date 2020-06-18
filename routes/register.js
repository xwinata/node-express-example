var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var models = require('../models');
var passwordHash = require('password-hash');

router.post('/',
    [
        check('name').not().isEmpty(),
        check('email').isEmail(),
        check('phonenumber').not().isEmpty(),
        check('address').not().isEmpty(),
        check('ktp').not().isEmpty(),
        check('npwp').not().isEmpty(),
        check('passport').not().isEmpty(),
        check('password').not().isEmpty()
    ],
    function(req, res, next) {
        var errorValidation = validationResult(req)
        if (!errorValidation.isEmpty()) {
            return res.status(422).json({message: "validation error", errors: errorValidation.array()})
        }
        
        models.Users.create({
            Name: req.body.name,
            Email: req.body.email,
            PhoneNumber: req.body.phonenumber,
            Address: req.body.address,
            KTP: req.body.ktp,
            NPWP: req.body.npwp,
            Passport: req.body.passport,
            Password: passwordHash.generate(req.body.password)
        }).then(created => {
            res.json(created)
            return
        })
        .catch( error => {
            res.status( 400 ).send( error )
        });
});

module.exports = router;