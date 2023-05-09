const AWS = require('aws-sdk');
var encryptor = require('file-encryptor');
var fs= require('fs');
const multer = require('multer');
require("dotenv").config();
const path = require('path');


const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});
console.log("access id", process.env.REACT_APP_AWS_ACCESS_KEY_ID)
module.exports = (app) => {

  const uploadDirectory = './uploads';
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }
  // Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  }
});

// Create a Multer instance
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  
     console.log("request", req.body.fileName);
    // try {

      const file = req.file;
      const fileName = req.body.fileName;
      const extension = path.extname(fileName);
      const filenameWithoutExtension = path.basename(fileName, extension);
      const userName = req.body.userName;
      

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Access the uploaded file details
      encryptor.encryptFile(req.file.path, filenameWithoutExtension+'-'+userName+'.dat', filenameWithoutExtension, function(err) {
      });
      const encryptedFile = fs.readFileSync('./'+filenameWithoutExtension+'-'+userName+'.dat');

      const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: filenameWithoutExtension+userName,
        Body: encryptedFile,
        ACL: 'public-read',
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to upload file to S3.' });
        } else {
          console.log('File uploaded successfully. ' + data.Location);
          res.status(200).json({ message: 'File uploaded successfully.', location: data.Location });
        }
      });
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).json({ error: 'An error occurred.' });
    // }
  });

  app.post('/download', async (req, res) => {

    const fileName = req.body.fileName;
    const extension = path.extname(fileName);
    const filenameWithoutExtension = path.basename(fileName, extension);
    const doctorName = req.body.userName;
  
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }
  
    if (!doctorName) {
      return res.status(400).json({ error: 'Doctor name is required' });
    }
    try {
      const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME, 
        Key: filenameWithoutExtension+doctorName,
      };
  
      const { Body } = await s3.getObject(params).promise();
      const localFilePath = `uploads/${fileName}`;
      fs.writeFileSync(localFilePath, Body);
      encryptor.decryptFile(localFilePath, fileName, filenameWithoutExtension, function(err) {
        
      });
      const decryptedFile = fs.readFileSync(fileName);
      const decryptedBuffer = Buffer.from(decryptedFile);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(decryptedFile);
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });
  
};


