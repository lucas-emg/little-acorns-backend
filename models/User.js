const { Schema, model } = require('mongoose')

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    },
    passwordHash: {
        type: String,
        required: true
    },
    todos: [{ type: Schema.Types.ObjectId, ref:'Todo'}]
}, 
{
    timestamps: true
})

module.exports = model('User', userSchema)