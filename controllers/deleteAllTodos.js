const Todo = require("../models/Todo")

const deleteAllTodos = (todos) => {

    todos.forEach( async (todo) => {

        await Todo.findByIdAndDelete(todo)

    })
}

module.exports = deleteAllTodos