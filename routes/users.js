var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var passwordHash = require('password-hash');
const { where } = require('sequelize');

router
  /* GET current user profile. */
  .get('/profile', function(req, res, next) {
    let token = req.headers['authorization']
    let decodetoken
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
      decodetoken = jwt.decode(token)
    });
    
    models.Users.findOne({
      where: {
        id: decodetoken.userid,
        deletedAt: null
      }
    }).then(users => {
      res.json(users)
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

  /* GET user list. */
  .get('/', function(req, res, next) {
    let token = req.headers['authorization']
    let whereStatement = {}
    let orderStatement = []
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
    });

    let page = 1
    let rows = 10
    
    if (req.query.orderby) {
      orderStatement = orderStatement.concat([[req.query.orderby, (req.query.sort) ? req.query.sort : "ASC"]])
    }
    whereStatement.deletedAt = null
    if (req.query.name) {
      whereStatement.Name = {[Op.iLike]: "%"+req.query.name+"%"}
    }
    if (req.query.email) {
      whereStatement.Email = {[Op.iLike]: "%"+req.query.email+"%"}
    }
    if (req.query.phonenumber) {
      whereStatement.PhoneNumber = {[Op.like]: "%"+req.query.phonenumber+"%"}
    }
    if (req.query.address) {
      whereStatement.Address = {[Op.iLike]: "%"+req.query.address+"%"}
    }
    if (req.query.ktp) {
      whereStatement.KTP = {[Op.like]: "%"+req.query.ktp+"%"}
    }
    if (req.query.npwp) {
      whereStatement.NPWP = {[Op.like]: "%"+req.query.npwp+"%"}
    }
    if (req.query.passport) {
      whereStatement.Passport = {[Op.iLike]: "%"+req.query.passport+"%"}
    }
    if (req.query.rows) {
      rows = req.query.rows
    }
    if (req.query.page) {
      page = req.query.page
    }
    let offset = (page*rows)-rows

    models.Users.findAndCountAll({
      where: whereStatement,
      order: orderStatement,
      limit: rows,
      offset: offset
    }).then(result => {
        res.json({
          page: page,
          rows: rows,
          totaldatas: result.count,
          totalpages: Math.ceil(result.count/rows),
          users: result.rows
        })
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

  /* POST new user. */
  .post('/', function(req, res, next) {
    let token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
    });

    let createStatement = {}
    if (req.body.name) {
      createStatement.Name = req.body.name
    }
    if (req.body.email) {
      createStatement.Email = req.body.email
    }
    if (req.body.phonenumber) {
      createStatement.PhoneNumber = req.body.phonenumber
    }
    if (req.body.address) {
      createStatement.Address = req.body.address
    }
    if (req.body.ktp) {
      createStatement.KTP = req.body.ktp
    }
    if (req.body.npwp) {
      createStatement.NPWP = req.body.npwp
    }
    if (req.body.passport) {
      createStatement.Passport = req.body.passport
    }
    createStatement.Password = passwordHash.generate(Math.random().toString(36).substring(8))

    models.Users.create(
      createStatement
    ).then(created => {
      res.json(created)
      return
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })
  /* GET user by id. */
  .get('/:mailorname', function(req, res, next) {
    let token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
    });

    models.Users.findOne({where: {
      [Op.or]: [
        {Name: req.params.mailorname},
        {Email: req.params.mailorname}
      ],
      deletedAt: null
    }})
    .then(users => {
        if (users == null) {
          return res.json({message: `user with mail or name ${req.params.mailorname} not found`})
        }
        res.json(users)
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

  /* PATCH user by id. */
  .patch('/:id', function(req, res, next) {
    let token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
    });

    let updateStatement = {}
    if (req.body.name) {
      updateStatement.Name = req.body.name
    }
    if (req.body.email) {
      updateStatement.Email = req.body.email
    }
    if (req.body.phonenumber) {
      updateStatement.PhoneNumber = req.body.phonenumber
    }
    if (req.body.address) {
      updateStatement.Address = req.body.address
    }
    if (req.body.ktp) {
      updateStatement.KTP = req.body.ktp
    }
    if (req.body.npwp) {
      updateStatement.NPWP = req.body.npwp
    }
    if (req.body.passport) {
      updateStatement.Passport = req.body.passport
    }

    models.Users.update(
      updateStatement,
      {where: {
        id: req.params.id,
        deletedAt: null
      }}
    ).then(updated => {
      res.json({message:`user ${req.params.id} is updated.`})
      return
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

  /**
  * @swagger
  * /users/:id:
  *   delete:
  *     tags:
  *       — Users
  *     summary: This should create a new ice cream.
  *     description: This is where you can give some background as to why this route is being created or perhaps reference a ticket number.
  *     consumes:
  *       — application/json
  *     parameters:
  *       — name: body
  *       in: body
  *       schema:
  *         type: object
  *         properties:
  *           flavor:
  *           type: string
  *     responses: 
  *       200:
  *         description: Receive back flavor and flavor Id.
  */
  .delete('/:id', function(req, res, next) {
    let token = req.headers['authorization']
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    jwt.verify(token, "ABCDE123456789", (err) => {
      if (err) {
        return res.json({
          message: 'Token is not valid'
        });
      }
    });

    models.Users.destroy(
      {where: {id: req.params.id}}
    ).then(updated => {
      res.json({message: `user ${req.params.id} is deleted.`})
      return
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

module.exports = router;
