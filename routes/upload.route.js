const express = require("express");
const UploadRouter = express.Router();
const { FileModel } = require("../models/upload.model");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authorization}=require("../middleware/auth.middleware.js");
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
 
 
// File upload route
UploadRouter.post('/upload', authorization, upload.single('file'), async (req, res) => {
    const { filename, originalname, path } = req.file;
    console.log(filename, originalname, path);
  
    try {
      // Save file details to MongoDB
      await FileModel.create({
        filename,
        originalname,
        path,
      });
  
      res.status(200).send('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file.');
    }
  });

// GET route to read the uploaded PDF file
UploadRouter.get('/files/:id', async (req, res) => {
    try {
      const fileId = req.params.id;
  
      // Find the file in the database
      const file = await FileModel.findById(fileId);
  
      if (!file) {
        return res.status(404).send('File not found');
      }
  
      // Read the file from the file system
      const filePath = path.join(__dirname, '..', file.path);
      const fileStream = fs.createReadStream(filePath);
  
      // Set the appropriate headers
      // res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${file.originalname}"`);
  
      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error reading file');
    }
});
  
UploadRouter.get("/files", async (req, res) => {
   try {
     const files = await FileModel.find();
     res.send(files);
   } catch (error) {
     console.error(error);
     res.status(500).send('Error reading file');
   }
})
  
module.exports = {
  UploadRouter
};
