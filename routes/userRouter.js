const express = require('express');
const { models, Types } = require('mongoose');
const debug = require('debug')('app:userRouter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, authorizeClient, authorizeAdministrator } = require('../middleware/authenticate');
const { request, response } = require('express');

function routes(userModel, userRoleModel) {
  const userRouter = express.Router();

  userRouter.route('/user/register')
    .post(async (req, res) => {
      try {
        /// Create new user model based on data provided.
        let user = new userModel(req.body);

        /// Check if input data is valid.
        if (!(user.username && user.email && user.password)) {
          res.status(400);
          return res.send('Invalid entry.');
        }

        /// Request user role.
        user.role = await userRoleModel.findOne({ userRole: process.env.SIGNUP_ROLE });

        /// Request user data.
        const existingUser = await userModel.findOne({ email: user.email });

        /// Check if requested user exists.
        if (existingUser) {
          res.status(409);
          return res.send('User already exists.')
        }

        /// Encrypt password.
        const encryptedPassword = await bcrypt.hash(user.password, 10);
        user.password = encryptedPassword;

        /// Sign the token.
        const token = jwt.sign(
          { user_id: user._id, email: user.email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        )

        /// Update the token.
        user.token = token;

        /// Save the user data.
        user.save();

        /// Send response.
        res.status(201);
        return res.json(user);
      } catch (err) {
        /// Return error if necessary.
        return res.send(err);
      }
    });

  userRouter.route('/user/login')
    .post(async (req, res) => {
      try {
        let user = new userModel(req.body);

        /// Check if input data is valid.
        if (!(user.email && user.password && user.username)) {
          res.status(400);
          return res.send('Invalid entry.');
        }

        /// Get existing user's data.
        const existingUser = await userModel.findOne({ email: user.email });

        /// Check if user exists.
        if(!existingUser) {
          res.status('404');
          return res.send('User not found.');
        }

        /// Check if the passwords match.
        if (await bcrypt.compare(user.password, existingUser.password)) {
          /// Sign the user token.
          const token = jwt.sign(
            { user_id: existingUser._id, email: existingUser.email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
          );

          existingUser.token = token;
          await existingUser.save();

          res.status(200);
          return res.json(existingUser);
        }

        res.status(400);
        return res.send('Invalid credentials.');
      } catch (err) {
        debug(err);
      }
    });

  userRouter.route('/user')
    .get([verifyToken, authorizeAdministrator], async (req, res) => {
      try {
        /// Create query based on input.
        const query = {};
        Object.assign(query, req.query);

        /// Query the database.
        const queryResponse = await userModel.find(query);

        /// Convert the response into a JSON file.
        const returnResponse = queryResponse.map((response) => {
          let newResponse = response.toJSON();
          return newResponse;
        });

        /// Send response.
        res.status(200);
        return res.json(returnResponse);        
      } catch (err) {
        return res.send(err);
      }
    });

  userRouter.route('/user/:userId')
    .get([verifyToken, authorizeClient], async (req, res) => {
      try {
        /// Check if user ID is valid.
        if (!Types.ObjectId.isValid(req.params.userId)) {
          res.status(400);
          return res.send('Invalid ID.');
        }

        /// Get requested user data.
        const requestedUser = await userModel.findById(req.params.userId);

        /// Check if requested user exists.
        if (!requestedUser) {
          res.status(404);
          return res.send('User not found.');
        }

        /// Client should not be able to see administrator or moderator information.

        /// Send requested user.
        res.status(200);
        return res.json(requestedUser);
      } catch (err) {
        /// Return error if necessary.
        return res.send(err);
      }
    });

  return userRouter;
}

module.exports = routes;