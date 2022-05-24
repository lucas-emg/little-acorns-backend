const { Router } = require('express')
const Todo = require('../models/Todo')
const mongoose = require('mongoose')
const TodoList = require('../models/TodoList')
const uploadTodoImage = require('../config/cloudinary.todo.config')

const router = Router()

router.get('/getAllTodosFromList/:id', async (req, res) => {

    try {
        const todoListId = req.params.id
        const allTodos = await Todo.find({todoList: todoListId})

        res.status(200).json(allTodos)

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

router.put('/updateTodo/:id', async (req, res) => {

    const { id } = req.params
    const payload = req.body

    try {

        const updatedTodo = await Todo.findOneAndUpdate({_id: id}, payload, {new: true})

        res.status(200).json(updatedTodo)

    } catch (error) {

        res.status(500).json({error: error.message})

    }
})

router.put('/uploadTodoImage/:id', uploadTodoImage.single('image') ,async (req, res) => {

    const { id } = req.params
    const { path } = req.file

    try {

        const updatedTodo = await Todo.findByIdAndUpdate({_id: id}, {fileUpload: path}, {new: true})

        res.status(200).json(updatedTodo)
        
    } catch (error) {

        res.status(500).json(error.message)
        
    }

})

router.delete('/deleteOneTodo/:id', async (req, res) => {

    const { id } = req.params

    try {

        const todo = await Todo.findById(id)

        await TodoList.findOneAndUpdate({_id: todo.todoList}, {$pull: {todos: id }})

        todo.delete()

        res.status(204)

    } catch (error) {
        
        res.status(500).json({ error: error.message })
    }
})

router.delete('/deleteAllTodos/:id', async (req, res) => {

    const todoListId = req.params.id

    try {

        await Todo.find({todoList: todoListId}).deleteMany({})
        await TodoList.findByIdAndUpdate(todoListId, {$unset: {todos: 1}})

        res.status(204).json("All todos deleted")

    } catch (error) {
        
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router