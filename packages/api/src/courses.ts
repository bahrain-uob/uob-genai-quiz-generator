import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { Table } from "sst/node/table";

const dynamodb = new DynamoDBClient();

export const get = async () => {
  const command = new QueryCommand({
    TableName: (Table as any).courses.tableName,
    ProjectionExpression: "course_id, course_code, course_name",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      // TODO get the user id from the authenticated request
      ":uid": { S: "1" },
    },
  });

  let response;
  try {
    response = await dynamodb.send(command);
  } catch {
    return { statusCode: 500 };
  }
  let courses = response.Items?.map((obj) => ({
    course_id: obj.course_id.S,
    course_code: obj.course_code.S,
    course_name: obj.course_name.S,
  }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(courses),
  };
};

export const post = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) return { statusCode: 400 };

  const course_name: string = JSON.parse(event.body).course_name;
  const course_code: string = JSON.parse(event.body).course_code;
  if (!course_name) return { statusCode: 400 };
  if (!course_code) return { statusCode: 400 };

  const course_id = randomUUID();

  const command = new PutItemCommand({
    TableName: Table.courses.tableName,
    Item: {
      // TODO get the user id from the authenticated request
      user_id: { S: "1" },
      course_id: { S: course_id },
      course_code: { S: course_code },
      course_name: { S: course_name },
    },
  });

  try {
    await dynamodb.send(command);
  } catch {
    return { statusCode: 500 };
  }

  return {
    statusCode: 201,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ course_id, course_code, course_name }),
  };
};
