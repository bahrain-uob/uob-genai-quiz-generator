import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { randomUUID } from "crypto"
import { Table } from "sst/node/table";

const dynamodb = new DynamoDBClient();

export const get = async () => {
  const command = new QueryCommand({
    TableName: (Table as any).courses.tableName,
    ProjectionExpression: "course_id, course_name",
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      // TODO get the user id from the authenticated request
      ":uid": { "S": "1" }
    }
  })

  let response;
  try { response = await dynamodb.send(command) } catch { return { statusCode: 500 } };
  let courses = response.Items?.map(obj => ({ course_id: obj.course_id.S, course_name: obj.course_name.S }));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(courses)
  };

}

