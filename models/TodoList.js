const { Schema, model} = require('mongoose')

const todoListSchema = new Schema ({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    fileUpload: [{
        type: String
    }],
    todos: [{type: Schema.Types.ObjectId, ref: 'Todo'}],
    user: [{type: Schema.Types.ObjectId, ref: 'User'}]

})

module.exports = model('TodoList', todoListSchema)