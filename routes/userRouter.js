const express = require('express');
const { models } = require('mongoose');
const debug = require('debug')('app:userRouter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

function routes(userModel) {
  const userRouter = express.Router();

  userRouter.route('/user/register')
    .post(async (req, res) => {
      try {
        let user = new userModel(req.body);

        /* POST requirements here */

        if (!(user.username && user.email && user.password)) {
          res.status(400);
          return res.send('Invalid entry.');
        }

        const existingUser = await userModel.findOne({ email: user.email });

        if (existingUser) {
          res.status(409);
          res.send('User already exists.')
        }

        const encryptedPassword = await bcrypt.hash(user.password, 10);
        user.password = encryptedPassword;

        const token = jwt.sign(
          { user_id: user._id, email: user.email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        )
        user.token = token;

        user.save();
        res.status(201);
        return res.json(user);
      } catch (err) {
        debug(err);
      }
    });

  userRouter.route('/user/login')
    .post(async (req, res) => {
      try {
        let user = new userModel(req.body);

        if (!(user.email && user.password)) {
          res.status(400);
          return res.send('Invalid entry.');
        }

        const existingUser = await userModel.findOne({ email: user.email });

        if (existingUser && (await bcrypt.compare(user.password, existingUser.password))) {
          const token = jwt.sign(
            { user_id: user._id, email: user.email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
          );
          user.token = token;
          user.password 

          res.status(200);
          return res.json(user);
        }

        res.status(400);
        return res.send('Invalid credentials.');
      } catch (err) {
        debug(err);
      }
    });

  userRouter.route('/user')
    .get(authenticate, (req, res) => {
      const query = {};

      Object.assign(query, req.query);

      userModel.find(query, (err, users) => {
        if (err) {
          res.send(err);
        }

        const returnUser = users.map((user) => {
          let newUser = user.toJSON();
          /* Extra processing */
          return newUser;
        });
        res.status(200);
        return res.json(returnUser);
      });
    });

  userRouter.use('/user/:userId', authenticate, (req, res, next) => {
    userModel.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (user) {
        req.user = user;
        return next();
      }
      return res.sendStatus(400);
    });
  });

  userRouter.route('/user/:userId')
    .get((req, res) => {
      const returnUser = req.user.toJSON();
      res.status(200);
      res.json(returnUser);
    })
    .put((req, res) => {
      const { user } = req;

      Object.assign(user, req.body);

      req.user.save((err) => {
        if (err) {
          return res.send(err);
        }
        res.status(200);
        return res.json(user);
      })
    })
    .delete((req, res) => {
      req.user.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(200);
      })
    });

  return userRouter;
}

module.exports = routes;