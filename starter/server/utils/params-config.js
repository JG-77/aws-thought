const { v4: uuidv4 } = require('uuid');

//declare the params function that will configure the file
//function receives a parameter called fileName, which this function will receive as an argument from the Express route
const params = (fileName) => {
  const myFile = fileName.originalname.split('.');
  //store the reference to the fileType
  const fileType = myFile[myFile.length - 1];

  //Bucket, Key, and Body properties to connect to S3
  const imageParams = {
    //assign the Bucket with the name of the S3 bucket we created previously --> name found in AWS.com s3 section
    Bucket: 'user-images-52622be8-e9e7-4b79-b246-a4948891cacd',
    //assign the Key property, which is the name of this file
    //use the uuidv4() to ensure a unique file name
    Key: `${uuidv4()}.${fileType}`,
    //assign the buffer property of the image
    //buffer is temporary storage container of the image file. Once the buffer has been used, the temporary storage space is removed by multer
    Body: fileName.buffer,
  };

  return imageParams;
};

module.exports = params;
