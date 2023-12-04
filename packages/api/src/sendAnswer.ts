import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;
const dynamodb = new DynamoDBClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const time = event.requestContext.requestTimeEpoch;
  const messageData = JSON.parse(event.body!);
  const gameId = messageData.gameId;
  const { stage, domainName } = event.requestContext;

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
        kind: "sendAnswer",
        connectionId: event.requestContext.connectionId!,
        time,
        ...messageData,
      }),
    }),
  );

  return { statusCode: 200, body: "Message sent" };
};
