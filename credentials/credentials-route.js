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
  
    try {
      const file = req.file;
      const fileName = req.body.fileName;
      const extension = path.extname(fileName);
      const filenameWithoutExtension = path.basename(fileName, extension);
      const key = req.body.key;
      

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      encryptor.encryptFile(req.file.path, filenameWithoutExtension+'-'+key+'.dat', key, function(err) {
        const encryptedFile = fs.readFileSync('./'+filenameWithoutExtension+'-'+key+'.dat');
        const params = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: filenameWithoutExtension+key,
          Body: encryptedFile,
          ACL: 'public-read',
        };
    
        s3.upload(params, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload file to S3.' });
          } else {
            console.log('File uploaded successfully. ' + data.Location);
            sendRequestEmail(req.body.providerEmail, key);
            res.status(200).json({ message: 'File uploaded successfully.', location: data.Location });
          }
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });

  app.post('/download', async (req, res) => {

    const fileName = req.body.fileName;
    const extension = path.extname(fileName);
    const filenameWithoutExtension = path.basename(fileName, extension);
    const key = req.body.key;
  
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }
 
    try {
      const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME, 
        Key: filenameWithoutExtension+key,
      };
  
      const { Body } = await s3.getObject(params).promise();
      const localFilePath = `uploads/${fileName}`;
      fs.writeFileSync(localFilePath, Body);
      encryptor.decryptFile(localFilePath, fileName, key, function(err) {
        const decryptedFile = fs.readFileSync(fileName);
        const decryptedBuffer = Buffer.from(decryptedFile);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(decryptedBuffer);
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  app.post('/s3upload', (req, res) => {
    try {
      const params = {
        Bucket: req.body.bucket,
        Key: req.body.key,
        Body: Buffer.from(req.body.data),
      };
      console.log("params",  params);
      s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to upload file to S3.' });
        } else {
          console.log('File uploaded successfully. ' + data.Location);
          res.status(200).json({ message: 'File uploaded successfully.', location: data.Location });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });

  app.post('/s3download', async (req, res) => {
    try {
      const params = {
        Bucket: req.body.bucket, 
        Key: req.body.key,
      };
      const resp = await s3.getObject(params).promise();
      const data = JSON.parse(resp.Body.toString('utf-8'));
      console.log(data)
      res.status(200).json({ message: 'File downloaded successfully.', data: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });

const ses = new AWS.SES({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

function sendRequestEmail(to, userName) {
  const subject = 'Credentials Verification Request';
  const body = 'Credentials Verification Request has been raised by Dr.' + userName;
  sendEmail(to, subject, body);
}

function sendEmail(to, subject, body) {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: 'aishwarya.ravi@sjsu.edu',
  };

  ses.getIdentityVerificationAttributes({ Identities: [to] }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const verificationAttributes = data.VerificationAttributes[to];
      if (verificationAttributes && verificationAttributes.VerificationStatus === 'Success') {
        // Email identity is verified, send the email
        ses.sendEmail(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Email sent:', data);
          }
        });
      } else {
        // Email identity is not verified, verify the email identity
        ses.verifyEmailIdentity({ EmailAddress: to }, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Email identity verification initiated for ${to}.`);
            // Wait for the email identity to be verified before sending the email
            const intervalId = setInterval(() => {
              ses.getIdentityVerificationAttributes({ Identities: [to] }, (err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  const verificationAttributes = data.VerificationAttributes[to];
                  if (
                    verificationAttributes &&
                    verificationAttributes.VerificationStatus === 'Success'
                  ) {
                    clearInterval(intervalId);
                    ses.sendEmail(params, (err, data) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('Email sent:', data);
                      }
                    });
                  }
                }
              });
            }, 5000);
          }
        });
      }
    }
  });
}
};


