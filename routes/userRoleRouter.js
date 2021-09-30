const express = require('express');
const { models } = require('mongoose');
const debug = require('debug')('app:userRoleRouter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, authorizeClient, authorizeModerator, authorizeAdministrator } = require('../middleware/authenticate');

function routes(userRoleModel) {
  const userRoleRouter = express.Router();

  userRoleRouter.route('/userRole')
    .get(verifyToken, authorizeClient, (req, res) => {
      const query = {};

      Object.assign(query, req.query);

      userRoleModel.find(query, (err, userRoles) => {
        if (err) {
          res.send(err);
        }

        const returnUserRole = userRoles.map((userRole) => {
          let newUserRole = userRole.toJSON();
          /* Extra processing */
          return newUserRole;
        });
        res.status(200);
        return res.json(returnUserRole);
      });
    })
    .post(verifyToken, authorizeClient, async (req, res) => {
      try {
        const userRole = new userRoleModel(req.body);

        /* POST requirements here */

        if (!(userRole.userRole)) {
          res.status(400);
          return res.send('Invalid entry.');
        }

        const existingUserRoleModel = await userRoleModel.findOne({ userRole: userRole.userRole });

        if (existingUserRoleModel) {
          res.status(409);
          return res.send('User role already exists.');
        }

        userRole.save();
        res.status(201);
        return res.json(userRole);
      } catch (err) {
        res.send(err);
      }
    });

  userRoleRouter.use('/userRole/:userRoleId', verifyToken, authorizeClient, (req, res, next) => {
    userRoleModel.findById(req.params.userRoleId, (err, userRole) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (userRole) {
        req.userRole = userRole;
        return next();
      }
      return res.sendStatus(400);
    });
  });

  userRoleRouter.route('/userRole/:userRoleId')
    .delete((req, res) => {
      req.userRole.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(200);
      })
    });

  return userRoleRouter;
}

module.exports = routes;