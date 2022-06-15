const { Schema, model } = require('mongoose')

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    },
    profileImage: {
        type: String
    },
    passwordHash: {
        type: String,
        required: true
    },
    todosList: [{ type: Schema.Types.ObjectId, ref:'TodoList'}],
    sharedTodoLists: [{ type: Schema.Types.ObjectId, ref:'TodoList'}]
})

module.exports = model('User', userSchema)