const { Router } = require('express')
const User = require('../models/User')
const TodoList = require('../models/TodoList')
const mongoose = require('mongoose')
const deleteAllTodos = require('../controllers/deleteAllTodos')
const validateUser = require('../controllers/validateUser')

const router = Router()

router.get('/', async(req, res) => {

    const userId = req.user.id 

    try {

        const allTodoLists = await TodoList.find({user: userId})

        res.status(200).json(allTodoLists)

    } catch (error) {

        res.status(500)

    }

})

router.post('/', async(req,res) => {

    const payload = req.body
    const userId = req.user.id

    try {

        const newTodoList = await TodoList.create({...payload, user: userId})
        await User.findByIdAndUpdate(userId, {$push: {todoList: newTodoList._id}})

        res.status(200).json(newTodoList)

    } catch (error) {

        res.status(500).json(error.message)

    }

})

router.put('/updateTodoList/:id', async (req, res) => {

    const userId = req.user.id
    const { id } = req.params
    const payload = req.body

    try {
        
        const userValidation = await TodoList.findById(id)

        validateUser(userValidation.user, userId, 401, "Cannot update another user's Todo List")

        const updatedTodoList = await TodoList.findByIdAndUpdate({ _id: id },payload, { new: true })

        res.status(200).json(updatedTodoList)

    } catch (error) {
        
        res.status(error.status || 500).json(error.message)
    }
})

router.delete('/:id', async (req, res) => {

    const todoListId = req.params.id
    const userId = req.user.id

    try {

        const todos = await TodoList.findById(todoListId)

        validateUser(todos.user, userId, 401, "Cannot delete another user's Todo List")

        deleteAllTodos(todos.todos)

        await TodoList.findByIdAndDelete(todoListId)

        res.status(200).json({message: "All todos have been deleted"})

    } catch (error) {

        res.status(error.status || 500).json(error.message)
    }

})



module.exports = router