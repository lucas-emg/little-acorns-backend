const { Router } = require('express')
const User = require('../models/User')
const TodoList = require('../models/TodoList')
const mongoose = require('mongoose')
const Todo = require('../models/Todo')
const deleteAllTodos = require('../controllers/deleteAllTodos')

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

router.delete('/:id', async (req, res) => {

    const todoListId = req.params.id

    try {

        const todos = await TodoList.findById(todoListId).select(["todos", "-_id"])

        deleteAllTodos(todos.todos)

        await TodoList.findByIdAndDelete(todoListId)

        res.status(200).json({message: "All todos have been deleted"})

    } catch (error) {

        res.status(500).json(error.message)
    }

})

router.post('/newtodo/:id', async (req, res) => {

    const payload = req.body
    const todoListId = req.params.id

    try {

        const newTodo = await Todo.create({...payload, todoList: todoListId})
        await TodoList.findByIdAndUpdate(todoListId, {$push: {todos: newTodo._id}})

        res.status(200).json(newTodo)
        
    } catch (error) {

        res.status(500).json(error.message)
        
    }
})


module.exports = router