const { Router } = require('express')
const mongoose = require('mongoose')
const uploadProfilePricture = require('../config/cloudinary.profile.config')
const filterSearchedUser = require('../controllers/user.controllers/filterSearchedUser')
const User = require('../models/User')

const router = Router()

//Enable Users to update their profile
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

//Enable Users to Upload a Profile Picture
router.put('/uploadProfilePhoto', uploadProfilePricture.single('profilePic'), async (req, res) => {

    const { path } = req.file
    const userId = req.user.id

    try {

        const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: path }, { new: true })

        res.status(200).json(updatedUser)

    } catch (error) {

        res.status(500).json(error.message)
        
    }

})

//Serach User by Username or Email
router.get('/searchOneUser/:search', async (req, res) => {

    const searchParam = req.params.search
    
    try {

        const allUsers = await User.find().select('-passwordHash')

        const search = filterSearchedUser(allUsers, searchParam)

        res.status(200).json(search)
        
    } catch (error) {

        res.status(500).json(error.message)
        
    }

})

module.exports = router