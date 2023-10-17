import { Cognito, StackContext } from "sst/constructs";

export function AuthStack({ stack }: StackContext) {

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });

  return { auth };
}
