const AWS = require("aws-sdk");
require("dotenv").config();
const config = require("./config.js");
AWS.config.update(config.aws_remote_config);

const dynamoClient = new AWS.DynamoDB.DocumentClient();
var docClient = new AWS.DynamoDB();

module.exports = {
  dynamoClient,
  docClient,
};
