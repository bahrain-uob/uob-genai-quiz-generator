import { Api, StackContext, use } from "sst/constructs";
import { AuthStack } from "./AuthStack";
import { CoreStack } from "./CoreStack";

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
    },
  });

  return { api };
}
