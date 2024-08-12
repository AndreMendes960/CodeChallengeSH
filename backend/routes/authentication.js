const express = require("express");
const jwt = require("jsonwebtoken");
const db = require('../database/models')
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');

const RegistrationValidationRules = () => {
    return [
      body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
      body('email')
        .isEmail().withMessage('Please provide a valid email address'),
      body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
    ];
};

const LoginValidationRules = () => {
    return [
      body('email')
        .isEmail().withMessage('Please provide a valid email address'),
      body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
    ];
};


router.post("/login", LoginValidationRules(), async (req, res) => {
  try{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log(email)

    const user = await db.User.findOne({
        where: {
          email: email,
        },
    });


    if (!user) return res.status(400).send("Invalid username or password.");

    const validPassword = await user.validPassword(password)
    if (!validPassword)
        return res.status(400).send("Invalid username or password.");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.status(202).json({
        token: token
    });

  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/register", RegistrationValidationRules(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       
        const { username, email, password } = req.body;
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const newUser = await db.User.create({ username, email, password });

        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;