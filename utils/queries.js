const { createDynamoDBClient } = require("../factories/aws");
require("dotenv").config();
const dynamodb = createDynamoDBClient(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_REGION
);

async function getDoctors(hcprovider, speciality) {
  const scanParams = {
    TableName: "availability",
    FilterExpression: "hc_provider = :p",
    ExpressionAttributeValues: {
      ":p": hcprovider,
    },
  };
  if (speciality !== "all") {
    scanParams.FilterExpression += " AND speciality = :speciality";
    scanParams.ExpressionAttributeValues[":speciality"] = speciality;
  }
  try {
    const result = await dynamodb.scan(scanParams).promise();

    if (result.Items) {
      return result.Items;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

async function getDocAvailability(doc_email, availability_date) {
  const params = {
    TableName: "availability",
    KeyConditionExpression:
      "doctor_email = :email and availability_date = :avail_date",
    ExpressionAttributeValues: {
      ":email": doc_email,
      ":avail_date": availability_date,
    },
  };

  try {
    const result = await dynamodb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].availability_time;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

async function postAppointments(body) {
  const params = {
    TableName: "appointments",
    Item: body,
  };
  try {
    let resp = await dynamodb.put(params).promise();

    return JSON.stringify(body);
  } catch (err) {
    throw new Error("Unable to add appointment");
  }
}

module.exports = { getDoctors, getDocAvailability, postAppointments };
