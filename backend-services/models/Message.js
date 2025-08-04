const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likes: { type: Number, default: 0},
    authorName: {type: String},
    createdAt: {type: Date, default: Date.now},
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Message', MessageSchema);