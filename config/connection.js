const AWS = require("aws-sdk");
require("dotenv").config();
const config = require("./config.js");
AWS.config.update(config.aws_remote_config);

const dynamoClient = new AWS.DynamoDB.DocumentClient();
var docClient = new AWS.DynamoDB();
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID, // accessKeyId that is stored in .env file
  secretAccessKey: process.env.ACCESS_SECRET_KEY, // secretAccessKey is also store in .env file
  region: process.env.AWS_REGION,
});

module.exports = {
  dynamoClient,
  docClient,
  s3,
};
