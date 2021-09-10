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
});

//use query parameters to pass the username from the client to the server
router.get('/users/:username', (req, res) => {
  //capture the query parameter with the req.params object
  console.log(`Querying for thought(s) from ${req.params.username}.`);

  const params = {
    TableName: table,
    //KeyConditionExpression property specifies the search criteria
    //#un represents the attribute name username --> defined in the ExpressionAttributeNames property
    KeyConditionExpression: '#un = :user',
    // # or : used a prefix to avoid using a list of reserved words from DynamoDB that can't be used as attribute names
    ExpressionAttributeNames: {
      '#un': 'username',
      '#ca': 'createdAt',
      '#th': 'thought',
    },
    //ExpressionAttributeValues property is assigned to req.params.username, which was received from the client
    ExpressionAttributeValues: {
      //use the username selected by the user in the client to determine the condition of the search
      ':user': req.params.username,
    },
    //determines which attributes or columns will be returned
    ProjectionExpression: '#th, #ca',
    //This property takes a Boolean value
    //default setting is true, which specifies the order for the sort key, which will be ascending
    //false so that the order is descending
    ScanIndexForward: false,
  };

  //use the service interface object, dynamodb, and the query method to retrieve the user's thoughts from the database
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log('Query succeeded.');
      res.json(data.Items);
    }
  });
}); // closes the route for router.get(users/:username)

// Create new user at /api/users
router.post('/users', (req, res) => {
  //set the params object to the form data of the ThoughtForm, which we can access with req.body
  const params = {
    TableName: table,
    Item: {
      username: req.body.username,
      //use the JavaScript native Date object to set the value of the createdAt property
      createdAt: Date.now(),
      thought: req.body.thought,
    },
  };

  // database call
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      );
      res.status(500).json(err); // an error occurred
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
      res.json({ Added: JSON.stringify(data, null, 2) });
    }
  });
}); // ends the route for router.post('/users')

module.exports = router;
