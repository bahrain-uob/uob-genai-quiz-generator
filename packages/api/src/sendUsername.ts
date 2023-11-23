import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;
const dynamodb = new DynamoDBClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const gameId = JSON.parse(event.body!).gameId;
  const username = JSON.parse(event.body!).username;
  if (!gameId) return { statusCode: 400, body: "no game id was provided" };
  if (!username) return { statusCode: 400, body: "no username was provided" };
  const { stage, domainName } = event.requestContext;

  const connections = await dynamodb.send(
    new ScanCommand({
      TableName,
      ProjectionExpression: "id",
      FilterExpression: "gameId = :gameId AND master = :master",
      ExpressionAttributeValues: {
        ":gameId": { S: gameId },
        ":master": { BOOL: true },
      },
    }),
  );

  const masterConnection = connections.Items![0].id;
  const apiG = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });

  await apiG.send(
    new PostToConnectionCommand({
      ConnectionId: masterConnection.S,
      Data: JSON.stringify({
        action: "sendUsername",
        connectionId: event.requestContext.connectionId!,
        username,
      }),
    }),
  );

  return { statusCode: 200, body: "Username sent" };
};
