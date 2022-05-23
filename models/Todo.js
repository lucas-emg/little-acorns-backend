const { Schema, model } = require('mongoose')

const todoSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },

    fileUpload: [{
        type: String
    }],
    todoList: {type: Schema.Types.ObjectId, ref:'TodoList'}
},
{
    timestamps: true
})

module.exports = model('Todo', todoSchema)