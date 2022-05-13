const mongoose = require('mongoose')

const connectDB = async () => {

    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`DB is connected: ${connection.connections[0].name}`)
}

module.exports = connectDB