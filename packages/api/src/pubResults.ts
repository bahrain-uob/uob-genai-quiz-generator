import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyHandler } from "aws-lambda";

export const main: APIGatewayProxyHandler = async (event) => {
  const connectionId = JSON.parse(event.body!).connectionId;
  const rank = JSON.parse(event.body!).rank;
  const score = JSON.parse(event.body!).score;
  const { stage, domainName } = event.requestContext;

  const apiG = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });

  // Send the message to the given client
  await apiG.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({ action: "pubResult", score, rank }),
    }),
  );

  return { statusCode: 200, body: "Message sent" };
};
