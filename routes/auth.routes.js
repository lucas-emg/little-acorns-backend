const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateRequiredFields = require('../controllers/auth.controllers/validateRequiredFields')
const validateExistingEmail = require('../controllers/auth.controllers/validateExistingEmail')
const validateCredentialsUser = require('../controllers/auth.controllers/validateCredentialsUser')
const validateCredentialsPassword = require('../controllers/auth.controllers/validateCredentialsPassword')

const router = Router()

router.post('/signup', async (req, res) => {

    try {

        const { name, username, email, password } = req.body

        validateRequiredFields(name, username, email, password, 400, "All fields are required")

        const emailCheck = await User.findOne({email})

        validateExistingEmail(emailCheck, 400, "This email is already in use")

        const salt = await bcrypt.genSalt(12)

        const passwordHash = await bcrypt.hash(password, salt)

         await User.create({
            name,
            username,
            email,
            passwordHash
        })

        res.status(201).json({name, email})

    } catch (error) {

        res.status(error.status || 500).json(error.message)

    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({email})

        validateCredentialsUser(user, 401, "User or Password are invalid")

        const passwordValidation = await bcrypt.compare(password, user.passwordHash)

        validateCredentialsPassword(passwordValidation, 401, "User or Password are invalid")

        const payload = {
            id: user._id,
            name: user.name,
            email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.status(200).json({user: payload, token})

    } catch (error) {

        res.status(error.status || 500).json(error.message)
    }
})


module.exports = router