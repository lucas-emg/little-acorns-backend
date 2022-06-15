const { Router } = require('express')
const User = require('../models/User')
const TodoList = require('../models/TodoList')
const mongoose = require('mongoose')
const deleteAllTodos = require('../controllers/deleteAllTodos')
const validateUser = require('../controllers/validateUser')
const validateUserIsAdmin = require('../controllers/user.controllers/validateUserIsAdmin')
const { route } = require('./todo.routes')
const validateUseIsInvited = require('../controllers/todolist.controllers/validateUseIsInvited')

const router = Router()

//Display all TodoLists of the user
router.get('/', async(req, res) => {

    const userId = req.user.id 

    try {

        const allTodoLists = await TodoList.find({user: userId})

        res.status(200).json(allTodoLists)

    } catch (error) {

        res.status(500)

    }

})

//Gets all TodoLists shared with me
router.get('/sharedWithMe', async(req, res) => {

    const { id } = req.user

    try {

        const sharedWithMe = await TodoList.find({invitedUsers: id})

        res.status(200).json(sharedWithMe)
        
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})

//Creates a new Todo Lists
router.post('/', async(req,res) => {

    const payload = req.body
    const userId = req.user.id

    try {

        const newTodoList = await TodoList.create({...payload, user: userId, admins: userId})
        await User.findByIdAndUpdate(userId, {$push: {todoList: newTodoList._id}})

        res.status(200).json(newTodoList)

    } catch (error) {

        res.status(500).json(error.message)

    }

})

//Update a TodoList
router.put('/updateTodoList/:id', async (req, res) => {

    const userId = req.user.id
    const { id } = req.params
    const payload = req.body

    try {
        
        const userValidation = await TodoList.findById(id)

        validateUser(userValidation.user, userValidation.invitedUsers, userId, 401, "Cannot update another user's Todo List")

        const updatedTodoList = await TodoList.findByIdAndUpdate({ _id: id },payload, { new: true })

        res.status(200).json(updatedTodoList)

    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

//Share a TodoList with another user
router.put('/shareTodoList/:todoListId/:newUserId', async (req, res) => {

    const { todoListId } = req.params
    const { newUserId } = req.params

    try {

        const todoList = await TodoList.findById(todoListId)

        validateUseIsInvited(todoList.invitedUsers, newUserId, 400, 'User is already invited')

        const updatedTodoList = await TodoList.findByIdAndUpdate(todoListId, {$push: { invitedUsers: newUserId }}, { new: true })

        res.status(200).json(updatedTodoList)
        
    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

//Remove invited users
router.put('/removeInvitedUser/:todoListId/:InvitedUserId', async (req, res) => {

    const userId = req.user.id
    const { todoListId } = req.params
    const { InvitedUserId } = req.params

    try {

        const userValidation = await TodoList.findById(todoListId)

        validateUserIsAdmin(userValidation.admins, userId, 401, 'Only Admins can remove invited users')

        const updatedTodoList = await TodoList.findByIdAndUpdate(todoListId, {$pull: { invitedUsers: InvitedUserId }}, { new: true })

        res.status(200).json(updatedTodoList)
        
    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

//Leave a Todo List
router.put('/leaveTodoList/:todoListId', async (req, res) => {

    const userId = req.user.id
    const { todoListId } = req.params

    try {
        
        const updatedTodoList = await TodoList.findByIdAndUpdate(todoListId, {$pull: { invitedUsers: userId }}, {new: true})

        res.status(200).json({message: `You have left ${updatedTodoList.title}`})

    } catch (error) {

        res.status(error.status || 500).json(error.message)
    }
})


//Add new Admin to TodoList
router.put('/addAdminTodoList/:todoListId/:newUserId', async (req, res) => {

    const userId = req.user.id
    const { todoListId } = req.params
    const { newUserId } = req.params

    try {

        const validateUser = await TodoList.findById(todoListId)

        validateUserIsAdmin(validateUser.admins, userId, 401, 'Only Admins can add a new Admin')

        const updatedTodoList = await TodoList.findByIdAndUpdate(todoListId, {$push: { admins: newUserId }}, { new: true })

        res.status(200).json(updatedTodoList)
        
    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

//Remove Admin to TodoList
router.put('/removeAdmin/:todoListId/:adminId', async (req, res) => {

    const userId = req.user.id
    const { todoListId } = req.params
    const { adminId } = req.params

    try {

        const validateUser = await TodoList.findById(todoListId)

        validateUserIsAdmin(validateUser.admins, userId, 401, 'Only Admins can remove other admins from the list')

        const updatedTodoList = await TodoList.findByIdAndUpdate(todoListId, {$pull: { admins: adminId }}, { new: true })

        res.status(200).json(updatedTodoList)
        
    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

//Delete a TodoList
router.delete('/:id', async (req, res) => {

    const todoListId = req.params.id
    const userId = req.user.id

    try {

        const todos = await TodoList.findById(todoListId)

        validateUser(todos.user, todos.invitedUsers, userId, 401, "Cannot update another user's Todo List")

        validateUserIsAdmin(todos.admins, userId, 401, 'Only Admins can delete a TodoList')
        
        deleteAllTodos(todos.todos)

        await TodoList.findByIdAndDelete(todoListId)

        res.status(200).json({message: "All todos have been deleted"})

    } catch (error) {

        res.status(error.status || 500).json(error.message)
    }

})



module.exports = router