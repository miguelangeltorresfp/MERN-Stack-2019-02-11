/* eslint-disable no-shadow */
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const router = express.Router();

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load User Model
const User = require('../../models/User');

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', async (req, res) => {
  res.json({msg: 'Users Works'});
});

// @route  POST api/users/register
// @desc   Register users route
// @access Public
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });
      const newUser = User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(500).json(err));
        });
      });
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/users/login
// @desc   Login Users / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {email, password} = req.body;

  // Find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched Payload
          const payload = {id: user.id, name: user.name, avatar: user.avatar}; // Create JWT Payload
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {expiresIn: 3600},
            (err, token) => {
              res.json({success: true, token: `Bearer ${token}`}); // ready to do the request later
            },
          );
        } else {
          errors.password = 'Password incorrect';
          res.status(400).json(errors);
        }
      });
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  '/current',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  },
);

module.exports = router;
