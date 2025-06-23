const mongoose = require ('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    content: {
        type:String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    category: {
        type: String,
        enum: ['liked', 'rare', 'troubleshooting', 'indoors'],
        required: true
    },
    author: {
        type:String,
        default: 'Anonymous'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
