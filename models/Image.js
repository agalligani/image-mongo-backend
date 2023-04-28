const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: false,
        //     ref: 'User'
        // },
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: false
        },
        alt: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Image', imageSchema)