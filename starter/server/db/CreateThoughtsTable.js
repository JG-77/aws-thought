//importing the aws-sdk package
const AWS = require('aws-sdk');

//modify the AWS config object that DynamoDB will use to connect to the local instance
AWS.config.update({
  region: 'us-east-2',
  endpoint: 'http://localhost:8000',
});

//create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

//params object that will hold the schema and metadata of the table
const params = {
  // table name as Thoughts
  TableName: 'Thoughts',
  //KeySchema property is where we define the partition key and the sort key
  KeySchema: [
    //defined the hash key as 'username'
    { AttributeName: 'username', KeyType: 'HASH' }, // Partition key
    //defined the range key as 'createdAt' to create a unique composite key
    { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort key
  ],
  //defines the attributes we've used for the hash and range keys
  AttributeDefinitions: [
    //assigned a string to the username and a number to createdAt, indicated by "S" and "N" respectively
    { AttributeName: 'username', AttributeType: 'S' },
    //createdAt as the sort key is that queries will automatically sort by this value, which conveniently orders thoughts by most recent entry
    { AttributeName: 'createdAt', AttributeType: 'N' },
  ],
  //This setting reserves a maximum write and read capacity of the database, which is how AWS factors in pricing
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

//use params to make a call to the DynamoDB instance and create a table
//used the method, createTable, on the dynamodb service object
//pass in the params object and use a callback function to capture the error and response
dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error(
      'Unable to create table. Error JSON:',
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      'Created table. Table description JSON:',
      JSON.stringify(data, null, 2)
    );
  }
});
