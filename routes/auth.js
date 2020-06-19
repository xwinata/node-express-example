var express = require('express');
var router = express.Router();
var models = require('../models');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var jwtkey = "ABCDE123456789";

  /**
  * @swagger
  * /auth:
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
  *             email:
  *               type: string
  *               example: email example
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
        res.status(404).json({"message":"email not found"})
    })
});

module.exports = router;