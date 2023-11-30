import { StaticSite, StackContext, use } from "sst/constructs";
import { CoreStack } from "./CoreStack";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";

export function FrontendStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);
  const { auth } = use(AuthStack);
  const { materialBucket } = use(CoreStack);

  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_SOCKET_URL: socket.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId!,
      VITE_APP_MATERIAL_BUCKET: materialBucket.bucketName,
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
