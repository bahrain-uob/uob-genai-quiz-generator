import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { randomUUID } from "crypto";
import { Table } from "sst/node/table";

const dynamodb = new DynamoDBClient();

export const get = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const user_id = event.requestContext.authorizer.jwt.claims.sub as string;
  const command = new QueryCommand({
    TableName: Table.Courses.tableName,
    ProjectionExpression: "course_id, course_code, course_name",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: user_id },
    },
  });

  let response;
  try {
    response = await dynamodb.send(command);
  } catch {
    return { statusCode: 500 };
  }

  let courses = response.Items?.map((obj) => ({
    id: obj.course_id.S,
    code: obj.course_code.S,
    name: obj.course_name.S,
  }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(courses),
  };
};

export const post = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  if (!event.body) return { statusCode: 400 };
  const user_id = event.requestContext.authorizer.jwt.claims.sub as string;

  const code: string = JSON.parse(event.body).code;
  const name: string = JSON.parse(event.body).name;
  if (!code) return { statusCode: 400 };
  if (!name) return { statusCode: 400 };

  const course_id = randomUUID();

  const command = new PutItemCommand({
    TableName: Table.Courses.tableName,
    Item: {
      user_id: { S: user_id },
      course_id: { S: course_id },
      course_code: { S: code },
      course_name: { S: name },
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
    body: JSON.stringify({
      id: course_id,
      code: code,
      name: name,
    }),
  };
};
