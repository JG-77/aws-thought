const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

//Configure the service interface object 'dynamodb'
const awsConfig = {
  region: 'us-east-2',
  //endpoint property in awsConfig points to the local DynamoDB instance
  endpoint: 'http://localhost:8000',
};
AWS.config.update(awsConfig);
//use the DocumentClient class to use native JavaScript objects to interface with the dynamodb service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

//setting the table value to "Thoughts"
const table = 'Thoughts';

//retrieve all the users' thoughts from the Thoughts table
router.get('/users', (req, res) => {
  const params = {
    TableName: table,
  };
  // Scan method returns all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    } else {
      //the data in the table is actually in the Items property of the response, so 'data.Items' was returned
      res.json(data.Items);
    }
  });
  // more to come . . .
});

module.exports = router;
