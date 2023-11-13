import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";

const dynamodb = new DynamoDBClient();

export const main = async (event: any) => {
  const command = new DeleteItemCommand({
    TableName: Table.Connections.tableName,
    Key: { id: { S: event.requestContext.connectionId } },
  });

  await dynamodb.send(command);

  return { statusCode: 200, body: "Connected" };
};
