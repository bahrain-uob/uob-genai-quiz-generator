import { Cognito, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { DBStack } from "./DBStack";
import { FunctionStack } from "./FunctionStack";

export function AuthStack({ stack }: StackContext) {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  const { materialBucket } = use(FunctionStack);
  auth.attachPermissionsForAuthUsers(stack, [
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        // this doesn't work for some reason
        // `${materialBucket.bucketArn}/\${cognito-identity.amazonaws.com:sub}/*`,
        // currently we give user access to the whole bukcet which is a *HUGE* security flaw
        `${materialBucket.bucketArn}`,
        `${materialBucket.bucketArn}/`,
        `${materialBucket.bucketArn}/*`,
      ],
    }) as any,
  ]);

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });

  return { auth };
}
