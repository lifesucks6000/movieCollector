const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: String,
    directorName: String
})

module.exports = mongoose.model('Movie', MovieSchema);