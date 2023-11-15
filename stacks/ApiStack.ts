import { Api, StackContext, use } from "sst/constructs";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DBStack } from "./DBStack";
import { AuthStack } from "./AuthStack";
import { FunctionStack } from "./FunctionStack";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { courses_table } = use(DBStack);
  const { materialText } = use(FunctionStack);

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
          bind: [courses_table],
        },
      },
      "POST /courses": {
        function: {
          handler: "packages/api/src/courses.post",
          runtime: "nodejs18.x",
          bind: [courses_table],
        },
      },
    },
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

  return { api, apiCachePolicy };
}
