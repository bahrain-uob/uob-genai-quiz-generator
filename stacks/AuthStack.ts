import { Cognito, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { DBStack } from "./DBStack";

export function AuthStack({ stack }: StackContext) {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  const { materialBucket } = use(DBStack);
  auth.attachPermissionsForAuthUsers(stack, [
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        `${materialBucket.bucketArn}/\${cognito-identity.amazonaws.com:sub}`,
        `${materialBucket.bucketArn}/\${cognito-identity.amazonaws.com:sub}/`,
        `${materialBucket.bucketArn}/\${cognito-identity.amazonaws.com:sub}/*`,
      ],
    }) as any,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [`${materialBucket.bucketArn}`],
      conditions: {
        StringLike: {
          "s3:prefix": ["${cognito-identity.amazonaws.com:sub}/*"],
        },
      },
    }),
  ]);

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });

  return { auth };
}
