var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var models = require('../models');
var passwordHash = require('password-hash');

  /**
  * @swagger
  * /register:
  *   post:
  *     tags:
  *       - Public
  *     summary: patch user by id.
  *     consumes:
  *       - application/json
  *     parameters:
  *       - in: body
  *         name: body
  *         schema:
  *           type: object
  *           properties:
  *             name:
  *               type: string
  *               example: name example
  *               required: true
  *             email:
  *               type: string
  *               example: email example
  *               required: true
  *             address:
  *               type: string
  *               example: address example
  *               required: true
  *             ktp:
  *               type: string
  *               example: ktp example
  *               required: true
  *             npwp:
  *               type: string
  *               example: npwp example
  *               required: true
  *             passport:
  *               type: string
  *               example: passport example
  *               required: true
  *             password:
  *               type: string
  *               example: test123
  *               required: true
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
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