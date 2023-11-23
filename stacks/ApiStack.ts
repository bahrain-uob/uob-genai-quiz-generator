import { Api, StackContext, Table, WebSocketApi, use } from "sst/constructs";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DBStack } from "./DBStack";
import { AuthStack } from "./AuthStack";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { materialBucket, quiz_bucket, courses_table } = use(DBStack);

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        bind: [materialBucket, quiz_bucket, courses_table],
      },
    },
    routes: {
      "GET /courses": "packages/api/src/courses.get",
      "POST /courses": "packages/api/src/courses.post",
    },
  });

  const connectionsTable = new Table(stack, "Connections", {
    fields: {
      id: "string",
      username: "string",
      gameId: "string",
      master: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const socket = new WebSocketApi(stack, "Socket", {
    defaults: {
      function: {
        bind: [connectionsTable],
      },
    },
    routes: {
      $connect: "packages/api/src/connect.main",
      $disconnect: "packages/api/src/disconnect.main",
      pubQuestion: "packages/api/src/pubQuestion.main",
      pubResult: "packages/api/src/pubResults.main",
      sendAnswer: "packages/api/src/sendAnswer.main",
      sendUsername: "packages/api/src/sendUsername.main",
    },
  });

  stack.addOutputs({
    socketUrl: socket.url,
  });

  // cache policy to use with cloudfront as reverse proxy to avoid cors
  // https://dev.to/larswww/real-world-serverless-part-3-cloudfront-reverse-proxy-no-cors-cgj
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration.seconds(0), // no cache by default unless backend decides otherwise
    defaultTtl: Duration.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer",
    ),
  });

  return { api, apiCachePolicy, socket };
}
