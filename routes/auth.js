var express = require('express');
var router = express.Router();
var models = require('../models');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var jwtkey = "ABCDE123456789";

router.post('/', function(req, res, next) {
  let email = req.body.email
  let pass = req.body.password

  models.Users.findOne({
      where: {
        Email: email
      },
    }).then(function(found){
        if (found != null) {
            if (passwordHash.verify(pass, found.Password)) {
                let token = jwt.sign({userid: found.id}, jwtkey)
                res.json({"token":token})
            } else {
                res.status(401).json({"message": "invalid password"})
            }
            return
        }
        res.status(404).json({"message":"email found"})
    })
});

module.exports = router;