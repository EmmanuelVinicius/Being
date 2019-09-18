const Mongoose = require('mongoose')

const itemSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 1,
    },
    schedule: {
        type: Date,
    },
    priority: {
        type: Number,
        default: 4
    },
    insertedAt: {
        type: Date,
        default: new Date(),
    },
    completedAt: {
        type: Date,
    },
})
module.exports = Mongoose.model('Items', itemSchema)
