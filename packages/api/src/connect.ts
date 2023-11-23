import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.Connections.tableName;
const dynamodb = new DynamoDBClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const gameId = event.queryStringParameters!.gameId;
  const master = event.queryStringParameters!.master ? true : false;
  if (!gameId) return { statusCode: 400, body: "no game id was provided" };

  const command = new PutItemCommand({
    TableName,
    Item: {
      id: { S: event.requestContext.connectionId! },
      gameId: { S: gameId },
      master: { BOOL: master },
    },
  });

  await dynamodb.send(command);

  return { statusCode: 200, body: "Connected" };
};
