const { Router } = require('express')
const Todo = require('../models/Todo')
const User = require('../models/User')
const mongoose = require('mongoose')

const router = Router()

router.get('/', async (req, res) => {

    try {
        const userId = req.user.id
        const allTodos = await Todo.find({user: userId})

        res.status(200).json(allTodos)

    } catch {

        res.status(500)

    }
})

router.post('/', async (req, res) => {

    const payload = req.body

    try {
        const userId = req.user.id
        const newTodo = await Todo.create({...payload, user: userId})
        await User.findByIdAndUpdate(userId, { $push: { todos: newTodo._id }})
        res.status(200).json(newTodo)

    } catch (error) {

        res.status(500).json({error: error.message})

    }
})

router.put('/:id', async (req, res) => {

    const { id } = req.params
    const payload = req.body
    const userId = req.user.id

    try {

        const updatedTodo = await Todo.findOneAndUpdate({_id: id, user: userId}, payload, {new: true})

        if(!updatedTodo) throw new Error ('Cannot update to do from another user')

        res.status(200).json(updatedTodo)

    } catch (error) {

        res.status(500).json({error: error.message})

    }
})

router.delete('/:id', async (req, res) => {

    const { id } = req.params
    const userId = req.user.id

    try {

        const todo = await Todo.findById(id)
        
        if (todo.user.toString() !== userId) throw new Error ('Cannot delete to do from another user')

        todo.delete()
        await User.findByIdAndUpdate(userId, {$pull: {todos: id }})

        res.status(204).json("Task was deleted")

    } catch (error) {
        
        res.status(500).json({ error: error.message })
    }
})

router.delete('/', async (req, res) => {

    try {

        const userId = req.user.id
        await Todo.find({user: userId}).deleteMany({})
        await User.findByIdAndUpdate(userId, {$unset: {todos: 1}})

        res.status(204).json('All user to dos were deleted')

    } catch (error) {
        
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router