const multer = require("multer");
const path = require('path');
const express = require ("express");
const app = express ();



app.use(express.static(path.join(__dirname, 'public')))


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'public/images'); // images e path ta hbe 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_verbalIq' + Date.now() 
        + path.extname(file.originalname))
      },
    
    
});

const fileFilter = (req, file, cb) => {

    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
    
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        return cb(new Error("Invalid file type."), false );
      }

}

const maxSize = 5 * 1024 * 1024;

const upload  = multer({ storage: storage, fileFilter: fileFilter});

module.exports = {
  upload
 }