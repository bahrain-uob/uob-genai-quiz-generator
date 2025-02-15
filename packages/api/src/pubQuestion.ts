import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  DeleteItemCommand,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;
const dynamodb = new DynamoDBClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse(event.body!);
  const gameId = messageData.gameId;
  const { stage, domainName } = event.requestContext;

  // Get all the connections
  const connections = await dynamodb.send(
    new ScanCommand({
      TableName,
      ProjectionExpression: "id",
      FilterExpression: "gameId = :gameId AND master = :master",
      ExpressionAttributeValues: {
        ":gameId": { S: gameId },
        ":master": { BOOL: false },
      },
    }),
  );

  const apiG = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });

  const postToConnection = async ({ id }: any) => {
    try {
      // Send the message to the given client
      await apiG.send(
        new PostToConnectionCommand({
          ConnectionId: id.S,
          Data: JSON.stringify(messageData),
        }),
      );
    } catch (e: any) {
      if (e.statusCode === 410) {
        // Remove stale connections
        await dynamodb.send(
          new DeleteItemCommand({ TableName, Key: { id: { S: id } } }),
        );
      }
    }
  };

  // Iterate through all the connections
  await Promise.all(connections.Items!.map(postToConnection));

  return { statusCode: 200, body: "Message sent" };
};
