const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    path: String,
    authorId : Number ,
    username : String
  });
  
const FileModel = mongoose.model('file', fileSchema);

module.exports = {
    FileModel
}