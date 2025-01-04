import { Api, StackContext, Table, WebSocketApi, use } from "sst/constructs";
import { AuthStack } from "./AuthStack";
import { CoreStack } from "./CoreStack";
import * as iam from "aws-cdk-lib/aws-iam";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { coursesTable, materialText } = use(CoreStack);

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
        runtime: "python3.11",
        permissions: ["sagemaker", "s3"],
        environment: {
          TEXT_BUCKET: materialText.bucketName,
        },
        initialPolicy: [new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["bedrock:InvokeModel*"],
          resources: ["*"],
        }) as any]
      },
    },
    routes: {
      "POST /mcq": "packages/api/src/questionsGen.mcq",
      "POST /tf": "packages/api/src/questionsGen.tf",
      "POST /fib": "packages/api/src/questionsGen.fib",
      "GET /courses": {
        function: {
          handler: "packages/api/src/courses.get",
          runtime: "nodejs18.x",
          bind: [coursesTable],
        },
      },
      "POST /courses": {
        function: {
          handler: "packages/api/src/courses.post",
          runtime: "nodejs18.x",
          bind: [coursesTable],
        },
      },

      "DELETE /courses": {
        function: {
          handler: "packages/api/src/courses.del",
          runtime: "nodejs18.x",
          bind: [coursesTable],
        },
      },
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
      pubEnd: "packages/api/src/pubEnd.main",
      sendAnswer: "packages/api/src/sendAnswer.main",
      sendUsername: "packages/api/src/sendUsername.main",
    },
  });

  return { api, socket };
}
