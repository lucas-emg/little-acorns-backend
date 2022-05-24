const { Router } = require('express')
const mongoose = require('mongoose')
const uploadProfilePricture = require('../config/cloudinary.profile.config')
const { update } = require('../models/User')
const User = require('../models/User')

const router = Router()

router.put('/updateUser', async (req, res) => {

    const userId = req.user.id
    const payload = req.body

    try {

        const updatedUser = await User.findByIdAndUpdate(userId, payload, {new: true})

        res.status(200).json(updatedUser)
        
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})

router.put('/uploadProfilePhoto', uploadProfilePricture.single('profilePic'), async (req, res) => {

    const { path } = req.file
    const userId = req.user.id

    try {

        const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: path }, { new: true })

        console.log(userId)

        res.status(200).json(updatedUser)

    } catch (error) {

        res.status(500).json(error.message)
        
    }

})

module.exports = router