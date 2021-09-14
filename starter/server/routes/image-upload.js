const express = require('express');
const router = express.Router();
//multer to provide the middleware for handling multipart/form-data, primarily used for uploading files
//multer package will add a file property on the req object that contains the image file uploaded by the form
const multer = require('multer');
const AWS = require('aws-sdk');
const paramsConfig = require('../utils/params-config');

//create a temporary storage container that will hold the image files until it is ready to be uploaded to the S3 bucket
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});

// image is the key!
//declare the upload object, which contains the storage destination and the key, image
const upload = multer({ storage }).single('image');
//single method to define this upload function will only receive one image

//instantiate the service object, s3, to communicate with the S3 web service, which will allow us to upload the image to the S3 bucket
const s3 = new AWS.S3({
  //locked the version number as a precautionary measure in case the default S3 version changes
  apiVersion: '2006-03-01',
});

//include the upload function as the second argument to define the key and storage destination
router.post('/image-upload', upload, (req, res) => {
  console.log("post('/api/image-upload'", req.file);
  // set up params config
  //assigned the returned object from the paramsConfig function to the params object
  const params = paramsConfig(req.file);

  // set up S3 service call
  //s3 service interface object we instantiated previously with the aws-sdk package to call the upload() method
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.json(data);
  });
});

module.exports = router;
