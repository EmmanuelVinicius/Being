const Mongoose = require('mongoose')

const projectsSchema = new Mongoose.Schema({
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
    insertedAt: {
        type: Date,
        default: new Date(),
    },
    completedAt: {
        type: Date,
    },
    items: [{
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Items', 
        }]

})
module.exports = Mongoose.model('Projects', projectsSchema)
