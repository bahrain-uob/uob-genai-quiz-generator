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
  const username = event.queryStringParameters!.username;
  const gameId = event.queryStringParameters!.gameId;
  const master = event.queryStringParameters!.master ? true : false;
  if (!username) return { statusCode: 400, body: "no username was provided" };
  if (!gameId) return { statusCode: 400, body: "no game id was provided" };
  const { stage, domainName } = event.requestContext;

  const command = new PutItemCommand({
    TableName,
    Item: {
      id: { S: event.requestContext.connectionId! },
      username: { S: username },
      gameId: { S: gameId },
      master: { BOOL: master },
    },
  });

  await dynamodb.send(command);

  if (!master) {
    const connection = await dynamodb.send(
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

    const masterConnection = connection.Items![0].id;
    const apiG = new ApiGatewayManagementApiClient({
      endpoint: `https://${domainName}/${stage}`,
    });

    await apiG.send(
      new PostToConnectionCommand({
        ConnectionId: masterConnection.S,
        Data: JSON.stringify({
          action: "joinGame",
          connectionId: event.requestContext.connectionId!,
          username,
        }),
      }),
    );
  }

  return { statusCode: 200, body: "Connected" };
};
