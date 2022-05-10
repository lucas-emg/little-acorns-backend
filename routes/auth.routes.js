const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = Router()

router.post('/signup', async (req, res) => {

    try {

        const { name, email, password } = req.body

        if(!name || !email || !password) throw new Error ('All fields are required')

        const emailCheck = await User.findOne({email})

        if(emailCheck) throw new Error ('This email is already in user')

        const salt = await bcrypt.genSalt(12)

        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            passwordHash
        })

        res.status(201).json({name, email})

    } catch (error) {

        if (error.message === 'This email is already in user') res.status(400).json({msg: error.message})

        res.status(500).json({error})
    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({email})

        if (!user) throw new Error ('User or Password are invalid')

        const passwordValidation = await bcrypt.compare(password, user.passwordHash)

        if (!passwordValidation) throw new Error ('User or Password are invalid')

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

        if(error.message === 'User or Password are invalid') {
            res.status(401).json({msg: error.message})
        }

        res.status(500).json({msg: error.message})
    }
})


module.exports = router