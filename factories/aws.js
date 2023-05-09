const AWS = require("aws-sdk");

function createDynamoDBClient(accessKeyId, secretAccessKey, region) {
  const config = {
    region,
    accessKeyId,
    secretAccessKey,
  };
  return new AWS.DynamoDB.DocumentClient(config);
}

function createSESClient(region, accessKeyId, secretAccessKey) {
  const config = {
    region,
    accessKeyId,
    secretAccessKey,
  };
  return new AWS.SES(config);
}
module.exports = { createDynamoDBClient, createSESClient};
