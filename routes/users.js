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

  /**
  * @swagger
  * /users:
  *   get:
  *     tags:
  *       - Users
  *     summary: patch user by id.
  *     consumes:
  *       - application/json
  *     parameters:
  *       - in: query
  *         name: page
  *         type: string
  *       - in: query
  *         name: rows
  *         type: string
  *       - in: query
  *         name: orderby
  *         type: string
  *       - in: query
  *         name: sort
  *         type: string
  *       - in: query
  *         name: name
  *         type: string
  *       - in: query
  *         name: email
  *         type: string
  *       - in: query
  *         name: address
  *         type: string
  *       - in: query
  *         name: ktp
  *         type: string
  *       - in: query
  *         name: npwp
  *         type: string
  *       - in: query
  *         name: passport
  *         type: string
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
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

  /**
  * @swagger
  * /users:
  *   post:
  *     tags:
  *       - Users
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
  *             email:
  *               type: string
  *               example: email example
  *             address:
  *               type: string
  *               example: address example
  *             ktp:
  *               type: string
  *               example: ktp example
  *             npwp:
  *               type: string
  *               example: npwp example
  *             passport:
  *               type: string
  *               example: passport example
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
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

  /**
  * @swagger
  * /users/:mailorname:
  *   get:
  *     tags:
  *       - Users
  *     summary: get user by mail or name.
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
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
  
  /**
  * @swagger
  * /users/versions/:id:
  *   get:
  *     tags:
  *       - Users
  *     summary: get user versions by id.
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
  .get('/versions/:id', function(req, res, next) {
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
      id: req.params.id,
      deletedAt: null
    }})
    .then(users => {
        if (users == null) {
          return res.json({message: `user with id ${req.params.id} not found`})
        }
        models.UserVersions.findAll({
          where: {
            usersId: users["id"]
          }
        }).then(versions => {
          return res.json({users, "versions": versions})
        })
        .catch( error => {
          res.status( 400 ).send( error )
        });
    })
    .catch( error => {
      res.status( 400 ).send( error )
    });
  })

  /**
  * @swagger
  * /users/:id:
  *   patch:
  *     tags:
  *       - Users
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
  *             email:
  *               type: string
  *               example: email example
  *             address:
  *               type: string
  *               example: address example
  *             ktp:
  *               type: string
  *               example: ktp example
  *             npwp:
  *               type: string
  *               example: npwp example
  *             passport:
  *               type: string
  *               example: passport example
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
  */
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
  *       - Users
  *     summary: soft deletes user by id.
  *     consumes:
  *       - application/json
  *     responses: 
  *       200:
  *         description: OK.
  *       400:
  *         description: Bad Request.
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
